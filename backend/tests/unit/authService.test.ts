import { AuthService } from '../../src/services/authService';
import { UserRepository } from '../../src/repositories/userRepository';
import { hashPassword, verifyPassword, generateToken, verifyToken } from '../../src/utils/crypto';

export async function runAuthUnitTests(): Promise<{ name: string; passed: boolean; error?: any }[]> {
  const results: { name: string; passed: boolean; error?: any }[] = [];

  // Test 1: Password hashing and verification
  try {
    const plain = 'SecretPassword123';
    const { hash, salt } = hashPassword(plain);
    const isValid = verifyPassword(plain, hash, salt);
    const isInvalid = verifyPassword('WrongPassword', hash, salt);

    if (isValid && !isInvalid) {
      results.push({ name: 'Password Hashing & PBKDF2 Verification', passed: true });
    } else {
      results.push({ name: 'Password Hashing & PBKDF2 Verification', passed: false, error: 'Verification mismatch' });
    }
  } catch (err) {
    results.push({ name: 'Password Hashing & PBKDF2 Verification', passed: false, error: err });
  }

  // Test 2: JWT token creation & verification
  try {
    const payload = { userId: 'user-123', email: 'test@vastraloop.in', role: 'customer' as const, name: 'Test User' };
    const token = generateToken(payload);
    const decoded = verifyToken(token);

    if (decoded && decoded.userId === payload.userId && decoded.role === 'customer') {
      results.push({ name: 'JWT Generation & HMAC-SHA256 Verification', passed: true });
    } else {
      results.push({ name: 'JWT Generation & HMAC-SHA256 Verification', passed: false, error: 'Decoded payload mismatch' });
    }
  } catch (err) {
    results.push({ name: 'JWT Generation & HMAC-SHA256 Verification', passed: false, error: err });
  }

  // Test 3: User registration and login flow
  try {
    const testRepo = new UserRepository();
    const service = new AuthService(testRepo);

    const regResult = await service.register({
      name: 'Rohan Sharma',
      email: `rohan.${Date.now()}@vastraloop.in`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: 'mypassword123',
      role: 'customer'
    });

    const loginResult = await service.login({
      emailOrPhone: regResult.user.email,
      password: 'mypassword123'
    });

    if (loginResult.token && loginResult.user.name === 'Rohan Sharma') {
      results.push({ name: 'User Registration & Login Authentication', passed: true });
    } else {
      results.push({ name: 'User Registration & Login Authentication', passed: false, error: 'Login result invalid' });
    }
  } catch (err) {
    results.push({ name: 'User Registration & Login Authentication', passed: false, error: err });
  }

  // Test 4: Aadhaar ID Verification
  try {
    const testRepo = new UserRepository();
    const service = new AuthService(testRepo);
    const user = await testRepo.findByEmail('aditya.patil@vastraloop.in');
    
    if (user) {
      const verified = await service.verifyAadhaarId(user.id, '123456789012', '4589');
      if (verified.verifiedId === true) {
        results.push({ name: 'Aadhaar ID KYC Verification Workflow', passed: true });
      } else {
        results.push({ name: 'Aadhaar ID KYC Verification Workflow', passed: false, error: 'verifiedId was false' });
      }
    } else {
      results.push({ name: 'Aadhaar ID KYC Verification Workflow', passed: false, error: 'Demo user not found' });
    }
  } catch (err) {
    results.push({ name: 'Aadhaar ID KYC Verification Workflow', passed: false, error: err });
  }

  return results;
}
