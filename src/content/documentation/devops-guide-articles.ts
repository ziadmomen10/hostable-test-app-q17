// DevOps & Infrastructure Documentation Articles
// Covers CI/CD, environment sync, database migrations, and deployment

import { DocArticle } from './index';

// ============================================================================
// DEVOPS & INFRASTRUCTURE ARTICLES
// ============================================================================

export const infrastructureOverviewGuide: DocArticle = {
  title: 'Infrastructure Overview',
  description: 'Architecture map of VPS servers, Supabase stacks, and Nginx routing',
  category: 'devops',
  slug: 'infrastructure',
  order: 1,
  tags: ['infrastructure', 'architecture', 'VPS', 'Supabase', 'Nginx', 'servers'],
  lastUpdated: '2026-03-12',
  content: `
# Infrastructure Overview

A complete map of the production and testing infrastructure, including server topology, Supabase stacks, and traffic routing.

---

## Architecture Diagram

\`\`\`mermaid
graph TB
    subgraph Internet
        U[Users / Browsers]
    end

    subgraph VPS1["VPS1 — Application Server"]
        NG[Nginx Reverse Proxy]
        APP_PROD[Production App<br/>main branch]
        APP_TEST[Testing App<br/>develop branch]
    end

    subgraph VPS2["VPS2 — Supabase Server"]
        SB_PROD[Supabase Production Stack<br/>Port 8000]
        SB_TEST[Supabase Testing Stack<br/>Port 9000]
        PG_PROD[(PostgreSQL Production)]
        PG_TEST[(PostgreSQL Testing)]
        S3_PROD[Storage Production]
        S3_TEST[Storage Testing]
    end

    U --> NG
    NG -->|production domain| APP_PROD
    NG -->|testing subdomain| APP_TEST
    APP_PROD --> SB_PROD
    APP_TEST --> SB_TEST
    SB_PROD --> PG_PROD
    SB_PROD --> S3_PROD
    SB_TEST --> PG_TEST
    SB_TEST --> S3_TEST
\`\`\`

---

## Server Roles

### VPS1 — Application Server

Hosts the frontend application and Nginx:

| Component | Purpose |
|-----------|---------|
| **Nginx** | Reverse proxy, SSL termination, domain routing |
| **Production App** | Built from \`main\` branch, serves production domain |
| **Testing App** | Built from \`develop\` branch, serves testing subdomain |

### VPS2 — Supabase Server

Hosts two isolated self-hosted Supabase stacks:

| Component | Port | Purpose |
|-----------|------|---------|
| **Supabase Production** | 8000 | Live database, auth, storage, edge functions |
| **Supabase Testing** | 9000 | Testing database, auth, storage, edge functions |
| **PostgreSQL Production** | 5432 | Production database |
| **PostgreSQL Testing** | 5433 | Testing database |

---

## Network Topology

### Domain Routing

Nginx routes traffic based on the domain:

\`\`\`nginx
# Production
server {
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}

# Testing
server {
    server_name test.yourdomain.com;
    location / {
        proxy_pass http://localhost:3001;
    }
}
\`\`\`

### Supabase API Routing

Each Supabase stack exposes its own API gateway:

| Environment | API URL | Dashboard |
|-------------|---------|-----------|
| Production | \`https://supabase.yourdomain.com\` | Port 8000 |
| Testing | \`https://supabase-test.yourdomain.com\` | Port 9000 |

---

## Environment Isolation

Each environment is completely isolated:

- **Separate databases** — No shared tables or data
- **Separate auth** — Different user pools and JWT secrets
- **Separate storage** — Independent file storage buckets
- **Separate edge functions** — Independently deployed functions
- **Separate secrets** — Environment-specific API keys

> ⚠️ **Warning:** Never point a production app at a testing Supabase instance or vice versa. The JWT secrets are different and authentication will fail.

---

## What's Next?

- **[CI/CD Pipeline](/a93jf02kd92ms71x8qp4/documentation/devops/cicd-pipeline)** — Automated deployment workflows
- **[Environment Sync](/a93jf02kd92ms71x8qp4/documentation/devops/environment-sync)** — Replicating data between environments
  `
};

