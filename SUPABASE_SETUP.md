# Supabase Setup Guide for Vedarogya

## 🚀 Installation Complete!

Your Supabase setup is now ready. Here's what was installed and configured:

### 📦 Installed Packages
- `@supabase/supabase-js` - Supabase JavaScript client
- `react-native-url-polyfill` - URL polyfill for React Native
- `@react-native-async-storage/async-storage` - AsyncStorage for session persistence

### 📁 Created Files
- `utils/supabase.ts` - Supabase client configuration
- `utils/useAuth.ts` - Authentication hook for React components

## 🔑 Environment Variables Setup

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key_here
```

### How to get these values:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key

## 🎯 Usage Examples

### Basic Supabase Client Import
```typescript
import { supabase } from '../utils/supabase'

// Example: Query data
const { data, error } = await supabase
  .from('your_table')
  .select('*')
```

### Authentication Hook Usage
```typescript
import { useAuth } from '../utils/useAuth'

function MyComponent() {
  const { user, signIn, signUp, signOut, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  
  return (
    <View>
      {user ? (
        <Text>Welcome, {user.email}!</Text>
      ) : (
        <Text>Please sign in</Text>
      )}
    </View>
  )
}
```

## 🔒 Security Notes

- `.env.local` is already in `.gitignore` for security
- Never commit your Supabase keys to version control
- Use `EXPO_PUBLIC_` prefix for client-side environment variables

## 🚀 Next Steps

1. Add your Supabase credentials to `.env.local`
2. Test the connection in your components
3. Set up your database tables in Supabase dashboard
4. Implement authentication in your login/signup screens

## 📱 React Native Specific Features

- **AsyncStorage**: Sessions are automatically persisted
- **URL Polyfill**: Handles URL compatibility issues
- **Auto Refresh**: Tokens are automatically refreshed
- **Session Detection**: Disabled for React Native compatibility

Your Supabase integration is ready to use! 🎉
