// Shell layout for app pages
export const AppShell = ({ children, activePage }: { children: any; activePage: string }) => (
  <div class="min-h-screen bg-gray-50">
    {/* Top Nav */}
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center gap-6">
            <a href="/app" class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <i class="fas fa-layer-group text-white text-sm"></i>
              </div>
              <span class="font-bold text-gray-900 text-sm hidden sm:block">Control Layer</span>
            </a>
            <div class="flex items-center gap-1">
              <a href="/app" class={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activePage === 'home' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                <i class="fas fa-bolt mr-1.5"></i>Decisions
              </a>
              <a href="/app/subscriptions" class={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activePage === 'subscriptions' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                <i class="fas fa-cube mr-1.5"></i>Tools
              </a>
              <a href="/app/settings" class={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activePage === 'settings' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                <i class="fas fa-cog mr-1.5"></i>Settings
              </a>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a href="/app/settings" id="alerts-badge" class="relative p-2 text-gray-400 hover:text-gray-600 transition">
              <i class="fas fa-bell"></i>
              <span id="alert-count" class="hidden absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold"></span>
            </a>
            <button onclick="logout()" class="text-xs text-gray-400 hover:text-gray-600 transition">
              <i class="fas fa-sign-out-alt mr-1"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Content */}
    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {children}
    </main>

    <script dangerouslySetInnerHTML={{__html: `
      async function logout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
      }
      // Load alert count
      fetch('/api/stats').then(r => r.json()).then(data => {
        if (data.unreadAlerts > 0) {
          const el = document.getElementById('alert-count');
          el.textContent = data.unreadAlerts;
          el.classList.remove('hidden');
        }
      }).catch(() => {});
    `}} />
  </div>
);