export const cicdPipelineGuide: DocArticle = {
  title: 'CI/CD Pipeline',
  description: 'GitHub Actions workflows for testing, building, and deploying to both environments',
  category: 'devops',
  slug: 'cicd-pipeline',
  order: 2,
  tags: ['CI/CD', 'GitHub Actions', 'deployment', 'automation', 'pipeline'],
  lastUpdated: '2026-03-12',
  content: `
# CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. Two separate workflows handle testing and production deployments, with branch isolation to prevent race conditions.

---

## Pipeline Overview

\`\`\`mermaid
graph LR
    subgraph Triggers
        PR[Pull Request] --> CI
        DEV[Push to develop] --> DT[Deploy Testing]
        MAIN[Push to main] --> DP[Deploy Production]
    end

    subgraph CI["CI Pipeline"]
        LINT[Lint] --> TEST[Vitest]
        TEST --> BUILD[Build Check]
    end

    subgraph DT["Deploy Testing"]
        BT[Build App] --> SSHT[SSH to VPS1]
        SSHT --> MIG_T[Run Migrations]
        MIG_T --> EF_T[Sync Edge Functions]
    end

    subgraph DP["Deploy Production"]
        BP[Build App] --> SSHP[SSH to VPS1]
        SSHP --> MIG_P[Run Migrations]
        MIG_P --> EF_P[Sync Edge Functions]
    end
\`\`\`

---

## Workflow Files

### \`ci.yml\` — Continuous Integration

Runs on every pull request:

\`\`\`yaml
name: CI
on:
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint
      - run: bun run test
\`\`\`

> ⚠️ **Warning:** CI gates must never use \`|| true\` to mask failures. All linting and test failures must block the merge.

### \`deploy-testing.yml\` — Testing Deployment

Triggers on push to \`develop\`:

\`\`\`yaml
name: Deploy Testing
on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bun install && bun run build
        env:
          VITE_SUPABASE_URL: \${{ secrets.TEST_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: \${{ secrets.TEST_SUPABASE_ANON_KEY }}
      - name: Deploy to VPS1
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.VPS1_HOST }}
          key: \${{ secrets.VPS1_SSH_KEY }}
          script: |
            cd /app/testing
            ./deploy.sh
      - name: Run Migrations
        run: ./scripts/run-migrations.sh testing
      - name: Sync Edge Functions
        run: ./scripts/sync-edge-functions.sh testing
\`\`\`

### \`deploy-production.yml\` — Production Deployment

Triggers on push to \`main\`:

\`\`\`yaml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bun install && bun run build
        env:
          VITE_SUPABASE_URL: \${{ secrets.PROD_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: \${{ secrets.PROD_SUPABASE_ANON_KEY }}
      - name: Deploy to VPS1
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.VPS1_HOST }}
          key: \${{ secrets.VPS1_SSH_KEY }}
          script: |
            cd /app/production
            ./deploy.sh
      - name: Run Migrations
        run: ./scripts/run-migrations.sh production
      - name: Sync Edge Functions
        run: ./scripts/sync-edge-functions.sh production
\`\`\`

---

## Branch Strategy

| Branch | Environment | Auto-deploy | CI Required |
|--------|-------------|-------------|-------------|
| \`develop\` | Testing | ✅ Yes | ✅ Yes |
| \`main\` | Production | ✅ Yes | ✅ Yes |
| Feature branches | None | ❌ No | ✅ Yes (PR) |

---

## Deployment Steps

Each deployment follows this sequence:

1. **Build** — Compile the app with environment-specific variables
2. **Transfer** — SSH into VPS1, copy build artifacts
3. **Migrations** — Run pending database migrations on VPS2
4. **Edge Functions** — Deploy all edge functions to the target Supabase stack
5. **Health Check** — Verify the deployment is serving correctly

---

## What's Next?

- **[Environment Sync](/a93jf02kd92ms71x8qp4/documentation/devops/environment-sync)** — Data replication pipeline
- **[Database Migrations](/a93jf02kd92ms71x8qp4/documentation/devops/database-migrations)** — Migration management
  `
};

