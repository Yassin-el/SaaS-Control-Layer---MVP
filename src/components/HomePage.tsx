// Home page - Decision Engine Core Screen
// "What should I do?" - Every element is actionable
export const HomePage = () => (
  <div>
    {/* Usage Check Banner */}
    <div id="usage-check-banner" class="hidden mb-6 slide-up">
      <div class="bg-brand-600 rounded-2xl p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold text-lg">Weekly check-in</h3>
            <p class="text-brand-100 text-sm mt-1">Did you use these tools this week? Quick yes/no for each.</p>
          </div>
          <button onclick="dismissUsageCheck()" class="text-brand-200 hover:text-white transition">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div id="usage-check-list" class="space-y-2"></div>
        <button onclick="submitUsageCheck()" id="submit-usage-btn" class="mt-4 w-full py-2.5 bg-white text-brand-700 rounded-xl font-medium text-sm hover:bg-brand-50 transition">
          <i class="fas fa-check mr-2"></i>Save &amp; Re-analyze
        </button>
      </div>
    </div>

    {/* Waste Banner */}
    <div id="waste-banner" class="mb-6 slide-up">
      <div id="waste-banner-content" class="rounded-2xl p-6 border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">You are wasting</p>
            <div class="flex items-baseline gap-2">
              <span id="waste-amount" class="text-4xl font-extrabold text-waste">$0.00</span>
              <span class="text-gray-400 text-sm">/month</span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-400">Total spend</p>
            <p id="total-spend" class="text-xl font-bold text-gray-700">$0.00</p>
            <p class="text-xs text-gray-400 mt-1"><span id="sub-count">0</span> active tools</p>
          </div>
        </div>
        <div class="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div id="waste-bar" class="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-1000" style="width: 0%"></div>
        </div>
        <div class="flex justify-between mt-1">
          <span class="text-xs text-gray-400">Useful spend</span>
          <span class="text-xs text-waste-dark font-medium" id="waste-percent">0%</span>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-900">Recommendations</h2>
      <button onclick="rerunAnalysis()" id="rerun-btn" class="px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition">
        <i class="fas fa-sync-alt mr-1"></i>Re-analyze
      </button>
    </div>

    {/* Recommendation Cards */}
    <div id="recommendations" class="space-y-3 mb-8">
      <div class="flex items-center justify-center py-12 text-gray-400">
        <i class="fas fa-spinner fa-spin mr-2"></i>Loading recommendations...
      </div>
    </div>

    {/* Keep List (collapsed) */}
    <div id="keep-section" class="hidden mb-8">
      <button onclick="toggleKeepList()" class="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3 hover:text-gray-700 transition">
        <i class="fas fa-chevron-right" id="keep-chevron"></i>
        Tools that look good <span id="keep-count" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"></span>
      </button>
      <div id="keep-list" class="hidden space-y-2"></div>
    </div>

    {/* Empty state */}
    <div id="empty-state" class="hidden text-center py-16">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 mb-4">
        <i class="fas fa-inbox text-gray-300 text-3xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">No subscriptions yet</h3>
      <p class="text-gray-400 text-sm mb-6">Add your first tool to get personalized recommendations.</p>
      <a href="/app/subscriptions" class="inline-flex items-center gap-2 px-4 py-2.5 btn-primary text-white rounded-xl text-sm font-medium">
        <i class="fas fa-plus"></i>Add a tool
      </a>
    </div>

    {/* Action Modal */}
    <div id="action-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 slide-up">
        <div class="flex items-center justify-between mb-4">
          <h3 id="modal-title" class="text-lg font-bold text-gray-900"></h3>
          <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>
        <div id="modal-body" class="mb-6"></div>
        <div id="modal-actions" class="flex gap-3"></div>
      </div>
    </div>

    <script dangerouslySetInnerHTML={{__html: `
      let analysisData = null;
      let usageEntries = {};

      async function loadDashboard() {
        try {
          // First run analysis
          const analysisRes = await fetch('/api/analyze', { method: 'POST' });
          analysisData = await analysisRes.json();

          // Check if needs usage check
          const statsRes = await fetch('/api/stats');
          const stats = await statsRes.json();

          renderWasteBanner(analysisData, stats);
          renderRecommendations(analysisData);

          if (stats.needsUsageCheck && stats.subscriptionCount > 0) {
            loadUsageCheck();
          }
        } catch(e) {
          console.error('Dashboard load error:', e);
        }
      }

      function renderWasteBanner(data, stats) {
        const wasteEl = document.getElementById('waste-amount');
        const totalEl = document.getElementById('total-spend');
        const subCountEl = document.getElementById('sub-count');
        const barEl = document.getElementById('waste-bar');
        const percentEl = document.getElementById('waste-percent');
        const bannerEl = document.getElementById('waste-banner-content');

        wasteEl.textContent = '$' + (data.totalWaste || 0).toFixed(2);
        totalEl.textContent = '$' + (data.totalMonthlySpend || 0).toFixed(2);
        subCountEl.textContent = stats.subscriptionCount || 0;

        const pct = data.totalMonthlySpend > 0 ? Math.round((data.totalWaste / data.totalMonthlySpend) * 100) : 0;
        percentEl.textContent = pct + '% waste';

        setTimeout(() => { barEl.style.width = pct + '%'; }, 100);

        if (data.totalWaste === 0) {
          bannerEl.className = 'rounded-2xl p-6 border bg-green-50 border-green-100';
          wasteEl.textContent = '$0.00';
          wasteEl.className = 'text-4xl font-extrabold text-green-600';
          document.querySelector('#waste-banner p.text-sm').textContent = 'You\\'re saving';
        } else {
          bannerEl.className = 'rounded-2xl p-6 border bg-red-50 border-red-100';
        }
      }

      function renderRecommendations(data) {
        const container = document.getElementById('recommendations');
        const keepSection = document.getElementById('keep-section');
        const keepList = document.getElementById('keep-list');
        const keepCount = document.getElementById('keep-count');
        const emptyState = document.getElementById('empty-state');

        if (!data.decisions || data.decisions.length === 0) {
          container.innerHTML = '';
          emptyState.classList.remove('hidden');
          return;
        }

        emptyState.classList.add('hidden');
        const actionable = data.decisions.filter(d => d.actionType !== 'keep');
        const keeps = data.decisions.filter(d => d.actionType === 'keep');

        if (actionable.length === 0) {
          container.innerHTML = '<div class="p-6 bg-green-50 border border-green-100 rounded-2xl text-center"><i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i><p class="text-green-700 font-medium">All clear! Your tools are well-utilized.</p></div>';
        } else {
          container.innerHTML = actionable.map((d, i) => renderRecommendationCard(d, i)).join('');
        }

        if (keeps.length > 0) {
          keepSection.classList.remove('hidden');
          keepCount.textContent = keeps.length;
          keepList.innerHTML = keeps.map(d => renderKeepCard(d)).join('');
        }
      }

      function renderRecommendationCard(d, index) {
        const configs = {
          cancel: { bg: 'bg-red-50', border: 'border-red-100', icon: 'fa-times-circle', iconColor: 'text-red-500', badge: 'bg-red-100 text-red-700', label: 'Cancel', btnClass: 'bg-red-500 hover:bg-red-600 text-white' },
          downgrade: { bg: 'bg-yellow-50', border: 'border-yellow-100', icon: 'fa-arrow-down', iconColor: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700', label: 'Downgrade', btnClass: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
          consolidate: { bg: 'bg-orange-50', border: 'border-orange-100', icon: 'fa-compress-arrows-alt', iconColor: 'text-orange-500', badge: 'bg-orange-100 text-orange-700', label: 'Consolidate', btnClass: 'bg-orange-500 hover:bg-orange-600 text-white' }
        };
        const cfg = configs[d.actionType] || configs.cancel;

        return '<div class="' + cfg.bg + ' border ' + cfg.border + ' rounded-2xl p-4 card-hover fade-in" style="animation-delay: ' + (index * 0.05) + 's">' +
          '<div class="flex items-start justify-between">' +
            '<div class="flex items-start gap-3 flex-1">' +
              '<div class="mt-0.5"><i class="fas ' + cfg.icon + ' ' + cfg.iconColor + ' text-lg"></i></div>' +
              '<div class="flex-1">' +
                '<div class="flex items-center gap-2 mb-1">' +
                  '<span class="font-semibold text-gray-900 text-sm">' + d.subscriptionName + '</span>' +
                  '<span class="px-2 py-0.5 rounded-full text-xs font-medium ' + cfg.badge + '">' + cfg.label + '</span>' +
                '</div>' +
                '<p class="text-sm text-gray-600">' + d.message + '</p>' +
                '<div class="flex items-center gap-4 mt-2">' +
                  '<span class="text-xs text-gray-400">Usage: ' + Math.round(d.usageScore * 100) + '%</span>' +
                  '<span class="text-xs font-semibold text-green-600">Save $' + d.impactMonthly.toFixed(2) + '/mo</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<button onclick="showActionModal(\\'' + d.subscriptionId + '\\', \\'' + d.actionType + '\\', \\'' + escapeStr(d.subscriptionName) + '\\', ' + d.impactMonthly + ')" class="ml-3 px-3 py-1.5 rounded-lg text-xs font-medium ' + cfg.btnClass + ' transition whitespace-nowrap">' +
              '<i class="fas fa-bolt mr-1"></i>Act' +
            '</button>' +
          '</div>' +
        '</div>';
      }

      function escapeStr(s) { return (s || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;'); }

      function renderKeepCard(d) {
        return '<div class="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between">' +
          '<div class="flex items-center gap-2">' +
            '<i class="fas fa-check-circle text-green-500 text-sm"></i>' +
            '<span class="text-sm font-medium text-gray-700">' + d.subscriptionName + '</span>' +
          '</div>' +
          '<span class="text-xs text-gray-400">Usage ' + Math.round(d.usageScore * 100) + '%</span>' +
        '</div>';
      }

      function toggleKeepList() {
        const list = document.getElementById('keep-list');
        const chevron = document.getElementById('keep-chevron');
        list.classList.toggle('hidden');
        chevron.classList.toggle('fa-chevron-right');
        chevron.classList.toggle('fa-chevron-down');
      }

      function showActionModal(subId, actionType, name, impact) {
        const modal = document.getElementById('action-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');
        const actions = document.getElementById('modal-actions');

        const configs = {
          cancel: { title: 'Cancel ' + name + '?', body: 'This will mark <strong>' + name + '</strong> as cancelled. You\\'ll save <strong class="text-green-600">$' + impact.toFixed(2) + '/mo</strong>.', confirmText: 'Yes, cancel it', confirmClass: 'bg-red-500 hover:bg-red-600 text-white' },
          downgrade: { title: 'Downgrade ' + name + '?', body: 'Consider switching <strong>' + name + '</strong> to a lower plan. Potential savings: <strong class="text-green-600">$' + impact.toFixed(2) + '/mo</strong>.', confirmText: 'Mark as downgraded', confirmClass: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
          consolidate: { title: 'Consolidate ' + name + '?', body: 'You have multiple tools in this category. Consider picking one and cancelling the rest. Potential savings: <strong class="text-green-600">$' + impact.toFixed(2) + '/mo</strong>.', confirmText: 'I\\'ll consolidate', confirmClass: 'bg-orange-500 hover:bg-orange-600 text-white' }
        };
        const cfg = configs[actionType] || configs.cancel;

        title.textContent = cfg.title;
        body.innerHTML = '<p class="text-sm text-gray-600">' + cfg.body + '</p>';

        if (actionType === 'cancel') {
          actions.innerHTML =
            '<button onclick="executeAction(\\'' + subId + '\\', \\'cancel\\')" class="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium ' + cfg.confirmClass + ' transition">' + cfg.confirmText + '</button>' +
            '<button onclick="closeModal()" class="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Keep it</button>';
        } else {
          actions.innerHTML =
            '<button onclick="executeAction(\\'' + subId + '\\', \\'' + actionType + '\\')" class="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium ' + cfg.confirmClass + ' transition">' + cfg.confirmText + '</button>' +
            '<button onclick="closeModal()" class="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Not now</button>';
        }

        modal.classList.remove('hidden');
      }

      async function executeAction(subId, actionType) {
        if (actionType === 'cancel') {
          await fetch('/api/subscriptions/' + subId, { method: 'DELETE' });
        } else {
          // Mark as acted upon
          await fetch('/api/subscriptions/' + subId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes: 'Marked for ' + actionType + ' on ' + new Date().toLocaleDateString() })
          });
        }
        closeModal();
        loadDashboard();
      }

      function closeModal() {
        document.getElementById('action-modal').classList.add('hidden');
      }

      async function loadUsageCheck() {
        const res = await fetch('/api/usage/pending');
        const data = await res.json();
        const subs = (data.subscriptions || []).filter(s => !s.logged_today);

        if (subs.length === 0) return;

        const banner = document.getElementById('usage-check-banner');
        const list = document.getElementById('usage-check-list');
        banner.classList.remove('hidden');

        list.innerHTML = subs.map(s =>
          '<div class="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2.5">' +
            '<span class="text-sm font-medium">' + s.name + '</span>' +
            '<div class="flex gap-2">' +
              '<button onclick="markUsage(\\'' + s.id + '\\', true, this)" class="px-3 py-1 rounded-lg text-xs font-medium bg-white/20 hover:bg-green-500 transition usage-btn" data-sub="' + s.id + '">Yes</button>' +
              '<button onclick="markUsage(\\'' + s.id + '\\', false, this)" class="px-3 py-1 rounded-lg text-xs font-medium bg-white/20 hover:bg-red-500 transition usage-btn" data-sub="' + s.id + '">No</button>' +
            '</div>' +
          '</div>'
        ).join('');
      }

      function markUsage(subId, used, btn) {
        usageEntries[subId] = used;
        // Visual feedback
        const parent = btn.parentElement;
        const buttons = parent.querySelectorAll('.usage-btn');
        buttons.forEach(b => b.classList.remove('bg-green-500', 'bg-red-500'));
        btn.classList.add(used ? 'bg-green-500' : 'bg-red-500');
      }

      async function submitUsageCheck() {
        const entries = Object.entries(usageEntries).map(([subscriptionId, used]) => ({ subscriptionId, used }));
        if (entries.length === 0) return;

        const btn = document.getElementById('submit-usage-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';

        await fetch('/api/usage/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entries })
        });

        document.getElementById('usage-check-banner').classList.add('hidden');
        usageEntries = {};
        loadDashboard();
      }

      function dismissUsageCheck() {
        document.getElementById('usage-check-banner').classList.add('hidden');
      }

      async function rerunAnalysis() {
        const btn = document.getElementById('rerun-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Analyzing...';
        await loadDashboard();
        btn.innerHTML = '<i class="fas fa-sync-alt mr-1"></i>Re-analyze';
      }

      // Load on page ready
      loadDashboard();
    `}} />
  </div>
);
