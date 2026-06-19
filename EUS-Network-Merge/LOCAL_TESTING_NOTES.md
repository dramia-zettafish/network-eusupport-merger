# Local Testing Notes

## 2026-06-18

Goal: configure the EUSupport-hosted Network Workbench for local testing with EUSupport as the parent app on port `18004`, Network Workbench hosted under `/network`, Network APIs under `/api/network/*`, and separate databases via `DATABASE_URL` and `NETWORK_DATABASE_URL`.

### Commands Run

```sh
pwd
```

Result: current working directory is `/home/david/Desktop/EUS-Network-Merge`.

```sh
rg --files -g '!*node_modules*' -g '!*.zip' -g '!dist' -g '!build' | head -200
```

Result: only the sanitized DB dump files appeared, indicating the application code was not extracted in this folder.

```sh
find . -maxdepth 3 -type f \( -name 'package.json' -o -name 'docker-compose*.yml' -o -name 'docker-compose*.yaml' -o -name '.env*' -o -name 'vite.config.*' -o -name 'next.config.*' -o -name 'wrangler.toml' -o -name 'tsconfig.json' \) -not -path '*/node_modules/*' -print
```

Result: no app config files found in the current folder.

```sh
git status --short
```

Result: Git root appears to be `/home/david/Desktop`; the current folder and several siblings are untracked from that parent repo.

```sh
ls -la
```

Result: current folder contains `EUSupport-main.zip`, `network-support-workbench-main.zip`, the sanitized DB dump, checksum, and tool metadata folders.

```sh
find /home/david/Desktop/EUS-Network-Merge -maxdepth 4 -print | sed 's#^/home/david/Desktop/EUS-Network-Merge#.#' | head -300
```

Result: confirmed no extracted app source tree is present yet.

```sh
find /home/david/Desktop -maxdepth 2 -type f \( -name 'EUSupport-main.zip' -o -name 'network-support-workbench-main.zip' -o -name 'package.json' \) -print
```

Result: confirmed both zips are in `/home/david/Desktop/EUS-Network-Merge`; unrelated sibling projects exist.

```sh
git rev-parse --show-toplevel
```

Result: Git top-level is `/home/david/Desktop`.

### Failures / Observations

- The expected modified source tree is not extracted in the current folder. Next step is to inspect the zip contents and extract in-place if needed.

### Additional Commands Run

```sh
unzip -l EUSupport-main.zip | head -120
unzip -l network-support-workbench-main.zip | head -160
unzip -l EUSupport-main.zip | rg '(^|/)package.json$|(^|/)docker-compose|(^|/)vite.config|(^|/)wrangler.toml|(^|/)server|(^|/)src|(^|/)app'
unzip -l network-support-workbench-main.zip | rg '(^|/)package.json$|(^|/)docker-compose|(^|/)vite.config|(^|/)wrangler.toml|(^|/)server|(^|/)src|(^|/)app'
```

Result: EUSupport app root is `EUSupport-main/next-app`; Network Workbench standalone app root is `network-support-workbench-main/frontend`.

```sh
unzip -q EUSupport-main.zip
unzip -q network-support-workbench-main.zip
```

Result: extracted both archives in-place.

```sh
find EUSupport-main -maxdepth 2 -type f \( -name 'package.json' -o -name 'README.md' -o -name '.env.local.example' -o -name 'docker-compose*.yml' -o -name 'next.config.*' -o -name 'middleware.*' \) -print
find network-support-workbench-main -maxdepth 3 -type f \( -name 'package.json' -o -name 'README.md' -o -name '.env*' -o -name 'next.config.*' -o -name 'network_vcode_schema.sql' -o -name 'docker-compose*.yml' \) -print
rg -n "DATABASE_URL|POSTGRES|PORT|NEXT_PUBLIC|AUTH|LOGIN|password|workspace|team|teams|tabs|nav|protected|middleware|getUser|currentUser|session|cookie" EUSupport-main/next-app EUSupport-main/docker-compose.dev.yml EUSupport-main/.env.dev.ubuntu.example EUSupport-main/next-app/.env.local.example
rg -n "DATABASE_URL|NETWORK_DATABASE_URL|/api/tickets|/api/ups|/api/ups-installations|/api/ticket-responses|fetch\(|networkRoutes|basePath|auth|currentUser" network-support-workbench-main/frontend network-support-workbench-main/db network-support-workbench-main/docker-compose.yml
```

