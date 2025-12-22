# Database Connection Fix

## Error

`FATAL: Tenant or user not found` - Your Supabase credentials are invalid.

## Steps to Fix

### 1. Get Correct Supabase Connection Strings

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **Database**
4. Find two connection strings:
   - **Connection Pooling** (port 6543) → for `DATABASE_URL`
   - **Direct Connection** (port 5432) → for `DIRECT_URL`

### 2. Update .env File

Replace the DATABASE_URL and DIRECT_URL in your `.env` file:

```env
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

**Important:** Make sure to:

- Use the correct project reference
- Use the correct password
- Keep `pgbouncer=true` in DATABASE_URL
- Remove `pgbouncer=true` from DIRECT_URL

### 3. Push Database Schema

After updating credentials, run:

```bash
npx prisma db push
```

This will create all tables in your Supabase database.

### 4. (Optional) Seed Sample Data

```bash
npm run seed
```

### 5. Restart Dev Server

```bash
npm run dev
```

## Quick Test

After fixing, test the connection:

```bash
npx prisma studio
```

This should open Prisma Studio if the connection is successful.
