import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import sirv from 'sirv'

function previewDevelopment(environment: Record<string, string>): Plugin {
  return {
    name: 'portfolio-preview-development',
    apply: 'serve',
    configureServer(server) {
      const studio = sirv('studio/dist', { dev: true, single: true });
      server.middlewares.use(async (request, response, next) => {
        const pathname = request.url?.split('?')[0] ?? '';
        if (pathname.startsWith('/api/')) {
          const action = /^\/api\/preview\/(enable|session|content|disable)$/.exec(pathname)?.[1];
          if (!action) { response.statusCode = 404; response.end(); return; }
          try {
            const { createHandler } = await server.ssrLoadModule('/server/preview/handlers.ts');
            const { getConfig } = await server.ssrLoadModule('/server/config.ts');
            await createHandler(action, { config: () => getConfig(environment) })(request, response);
          } catch { response.statusCode = 503; response.end('Preview is unavailable'); }
          return;
        }
        if (pathname === '/studio' || pathname.startsWith('/studio/')) {
          const original = request.url;
          request.url = request.url?.replace(/^\/studio/, '') || '/';
          studio(request, response, () => { request.url = original; next(); });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'preview' ? [basicSsl(), previewDevelopment(loadEnv(mode, process.cwd(), ''))] : [])],
  server: mode === 'preview' ? { host: 'localhost', port: 3000, strictPort: true } : undefined,
}))
