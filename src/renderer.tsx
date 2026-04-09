import { jsxRenderer } from 'hono/jsx-renderer';

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'SaaS Control Layer'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{__html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  brand: { 50: '#f0f4ff', 100: '#dbe4ff', 200: '#bac8ff', 300: '#91a7ff', 400: '#748ffc', 500: '#5c7cfa', 600: '#4c6ef5', 700: '#4263eb', 800: '#3b5bdb', 900: '#364fc7' },
                  waste: { light: '#fff5f5', DEFAULT: '#ff6b6b', dark: '#c92a2a' },
                  safe: { light: '#f0fff4', DEFAULT: '#51cf66', dark: '#2b8a3e' },
                  warn: { light: '#fff9db', DEFAULT: '#fcc419', dark: '#e67700' }
                }
              }
            }
          }
        `}} />
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          * { font-family: 'Inter', system-ui, sans-serif; }
          body { background: #f8f9fb; min-height: 100vh; }
          .fade-in { animation: fadeIn 0.3s ease-in; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          .slide-up { animation: slideUp 0.4s ease-out; }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .card-hover { transition: all 0.2s ease; }
          .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
          .modal-backdrop { background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); }
          .btn-primary { background: linear-gradient(135deg, #4c6ef5, #5c7cfa); }
          .btn-primary:hover { background: linear-gradient(135deg, #4263eb, #4c6ef5); }
          .pulse-dot { animation: pulse 2s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}} />
      </head>
      <body class="text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
});