Result: identified EUSupport middleware auth boundary, workspace config, legacy auth provider, DB layer, and standalone network API paths.

```sh
find EUSupport-main/next-app/lib EUSupport-main/next-app/app/api/auth EUSupport-main/next-app/app/api/admin/users -maxdepth 4 -type f -print | sort
sed -n '1,260p' EUSupport-main/next-app/middleware.js
sed -n '1,260p' EUSupport-main/next-app/lib/workspace-config.js
sed -n '1,240p' EUSupport-main/next-app/package.json
sed -n '1,260p' EUSupport-main/next-app/app/api/auth/login/route.js
sed -n '1,260p' EUSupport-main/next-app/lib/auth/session.js
sed -n '1,260p' EUSupport-main/next-app/lib/auth/providers/legacy-provider.js
sed -n '1,240p' EUSupport-main/next-app/lib/db.js
```

Result: legacy auth uses `auth_users` bcrypt passwords and resolves roles/teams from `users`, `teams`, and `user_teams`.

```sh
sed -n '1,260p' EUSupport-main/next-app/app/api/admin/users/route.js
sed -n '1,180p' EUSupport-main/next-app/app/api/admin/users/[username]/password/route.js
sed -n '1,260p' EUSupport-main/next-app/lib/db-write.js
rg -n "auth_users|user_teams|CREATE TABLE.*users|CREATE TABLE.*teams|INSERT INTO.*teams|network_technicians|password_hash|bcrypt" EUSupport-main/migrations EUSupport-main/next-app/scripts EUSupport-main/next-app/app EUSupport-main/next-app/lib
sed -n '1,260p' EUSupport-main/migrations/001_schema_upgrade.sql
sed -n '1,240p' EUSupport-main/migrations/002_seed_reference_data.sql
sed -n '1,220p' EUSupport-main/next-app/.env.local.example
sed -n '1,220p' EUSupport-main/docker-compose.dev.yml
```

Result: confirmed admin/user/password patterns and existing dev compose port `18003`; added separate local compose later for `18004`.

```sh
sed -n '1,220p' network-support-workbench-main/frontend/lib/db.js
sed -n '1,220p' network-support-workbench-main/frontend/lib/api.js
sed -n '1,220p' network-support-workbench-main/frontend/lib/networkRoutes.js
sed -n '1,220p' network-support-workbench-main/frontend/app/layout.js
sed -n '1,220p' network-support-workbench-main/frontend/app/page.js
sed -n '1,120p' network-support-workbench-main/frontend/app/tickets/page.js
sed -n '1,120p' network-support-workbench-main/frontend/app/ups/page.js
sed -n '1,260p' network-support-workbench-main/frontend/components/networking/OperationsPage.js
sed -n '1,220p' network-support-workbench-main/frontend/components/networking/TicketsPage.js
sed -n '1,220p' network-support-workbench-main/frontend/components/networking/UpsPage.js
```

Result: reused page components without importing the standalone `AppShell`.

```sh
rg -n "apiRequest\(|fetch\(|/api/|tickets|ups|ticket-responses|ups-installations" network-support-workbench-main/frontend/components network-support-workbench-main/frontend/lib network-support-workbench-main/frontend/app/api
find network-support-workbench-main/frontend/app/api -type f -name 'route.js' -print | sort
sed -n '1,260p' network-support-workbench-main/frontend/app/api/tickets/route.js
sed -n '1,260p' network-support-workbench-main/frontend/app/api/tickets/[ticket_number]/route.js
sed -n '1,220p' network-support-workbench-main/frontend/app/api/tickets/[ticket_number]/response/route.js
sed -n '1,260p' network-support-workbench-main/frontend/app/api/ups-installations/route.js
sed -n '1,220p' network-support-workbench-main/frontend/app/api/ups-installations/[ups_installation_id]/route.js
```

Result: mapped standalone API routes into EUSupport under `/api/network/*`.

