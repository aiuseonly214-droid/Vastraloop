import { app } from '../../src/app';
import http from 'http';
import { generateToken } from '../../src/utils/crypto';
import { SEED_USERS } from '../../src/data/seedData';

// Helper to make local HTTP requests to the Express app
function makeRequest(
  server: http.Server,
  options: {
    method: string;
    path: string;
    body?: any;
    token?: string;
  }
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const port = (server.address() as any).port;
    const postData = options.body ? JSON.stringify(options.body) : null;

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: options.path,
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
        }
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(rawData);
            resolve({ status: res.statusCode || 500, body: parsed });
          } catch {
            resolve({ status: res.statusCode || 500, body: rawData });
          }
        });
      }
    );

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

export async function runIntegrationTests(): Promise<{ name: string; passed: boolean; error?: any }[]> {
  const results: { name: string; passed: boolean; error?: any }[] = [];

  // Start temporary test server
  const server = await new Promise<http.Server>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });

  try {
    const customer = SEED_USERS[0];
    const customerToken = generateToken({
      userId: customer.id,
      email: customer.email,
      role: customer.role,
      name: customer.name
    });

    const admin = SEED_USERS[2];
    const adminToken = generateToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name
    });

    // Test 1: GET /api/v1/health
    try {
      const res = await makeRequest(server, { method: 'GET', path: '/api/v1/health' });
      if (res.status === 200 && res.body.success === true && res.body.data.status === 'healthy') {
        results.push({ name: 'GET /api/v1/health System Health Check', passed: true });
      } else {
        results.push({ name: 'GET /api/v1/health System Health Check', passed: false, error: res.body });
      }
    } catch (err) {
      results.push({ name: 'GET /api/v1/health System Health Check', passed: false, error: err });
    }

    // Test 2: POST /api/v1/auth/login
    try {
      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/v1/auth/login',
        body: { email: customer.email, password: 'password123' }
      });
      if (res.status === 200 && res.body.success === true && res.body.data.token) {
        results.push({ name: 'POST /api/v1/auth/login User Authentication Endpoint', passed: true });
      } else {
        results.push({ name: 'POST /api/v1/auth/login User Authentication Endpoint', passed: false, error: res.body });
      }
    } catch (err) {
      results.push({ name: 'POST /api/v1/auth/login User Authentication Endpoint', passed: false, error: err });
    }

    // Test 3: GET /api/v1/outfits with filter criteria
    try {
      const res = await makeRequest(server, {
        method: 'GET',
        path: '/api/v1/outfits?category=Sherwani&gender=Men&maxPrice=3000'
      });
      if (res.status === 200 && Array.isArray(res.body.data) && res.body.data.length > 0) {
        results.push({ name: 'GET /api/v1/outfits Multi-Attribute Filter Query', passed: true });
      } else {
        results.push({ name: 'GET /api/v1/outfits Multi-Attribute Filter Query', passed: false, error: res.body });
      }
    } catch (err) {
      results.push({ name: 'GET /api/v1/outfits Multi-Attribute Filter Query', passed: false, error: err });
    }

    // Test 4: Protected route guard check
    try {
      const res = await makeRequest(server, {
        method: 'GET',
        path: '/api/v1/orders' // Missing Bearer token
      });
      if (res.status === 401 && res.body.success === false) {
        results.push({ name: 'Protected Route 401 Unauthorized Guard', passed: true });
      } else {
        results.push({ name: 'Protected Route 401 Unauthorized Guard', passed: false, error: res.body });
      }
    } catch (err) {
      results.push({ name: 'Protected Route 401 Unauthorized Guard', passed: false, error: err });
    }

    // Test 5: End-to-end Rental Booking Creation
    try {
      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/v1/orders',
        token: customerToken,
        body: {
          outfitId: 'outfit-1',
          durationDays: 1,
          startDate: '25 Aug',
          endDate: '25 Aug',
          fulfillmentType: 'pickup',
          paymentMethod: 'upi'
        }
      });
      if (res.status === 201 && res.body.success === true && res.body.data.orderNumber) {
        results.push({ name: 'POST /api/v1/orders End-to-End Rental Booking', passed: true });
      } else {
        results.push({ name: 'POST /api/v1/orders End-to-End Rental Booking', passed: false, error: res.body });
      }
    } catch (err) {
      results.push({ name: 'POST /api/v1/orders End-to-End Rental Booking', passed: false, error: err });
    }

    // Test 6: Dispute Resolution by Admin
    try {
      const res = await makeRequest(server, {
        method: 'PATCH',
        path: '/api/v1/claims/claim-101/resolve',
        token: adminToken,
        body: { status: 'Approved', resolutionNotes: 'Dry cleaning receipt validated.' }
      });
      if (res.status === 200 && res.body.success === true && res.body.data.status === 'Approved') {
        results.push({ name: 'PATCH /api/v1/claims/:id/resolve Admin Dispute Escrow Settlement', passed: true });
      } else {
        results.push({ name: 'PATCH /api/v1/claims/:id/resolve Admin Dispute Escrow Settlement', passed: false, error: res.body });
      }
    } catch (err) {
      results.push({ name: 'PATCH /api/v1/claims/:id/resolve Admin Dispute Escrow Settlement', passed: false, error: err });
    }

    // Test 7: AI Styling Recommendation Endpoint
    try {
      const res = await makeRequest(server, {
        method: 'POST',
        path: '/api/v1/ai/recommend',
        body: { occasion: 'Wedding', gender: 'Men', budget: 2000 }
      });
      if (res.status === 200 && res.body.success === true && res.body.data.stylingAdvice) {
        results.push({ name: 'POST /api/v1/ai/recommend AI Styling Engine', passed: true });
      } else {
        results.push({ name: 'POST /api/v1/ai/recommend AI Styling Engine', passed: false, error: res.body });
      }
    } catch (err) {
      results.push({ name: 'POST /api/v1/ai/recommend AI Styling Engine', passed: false, error: err });
    }
  } finally {
    server.close();
  }

  return results;
}
