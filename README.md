# VedArogya - Ayurvedic Wellness App

A React Native application built with Expo for personalized Ayurvedic wellness recommendations and user management.

## 🚀 Features

- **User Authentication**: Secure signup and login with OTP verification
- **Personalized Profiles**: Comprehensive user details collection
- **Ayurvedic Assessment**: Dosha-based wellness recommendations
- **Supabase Integration**: Real-time database and authentication
- **Modern UI**: Clean, responsive design with Tailwind CSS

## 📱 Tech Stack

- **Frontend**: React Native + Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Testing**: Jest + React Native Testing Library

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd vedarogya

# Install dependencies
npm install

# Start the development server
npm start
```

## 🔑 Environment Setup

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key_here
```

### Getting Supabase Credentials
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key

## 📁 Project Structure

```
vedarogya/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication routes
│   │   ├── login.tsx      # Login screen
│   │   └── signup.tsx     # Signup screen
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Landing page
│   ├── landing.tsx        # Main landing
│   └── about.tsx          # About page
├── components/            # Reusable components
├── utils/                 # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── useAuth.ts        # Authentication hook
├── assets/               # Images, fonts, videos
└── tests/               # Test files (excluded from git)
```

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:signup
npm run test:supabase

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security

- Environment variables are properly secured
- Supabase keys are never committed to version control
- Authentication tokens are securely managed
- Input validation on all forms

## 📊 Database Schema

### Users Table
```sql
- id (primary key)
- full_name
- email
- phone
- password_hash
- is_verified
- created_at
```

### User Details Table
```sql
- id (primary key)
- user_id (foreign key to users.id)
- gender
- date_of_birth
- weight
- height
- activity_level (Low/Moderate/High)
- goal (Digestive Issues, Stress & Anxiety, etc.)
- profile_image
- created_at
- updated_at
```

## 🎯 Usage Examples

### Supabase Client
```typescript
import { supabase } from '../utils/supabase'

// Query user details
const { data, error } = await supabase
  .from('user_details')
  .select('*')
  .eq('user_id', userId)
```

### Authentication Hook
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

## 🚀 Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm test           # Run tests
npm run test:watch # Run tests in watch mode
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using React Native and Supabase**
