# Supabase Migration - Complete Setup Guide

**Project**: Geo Events Map  
**Status**: Phase 1 Complete ✅  
**Date**: December 4, 2025

---

## Supabase Project Configuration

**Project Details:**
- Project ID: `wxlmycbxhqeabaqyrerz`
- Project URL: `https://wxlmycbxhqeabaqyrerz.supabase.co`
- Region: US East (aws-0-us-east-1)
- Database: PostgreSQL (Supabase-managed)

**Environment Variables:**
```bash
VITE_SUPABASE_URL=https://wxlmycbxhqeabaqyrerz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Database Schema

### profiles Table
Extends `auth.users` with application-specific data:

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_signed_in TIMESTAMPTZ
);
```

### Database Functions

**handle_new_user()** - Automatically creates profile on signup:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**is_admin()** - Helper to check admin status:
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Triggers

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Row Level Security Policies

### profiles Table

**Users can view their own profile:**
```sql
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);
```

**Users can update their own profile:**
```sql
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

**Admins can view all profiles:**
```sql
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### events Table

**Public read (approved events only):**
```sql
CREATE POLICY "Anyone can view approved events"
  ON public.events FOR SELECT
  USING (status = 'approved');
```

**Admin full access:**
```sql
CREATE POLICY "Admins can view all events"
  ON public.events FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  USING (public.is_admin());
```

### Admin-Only Tables

**scraping_jobs, scraping_job_history, imported_videos:**
```sql
CREATE POLICY "Admins can manage [table_name]"
  ON public.[table_name] FOR ALL
  USING (public.is_admin());
```

---

## Admin User

**Credentials:**
- Email: `admin@geo-events-map.com`
- Password: `Admin123!`
- Role: `admin`
- User ID: `220ff999-c550-4e9f-88fc-93d854a0b254`

**Created**: 2025-12-04 16:07:11 UTC

---

## Code Integration

### Supabase Client Setup

**File**: `client/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getUserProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function isAdmin() {
  const profile = await getUserProfile()
  return profile?.role === 'admin'
}
```

### Authentication Pages

**Login** (`client/src/pages/Login.tsx`):
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

if (data.session) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', data.user.id)
    .single();

  if (profile?.role === 'admin') {
    setLocation('/admin');
  } else {
    setLocation('/');
  }
}
```

**Signup** (`client/src/pages/Signup.tsx`):
```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name,
      role: 'user'
    }
  }
});
```

---

## Testing

### Manual Testing Steps

1. **Test Login:**
   ```
   Navigate to /login
   Email: admin@geo-events-map.com
   Password: Admin123!
   Expected: Redirect to /admin
   ```

2. **Test Signup:**
   ```
   Navigate to /signup
   Fill in name, email, password
   Expected: Account created, redirect to /
   ```

3. **Test RLS:**
   ```sql
   -- As anonymous user
   SELECT * FROM public.events WHERE status = 'approved'; -- Should work
   SELECT * FROM public.events WHERE status = 'pending'; -- Should return empty
   
   -- As admin
   SELECT * FROM public.events; -- Should return all events
   ```

### Database Queries

**Verify admin user:**
```sql
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE email = 'admin@geo-events-map.com';
```

**Check RLS status:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**List all policies:**
```sql
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## Dependencies

**Added:**
- `@supabase/supabase-js@2.86.2`

**Removed:**
- `bcryptjs`
- `jsonwebtoken`
- `@types/bcryptjs`
- `@types/jsonwebtoken`

---

## Migration Checklist

- [x] Supabase project created
- [x] Database connection configured
- [x] profiles table created
- [x] RLS policies applied
- [x] Database functions created
- [x] Triggers configured
- [x] Admin user created
- [x] Supabase client installed
- [x] Login/Signup pages converted
- [x] Legacy auth code removed
- [x] Environment variables configured
- [ ] Edge Functions deployed (Phase 2)
- [ ] tRPC endpoints migrated (Phase 2)
- [ ] Scraping automations migrated (Phase 3)

---

## Next Steps

### Phase 2: Edge Functions

1. Create first "hello world" Edge Function
2. Deploy using Supabase MCP
3. Test invocation from frontend
4. Convert tRPC endpoints to Edge Functions
5. Update frontend to call Edge Functions

### Phase 3: Automations

1. Convert scraping jobs to Supabase scheduled functions
2. Set up database webhooks for event notifications
3. Migrate video processing to Edge Functions
4. Test end-to-end automation flow

---

## Troubleshooting

**Issue**: Can't login  
**Solution**: Verify admin user exists in `auth.users` and `public.profiles`

**Issue**: RLS blocking queries  
**Solution**: Check policies with `SELECT * FROM pg_policies WHERE tablename = 'your_table'`

**Issue**: Profile not created on signup  
**Solution**: Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created'`

**Issue**: Dev server errors  
**Solution**: Restart dev server, check environment variables are loaded

---

**Documentation**: Complete ✅  
**Phase 1**: Complete ✅  
**Ready for Phase 2**: YES ✅
