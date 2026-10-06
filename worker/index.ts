interface Env { ASSETS: { fetch(request: Request): Promise<Response> } }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const isAdDocument = /^\/ads\/(320x50|728x90|300x250)\.html$/.test(url.pathname);
    if (url.hostname === 'ads.fcgallery.wiki') {
      if (!isAdDocument) return new Response('Not found', { status: 404 });
      // Fetch the asset's canonical extensionless URL internally. Keep .html in
      // the browser so an Assets redirect cannot bypass the host allowlist.
      const assetUrl = new URL(url);
      assetUrl.pathname = assetUrl.pathname.replace(/\.html$/, '');
      const response = await env.ASSETS.fetch(new Request(assetUrl, request));
      const headers = new Headers(response.headers);
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(response.body, { status: response.status, headers });
    }
    // Advertising scripts never execute with the tool site's origin and storage.
    let path = url.pathname;
    try {
      for (let i = 0; i < 10; i++) {
        const decoded = decodeURIComponent(path);
        if (decoded === path) break;
        path = decoded;
      }
    } catch {
      return new Response('Not found', { status: 404 });
    }
    path = new URL(path.replace(/\\/g, '/').replace(/\/+/g, '/'), url.origin).pathname.toLowerCase();
    if (path === '/ads' || path.startsWith('/ads/')) return new Response('Not found', { status: 404 });
    return env.ASSETS.fetch(request);
  },
};
