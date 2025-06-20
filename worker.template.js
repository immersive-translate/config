export default {
  async fetch(request, env, ctx) {
    const { pathname, searchParams } = new URL(request.url);
    if (pathname === "/") {
      return new Response("Hello");
    } else if (pathname === "/default_config.json") {
      // 实现条件请求优化
      // 使用 buildinConfigUpdatedAt 作为 Last-Modified 时间戳

      const lastModified = new Date(DEFAULT_CONFIG.buildinConfigUpdatedAt)
        .toISOString();
      const ifModifiedSince = request.headers.get("If-Modified-Since");

      // 如果客户端发送了 If-Modified-Since 头部
      if (ifModifiedSince) {
        // 如果客户端缓存的时间戳与服务器时间戳一致，返回 304 Not Modified
        if (lastModified === ifModifiedSince) {
          return formatResponse(
            new Response(null, {
              status: 304,
              headers: {
                "Last-Modified": lastModified,
                "Cache-Control": "public, max-age=0, must-revalidate", // 允许条件请求但强制验证
              },
            }),
          );
        }
      }

      // 如果时间戳不一致或没有 If-Modified-Since 头部，返回完整响应
      return formatResponse(
        new Response(JSON.stringify(DEFAULT_CONFIG, null, 2), {
          headers: {
            "Content-Type": "application/json",
            "Last-Modified": lastModified,
            "Cache-Control": "public, max-age=0, must-revalidate", // 允许条件请求但强制验证
          },
        }),
      );
    } else if (pathname === "/meta.json") {
      //
      // no cache

      return formatResponse(
        new Response(JSON.stringify(META, null, 2), {
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