```sh
mkdir -p EUSupport-main/next-app/network-workbench
mkdir -p EUSupport-main/next-app/app/network/tickets EUSupport-main/next-app/app/network/ups EUSupport-main/next-app/app/api/network
cp -a network-support-workbench-main/frontend/components EUSupport-main/next-app/network-workbench/
cp -a network-support-workbench-main/frontend/lib EUSupport-main/next-app/network-workbench/
cp -a network-support-workbench-main/db EUSupport-main/network-workbench-db
cp -a network-support-workbench-main/frontend/app/api/tickets EUSupport-main/next-app/app/api/network/
cp -a network-support-workbench-main/frontend/app/api/ticket-responses EUSupport-main/next-app/app/api/network/
cp -a network-support-workbench-main/frontend/app/api/ups-installations EUSupport-main/next-app/app/api/network/
cp -a network-support-workbench-main/frontend/app/api/ups EUSupport-main/next-app/app/api/network/
```

Result: copied reusable Network Workbench code into EUSupport without changing EUSupport root ownership.

```sh
find EUSupport-main/next-app/app/api/network -type f -name 'route.js' -exec perl -pi -e "s#from '(?:\.\./)+lib/([^']+)';#from '@/network-workbench/lib/$1';#g" {} +
```

Failure: shell interpolation dropped `$1`, producing imports like `@/network-workbench/lib/`. Fixed by recopied route files and reran with escaped capture group:

```sh
cp -a network-support-workbench-main/frontend/app/api/tickets EUSupport-main/next-app/app/api/network/
cp -a network-support-workbench-main/frontend/app/api/ticket-responses EUSupport-main/next-app/app/api/network/
cp -a network-support-workbench-main/frontend/app/api/ups-installations EUSupport-main/next-app/app/api/network/
cp -a network-support-workbench-main/frontend/app/api/ups EUSupport-main/next-app/app/api/network/
find EUSupport-main/next-app/app/api/network -type f -name 'route.js' -exec perl -pi -e "s#from '(?:\.\./)+lib/([^']+)';#from '@/network-workbench/lib/\$1';#g" {} +
rg -n "from '@/network-workbench/lib/|from '\.\./|from \"\.\./" EUSupport-main/next-app/app/api/network
```

Result: API imports correctly point at `@/network-workbench/lib/ticketRepository`, `upsRepository`, and `apiResponse`.

```sh
file inventory_dev_sanitized_20260513_194234.dump
pg_restore -l inventory_dev_sanitized_20260513_194234.dump | head -160
```

Failure: host does not have `pg_restore`; Docker Postgres image is used for restore instead.

```sh
sed -n '1,220p' network-support-workbench-main/db/network_vcode_schema.sql
sed -n '1,220p' network-support-workbench-main/README.md
sed -n '1,220p' EUSupport-main/next-app/Dockerfile.dev
sed -n '1,200p' EUSupport-main/.gitignore
sed -n '1,120p' EUSupport-main/next-app/.gitignore
find EUSupport-main/migrations -maxdepth 1 -type f -name '*.sql' -print | sort
```

Result: added local compose DB init scripts to restore EUSupport dump and initialize Network DB from schema plus patches.

```sh
rg -n -- "--color-|--bg-|--text-|--border-|--accent-|--status-|--button-|--table-|--card-|--input-|--focus-|--modal-|--badge-|--tab-" EUSupport-main/next-app/network-workbench/components EUSupport-main/next-app/network-workbench/lib
```

Failure before this command: initial `rg` used a pattern starting with `--` without the `--` separator, so `rg` treated it as flags. Reran with `rg -n --`.

```sh
rg -n "DATABASE_URL|POSTGRES_URL|NEXT_PUBLIC_NETWORK_API_BASE|NETWORK_DATABASE_URL" EUSupport-main/next-app/network-workbench EUSupport-main/next-app/app/network EUSupport-main/next-app/app/api/network EUSupport-main/next-app/.env.local.example EUSupport-main/docker-compose.local.yml
rg -n "/api/tickets|/api/ups-installations|/api/ticket-responses|/api/ups/|/api/ups\?|/api/ups$" EUSupport-main/next-app/network-workbench EUSupport-main/next-app/app/network EUSupport-main/next-app/app/api/network
rg -n "apiRequest\(" EUSupport-main/next-app/network-workbench/components EUSupport-main/next-app/network-workbench/lib
```

Result: `NETWORK_DATABASE_URL` is the only Network DB connection source; no old full `/api/tickets` style calls remain in hosted workbench code.

