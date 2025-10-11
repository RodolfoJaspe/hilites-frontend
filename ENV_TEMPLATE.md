# Frontend Environment Variables

Create a file named `.env` in the `hilites/` folder with these variables:

```env
# Supabase Configuration (Required)
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API URL (Optional - defaults to localhost:5000)
# REACT_APP_API_URL=http://localhost:5000/api

# Port (Optional - defaults to 3000)
# PORT=3000
```

## How to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings > API
4. Copy:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon/public key** → `REACT_APP_SUPABASE_ANON_KEY`

## Notes

- The `.env` file is already gitignored
- These are the **same values** as in `hilites-backend/.env` (just with `REACT_APP_` prefix)
- Don't commit this file to git
- Restart the dev server after creating/updating `.env`

