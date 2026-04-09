// Subscriptions list page - All tools, sortable
export const SubscriptionsPage = () => (
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Your Tools</h1>
        <p class="text-sm text-gray-500 mt-1">Manage all your SaaS subscriptions</p>
      </div>
      <button onclick="showAddModal()" class="px-4 py-2 btn-primary text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
        <i class="fas fa-plus mr-1.5"></i>Add tool
      </button>
    </div>

    {/* Filters & Sort */}
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <div class="flex bg-white rounded-xl border border-gray-200 p-0.5">
        <button onclick="setSort('cost_monthly')" id="sort-cost" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-white transition">Cost</button>
        <button onclick="setSort('name')" id="sort-name" class="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 transition">Name</button>
        <button onclick="setSort('category')" id="sort-category" class="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 transition">Category</button>
      </div>
      <select id="filter-category" onchange="loadSubscriptions()" class="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-brand-400 outline-none">
        <option value="">All categories</option>
        <option value="communication">Communication</option>
        <option value="productivity">Productivity</option>
        <option value="design">Design</option>
        <option value="development">Development</option>
        <option value="storage">Storage</option>
        <option value="writing">Writing</option>
        <option value="marketing">Marketing</option>
      </select>
    </div>

    {/* Summary bar */}
    <div id="subs-summary" class="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div>
          <p class="text-xs text-gray-400">Total</p>
          <p id="subs-total" class="text-lg font-bold text-gray-900">$0.00/mo</p>
        </div>
        <div>
          <p class="text-xs text-gray-400">Tools</p>
          <p id="subs-count" class="text-lg font-bold text-gray-900">0</p>
        </div>
        <div>
          <p class="text-xs text-gray-400">Yearly projection</p>
          <p id="subs-yearly" class="text-lg font-bold text-gray-900">$0.00</p>
        </div>
      </div>
    </div>

    {/* Subscriptions list */}
    <div id="subs-list" class="space-y-2">
      <div class="flex items-center justify-center py-12 text-gray-400">
        <i class="fas fa-spinner fa-spin mr-2"></i>Loading...
      </div>
    </div>

    {/* Add/Edit Modal */}
    <div id="add-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 slide-up">
        <div class="flex items-center justify-between mb-6">
          <h3 id="add-modal-title" class="text-lg font-bold text-gray-900">Add a tool</h3>
          <button onclick="closeAddModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>
        <form id="add-form" onsubmit="return false;" class="space-y-4">
          <input type="hidden" id="edit-id" value="" />
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Tool name *</label>
            <input type="text" id="add-name" required placeholder="e.g. Slack, Notion..."
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Cost *</label>
              <input type="number" id="add-cost" required step="0.01" placeholder="0.00"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Billing</label>
              <select id="add-cycle" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-brand-400 outline-none">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select id="add-category" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-brand-400 outline-none">
              <option value="other">Other</option>
              <option value="communication">Communication</option>
              <option value="productivity">Productivity</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="storage">Storage</option>
              <option value="writing">Writing</option>
              <option value="marketing">Marketing</option>
              <option value="analytics">Analytics</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Next renewal</label>
            <input type="date" id="add-renewal" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-400 outline-none" />
          </div>
          <button type="submit" id="add-submit-btn" class="w-full py-2.5 px-4 btn-primary text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all">
            <i class="fas fa-plus mr-1"></i>Add tool
          </button>
        </form>
      </div>
    </div>

    <script dangerouslySetInnerHTML={{__html: `
      let currentSort = 'cost_monthly';
      let currentOrder = 'desc';
      let allSubs = [];

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

      async function loadSubscriptions() {
        const filterCat = document.getElementById('filter-category').value;
        let url = '/api/subscriptions?sort=' + currentSort + '&order=' + currentOrder;
        const res = await fetch(url);
        const data = await res.json();
        allSubs = data.subscriptions || [];

        let filtered = allSubs;
        if (filterCat) {
          filtered = allSubs.filter(s => s.category === filterCat);
        }

        renderSubs(filtered);
      }

      function renderSubs(subs) {
        const list = document.getElementById('subs-list');
        const total = subs.reduce((sum, s) => sum + s.cost_monthly, 0);

        document.getElementById('subs-total').textContent = '$' + total.toFixed(2) + '/mo';
        document.getElementById('subs-count').textContent = subs.length;
        document.getElementById('subs-yearly').textContent = '$' + (total * 12).toFixed(2);

        if (subs.length === 0) {
          list.innerHTML = '<div class="text-center py-12"><p class="text-gray-400 text-sm">No tools found. Add your first subscription!</p></div>';
          return;
        }

        list.innerHTML = subs.map((s, i) => {
          const icon = categoryIcons[s.category] || 'fa-cube';
          const color = categoryColors[s.category] || 'bg-gray-100 text-gray-600';

          return '<div class="bg-white rounded-xl border border-gray-100 p-4 card-hover fade-in cursor-pointer" style="animation-delay: ' + (i * 0.03) + 's" onclick="goToDetail(\\'' + s.id + '\\')">' +
            '<div class="flex items-center justify-between">' +
              '<div class="flex items-center gap-3">' +
                '<div class="w-10 h-10 rounded-xl ' + color + ' flex items-center justify-center"><i class="fas ' + icon + ' text-sm"></i></div>' +
                '<div>' +
                  '<p class="font-semibold text-gray-900 text-sm">' + s.name + '</p>' +
                  '<div class="flex items-center gap-2 mt-0.5">' +
                    '<span class="text-xs text-gray-400 capitalize">' + s.category + '</span>' +
                    '<span class="text-xs text-gray-300">·</span>' +
                    '<span class="text-xs text-gray-400">' + s.billing_cycle + '</span>' +
                    (s.source === 'gmail' ? '<span class="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Gmail</span>' : '') +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="text-right flex items-center gap-3">' +
                '<div>' +
                  '<p class="font-bold text-gray-900 text-sm">$' + s.cost_monthly.toFixed(2) + '</p>' +
                  '<p class="text-xs text-gray-400">/month</p>' +
                '</div>' +
                '<button onclick="event.stopPropagation(); showEditModal(\\'' + s.id + '\\')" class="p-2 text-gray-300 hover:text-gray-500 transition">' +
                  '<i class="fas fa-ellipsis-v text-xs"></i>' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
      }

      function setSort(field) {
        if (currentSort === field) {
          currentOrder = currentOrder === 'desc' ? 'asc' : 'desc';
        } else {
          currentSort = field;
          currentOrder = field === 'name' ? 'asc' : 'desc';
        }
        // Update button styles
        ['cost', 'name', 'category'].forEach(f => {
          const btn = document.getElementById('sort-' + f);
          const isActive = currentSort === (f === 'cost' ? 'cost_monthly' : f);
          btn.className = 'px-3 py-1.5 rounded-lg text-xs font-medium transition ' +
            (isActive ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700');
        });
        loadSubscriptions();
      }

      function goToDetail(id) {
        window.location.href = '/app/tool/' + id;
      }

      function showAddModal() {
        document.getElementById('edit-id').value = '';
        document.getElementById('add-modal-title').textContent = 'Add a tool';
        document.getElementById('add-submit-btn').innerHTML = '<i class="fas fa-plus mr-1"></i>Add tool';
        document.getElementById('add-name').value = '';
        document.getElementById('add-cost').value = '';
        document.getElementById('add-cycle').value = 'monthly';
        document.getElementById('add-category').value = 'other';
        document.getElementById('add-renewal').value = '';
        document.getElementById('add-modal').classList.remove('hidden');
      }

      function showEditModal(id) {
        const sub = allSubs.find(s => s.id === id);
        if (!sub) return;
        document.getElementById('edit-id').value = id;
        document.getElementById('add-modal-title').textContent = 'Edit ' + sub.name;
        document.getElementById('add-submit-btn').innerHTML = '<i class="fas fa-save mr-1"></i>Save changes';
        document.getElementById('add-name').value = sub.name;
        document.getElementById('add-cost').value = sub.cost_monthly;
        document.getElementById('add-cycle').value = sub.billing_cycle;
        document.getElementById('add-category').value = sub.category;
        document.getElementById('add-renewal').value = sub.next_renewal || '';
        document.getElementById('add-modal').classList.remove('hidden');
      }

      function closeAddModal() {
        document.getElementById('add-modal').classList.add('hidden');
      }

      document.getElementById('add-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const editId = document.getElementById('edit-id').value;
        const payload = {
          name: document.getElementById('add-name').value,
          costMonthly: parseFloat(document.getElementById('add-cost').value) || 0,
          billingCycle: document.getElementById('add-cycle').value,
          category: document.getElementById('add-category').value,
          nextRenewal: document.getElementById('add-renewal').value || null,
        };

        const btn = document.getElementById('add-submit-btn');
        btn.disabled = true;

        if (editId) {
          await fetch('/api/subscriptions/' + editId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          await fetch('/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        btn.disabled = false;
        closeAddModal();
        loadSubscriptions();
      });

      loadSubscriptions();
    `}} />
  </div>
);
