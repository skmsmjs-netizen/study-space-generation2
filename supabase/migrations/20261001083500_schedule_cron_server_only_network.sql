-- Scheduled server jobs alone use pg_net. Application accounts do not send HTTP from SQL.
revoke usage on schema net from public, anon, authenticated;
revoke execute on all functions in schema net from public, anon, authenticated;
grant usage on schema net to service_role;
grant execute on all functions in schema net to service_role;
