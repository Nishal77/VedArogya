#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 VedArogya Test Runner');
console.log('========================\n');

// Function to run tests and display results
function runTests(testFile) {
  try {
    console.log(`📋 Running tests for: ${testFile}`);
    console.log('─'.repeat(50));
    
    const result = execSync(`npx jest ${testFile} --verbose`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(result);
    console.log('✅ All tests passed!\n');
    return true;
  } catch (error) {
    console.log(error.stdout || error.message);
    console.log('❌ Some tests failed!\n');
    return false;
  }
}

// Function to run all tests
function runAllTests() {
  try {
    console.log('📋 Running all tests...');
    console.log('─'.repeat(50));
    
    const result = execSync('npx jest --verbose', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(result);
    console.log('✅ All tests passed!\n');
    return true;
  } catch (error) {
    console.log(error.stdout || error.message);
    console.log('❌ Some tests failed!\n');
    return false;
  }
}

// Function to run tests with coverage
function runTestsWithCoverage() {
  try {
    console.log('📋 Running tests with coverage...');
    console.log('─'.repeat(50));
    
    const result = execSync('npx jest --coverage --verbose', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(result);
    console.log('✅ Coverage report generated!\n');
    return true;
  } catch (error) {
    console.log(error.stdout || error.message);
    console.log('❌ Some tests failed!\n');
    return false;
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node test-runner.js [option]');
  console.log('\nOptions:');
  console.log('  all              - Run all tests');
  console.log('  coverage         - Run tests with coverage');
  console.log('  supabase         - Run Supabase integration tests');
  console.log('  signup           - Run signup component tests');
  console.log('\nExamples:');
  console.log('  node test-runner.js all');
  console.log('  node test-runner.js supabase');
  console.log('  node test-runner.js coverage');
  process.exit(0);
}

const option = args[0];
let success = false;

switch (option) {
  case 'all':
    success = runAllTests();
    break;
  case 'coverage':
    success = runTestsWithCoverage();
    break;
  case 'supabase':
    success = runTests('tests/supabase-integration.test.ts');
    break;
  case 'signup':
    success = runTests('tests/signup.test.tsx');
    break;
  default:
    console.log(`❌ Unknown option: ${option}`);
    console.log('Run without arguments to see available options.');
    process.exit(1);
}

// Exit with appropriate code
process.exit(success ? 0 : 1);