export const environmentSyncGuide: DocArticle = {
  title: 'Environment Sync Pipeline',
  description: 'How the replication scripts sync data, storage, edge functions, and cron jobs between environments',
  category: 'devops',
  slug: 'environment-sync',
  order: 3,
  tags: ['sync', 'replication', 'data', 'storage', 'edge functions', 'cron'],
  lastUpdated: '2026-03-12',
  content: `
# Environment Sync Pipeline

The sync pipeline replicates configuration, data, storage objects, edge functions, and cron jobs from the production Supabase stack to the testing stack. This ensures the testing environment stays current with production.

---

## Sync Architecture

\`\`\`mermaid
graph TD
    subgraph Production["Production Supabase (VPS2:8000)"]
        PG_P[(PostgreSQL)]
        S3_P[Storage Buckets]
        EF_P[Edge Functions]
        CRON_P[Cron Jobs]
    end

    subgraph Scripts["Sync Scripts"]
        SD[sync-data.sh]
        SS[sync-storage.sh]
        SEF[sync-edge-functions.sh]
        SC[sync-cron-jobs.sh]
    end

    subgraph Testing["Testing Supabase (VPS2:9000)"]
        PG_T[(PostgreSQL)]
        S3_T[Storage Buckets]
        EF_T[Edge Functions]
        CRON_T[Cron Jobs]
    end

    PG_P -->|pg_dump / pg_restore| SD --> PG_T
    S3_P -->|rsync / API| SS --> S3_T
    EF_P -->|deploy| SEF --> EF_T
    CRON_P -->|pg_cron config| SC --> CRON_T
\`\`\`

---

## Sync Scripts

### \`sync-data.sh\` — Database Sync

Replicates database tables from production to testing:

\`\`\`bash
#!/bin/bash
# sync-data.sh - Sync production data to testing
# Usage: ./sync-data.sh [--tables table1,table2] [--exclude auth]

PROD_DB="postgresql://postgres:$PROD_DB_PASSWORD@localhost:5432/postgres"
TEST_DB="postgresql://postgres:$TEST_DB_PASSWORD@localhost:5433/postgres"

# Dump production data (schema + data)
pg_dump "$PROD_DB" \\
  --data-only \\
  --exclude-table=auth.* \\
  --exclude-table=storage.* \\
  -f /tmp/prod-data.sql

# Restore to testing
psql "$TEST_DB" -f /tmp/prod-data.sql

echo "Data sync complete"
\`\`\`

**What it syncs:**
- All public schema tables (pages, translations, settings, etc.)
- Enum types and their values
- Foreign key relationships

**What it excludes:**
- \`auth.*\` tables (users, sessions) — testing has its own auth
- \`storage.*\` tables — handled separately by storage sync
- Migration tracking tables — testing tracks its own migrations

### \`sync-storage.sh\` — Storage Sync

Replicates storage buckets and objects:

\`\`\`bash
#!/bin/bash
# sync-storage.sh - Sync production storage to testing
# Uses Supabase Storage API

PROD_URL="http://localhost:8000"
TEST_URL="http://localhost:9000"

# List all buckets in production
buckets=$(curl -s "$PROD_URL/storage/v1/bucket" \\
  -H "Authorization: Bearer $PROD_SERVICE_KEY" | jq -r '.[].name')

for bucket in $buckets; do
  echo "Syncing bucket: $bucket"
  
  # Ensure bucket exists in testing
  curl -s -X POST "$TEST_URL/storage/v1/bucket" \\
    -H "Authorization: Bearer $TEST_SERVICE_KEY" \\
    -d '{"name": "'$bucket'", "public": true}'
  
  # List and sync objects
  objects=$(curl -s "$PROD_URL/storage/v1/object/list/$bucket" \\
    -H "Authorization: Bearer $PROD_SERVICE_KEY" | jq -r '.[].name')
  
  for obj in $objects; do
    # Download from production, upload to testing
    curl -s "$PROD_URL/storage/v1/object/$bucket/$obj" \\
      -H "Authorization: Bearer $PROD_SERVICE_KEY" \\
      -o "/tmp/storage-sync/$obj"
    
    curl -s -X POST "$TEST_URL/storage/v1/object/$bucket/$obj" \\
      -H "Authorization: Bearer $TEST_SERVICE_KEY" \\
      -F "file=@/tmp/storage-sync/$obj"
  done
done
\`\`\`

### \`sync-edge-functions.sh\` — Edge Functions Sync

Deploys all edge functions to the target environment:

\`\`\`bash
#!/bin/bash
# sync-edge-functions.sh - Deploy edge functions to target environment
# Usage: ./sync-edge-functions.sh [testing|production]

ENV=\${1:-testing}
FUNCTIONS_DIR="./supabase/functions"

# Set target based on environment
if [ "$ENV" = "production" ]; then
  export SUPABASE_URL="$PROD_SUPABASE_URL"
  export SUPABASE_SERVICE_KEY="$PROD_SERVICE_KEY"
else
  export SUPABASE_URL="$TEST_SUPABASE_URL"
  export SUPABASE_SERVICE_KEY="$TEST_SERVICE_KEY"
fi

# Deploy each function
for func_dir in "$FUNCTIONS_DIR"/*/; do
  func_name=$(basename "$func_dir")
  echo "Deploying: $func_name"
  supabase functions deploy "$func_name" --project-ref "$PROJECT_REF"
done

echo "All edge functions deployed to $ENV"
\`\`\`

### \`sync-cron-jobs.sh\` — Cron Jobs Sync

Replicates pg_cron job configurations:

\`\`\`bash
#!/bin/bash
# sync-cron-jobs.sh - Sync cron job configs to testing

PROD_DB="postgresql://postgres:$PROD_DB_PASSWORD@localhost:5432/postgres"
TEST_DB="postgresql://postgres:$TEST_DB_PASSWORD@localhost:5433/postgres"

# Export cron jobs from production
psql "$PROD_DB" -c "SELECT * FROM cron.job" -t -A > /tmp/cron-jobs.csv

# Recreate in testing
while IFS='|' read -r jobid schedule command; do
  psql "$TEST_DB" -c "SELECT cron.schedule('$schedule', '$command')"
done < /tmp/cron-jobs.csv
\`\`\`

---

## When to Sync

| Scenario | Scripts to Run |
|----------|---------------|
| New feature needs prod data | \`sync-data.sh\` |
| Testing storage uploads | \`sync-storage.sh\` |
| After adding new edge function | \`sync-edge-functions.sh\` |
| After modifying cron schedule | \`sync-cron-jobs.sh\` |
| Full environment refresh | All scripts in order |

---

## Safety Considerations

1. **Always backup testing first** — \`pg_dump\` the testing database before syncing
2. **Never sync in reverse** — Testing → Production sync is forbidden
3. **Auth data stays isolated** — Each environment has its own users
4. **Check disk space** — Storage sync can be large

---

## What's Next?

- **[Database Migrations](/a93jf02kd92ms71x8qp4/documentation/devops/database-migrations)** — Managing schema changes
- **[Secrets Management](/a93jf02kd92ms71x8qp4/documentation/devops/secrets-management)** — Environment variables and API keys
  `
};

