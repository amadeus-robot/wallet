import index_bin from './html/wallet.html'

const corsHeaders = {
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  //"Access-Control-Allow-Origin": request.headers.get("Origin"),
  //"Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Accept, Authorization, Content-Type, X-Requested-With, Range",
  "Access-Control-Allow-Credentials": "true"
}

const REPLY = {
  status: 200,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    ...corsHeaders
  },
}

function handleOptions(request) {
  if (request.headers.get("Origin") !== null &&
      request.headers.get("Access-Control-Request-Method") !== null &&
      request.headers.get("Access-Control-Request-Headers") !== null) {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      status: 200,
      headers: {
        "Allow": "GET, HEAD, POST, OPTIONS",
      }
    })
  }
}

exports.handlers = {
  async fetch(request, env) {
    globalThis.env = env;
    try {
      const url = new URL(request.url);
      if (request.method === "OPTIONS" || request.method === "HEAD") {
        return handleOptions(request);
      }

      if (request.method === "GET") {
        return new Response(index_bin, {status: 200, headers: {"Content-Type": "text/html"}})
      }

      return new Response("", {status: 404, headers: {"Content-Type": "text/html"}})
    } catch (e) {
      if (e.stack) {
        return new Response(JSON.stringify({error: e.message, stack_trace: e.stack}))
      } else {
        return new Response(JSON.stringify({error: e}))
      }
    }
  },
}
