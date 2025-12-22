# Quick Fix for Database Error

## The Problem

Your Supabase database connection is failing with "Tenant or user not found"

## Quick Solution: Use SQLite for Development

### Step 1: Backup current schema

```bash
cp prisma/schema.prisma prisma/schema-postgres.prisma
```

### Step 2: Replace with SQLite schema

```bash
cp prisma/schema-sqlite.prisma prisma/schema.prisma
```

### Step 3: Update .env

```bash
# Comment out Supabase URLs
# DATABASE_URL=...
# DIRECT_URL=...

# SQLite will use file:./dev.db from schema
```

### Step 4: Create new database

```bash
rm -f prisma/dev.db
npx prisma migrate dev --name init
npx prisma db seed
```

### Step 5: Restart server

```bash
bun dev
```

## To Switch Back to PostgreSQL Later

1. Restore schema: `cp prisma/schema-postgres.prisma prisma/schema.prisma`
2. Update `.env` with valid Supabase credentials
3. Run: `npx prisma migrate deploy`

## Alternative: Fix Supabase

1. Go to https://supabase.com/dashboard
2. Check if project is paused → Click "Resume"
3. Get fresh connection strings from Settings → Database
4. Update `.env` file
5. Run: `npx prisma generate`