export const databaseMigrationsGuide: DocArticle = {
  title: 'Database Migrations',
  description: 'How run-migrations.sh manages schema changes across environments',
  category: 'devops',
  slug: 'database-migrations',
  order: 4,
  tags: ['migrations', 'database', 'schema', 'PostgreSQL', 'versioning'],
  lastUpdated: '2026-03-12',
  content: `
# Database Migrations

Database migrations are managed through versioned SQL files and an automated runner script. The system tracks which migrations have been applied to each environment, preventing duplicate execution.

---

## Migration File Structure

\`\`\`
supabase/migrations/
├── 20250101000000_initial_schema.sql
├── 20250115000000_add_page_versions.sql
├── 20250201000000_add_translation_keys.sql
├── 20250215000000_add_seo_tables.sql
├── 20250301000000_add_user_roles.sql
├── 20250315000000_add_page_locks.sql
└── 20260301000000_add_content_freshness.sql
\`\`\`

Each migration file follows the naming convention: \`YYYYMMDDHHMMSS_description.sql\`

---

## The Migration Runner

### \`run-migrations.sh\`

\`\`\`bash
#!/bin/bash
# run-migrations.sh - Apply pending migrations to target environment
# Usage: ./run-migrations.sh [testing|production]

ENV=\${1:-testing}

# Set database connection
if [ "$ENV" = "production" ]; then
  DB_URL="postgresql://postgres:$PROD_DB_PASSWORD@localhost:5432/postgres"
else
  DB_URL="postgresql://postgres:$TEST_DB_PASSWORD@localhost:5433/postgres"
fi

MIGRATIONS_DIR="./supabase/migrations"
TRACKING_TABLE="public.schema_migrations"

# Ensure tracking table exists
psql "$DB_URL" -c "
  CREATE TABLE IF NOT EXISTS $TRACKING_TABLE (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT now()
  );
"

# Apply pending migrations in order
for migration in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
  version=$(basename "$migration" .sql)
  
  # Check if already applied
  applied=$(psql "$DB_URL" -t -c "
    SELECT 1 FROM $TRACKING_TABLE WHERE version = '$version'
  ")
  
  if [ -z "$applied" ]; then
    echo "Applying: $version"
    psql "$DB_URL" -f "$migration"
    
    if [ $? -eq 0 ]; then
      psql "$DB_URL" -c "
        INSERT INTO $TRACKING_TABLE (version) VALUES ('$version')
      "
      echo "✅ Applied: $version"
    else
      echo "❌ Failed: $version"
      exit 1
    fi
  else
    echo "⏭️ Skipped (already applied): $version"
  fi
done

echo "Migration run complete for $ENV"
\`\`\`

---

## Writing Migrations

### Best Practices

1. **Always make migrations reversible** — Include rollback comments
2. **One concern per migration** — Don't mix unrelated changes
3. **Use IF NOT EXISTS** — Make migrations idempotent where possible
4. **Test on testing first** — Always deploy to testing before production

### Example Migration

\`\`\`sql
-- 20260301000000_add_content_freshness.sql
-- Adds content freshness tracking for SEO

CREATE TABLE IF NOT EXISTS public.seo_content_freshness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  content_hash TEXT,
  word_count INTEGER,
  freshness_score NUMERIC,
  last_major_update TIMESTAMPTZ,
  decay_detected_at TIMESTAMPTZ,
  refresh_suggestions JSONB,
  checked_at TIMESTAMPTZ DEFAULT now()
);

-- Add unique constraint
ALTER TABLE public.seo_content_freshness
  ADD CONSTRAINT uq_content_freshness_page UNIQUE (page_id);

-- Enable RLS
ALTER TABLE public.seo_content_freshness ENABLE ROW LEVEL SECURITY;

-- RLS policy
CREATE POLICY "Allow authenticated read"
  ON public.seo_content_freshness
  FOR SELECT TO authenticated USING (true);

-- Rollback:
-- DROP TABLE IF EXISTS public.seo_content_freshness;
\`\`\`

---

## Migration Workflow

\`\`\`mermaid
graph TD
    A[Write Migration SQL] --> B[Test Locally]
    B --> C[Commit to Feature Branch]
    C --> D[PR Review]
    D --> E[Merge to develop]
    E --> F[Auto-deploy to Testing]
    F --> G{Tests Pass?}
    G -->|Yes| H[Merge to main]
    G -->|No| I[Fix & Retry]
    H --> J[Auto-deploy to Production]
\`\`\`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Migration fails halfway | Fix the SQL, re-run (tracking prevents re-execution of successful ones) |
| Need to rollback | Run the rollback SQL manually, remove from tracking table |
| Duplicate migration error | Check tracking table, remove duplicate entry |
| Permission denied | Verify database credentials and connection |

---

## What's Next?

- **[Edge Functions Deployment](/a93jf02kd92ms71x8qp4/documentation/devops/edge-functions-deployment)** — Deploying serverless functions
- **[Environment Sync](/a93jf02kd92ms71x8qp4/documentation/devops/environment-sync)** — Data replication
  `
};

