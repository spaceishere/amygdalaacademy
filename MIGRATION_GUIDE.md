# Database Migration Guide

## Overview

The new features require database schema changes. Follow these steps to apply them.

## Schema Changes

### Course Model

Added fields:

- `discountPercent` (Int) - Percentage discount (0-100)
- `discountEndDate` (DateTime?) - When discount expires
- `category` (String?) - Course category for filtering

### User Model

Added fields:

- `resetToken` (String?) - Unique token for password reset
- `resetTokenExpiry` (DateTime?) - Token expiration timestamp

## Migration Steps

### 1. Verify Schema Changes

Check that `/prisma/schema.prisma` has been updated with the new fields.

### 2. Create and Apply Migration

```bash
# Generate migration files
npx prisma migrate dev --name add_discount_category_and_password_reset

# This will:
# 1. Create SQL migration files
# 2. Apply changes to database
# 3. Regenerate Prisma Client
```

### 3. Verify Migration

```bash
# Check migration status
npx prisma migrate status

# View database schema
npx prisma studio
```

## Alternative: Manual SQL (if migration fails)

If you're using PostgreSQL and the migration command fails, you can apply these SQL commands manually:

```sql
-- Add discount and category fields to Course
ALTER TABLE "Course"
ADD COLUMN "discountPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "discountEndDate" TIMESTAMP(3),
ADD COLUMN "category" TEXT;

-- Add password reset fields to User
ALTER TABLE "User"
ADD COLUMN "resetToken" TEXT,
ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);

-- Add unique constraint on resetToken
ALTER TABLE "User"
ADD CONSTRAINT "User_resetToken_key" UNIQUE ("resetToken");
```

Then regenerate Prisma Client:

```bash
npx prisma generate
```

## Post-Migration

### 1. Update Existing Courses (Optional)

You can add categories to existing courses via Prisma Studio or SQL:

```sql
-- Example: Update courses with categories
UPDATE "Course"
SET "category" = 'Digital Marketing'
WHERE "title" LIKE '%Marketing%';

UPDATE "Course"
SET "category" = 'Web Development'
WHERE "title" LIKE '%Development%' OR "title" LIKE '%Programming%';
```

### 2. Test Features

After migration, test:

- [ ] Discount badges appear on courses
- [ ] Category filtering works
- [ ] Password reset flow completes
- [ ] No TypeScript errors in IDE

## Rollback (if needed)

If you need to rollback:

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration_name>

# Or manually remove columns
```

```sql
ALTER TABLE "Course"
DROP COLUMN "discountPercent",
DROP COLUMN "discountEndDate",
DROP COLUMN "category";

ALTER TABLE "User"
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry";
```

## Troubleshooting

### Error: "Tenant or user not found"

- Check your `.env` file for correct `DATABASE_URL`
- Verify database connection
- Ensure Supabase/PostgreSQL is running

### Error: "Column already exists"

- The migration may have partially applied
- Use `npx prisma migrate resolve` to mark it as applied
- Or manually check database and adjust

### TypeScript Errors Persist

- Run `npx prisma generate` to regenerate types
- Restart TypeScript server in VS Code
- Close and reopen IDE

## Production Deployment

When deploying to production:

1. **Backup database first**
2. Run migration in production:
   ```bash
   npx prisma migrate deploy
   ```
3. Verify all features work
4. Monitor for errors

## Environment Variables

Ensure these are set in `.env`:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # For Supabase
NEXTAUTH_URL="https://yourdomain.com"
```

## Next Steps

After successful migration:

1. Test all 7 features
2. Add sample courses with discounts
3. Configure email service for password reset
4. Update admin UI to set discounts and categories
