// Signup page component
export const SignupPage = () => (
  <div class="min-h-screen flex items-center justify-center px-4" style="background: linear-gradient(135deg, #f8f9fb 0%, #e8ecf4 100%);">
    <div class="w-full max-w-md fade-in">
      {/* Logo */}
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4">
          <i class="fas fa-layer-group text-white text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">SaaS Control Layer</h1>
        <p class="text-gray-500 mt-1 text-sm">Take control of your subscriptions</p>
      </div>

      {/* Signup Form */}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Create your account</h2>

        <div id="signup-error" class="hidden mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"></div>

        <form id="signup-form" class="space-y-4" onsubmit="return false;">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <input type="text" id="signup-name" required placeholder="Alex Johnson"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" id="signup-email" required placeholder="you@company.com"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" id="signup-password" required placeholder="At least 6 characters" minlength="6"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm" />
          </div>
          <button type="submit" id="signup-btn"
            class="w-full py-2.5 px-4 btn-primary text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all">
            Get started free
          </button>
        </form>

        <p class="mt-4 text-xs text-gray-400 text-center">
          We only scan invoices, never personal emails. Your data is encrypted.
        </p>

        <div class="mt-6 text-center">
          <span class="text-sm text-gray-500">Already have an account? </span>
          <a href="/login" class="text-sm font-medium text-brand-600 hover:text-brand-700">Sign in</a>
        </div>
      </div>
    </div>

    <script dangerouslySetInnerHTML={{__html: `
      document.getElementById('signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = document.getElementById('signup-btn');
        const errEl = document.getElementById('signup-error');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating account...';
        errEl.classList.add('hidden');

        try {
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: document.getElementById('signup-name').value,
              email: document.getElementById('signup-email').value,
              password: document.getElementById('signup-password').value
            })
          });
          const data = await res.json();
          if (res.ok) {
            window.location.href = '/onboarding';
          } else {
            errEl.textContent = data.error || 'Signup failed';
            errEl.classList.remove('hidden');
          }
        } catch (err) {
          errEl.textContent = 'Network error. Please try again.';
          errEl.classList.remove('hidden');
        }
        btn.disabled = false;
        btn.innerHTML = 'Get started free';
      });
    `}} />
  </div>
);