export const edgeFunctionsDeploymentGuide: DocArticle = {
  title: 'Edge Functions Deployment',
  description: 'All edge functions, how they deploy, and environment-specific configurations',
  category: 'devops',
  slug: 'edge-functions-deployment',
  order: 5,
  tags: ['edge functions', 'Deno', 'serverless', 'deployment', 'Supabase'],
  lastUpdated: '2026-03-12',
  content: `
# Edge Functions Deployment

Edge functions are Deno-based serverless functions deployed to the self-hosted Supabase instances. Each environment has its own set of functions with environment-specific secrets.

---

## Function Inventory

| Function | Purpose | Auth Required |
|----------|---------|---------------|
| \`ai-translate\` | Single key AI translation | User/Service |
| \`ai-translate-batch\` | Batch AI translation | User/Service |
| \`admin-auth\` | Admin authentication | User |
| \`create-admin-user\` | Initial admin setup | Setup Key |
| \`get-exchange-rates\` | Currency exchange rates | None |
| \`purge-cloudflare-cache\` | CDN cache purge | User |
| \`fix-page-translations\` | Translation repair | User |
| \`analyze-competitor\` | SEO competitor analysis | User |
| \`generate-sitemap\` | Dynamic sitemap generation | None |
| \`send-notification\` | Email/push notifications | Service |
| \`validate-seo\` | SEO validation checks | User |
| \`sync-gsc-data\` | Google Search Console sync | Service |
| \`check-backlinks\` | Backlink monitoring | Service |
| \`content-freshness\` | Content decay detection | Service |

---

## Function Structure

Each edge function lives in its own directory:

\`\`\`
supabase/functions/
├── ai-translate/
│   └── index.ts
├── ai-translate-batch/
│   └── index.ts
├── admin-auth/
│   └── index.ts
├── _shared/
│   ├── cors.ts
│   ├── supabase-client.ts
│   └── rate-limiter.ts
└── ...
\`\`\`

### Shared Utilities (\`_shared/\`)

Common code shared across functions:

\`\`\`typescript
// _shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// _shared/supabase-client.ts
import { createClient } from '@supabase/supabase-js';

export const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
};
\`\`\`

---

## Environment-Specific Secrets

Each environment needs its own secrets configured:

| Secret | Testing Value | Production Value |
|--------|---------------|------------------|
| \`SUPABASE_URL\` | \`http://localhost:9000\` | \`http://localhost:8000\` |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Testing service key | Production service key |
| \`OPENAI_API_KEY\` | Shared or separate key | Production API key |
| \`CLOUDFLARE_API_TOKEN\` | N/A | Production token |

---

## Deployment Process

### Manual Deployment

\`\`\`bash
# Deploy single function to testing
supabase functions deploy ai-translate \\
  --project-ref testing-ref

# Deploy all functions to production
for dir in supabase/functions/*/; do
  func=$(basename "$dir")
  [[ "$func" == _* ]] && continue  # Skip shared dirs
  supabase functions deploy "$func" --project-ref prod-ref
done
\`\`\`

### Automated Deployment (CI/CD)

Functions are automatically deployed during the CI/CD pipeline:

1. Push to \`develop\` → deploys to testing Supabase
2. Push to \`main\` → deploys to production Supabase

---

## Testing Edge Functions

### Local Development

\`\`\`bash
# Serve function locally
supabase functions serve ai-translate --env-file .env.local

# Test with curl
curl -X POST http://localhost:54321/functions/v1/ai-translate \\
  -H "Authorization: Bearer YOUR_ANON_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "hero.title", "targetLang": "fr", "sourceText": "Welcome"}'
\`\`\`

---

## What's Next?

- **[Secrets Management](/a93jf02kd92ms71x8qp4/documentation/devops/secrets-management)** — Managing environment variables
- **[Troubleshooting](/a93jf02kd92ms71x8qp4/documentation/devops/troubleshooting)** — Common deployment issues
  `
};

