export default {
  async fetch(request, env, ctx) {
    const { pathname, searchParams } = new URL(request.url);
    if (pathname === "/") {
      return new Response("Hello");
    } else if (pathname === "/default_config.json") {

      // 
      // no cache

      return formatResponse(
        new Response(JSON.stringify(DEFAULT_CONFIG,null,2) 
        , {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          },
        }),
      );
    } else if (pathname === "/meta.json") {

      // 
      // no cache

      return formatResponse(
        new Response(JSON.stringify(META,null,2) 
        , {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          },
        }),
      );
    } else {
      return formatResponse(
        new Response("Not Found", {
          status: 404,
        }),
      );
    }

  },
};


function formatResponse(response) {
  // add cors header
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "*");
  return response;
}
