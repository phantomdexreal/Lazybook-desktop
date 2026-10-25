# SUPABASE_MIGRATIONS — manual stand-in until Edge Functions exist
1. **Master project:** create a free Supabase project → SQL editor (role postgres) → run `docs/shared/sql/01_master_schema.sql` → run `docs/shared/sql/tests/master_tests.sql` (expect `OK` notices; the test inserts demo rows — delete them afterwards).
2. **First admin:** Authentication → add user (email+password) → `insert into public.admins(user_id,email,role) values ('<uid>','<email>','owner');`
3. **License project** (per customer, or a shard): create a project → run `docs/shared/sql/02_license_project_schema.sql`.
4. **Logins:** Authentication → add two users in the LICENSE project (owner + connector), then set app_metadata (SQL editor, role postgres):
   `update auth.users set raw_app_meta_data = raw_app_meta_data || '{"license_key":"LB-XXXX-XXXX-XXXX-XXXX","role":"owner"}'::jsonb where email='owner@example.com';` (role `connector` for the desktop login).
5. **Register:** in the master insert `supabase_projects` (url, anon_key, status 'active') and `licenses` (license_key, company_name, plan_id, project_id, expires_at).
Phases `sb-provision`, `schema-push`, `user-provisioning`, `licenses` automate steps 3–5; keep this file as the documented manual fallback.
**Never use `user_metadata` for the license/role claim — it is user-writable.**

## Demo data and plan flags (1.0.3)
`sql/01_master_schema.sql` seeds `basic` and `pro` with a subset of flags (for example it omits `einvoice_eway`). `demo/master_seed.sql` upserts the complete flag sets and limits from `constants.json`; run it after the schema on any new master project. The frozen schema file is not edited; a missing flag is treated as `constants.json` `flags.missing_flag_default`. License project demo data: `demo/license_project_seed.sql`.
