// Next.js API route that wraps the Express backend
import { NextResponse } from 'next/server';

// Lazy load Express app to avoid initialization issues
let expressApp = null;

async function getExpressApp() {
  if (!expressApp) {
    // Use dynamic import to load Express app
    const serverModule = await import('../server.js');
    expressApp = serverModule.default || serverModule;
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
    const app = await getExpressApp();
    
    // Next.js 15 requires awaiting params
    const params = await context.params;
    const path = params?.path ? `/${params.path.join('/')}` : '/';
    
    // Get URL and query string
    const url = new URL(request.url);
    const queryString = url.search;
    const fullPath = `/api${path}${queryString}`;

    // Get request body
    let bodyData = null;
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        bodyData = await request.json();
      } catch (e) {
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
        on: () => {},
        emit: () => {},
        pipe: () => {},
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
        console.log(`[API] ${req.method} ${req.url}`);
        app(req, res, (err) => {
          if (err && !isResolved) {
            console.error('[API] Express middleware error:', err);
            console.error('[API] Error stack:', err.stack);
            isResolved = true;
            resolve(
              NextResponse.json(
                { success: false, error: err.message || 'Internal Server Error' },
                { status: 500 }
              )
            );
          }
        });
        
        // Timeout fallback in case Express doesn't respond
        setTimeout(() => {
          if (!isResolved) {
            console.error(`[API] Request timeout after 5s - Express did not respond to ${req.url}`);
            console.error('[API] This usually means Express middleware is hanging');
            isResolved = true;
            resolve(
              NextResponse.json(
                { success: false, error: 'Request timeout - server did not respond' },
                { status: 500 }
              )
            );
          }
        }, 5000); // 5 second timeout
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

