// Tool detail page
export const ToolDetailPage = ({ subId }: { subId: string }) => (
  <div>
    <a href="/app/subscriptions" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition mb-6">
      <i class="fas fa-arrow-left text-xs"></i>Back to tools
    </a>

    <div id="tool-loading" class="flex items-center justify-center py-20 text-gray-400">
      <i class="fas fa-spinner fa-spin mr-2"></i>Loading...
    </div>

    <div id="tool-content" class="hidden">
      {/* Header */}
      <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div id="tool-icon" class="w-14 h-14 rounded-2xl flex items-center justify-center"></div>
            <div>
              <h1 id="tool-name" class="text-xl font-bold text-gray-900"></h1>
              <div class="flex items-center gap-2 mt-1">
                <span id="tool-category" class="text-xs px-2 py-0.5 rounded-full capitalize"></span>
                <span id="tool-source" class="text-xs text-gray-400"></span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p id="tool-cost" class="text-2xl font-extrabold text-gray-900"></p>
            <p class="text-xs text-gray-400">/month</p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div id="tool-recommendation" class="mb-4"></div>

      {/* Stats Grid */}
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p class="text-xs text-gray-400 mb-1">Billing Cycle</p>
          <p id="tool-billing" class="text-sm font-bold text-gray-900 capitalize"></p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p class="text-xs text-gray-400 mb-1">Usage Score</p>
          <p id="tool-usage-score" class="text-sm font-bold"></p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p class="text-xs text-gray-400 mb-1">Next Renewal</p>
          <p id="tool-renewal" class="text-sm font-bold text-gray-900"></p>
        </div>
      </div>

      {/* Usage History */}
      <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        <h3 class="font-bold text-gray-900 text-sm mb-4">Usage History (Last 30 days)</h3>
        <div id="usage-grid" class="flex flex-wrap gap-1.5"></div>
        <div class="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-400 inline-block"></span>Used</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-red-200 inline-block"></span>Not used</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-gray-100 inline-block"></span>No data</span>
        </div>
      </div>

      {/* Quick Usage Log */}
      <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        <h3 class="font-bold text-gray-900 text-sm mb-3">Log today's usage</h3>
        <div class="flex gap-3">
          <button onclick="logUsage(true)" class="flex-1 py-3 rounded-xl border-2 border-green-200 bg-green-50 text-green-700 font-medium text-sm hover:bg-green-100 transition">
            <i class="fas fa-check mr-2"></i>Yes, I used it
          </button>
          <button onclick="logUsage(false)" class="flex-1 py-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition">
            <i class="fas fa-times mr-2"></i>No, didn't use it
          </button>
        </div>
        <div id="usage-feedback" class="hidden mt-3 p-2 rounded-lg text-center text-sm"></div>
      </div>

      {/* Actions */}
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 class="font-bold text-gray-900 text-sm mb-4">Actions</h3>
        <div class="space-y-2">
          <button onclick="editTool()" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition text-left">
            <i class="fas fa-edit text-gray-400 w-5"></i>
            <span class="text-sm text-gray-700">Edit details</span>
          </button>
          <button onclick="cancelTool()" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition text-left">
            <i class="fas fa-trash text-red-400 w-5"></i>
            <span class="text-sm text-red-600">Cancel subscription</span>
          </button>
        </div>
      </div>
    </div>

    <script dangerouslySetInnerHTML={{__html: `
      const SUB_ID = '${subId}';
      let toolData = null;

      const categoryIcons = {
        communication: 'fa-comments', productivity: 'fa-tasks', design: 'fa-palette',
        development: 'fa-code', storage: 'fa-database', writing: 'fa-pen',
        marketing: 'fa-bullhorn', analytics: 'fa-chart-line', other: 'fa-cube'
      };
      const categoryColors = {
        communication: 'bg-blue-100 text-blue-700', productivity: 'bg-purple-100 text-purple-700',
        design: 'bg-pink-100 text-pink-700', development: 'bg-gray-100 text-gray-700',
        storage: 'bg-cyan-100 text-cyan-700', writing: 'bg-emerald-100 text-emerald-700',
        marketing: 'bg-amber-100 text-amber-700', analytics: 'bg-indigo-100 text-indigo-700',
        other: 'bg-gray-100 text-gray-600'
      };

      async function loadToolDetail() {
        try {
          const res = await fetch('/api/subscriptions/' + SUB_ID);
          if (!res.ok) { window.location.href = '/app/subscriptions'; return; }
          const data = await res.json();
          toolData = data;

          const sub = data.subscription;
          const logs = data.usageLogs || [];
          const insights = data.insights || [];

          // Header
          const icon = categoryIcons[sub.category] || 'fa-cube';
          const color = categoryColors[sub.category] || 'bg-gray-100 text-gray-600';
          document.getElementById('tool-icon').className = 'w-14 h-14 rounded-2xl flex items-center justify-center ' + color;
          document.getElementById('tool-icon').innerHTML = '<i class="fas ' + icon + ' text-xl"></i>';
          document.getElementById('tool-name').textContent = sub.name;
          document.getElementById('tool-cost').textContent = '$' + sub.cost_monthly.toFixed(2);
          document.getElementById('tool-category').textContent = sub.category;
          document.getElementById('tool-category').className = 'text-xs px-2 py-0.5 rounded-full capitalize ' + color;
          document.getElementById('tool-source').textContent = sub.source === 'gmail' ? 'Detected via Gmail' : 'Added manually';
          document.getElementById('tool-billing').textContent = sub.billing_cycle;
          document.getElementById('tool-renewal').textContent = sub.next_renewal || 'Not set';

          // Usage score
          const recentLogs = logs.slice(0, 7);
          const usedCount = recentLogs.filter(l => l.used === 1).length;
          const score = recentLogs.length > 0 ? Math.round((usedCount / 7) * 100) : 0;
          const scoreEl = document.getElementById('tool-usage-score');
          scoreEl.textContent = score + '%';
          scoreEl.className = 'text-sm font-bold ' + (score >= 60 ? 'text-green-600' : score >= 30 ? 'text-yellow-600' : 'text-red-500');

          // Usage grid (last 30 days)
          const grid = document.getElementById('usage-grid');
          const logMap = {};
          logs.forEach(l => { logMap[l.logged_at] = l.used; });

          let gridHtml = '';
          for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const status = logMap[dateStr];
            const color = status === 1 ? 'bg-green-400' : status === 0 ? 'bg-red-200' : 'bg-gray-100';
            const title = dateStr + (status === 1 ? ' - Used' : status === 0 ? ' - Not used' : ' - No data');
            gridHtml += '<div class="w-5 h-5 rounded ' + color + ' cursor-help" title="' + title + '"></div>';
          }
          grid.innerHTML = gridHtml;

          // Recommendation
          const recEl = document.getElementById('tool-recommendation');
          if (insights.length > 0) {
            const ins = insights[0];
            const cfgs = {
              cancel: { bg: 'bg-red-50 border-red-100', icon: 'fa-times-circle text-red-500', text: 'text-red-700' },
              downgrade: { bg: 'bg-yellow-50 border-yellow-100', icon: 'fa-arrow-down text-yellow-600', text: 'text-yellow-700' },
              consolidate: { bg: 'bg-orange-50 border-orange-100', icon: 'fa-compress-arrows-alt text-orange-500', text: 'text-orange-600' }
            };
            const cfg = cfgs[ins.action_type] || cfgs.cancel;
            recEl.innerHTML = '<div class="' + cfg.bg + ' border rounded-2xl p-4"><div class="flex items-start gap-3"><i class="fas ' + cfg.icon + ' mt-0.5"></i><div><p class="text-sm font-medium text-gray-800">' + ins.message + '</p><p class="text-xs font-semibold ' + cfg.text + ' mt-1">Potential saving: $' + ins.impact_monthly.toFixed(2) + '/mo</p></div></div></div>';
          } else {
            recEl.innerHTML = '<div class="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3"><i class="fas fa-check-circle text-green-500"></i><p class="text-sm font-medium text-green-700">This tool looks good. Well-utilized for its cost.</p></div>';
          }

          document.getElementById('tool-loading').classList.add('hidden');
          document.getElementById('tool-content').classList.remove('hidden');
        } catch(e) {
          console.error(e);
          document.getElementById('tool-loading').innerHTML = '<p class="text-red-500">Error loading tool details</p>';
        }
      }

      async function logUsage(used) {
        const res = await fetch('/api/usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscriptionId: SUB_ID, used })
        });
        const fb = document.getElementById('usage-feedback');
        if (res.ok) {
          fb.className = 'mt-3 p-2 rounded-lg text-center text-sm ' + (used ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600');
          fb.textContent = used ? 'Logged as used today' : 'Logged as not used today';
          fb.classList.remove('hidden');
          setTimeout(() => loadToolDetail(), 500);
        }
      }

      function editTool() {
        window.location.href = '/app/subscriptions';
      }

      async function cancelTool() {
        if (confirm('Cancel this subscription? This marks it as cancelled in your tracking.')) {
          await fetch('/api/subscriptions/' + SUB_ID, { method: 'DELETE' });
          window.location.href = '/app/subscriptions';
        }
      }

      loadToolDetail();
    `}} />
  </div>
);
