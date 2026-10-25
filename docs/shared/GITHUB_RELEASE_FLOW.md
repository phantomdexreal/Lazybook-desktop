# GITHUB_RELEASE_FLOW — version control through GitHub, controlled from the admin panel

## Repos
`lazybooks-admin`, `lazybooks-desktop`, `lazybooks-pwa`, `lazybooks-mobile` (code, private or public) and `lazybooks-releases` (PUBLIC, binaries only: desktop installers, APKs, `latest.yml`) so updaters need no tokens.
Branches: `main` (releasable), `dev`, feature branches `phase-NN-slug`. Tags: `vX.Y.Z` (stable), `vX.Y.Z-beta.N` (beta channel; numeric part must still be `x.y.z`).
Commit style: `phase NN: <what>`. One phase = one PR/commit group; `PHASE_STATUS.md` updated in the same commit.

## Pipeline (all repos)
1. Tag pushed → GitHub Actions builds + tests.
2. PWA: `out/` → GitHub Pages/Cloudflare Pages + `lazybooks-pwa-out-vX.Y.Z.zip` attached to the Release (consumed by Desktop embedded-PWA and Mobile `pull-pwa`).
   Desktop: Windows runner → NSIS installer + `latest.yml` → `lazybooks-releases`. Mobile: signed APK → `lazybooks-releases`. Admin: static deploy.
3. Final step of every workflow calls Edge Function `ci-publish-release` (header `x-ci-secret`) with `{app,version,channel,notes,download_url,sha256,repo,tag,release_id}`
   → master `app_releases` row with `status='draft'`.
4. In the admin panel (Release manager): review notes, set channel, `rollout_pct`, `min_supported_version`, `force_update`, then **Publish**. Yank to roll back.
5. Apps learn about it from `app_bootstrap().update` (rollout bucket = `abs(hashtext(device_id)) % 100 < rollout_pct`).

## Reusable workflow step (put at the end of each release job)
```yaml
- name: Register release in LazyBooks master
  env:
    CI_SECRET: ${{ secrets.LB_CI_SECRET }}
    MASTER_FN_URL: ${{ vars.LB_MASTER_FN_URL }}   # https://<master>.supabase.co/functions/v1
  run: |
    curl -sS -X POST "$MASTER_FN_URL/ci-publish-release" \
      -H "x-ci-secret: $CI_SECRET" -H "Content-Type: application/json" \
      -d "{\"app\":\"${APP}\",\"version\":\"${VERSION}\",\"channel\":\"${CHANNEL}\",\"notes\":\"${NOTES}\",\"download_url\":\"${URL}\",\"sha256\":\"${SHA256}\",\"repo\":\"${GITHUB_REPOSITORY}\",\"tag\":\"${GITHUB_REF_NAME}\",\"release_id\":${RELEASE_ID}}"
```
## Keepalive workflow (admin repo)
Cron `0 3 */3 * *` → `curl -X POST $MASTER_FN_URL/keepalive -H "x-cron-secret: $LB_CRON_SECRET"`.
## What the admin panel can do with GitHub (via `github-proxy`, fine-grained PAT, allow-listed)
list tags/releases/runs · create tag+release from the UI · dispatch the release workflow · import a release into `app_releases`. It never writes code to repos.
