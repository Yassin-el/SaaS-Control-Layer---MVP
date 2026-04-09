// Login page component
export const LoginPage = () => (
  <div class="min-h-screen flex items-center justify-center px-4" style="background: linear-gradient(135deg, #f8f9fb 0%, #e8ecf4 100%);">
    <div class="w-full max-w-md fade-in">
      {/* Logo */}
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4">
          <i class="fas fa-layer-group text-white text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">SaaS Control Layer</h1>
        <p class="text-gray-500 mt-1 text-sm">Stop wasting money on tools you don't use</p>
      </div>

      {/* Login Form */}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Welcome back</h2>

        <div id="login-error" class="hidden mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"></div>

        <form id="login-form" class="space-y-4" onsubmit="return false;">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" id="login-email" required placeholder="you@company.com"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" id="login-password" required placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm" />
          </div>
          <button type="submit" id="login-btn"
            class="w-full py-2.5 px-4 btn-primary text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all">
            Sign in
          </button>
        </form>

        <div class="mt-6 text-center">
          <span class="text-sm text-gray-500">Don't have an account? </span>
          <a href="/signup" class="text-sm font-medium text-brand-600 hover:text-brand-700">Create one</a>
        </div>
      </div>

      {/* Demo */}
      <div class="mt-4 text-center">
        <button onclick="demoLogin()" class="text-xs text-gray-400 hover:text-gray-600 transition">
          Try demo account &rarr;
        </button>
      </div>
    </div>

    <script dangerouslySetInnerHTML={{__html: `
      document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        const errEl = document.getElementById('login-error');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
        errEl.classList.add('hidden');

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: document.getElementById('login-email').value,
              password: document.getElementById('login-password').value
            })
          });
          const data = await res.json();
          if (res.ok) {
            window.location.href = '/app';
          } else {
            errEl.textContent = data.error || 'Login failed';
            errEl.classList.remove('hidden');
          }
        } catch (err) {
          errEl.textContent = 'Network error. Please try again.';
          errEl.classList.remove('hidden');
        }
        btn.disabled = false;
        btn.innerHTML = 'Sign in';
      });

      async function demoLogin() {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'demo@example.com', password: 'demo123' })
          });
          if (res.ok) window.location.href = '/app';
        } catch(e) {}
      }
    `}} />
  </div>
);
