// Test endpoint to verify authentication
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get the Express app
    const { default: app } = await import('../server.js');
    
    return new Promise((resolve) => {
      const authHeader = request.headers.get('authorization');
      
      // Mock Express request
      const req = {
        method: 'GET',
        url: '/test-auth',
        headers: {
          authorization: authHeader,
        },
        get(name) {
          return this.headers[name.toLowerCase()];
        },
      };

      // Mock Express response
      let statusCode = 200;
      let responseData = '';

      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseData = JSON.stringify(data);
          return this;
        },
        send(data) {
          responseData = typeof data === 'string' ? data : JSON.stringify(data);
          return this;
        },
      };

      // Test the auth middleware
      const { verifyToken, isAdmin } = require('../middleware/auth');
      
      verifyToken(req, res, async () => {
        // If we get here, auth passed
        const user = req.user;
        
        // Check if admin
        isAdmin(req, res, () => {
          resolve(
            NextResponse.json({
              success: true,
              message: 'Authentication successful',
              user: {
                uid: user.uid,
                email: user.email,
                isAdmin: true,
              },
            })
          );
        });
      });

      // If auth fails, the middleware will call res.status/json
      setTimeout(() => {
        if (responseData) {
          const data = JSON.parse(responseData);
          resolve(NextResponse.json(data, { status: statusCode }));
        }
      }, 100);
    });
  } catch (error) {
    console.error('[TEST-AUTH] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
