# Deployment Checklist - 7 New Features

## Pre-Deployment Steps

### 1. Run Database Migration

**CRITICAL:** Run this before testing or deploying:

```bash
# Generate and apply migration
npx prisma migrate dev --name add_discount_category_and_password_reset

# Regenerate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

This will:

- Add `discountPercent`, `discountEndDate`, `category` to Course model
- Add `resetToken`, `resetTokenExpiry` to User model
- Clear all TypeScript errors

### 2. Verify TypeScript Errors Clear

After migration, these errors should disappear:

- ✅ Course type missing discountPercent, discountEndDate, category
- ✅ User type missing resetToken, resetTokenExpiry

If errors persist:

1. Restart TypeScript server (Cmd+Shift+P → "Restart TS Server")
2. Close and reopen VS Code
3. Run `npx prisma generate` again

---

## Feature Testing

### ✅ 1. Loading Animation

**Test:**

1. Go to `/auth/login`
2. Enter credentials and click "Нэвтрэх"
3. Verify full-page spinner appears
4. Verify spinner disappears after login

**Expected:** Smooth loading overlay with "Ачааллаж байна..." text

---

### ✅ 2. Video Upload Progress

**Test:**

1. Go to `/admin/courses/[id]` (admin panel)
2. Create or edit an episode
3. Upload a video file (preferably large, 50MB+)
4. Watch progress bar

**Expected:**

- Progress bar shows 0% → 100%
- Percentage updates in real-time
- Success message at 100%

---

### ✅ 3. Video Protection

**Test:**

1. View any course with video
2. Try right-clicking on video → should be blocked
3. Try Ctrl+S → should be blocked
4. Check video controls → no download button

**Expected:** Basic protection active (not foolproof, but deters casual users)

---

### ✅ 4. Discount System

**Test:**

1. Go to `/admin/courses`
2. Edit a course
3. Set discount: 30%
4. Set end date: tomorrow
5. Save and view on homepage

**Expected:**

- Red discount badge on course card
- Countdown timer showing time left
- Original price with strikethrough
- Discounted price in red

---

### ✅ 5. Hero Section

**Test:**

1. Visit homepage `/`
2. Scroll to top

**Expected:**

- Large hero banner with gradient
- Statistics (10,000+ students, etc.)
- "Одоо суралцаж эхлэх" button
- Responsive on mobile

---

### ✅ 6. Category Filtering

**Test:**

1. Go to `/admin/courses`
2. Edit courses and assign categories
3. Visit homepage
4. Click category filter buttons

**Expected:**

- Category buttons appear if courses have categories
- Clicking filters courses
- "Бүгд" shows all courses
- Category badge on each card

---

### ✅ 7. Forgot Password

**Test:**

1. Go to `/auth/login`
2. Click "Нууц үгээ мартсан уу?"
3. Enter email address
4. Check console for reset URL
5. Visit reset URL
6. Enter new password
7. Verify redirect to login

**Expected:**

- Email submission shows success
- Console logs reset URL (in production, email sent)
- Reset page validates token
- Password updates successfully

---

## Production Setup

### Email Service (Required for Password Reset)

Choose one and configure:

**Option 1: Resend (Recommended)**

```bash
npm install resend
```

```typescript
// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await resend.emails.send({
    from: "noreply@yourdomain.com",
    to: email,
    subject: "Нууц үг сэргээх",
    html: `<p>Нууц үг сэргээх линк: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });
}
```

**Option 2: SendGrid**

```bash
npm install @sendgrid/mail
```

**Option 3: AWS SES**

```bash
npm install @aws-sdk/client-ses
```

### Environment Variables

Add to `.env`:

```env
# Email Service
RESEND_API_KEY=re_xxxxx
# or
SENDGRID_API_KEY=SG.xxxxx
# or
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx

# App URL (for password reset links)
NEXTAUTH_URL=https://yourdomain.com
```

---

## Admin Panel Updates

### Set Discounts

1. Navigate to course edit page
2. Find "Хямдралын тохиргоо" section
3. Enter discount percentage (0-100)
4. Set expiry date/time
5. Save

### Assign Categories

1. Navigate to course edit page
2. Find "Ангилал" dropdown
3. Select category
4. Save

Available categories:

- Social Marketing
- Digital Marketing
- Branding
- Web Development
- Photography
- Business

---

## Performance Optimization

### Image Optimization

Ensure all course thumbnails are optimized:

- Max width: 800px
- Format: WebP or JPEG
- Compression: 80% quality

### Video Considerations

For better protection:

- Use HLS/DASH streaming
- Implement DRM (Widevine, FairPlay)
- Add server-side watermarking

---

## Security Checklist

- [ ] Password reset tokens expire after 1 hour
- [ ] Email enumeration prevented (same response for valid/invalid emails)
- [ ] Rate limiting on password reset endpoints
- [ ] HTTPS enabled in production
- [ ] Environment variables secured
- [ ] Database backups configured

---

## Monitoring

### Metrics to Track

1. **Password Reset Flow**

   - Reset requests per day
   - Success rate
   - Token expiry rate

2. **Discount Performance**

   - Courses with active discounts
   - Conversion rate with/without discounts

3. **Video Engagement**

   - Watch time
   - Completion rate

4. **Category Usage**
   - Most popular categories
   - Filter usage stats

---

## Rollback Plan

If issues arise:

### 1. Disable Features

```typescript
// Quick feature flags
const FEATURES = {
  discounts: false,
  categories: false,
  passwordReset: false,
};
```

### 2. Database Rollback

```bash
npx prisma migrate resolve --rolled-back [migration_name]
```

### 3. Code Rollback

```bash
git revert [commit_hash]
git push
```

---

## Support Documentation

### For Users

Create help articles:

1. "How to reset your password"
2. "Understanding course discounts"
3. "Browsing courses by category"

### For Admins

Create admin guides:

1. "Setting up course discounts"
2. "Organizing courses with categories"
3. "Managing video uploads"

---

## Post-Deployment

### Week 1

- [ ] Monitor error logs
- [ ] Check password reset success rate
- [ ] Verify discount countdowns working
- [ ] Test on mobile devices

### Week 2

- [ ] Gather user feedback
- [ ] Analyze category usage
- [ ] Review video protection effectiveness
- [ ] Optimize performance

### Month 1

- [ ] A/B test discount strategies
- [ ] Add more categories if needed
- [ ] Enhance video protection if required
- [ ] Consider advanced features

---

## Future Enhancements

### Phase 2 Features

1. **Coupon Codes**

   - Unique discount codes
   - Usage limits
   - User-specific codes

2. **Bundle Discounts**

   - "Buy 3, get 1 free"
   - Course packages

3. **Advanced Analytics**

   - Discount ROI
   - Category performance
   - User engagement metrics

4. **Email Templates**
   - Branded password reset emails
   - Discount notifications
   - Course recommendations

---

## Contact & Support

For issues or questions:

- Check `FEATURES_IMPLEMENTED.md` for technical details
- Check `MIGRATION_GUIDE.md` for database issues
- Review console logs for errors
- Test in incognito mode to rule out cache issues

---

## Success Criteria

All features are working if:

- ✅ No TypeScript errors
- ✅ Database migration successful
- ✅ All 7 features tested and working
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Performance acceptable (<3s page load)

**Ready for production when all checkboxes above are complete!**