export const secretsManagementGuide: DocArticle = {
  title: 'Secrets & Environment Variables',
  description: 'Required GitHub secrets, Supabase keys, and per-environment configuration',
  category: 'devops',
  slug: 'secrets-management',
  order: 6,
  tags: ['secrets', 'environment variables', 'API keys', 'configuration', 'security'],
  lastUpdated: '2026-03-12',
  content: `
# Secrets & Environment Variables

A comprehensive guide to all secrets, environment variables, and API keys required across the infrastructure.

---

## GitHub Actions Secrets

These secrets must be configured in GitHub repository settings:

### Server Access

| Secret | Description |
|--------|-------------|
| \`VPS1_HOST\` | IP address of the application server |
| \`VPS1_SSH_KEY\` | SSH private key for VPS1 access |
| \`VPS2_HOST\` | IP address of the Supabase server |
| \`VPS2_SSH_KEY\` | SSH private key for VPS2 access |

### Testing Environment

| Secret | Description |
|--------|-------------|
| \`TEST_SUPABASE_URL\` | Testing Supabase API URL |
| \`TEST_SUPABASE_ANON_KEY\` | Testing Supabase anon/publishable key |
| \`TEST_SUPABASE_SERVICE_KEY\` | Testing Supabase service role key |
| \`TEST_DB_PASSWORD\` | Testing PostgreSQL password |

### Production Environment

| Secret | Description |
|--------|-------------|
| \`PROD_SUPABASE_URL\` | Production Supabase API URL |
| \`PROD_SUPABASE_ANON_KEY\` | Production Supabase anon/publishable key |
| \`PROD_SUPABASE_SERVICE_KEY\` | Production Supabase service role key |
| \`PROD_DB_PASSWORD\` | Production PostgreSQL password |

### Third-Party Services

| Secret | Description |
|--------|-------------|
| \`OPENAI_API_KEY\` | OpenAI API key for AI translations |
| \`CLOUDFLARE_API_TOKEN\` | Cloudflare API token for cache purging |
| \`GSC_SERVICE_ACCOUNT\` | Google Search Console service account JSON |

---

## Frontend Environment Variables

Variables prefixed with \`VITE_\` are available in the frontend:

\`\`\`bash
# .env.production
VITE_SUPABASE_URL=https://supabase.yourdomain.com
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_ADMIN_HASH_PATH=your_admin_path

# .env.testing
VITE_SUPABASE_URL=https://supabase-test.yourdomain.com
VITE_SUPABASE_PUBLISHABLE_KEY=your_test_anon_key
VITE_ADMIN_HASH_PATH=your_admin_path
\`\`\`

> ⚠️ **Warning:** Never put private/service keys in \`VITE_\` variables. They are exposed in the browser bundle. Only anon/publishable keys are safe.

---

## Supabase Edge Function Secrets

Set via the Supabase dashboard or CLI:

\`\`\`bash
# Set a secret for edge functions
supabase secrets set OPENAI_API_KEY=sk-xxx --project-ref your-ref

# List current secrets
supabase secrets list --project-ref your-ref
\`\`\`

---

## Security Best Practices

1. **Rotate secrets regularly** — Update API keys quarterly
2. **Use least privilege** — Service keys only where needed
3. **Never commit secrets** — Use \`.env\` files (gitignored) or CI secrets
4. **Audit access** — Review who has access to GitHub secrets
5. **Separate per environment** — Never share keys between testing and production

---

## What's Next?

- **[Troubleshooting](/a93jf02kd92ms71x8qp4/documentation/devops/troubleshooting)** — Common deployment issues
- **[CI/CD Pipeline](/a93jf02kd92ms71x8qp4/documentation/devops/cicd-pipeline)** — How secrets are used in workflows
  `
};

