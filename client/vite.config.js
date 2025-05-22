import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // <-- expose server so it's reachable from all network interfaces
    port: 3000,        // <-- make sure frontend port is not conflicting
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // backend URL
        changeOrigin: true,
        secure: false,
        // add ws if you want to proxy websockets too
        ws: true,
        // log proxy errors to console for debugging
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
  },
})
