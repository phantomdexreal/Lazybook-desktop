// LazyBooks | tools/fixture-device/device.mjs
// A script acting like a PWA device (Phase 19): signs in as the license OWNER, inserts one sync_requests row
// (SHARED_CONTRACTS 4.1) and polls it until the connector finishes it. Prints one line per status change and
// exits 0 on done, 1 on failed, 2 when nobody picked it up in time, 3 on a setup error.
// Works against a real license project or tools/mock-registry (which has no connector: expect exit 2 there).
//
// Usage:
//   LB_PROJECT_URL=https://xyz.supabase.co LB_ANON_KEY=... LB_EMAIL=owner@x LB_PASSWORD=... LB_LICENSE_KEY=LB-... \
//   node tools/fixture-device/device.mjs [ping|initial|delta|snapshot_refresh]
// Optional: LB_DEVICE_ID (default fixture-device-1), LB_COMPANY_GUID, LB_FROM_DATE, LB_TO_DATE, LB_LAST_SYNC_AT,
//           LB_LOOKBACK_DAYS, LB_FIXTURE_TIMEOUT_S (default 90 = polling.request_pickup_wait_s).
// Polling follows the contract: 2 s, backing off x1.5 to 10 s. No secret is printed.
const env = process.env;
const need = ['LB_PROJECT_URL', 'LB_ANON_KEY', 'LB_EMAIL', 'LB_PASSWORD', 'LB_LICENSE_KEY'];
const missing = need.filter((k) => !env[k]);
if (missing.length) {
  console.error('missing environment: ' + missing.join(', '));
  process.exit(3);
}
const kind = process.argv[2] || 'ping';
if (!['ping', 'initial', 'delta', 'snapshot_refresh'].includes(kind)) {
  console.error('kind must be ping, initial, delta or snapshot_refresh');
  process.exit(3);
}
const base = env.LB_PROJECT_URL.replace(/\/+$/, '');
const timeoutMs = Number(env.LB_FIXTURE_TIMEOUT_S || 90) * 1000;
const json = async (method, url, headers, body) => {
  const res = await fetch(url, { method, headers: { 'content-type': 'application/json', apikey: env.LB_ANON_KEY, ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  return { status: res.status, data };
};

const login = await json('POST', `${base}/auth/v1/token?grant_type=password`, {}, { email: env.LB_EMAIL, password: env.LB_PASSWORD });
if (login.status !== 200 || !login.data?.access_token) {
  console.error('sign-in failed (status ' + login.status + ')');
  process.exit(3);
}
const auth = { authorization: `Bearer ${login.data.access_token}`, prefer: 'return=representation' };

const row = { license_key: env.LB_LICENSE_KEY, device_id: env.LB_DEVICE_ID || 'fixture-device-1', kind };
if (env.LB_COMPANY_GUID) row.company_guid = env.LB_COMPANY_GUID;
if (env.LB_FROM_DATE) row.from_date = env.LB_FROM_DATE;
if (env.LB_TO_DATE) row.to_date = env.LB_TO_DATE;
if (env.LB_LAST_SYNC_AT) row.last_sync_at = env.LB_LAST_SYNC_AT;
if (env.LB_LOOKBACK_DAYS) row.lookback_days = Number(env.LB_LOOKBACK_DAYS);

const ins = await json('POST', `${base}/rest/v1/sync_requests`, auth, row);
let id = ins.data?.[0]?.id;
if (ins.status === 409) {
  // one in-flight request per (device, kind): wait for the existing one
  const q = await json('GET', `${base}/rest/v1/sync_requests?select=id&device_id=eq.${encodeURIComponent(row.device_id)}&kind=eq.${kind}&status=in.(pending,processing)`, auth);
  id = q.data?.[0]?.id;
  console.log('a request of this kind is already in flight; waiting for it');
}
if (!id) {
  console.error('could not create the request (status ' + ins.status + ')');
  process.exit(3);
}
console.log(`request ${id} kind=${kind} created`);

const started = Date.now();
let wait = 2000;
let last = '';
for (;;) {
  const r = await json('GET', `${base}/rest/v1/sync_requests?select=status,error&id=eq.${id}`, auth);
  const cur = r.data?.[0];
  if (cur && cur.status !== last) {
    last = cur.status;
    console.log(`status ${cur.status}${cur.error ? ' - ' + cur.error : ''}`);
  }
  if (cur?.status === 'done') process.exit(0);
  if (cur?.status === 'failed') process.exit(1);
  if (cur?.status !== 'processing' && Date.now() - started > timeoutMs) {
    console.log('nobody picked the request up in time');
    process.exit(2);
  }
  await new Promise((res) => setTimeout(res, wait));
  wait = Math.min(10000, Math.round(wait * 1.5));
}
