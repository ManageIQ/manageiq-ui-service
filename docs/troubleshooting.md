# Troubleshooting
- When running ManageIQ with `bin/rake evm:start`, it may be necessary to override the REST API host via a
PROXY\_HOST environment variable.
  - `PROXY_HOST=127.0.0.1:3000 yarn start`

- `ActiveRecord::ConnectionTimeoutError: could not obtain a connection from the pool within 5.000 seconds; all pooled
connections were in use` or `Error: socket hang up` or ` Error: connect ECONNREFUSED`
might be caused to by lower than expected connection pool size this is remedied by navigating to
`manageiq/config/database.yml` and increasing the `pool: xx` value.
- For a full list of gulp tasks available to the SUI.
  - `gulp help`
