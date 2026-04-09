// Settings page
export const SettingsPage = () => (
  <div>
    <h1 class="text-xl font-bold text-gray-900 mb-6">Settings</h1>

    {/* Account Section */}
    <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
      <h3 class="font-bold text-gray-900 text-sm mb-4">
        <i class="fas fa-user mr-2 text-gray-400"></i>Account
      </h3>
      <div id="account-info" class="space-y-3">
        <div class="flex items-center justify-between py-2">
          <span class="text-sm text-gray-500">Email</span>
          <span id="user-email" class="text-sm font-medium text-gray-900"></span>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-sm text-gray-500">Name</span>
          <span id="user-name" class="text-sm font-medium text-gray-900"></span>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-sm text-gray-500">Member since</span>
          <span id="user-since" class="text-sm font-medium text-gray-900"></span>
        </div>
      </div>
    </div>

    {/* Integrations Section */}
    <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
      <h3 class="font-bold text-gray-900 text-sm mb-4">
        <i class="fas fa-plug mr-2 text-gray-400"></i>Integrations
      </h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div class="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <div>
              <p class="text-sm font-medium text-gray-800">Gmail</p>
              <p class="text-xs text-gray-400">Auto-detect subscriptions from receipts</p>
            </div>
          </div>
          <span id="gmail-status" class="px-3 py-1 rounded-lg text-xs font-medium bg-gray-200 text-gray-600">Not connected</span>
        </div>
      </div>
      <p class="text-xs text-gray-400 mt-3">
        <i class="fas fa-shield-alt mr-1"></i>
        We only scan invoices and receipts. We never read personal emails.
      </p>
    </div>

    {/* Alerts Section */}
    <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
      <h3 class="font-bold text-gray-900 text-sm mb-4">
        <i class="fas fa-bell mr-2 text-gray-400"></i>Alerts
      </h3>
      <div id="alerts-list" class="space-y-2">
        <p class="text-sm text-gray-400 text-center py-4">Loading alerts...</p>
      </div>
    </div>

    {/* Danger Zone */}
    <div class="bg-white rounded-2xl border border-red-100 p-6">
      <h3 class="font-bold text-red-600 text-sm mb-4">
        <i class="fas fa-exclamation-triangle mr-2"></i>Danger Zone
      </h3>
      <button onclick="logout()" class="w-full py-2.5 px-4 border-2 border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition">
        <i class="fas fa-sign-out-alt mr-2"></i>Logout
      </button>
    </div>

    <script dangerouslySetInnerHTML={{__html: `
      async function loadSettings() {
        // Load user info
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (meData.user) {
          document.getElementById('user-email').textContent = meData.user.email;
          document.getElementById('user-name').textContent = meData.user.name;
          document.getElementById('user-since').textContent = new Date(meData.user.created_at).toLocaleDateString();
          if (meData.user.gmail_connected) {
            document.getElementById('gmail-status').textContent = 'Connected';
            document.getElementById('gmail-status').className = 'px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700';
          }
        }

        // Load alerts
        const alertsRes = await fetch('/api/alerts');
        const alertsData = await alertsRes.json();
        const alertsList = document.getElementById('alerts-list');

        if (!alertsData.alerts || alertsData.alerts.length === 0) {
          alertsList.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">No alerts yet. Run analysis to generate alerts.</p>';
        } else {
          alertsList.innerHTML = alertsData.alerts.map(a => {
            const icons = { renewal: 'fa-calendar-alt text-blue-500', unused: 'fa-exclamation text-yellow-500', price: 'fa-dollar-sign text-red-500' };
            const icon = icons[a.type] || 'fa-bell text-gray-400';
            const bg = a.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-100';
            return '<div class="p-3 rounded-xl border ' + bg + ' flex items-start gap-3 cursor-pointer" onclick="markRead(\\'' + a.id + '\\', this)">' +
              '<i class="fas ' + icon + ' mt-0.5"></i>' +
              '<div class="flex-1">' +
                '<p class="text-sm font-medium text-gray-800">' + a.title + '</p>' +
                '<p class="text-xs text-gray-500 mt-0.5">' + a.message + '</p>' +
                '<p class="text-xs text-gray-300 mt-1">' + new Date(a.created_at).toLocaleDateString() + '</p>' +
              '</div>' +
              (!a.read ? '<span class="w-2 h-2 rounded-full bg-blue-500 mt-1.5 pulse-dot"></span>' : '') +
            '</div>';
          }).join('');
        }
      }

      async function markRead(id, el) {
        await fetch('/api/alerts/' + id + '/read', { method: 'PUT' });
        el.className = el.className.replace('bg-blue-50 border-blue-100', 'bg-gray-50');
        const dot = el.querySelector('.pulse-dot');
        if (dot) dot.remove();
      }

      async function logout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
      }

      loadSettings();
    `}} />
  </div>
);