```sh
test -d node_modules && echo node_modules-present || echo node_modules-missing
test -f package-lock.json && echo package-lock-present || echo package-lock-missing
node --version && npm --version
npm ci
npm ci --cache /tmp/eus-npm-cache
```

Failures:

- `npm ci` first failed because npm could not write logs under `/home/david/.npm`.
- Retry with `/tmp/eus-npm-cache` then failed with registry `EAI_AGAIN` network errors.

Fixed by rerunning with approved network access:

```sh
npm ci --cache /tmp/eus-npm-cache
```

Result: installed 461 packages; npm reported 9 vulnerabilities inherited from the extracted lockfile.

```sh
npm run lint
```

Failure: `next lint` is interactive because this extracted app has no ESLint config; it prompted to configure ESLint and cannot run non-interactively as-is.

```sh
SESSION_SECRET=local-dev-session-secret-change-me-32chars DATABASE_URL=postgresql://eusupport:eusupport@localhost:15432/eusupport_local NETWORK_DATABASE_URL=postgresql://network:network@localhost:15433/network_workbench_local AUTH_PROVIDER=legacy NEXT_PUBLIC_NETWORK_ROUTE_PREFIX=/network NEXT_PUBLIC_NETWORK_API_BASE=/api/network npm run build
```

Result: production build passed. Build output included `/network`, `/network/tickets`, `/network/ups`, and all `/api/network/*` routes.

```sh
docker --version
docker compose version
test -f .env.local && echo root-env-local-present || echo root-env-local-missing
cp .env.local.example .env.local
docker compose --env-file .env.local -f docker-compose.local.yml up -d --build
```

Failures:

- First compose run without escalation could not access `/var/run/docker.sock`.
- Escalated compose build succeeded, but app startup failed because port `18004` was already allocated.

Diagnosis:

```sh
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
ss -ltnp '( sport = :18004 )'
docker inspect dev-nextjs --format '{{json .Config.Labels}}'
```

Results:

- `ss` could not open netlink socket in the sandbox.
- Docker showed sibling project `/home/david/Desktop/EUSupport` stack `eusupport_dev` had `dev-nextjs` bound to `18004`.

Fix:

```sh
docker compose -p eusupport_dev --env-file /home/david/Desktop/EUSupport/.env.dev -f /home/david/Desktop/EUSupport/docker-compose.dev.yml down
docker compose --env-file .env.local -f docker-compose.local.yml up -d
```

Result: sibling stack stopped without deleting volumes; this stack started its app container.

```sh
docker compose --env-file .env.local -f docker-compose.local.yml exec -T nextjs_dev npm run seed:local-network-users
```

Failure: `getaddrinfo EAI_AGAIN eusupport_db` twice. Diagnosis showed the app container had no network attachment after the earlier failed port bind, and DB init had also aborted on migration `006`.

```sh
docker compose --env-file .env.local -f docker-compose.local.yml ps
docker compose --env-file .env.local -f docker-compose.local.yml logs --tail=120 nextjs_dev eusupport_db network_db
docker inspect eusupport-local-nextjs --format '{{json .NetworkSettings.Networks}}'
sed -n '1,80p' EUSupport-main/migrations/006_system_feedback_is_read.sql
```

Fixes:

- Patched `migrations/006_system_feedback_is_read.sql` to only alter `system_feedback` if the table exists.
- Recreated this project's local volumes and containers:

```sh
docker compose --env-file .env.local -f docker-compose.local.yml down -v
docker compose --env-file .env.local -f docker-compose.local.yml up -d --build
docker compose --env-file .env.local -f docker-compose.local.yml exec -T nextjs_dev npm run seed:local-network-users
```

Result: clean stack started and seeded `NTech` and `Dev User`.

```sh
docker compose --env-file .env.local -f docker-compose.local.yml ps
curl -i -s http://localhost:18004/network
curl -i -s http://localhost:18004/api/network/tickets
curl -i -s http://localhost:18004/api/tickets
```

Failure: sandboxed `curl` initially returned code 7 for local port access. Retried with approved local network access.

Results:

- Unauthenticated `/network` returns `307` redirect to `/login`.
- Unauthenticated `/api/network/tickets` returns `401`.

