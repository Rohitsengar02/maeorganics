// Next.js API route that wraps the Express backend
import { NextResponse } from 'next/server';

// Lazy load Express app to avoid initialization issues
let expressApp = null;

async function getExpressApp() {
  if (!expressApp) {
    console.log('[API] Loading Express app for the first time...');
    // Use dynamic import to load Express app
    const serverModule = await import('../server.js');
    expressApp = serverModule.default || serverModule;
    console.log('[API] Express app loaded, type:', typeof expressApp);
    console.log('[API] Express app is function?', typeof expressApp === 'function');
    
    // Verify it's actually an Express app
    if (typeof expressApp !== 'function') {
      console.error('[API] ERROR: Express app is not a function!', expressApp);
      throw new Error('Express app failed to load properly');
    }
  }
  return expressApp;
}

export async function GET(request, context) {
  return handleRequest(request, context);
}

export async function POST(request, context) {
  return handleRequest(request, context);
}

export async function PUT(request, context) {
  return handleRequest(request, context);
}

export async function DELETE(request, context) {
  return handleRequest(request, context);
}

export async function PATCH(request, context) {
  return handleRequest(request, context);
}

export async function OPTIONS(request, context) {
  // Handle CORS preflight
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

async function handleRequest(request, context) {
  try {
    console.log('[API ROUTE] ========== NEW REQUEST ==========');
    console.log('[API ROUTE] Method:', request.method);
    console.log('[API ROUTE] URL:', request.url);
    
    const app = await getExpressApp();
    
    // Next.js 15 requires awaiting params
    const params = await context.params;
    const path = params?.path ? `/${params.path.join('/')}` : '/';
    
    // Get URL and query string
    const url = new URL(request.url);
    const queryString = url.search;
    // Express routes are mounted at /api in server.js, so we need to include /api prefix
    const fullPath = `/api${path}${queryString}`;

    console.log('[API ROUTE] Full path:', fullPath);

    // Get request body
    let bodyData = null;
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        bodyData = await request.json();
        console.log('[API ROUTE] Body parsed successfully, keys:', Object.keys(bodyData || {}));
      } catch (e) {
        console.log('[API ROUTE] Failed to parse body:', e.message);
        // Body might not be JSON or empty
      }
    }

    return new Promise((resolve) => {
      // Create fully compatible Express request object with all required properties
      const req = {
        method: request.method,
        url: fullPath,
        originalUrl: fullPath,
        path: fullPath,
        headers: Object.fromEntries(request.headers.entries()),
        body: bodyData,
        query: Object.fromEntries(url.searchParams.entries()),
        params: {},
        // Signal that body is already parsed (skip express.json/urlencoded middleware)
        _body: true,
        complete: true,
        // Mock socket/connection for middleware that needs it (like morgan)
        connection: {
          remoteAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
          encrypted: true,
        },
        socket: {
          remoteAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        },
        // Mock readable stream methods that body-parser might check
        readable: false,
        readableEnded: true,
        readableFlowing: null,
        on() { return this; },
        once() { return this; },
        emit() { return false; },
        pipe() { return this; },
        removeListener() { return this; },
        addListener() { return this; },
        read() { return null; },
        pause() { return this; },
        resume() { return this; },
        isPaused() { return true; },
        get(name) {
          return this.headers[name.toLowerCase()];
        },
        header(name) {
          return this.headers[name.toLowerCase()];
        },
      };

      // Create fully compatible Express response object
      let statusCode = 200;
      const headers = {};
      let responseData = '';
      let isResolved = false;

      const res = {
        statusCode: 200,
        headersSent: false,
        locals: {},
        
        status(code) {
          console.log('[API] res.status() called with:', code);
          statusCode = code;
          this.statusCode = code;
          return this;
        },
        
        setHeader(name, value) {
          headers[name] = value;
          return this;
        },
        
        getHeader(name) {
          return headers[name];
        },
        
        removeHeader(name) {
          delete headers[name];
          return this;
        },
        
        writeHead(code, hdrs) {
          statusCode = code;
          if (hdrs) {
            Object.assign(headers, hdrs);
          }
          this.headersSent = true;
          return this;
        },
        
        write(chunk) {
          responseData += chunk.toString();
          return this;
        },
        
        end(data) {
          if (isResolved) {
            console.warn('[API] Response.end called after already resolved');
            return;
          }
          isResolved = true;
          
          if (data) {
            responseData += typeof data === 'string' ? data : JSON.stringify(data);
          }

          console.log(`[API] Response: ${statusCode} ${req.url}`);
          console.log(`[API] Response data length: ${responseData.length}`);

          // Parse response
          let finalData;
          const contentType = headers['Content-Type'] || headers['content-type'] || 'application/json';
          
          try {
            if (contentType.includes('application/json') && responseData) {
              finalData = JSON.parse(responseData);
            } else {
              finalData = responseData;
            }
          } catch (e) {
            console.error('[API] Failed to parse response data:', e);
            finalData = responseData;
          }

          // Return Next.js response
          if (typeof finalData === 'string') {
            resolve(
              new NextResponse(finalData, {
                status: statusCode,
                headers,
              })
            );
          } else {
            resolve(
              NextResponse.json(finalData || {}, {
                status: statusCode,
                headers,
              })
            );
          }
        },
        
        json(data) {
          console.log('[API] ✅ res.json() called with status:', statusCode);
          console.log('[API] Response data:', JSON.stringify(data).substring(0, 200));
          headers['Content-Type'] = 'application/json';
          this.end(JSON.stringify(data));
          return this;
        },
        
        send(data) {
          if (typeof data === 'object' && data !== null) {
            this.json(data);
          } else {
            this.end(data);
          }
          return this;
        },
        
        redirect(url) {
          this.setHeader('Location', url);
          this.status(302);
          this.end();
          return this;
        },
        
        set(field, value) {
          if (typeof field === 'object') {
            Object.assign(headers, field);
          } else {
            headers[field] = value;
          }
          return this;
        },
        
        get(field) {
          return headers[field];
        },
      };

      // Call Express app
      try {
        console.log(`[API] ========== CALLING EXPRESS ==========`);
        console.log(`[API] ${req.method} ${req.url}`);
        console.log(`[API] Body:`, bodyData ? JSON.stringify(bodyData).substring(0, 200) : 'null');
        console.log(`[API] Headers:`, Object.keys(req.headers));
        console.log(`[API] req.body:`, req.body ? JSON.stringify(req.body).substring(0, 200) : 'null');
        console.log(`[API] 🚀 About to call Express app...`);
        console.log(`[API] Express app type:`, typeof app);
        
        // Call Express app with proper error handling
        console.log(`[API] Calling app(req, res, callback)...`);
        app(req, res, (err) => {
          console.log(`[API] 📞 Express callback invoked! Error:`, err ? err.message : 'none');
          if (err) {
            console.error('[API] Express error callback:', err.message);
            if (!isResolved) {
              isResolved = true;
              resolve(
                NextResponse.json(
                  { success: false, error: err.message || 'Internal Server Error' },
                  { status: 500 }
                )
              );
            }
          } else {
            console.log('[API] Express called next() without error');
          }
        });
        
        // Timeout fallback in case Express doesn't respond
        setTimeout(() => {
          if (!isResolved) {
            console.error(`[API] ⏱️  TIMEOUT after 10s - Express did not respond to ${req.url}`);
            console.error('[API] This means res.json() or res.send() was never called');
            console.error('[API] Check if middleware called next() but no route handler responded');
            isResolved = true;
            resolve(
              NextResponse.json(
                { success: false, error: 'Request timeout - server did not respond' },
                { status: 500 }
              )
            );
          }
        }, 10000); // 10 second timeout for debugging
      } catch (err) {
        if (!isResolved) {
          console.error('[API] Express app error:', err);
          console.error('[API] Error stack:', err.stack);
          isResolved = true;
          resolve(
            NextResponse.json(
              { success: false, error: err.message || 'Internal Server Error' },
              { status: 500 }
            )
          );
        }
      }
    });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

