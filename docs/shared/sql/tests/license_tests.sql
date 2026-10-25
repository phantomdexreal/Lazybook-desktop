-- LazyBooks license-project RLS tests (run after 02_license_project_schema.sql). Expect four OK notices.
set role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-0000000000a1","app_metadata":{"license_key":"LB-A","role":"owner"}}',false);
insert into sync_requests(license_key,device_id,kind) values ('LB-A','dev1','initial');
do $$ begin begin insert into sync_requests(license_key,device_id,kind) values ('LB-A','dev1','initial'); raise exception 'DUP NOT BLOCKED'; exception when unique_violation then raise notice 'OK duplicate in-flight blocked'; end; end $$;
do $$ begin begin insert into sync_chunks(license_key,device_id,table_name,payload) values ('LB-A','dev1','tm_ledger','[]'); raise exception 'OWNER INSERTED CHUNK'; exception when insufficient_privilege or others then if sqlerrm like 'OWNER%' then raise; end if; raise notice 'OK owner cannot insert chunks'; end; end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-0000000000c1","app_metadata":{"license_key":"LB-A","role":"connector"}}',false);
insert into sync_chunks(license_key,device_id,table_name,payload) values ('LB-A','dev1','tm_ledger','[]');
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-0000000000b1","app_metadata":{"license_key":"LB-B","role":"owner"}}',false);
do $$ declare n int; begin select count(*) into n from sync_chunks; if n<>0 then raise exception 'LEAK across licenses: %', n; end if; raise notice 'OK no cross-license leak'; end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-0000000000b2","user_metadata":{"license_key":"LB-A"},"app_metadata":{}}',false);
do $$ declare n int; begin select count(*) into n from sync_chunks; if n<>0 then raise exception 'user_metadata spoof worked'; end if; raise notice 'OK user_metadata spoof ignored'; end $$;
