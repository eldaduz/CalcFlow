import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

function runCheck(label, command) {
  process.stdout.write(`Checking ${label}... `);
  try {
    execSync(command, { stdio: 'pipe' });
    console.log('✓ PASS');
    return true;
  } catch (error) {
    console.log('✗ FAIL');
    console.error(`Error details: ${error.message}`);
    return false;
  }
}

function verifyReleaseReadiness() {
  console.log('====================================');
  console.log(' CalcFlow Release Readiness Verifier ');
  console.log('====================================\n');

  let allPassed = true;

  // 1. Verify package.json exists and reads cleanly
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.error('✗ FAIL: package.json missing!');
    process.exit(1);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  console.log(`Target Package Version: v${pkg.version}`);

  // 2. Check git branch
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: 'pipe' })
      .toString()
      .trim();
    console.log(`Current Git Branch: ${currentBranch}`);
  } catch (err) {
    console.warn(`Warning: Git branch resolution failed (${err.message}).`);
  }

  // 3. Quality checks
  allPassed = runCheck('Linting', 'npm run lint') && allPassed;
  allPassed = runCheck('Formatting', 'npm run format:check') && allPassed;
  allPassed = runCheck('Unit Tests', 'npm test') && allPassed;
  allPassed = runCheck('Production Build', 'npm run build') && allPassed;

  console.log('\n------------------------------------');
  if (allPassed) {
    console.log('SUCCESS: All pre-release verification checks PASSED!');
    process.exit(0);
  } else {
    console.error('FAILURE: Pre-release verification failed. Fix errors before tagging/releasing.');
    process.exit(1);
  }
}

verifyReleaseReadiness();