export const troubleshootingDeploymentsGuide: DocArticle = {
  title: 'Troubleshooting Deployments',
  description: 'Common deployment issues, rollback procedures, and debugging strategies',
  category: 'devops',
  slug: 'troubleshooting',
  order: 7,
  tags: ['troubleshooting', 'debugging', 'rollback', 'errors', 'deployment'],
  lastUpdated: '2026-03-12',
  content: `
# Troubleshooting Deployments

A guide to diagnosing and fixing common deployment issues, with rollback procedures for each component.

---

## Common Issues

### Build Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| TypeScript errors | Type mismatch or missing types | Fix types, run \`bun run build\` locally |
| Module not found | Missing dependency | Run \`bun install\`, check imports |
| Out of memory | Large build on CI | Increase Node memory or optimize bundle |
| Lint errors blocking merge | Code style violations | Run \`bun run lint --fix\` |

### Deployment Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| SSH connection refused | Wrong key or IP | Verify \`VPS1_HOST\` and \`VPS1_SSH_KEY\` |
| Permission denied on VPS | File ownership issues | Check deploy user permissions |
| Nginx 502 Bad Gateway | App not running | Restart the app process, check logs |
| Edge function deploy fails | Invalid Deno code | Test locally with \`supabase functions serve\` |

### Database Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Migration fails | SQL syntax error | Test migration locally first |
| Connection refused | Wrong port or credentials | Verify \`DB_PASSWORD\` and port |
| Duplicate migration | Tracking table inconsistency | Check \`schema_migrations\` table |
| RLS blocking queries | Missing policy | Add appropriate RLS policy |

---

## Rollback Procedures

### Rolling Back the Frontend

\`\`\`bash
# On VPS1, switch back to previous build
cd /app/production
ln -sfn builds/previous dist

# Restart Nginx to pick up changes
sudo nginx -s reload
\`\`\`

### Rolling Back a Migration

\`\`\`bash
# 1. Run the rollback SQL (found at bottom of migration file)
psql "$DB_URL" -c "DROP TABLE IF EXISTS public.new_table;"

# 2. Remove from tracking table
psql "$DB_URL" -c "
  DELETE FROM schema_migrations
  WHERE version = '20260301000000_add_new_table';
"
\`\`\`

### Rolling Back Edge Functions

\`\`\`bash
# Redeploy previous version from git
git checkout HEAD~1 -- supabase/functions/function-name/
supabase functions deploy function-name --project-ref your-ref
\`\`\`

---

## Debugging Checklist

When something goes wrong, follow this order:

1. **Check CI logs** — GitHub Actions workflow output
2. **Check server logs** — SSH into VPS, check app and Nginx logs
3. **Check Supabase logs** — Dashboard → Logs for edge functions
4. **Check database** — Run queries to verify data state
5. **Check network** — Verify DNS, SSL, and connectivity
6. **Check secrets** — Ensure all env vars are set correctly

---

## Log Locations

| Component | Log Location |
|-----------|-------------|
| **Nginx** | \`/var/log/nginx/access.log\`, \`/var/log/nginx/error.log\` |
| **App (PM2)** | \`pm2 logs\` |
| **Supabase** | Docker logs: \`docker logs supabase-kong\` |
| **Edge Functions** | Supabase Dashboard → Edge Function Logs |
| **PostgreSQL** | \`/var/log/postgresql/\` |
| **CI/CD** | GitHub Actions → Workflow runs |

---

## Health Checks

### Quick Verification Script

\`\`\`bash
#!/bin/bash
# health-check.sh - Verify all components are running

echo "=== VPS1 Health ==="
curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com
echo " - Frontend"

echo "=== VPS2 Health ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/rest/v1/
echo " - Supabase Production"

curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/rest/v1/
echo " - Supabase Testing"

echo "=== Database ==="
psql "$PROD_DB" -c "SELECT 1" > /dev/null 2>&1 && echo "✅ Production DB" || echo "❌ Production DB"
psql "$TEST_DB" -c "SELECT 1" > /dev/null 2>&1 && echo "✅ Testing DB" || echo "❌ Testing DB"
\`\`\`

---

## What's Next?

- **[Infrastructure Overview](/a93jf02kd92ms71x8qp4/documentation/devops/infrastructure)** — Server architecture
- **[CI/CD Pipeline](/a93jf02kd92ms71x8qp4/documentation/devops/cicd-pipeline)** — Deployment workflows
  `
};
