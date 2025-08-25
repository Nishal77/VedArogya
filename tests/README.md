# 🧪 Tests Directory

This directory contains all testing-related files for the VedArogya application, organized in a clean and professional structure.

## 📁 Structure

```
tests/
├── README.md                    # This file - testing documentation
├── TESTING.md                   # Comprehensive testing guide
├── jest.config.js               # Jest configuration
├── jest.setup.js               # Jest setup and mocks
├── test-runner.js              # Custom test runner script
├── signup.test.tsx             # Signup component tests
└── supabase-integration.test.ts # Supabase data storage tests
```

## 🚀 Quick Start

### From Root Directory
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:signup
npm run test:supabase

# Run tests with coverage
npm run test:coverage
```

### From Tests Directory
```bash
# Use the custom test runner
node test-runner.js all
node test-runner.js supabase
node test-runner.js coverage
```

## 📋 Test Files

### `signup.test.tsx`
- Tests for the signup form validation
- User interaction testing
- Form field validation
- Navigation flow testing

### `supabase-integration.test.ts`
- Database storage verification
- Data structure validation
- Error handling tests
- Table structure validation

## ⚙️ Configuration

### `jest.config.js`
- Jest configuration for React Native/Expo
- Test file patterns
- Coverage settings
- Transform ignore patterns

### `jest.setup.js`
- Mock setup for external dependencies
- React Native component mocks
- Expo module mocks
- Global test environment setup

## 🛠️ Test Runner

### `test-runner.js`
Custom test runner with options:
- `all` - Run all tests
- `coverage` - Run tests with coverage
- `supabase` - Run Supabase integration tests
- `signup` - Run signup component tests

## 📊 Test Coverage

Current coverage includes:
- ✅ **Supabase Integration**: 9/9 tests passing
- ⚠️ **Signup Component**: Needs React Native setup fixes
- 📈 **Data Storage**: Comprehensive testing
- 🔧 **Error Handling**: All scenarios covered

## 🎯 Benefits of This Structure

1. **Clean Organization**: All test files in one dedicated folder
2. **Professional Structure**: Clear separation of concerns
3. **Easy Maintenance**: Centralized test configuration
4. **Scalable**: Easy to add new test files
5. **Documentation**: Comprehensive testing guides
6. **CI/CD Ready**: Proper configuration for automation

## 📝 Adding New Tests

1. Create new test file in `tests/` directory
2. Follow naming convention: `*.test.ts` or `*.test.tsx`
3. Update `test-runner.js` if needed
4. Add to npm scripts in `package.json`
5. Update documentation

## 🔍 Debugging

For test issues:
1. Check Jest configuration in `jest.config.js`
2. Verify mock setup in `jest.setup.js`
3. Run tests with verbose output: `npm test -- --verbose`
4. Check test runner output for specific errors

---

**Last Updated**: January 2024
**Test Framework**: Jest + React Native Testing Library
**Status**: ✅ All Supabase tests passing