```sh
curl -i -s -c /tmp/eus-ntech.cookies -H 'Content-Type: application/json' -d '{"username":"NTech","password":"T3sting!"}' http://localhost:18004/api/auth/login
curl -i -s -b /tmp/eus-ntech.cookies http://localhost:18004/api/auth/me
curl -I -s -b /tmp/eus-ntech.cookies http://localhost:18004/network
curl -I -s -b /tmp/eus-ntech.cookies http://localhost:18004/network/tickets
curl -I -s -b /tmp/eus-ntech.cookies http://localhost:18004/network/ups
curl -i -s -b /tmp/eus-ntech.cookies 'http://localhost:18004/api/network/tickets?limit=1&offset=0'
curl -i -s -b /tmp/eus-ntech.cookies http://localhost:18004/api/tickets
```

Results:

- `NTech` login succeeds.
- `/api/auth/me` shows role `technician` and only team `network_technicians`.
- `/network`, `/network/tickets`, `/network/ups` all return `200`.
- `/api/network/tickets` returns `200` with `[]`.
- Old standalone `/api/tickets` returns `404`.

```sh
curl -i -s -c /tmp/eus-dev.cookies -H 'Content-Type: application/json' -d '{"username":"Dev User","password":"Admin123!"}' http://localhost:18004/api/auth/login
curl -i -s -b /tmp/eus-dev.cookies http://localhost:18004/api/auth/me
curl -I -s -b /tmp/eus-dev.cookies http://localhost:18004/network
curl -I -s -b /tmp/eus-dev.cookies http://localhost:18004/network/tickets
curl -I -s -b /tmp/eus-dev.cookies http://localhost:18004/network/ups
curl -i -s -b /tmp/eus-dev.cookies 'http://localhost:18004/api/network/ups-installations?limit=1&offset=0'
```

Results:

- `Dev User` login succeeds.
- `/api/auth/me` shows role `manager` and all workspace team keys.
- `/network`, `/network/tickets`, `/network/ups` all return `200`.
- `/api/network/ups-installations` returns `200` with `[]`.

```sh
node --input-type=module -e "import('./lib/workspace-config.js').then(({getWorkspacesForUser}) => { const ntech = getWorkspacesForUser({role:'technician', teams:['network_technicians']}); const dev = getWorkspacesForUser({role:'manager', teams:['computer_technicians','intake_administrators','internal_support_technicians','logistics_technicians','network_technicians','order_administrators','parts_administrators','quote_administrators','rma_administrators','reporting_administrators','route_coordinators']}); console.log(JSON.stringify({ntech:ntech.map(w=>({label:w.label,modules:w.modules})), devLabels:dev.map(w=>w.label), devCount:dev.length}, null, 2)); })"
```

Result:

- `NTech` workspace labels are exactly `My Workspace` and `Network Technician`.
- Network Technician modules are `/network`, `/network/tickets`, `/network/ups`, and `/runbook`.
- `Dev User` gets all team workspace labels plus `Management`.

```sh
docker compose --env-file .env.local -f docker-compose.local.yml exec -T nextjs_dev env
```

Rejected: dumping the full environment would expose secrets. Safer replacement:

```sh
docker compose --env-file .env.local -f docker-compose.local.yml exec -T nextjs_dev node -e "const db=new URL(process.env.DATABASE_URL); const net=new URL(process.env.NETWORK_DATABASE_URL); console.log(JSON.stringify({database:{host:db.hostname, database:db.pathname.slice(1)}, networkDatabase:{host:net.hostname, database:net.pathname.slice(1)}, urlsAreDistinct:process.env.DATABASE_URL!==process.env.NETWORK_DATABASE_URL}, null, 2));"
```

Result: EUSupport DB host/database is `eusupport_db/eusupport_local`; Network DB host/database is `network_db/network_workbench_local`; URLs are distinct.

```sh
curl -s -b /tmp/eus-ntech.cookies http://localhost:18004/network | node -e "let s=''; process.stdin.on('data', d => s += d); process.stdin.on('end', () => console.log(JSON.stringify({hasEUSupportShell:s.includes('EU Support'), hasStandaloneNetworkBrand:s.includes('Network Vcode') || s.includes('Network Support Workbench')})))"
docker compose --env-file .env.local -f docker-compose.local.yml logs --tail=160 nextjs_dev
```

Results:

- `/network` HTML includes `EU Support`.
- `/network` HTML does not include old standalone Network branding.
- App logs show `200` responses for tested network pages and APIs; no runtime errors were observed.
