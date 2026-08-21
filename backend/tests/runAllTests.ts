import { runAuthUnitTests } from './unit/authService.test';
import { runOrderUnitTests } from './unit/orderService.test';
import { runIntegrationTests } from './integration/api.test';

async function main() {
  console.log('\n======================================================');
  console.log('🧪 Starting Vastraloop Backend Automated Test Suite');
  console.log('======================================================\n');

  let totalTests = 0;
  let passedTests = 0;

  console.log('--- 1. Running Authentication & Crypto Unit Tests ---');
  const authResults = await runAuthUnitTests();
  for (const r of authResults) {
    totalTests++;
    if (r.passed) {
      passedTests++;
      console.log(`  ✅ [PASS] ${r.name}`);
    } else {
      console.error(`  ❌ [FAIL] ${r.name}`, r.error);
    }
  }

  console.log('\n--- 2. Running Order Pricing & Lifecycle Unit Tests ---');
  const orderResults = await runOrderUnitTests();
  for (const r of orderResults) {
    totalTests++;
    if (r.passed) {
      passedTests++;
      console.log(`  ✅ [PASS] ${r.name}`);
    } else {
      console.error(`  ❌ [FAIL] ${r.name}`, r.error);
    }
  }

  console.log('\n--- 3. Running End-to-End API Integration Tests ---');
  const apiResults = await runIntegrationTests();
  for (const r of apiResults) {
    totalTests++;
    if (r.passed) {
      passedTests++;
      console.log(`  ✅ [PASS] ${r.name}`);
    } else {
      console.error(`  ❌ [FAIL] ${r.name}`, r.error);
    }
  }

  console.log('\n======================================================');
  console.log(`📊 Test Summary: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('======================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('💥 Some tests failed. Please review errors above.\n');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
