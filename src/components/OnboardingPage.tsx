// Onboarding flow - 3 steps, reach value in < 60 seconds
export const OnboardingPage = () => (
  <div class="min-h-screen px-4 py-12" style="background: linear-gradient(135deg, #f8f9fb 0%, #e8ecf4 100%);">
    <div class="max-w-lg mx-auto">
      {/* Progress */}
      <div class="flex items-center justify-center mb-10 gap-2">
        <div id="step-dot-1" class="w-10 h-1.5 rounded-full bg-brand-500 transition-all"></div>
        <div id="step-dot-2" class="w-10 h-1.5 rounded-full bg-gray-200 transition-all"></div>
        <div id="step-dot-3" class="w-10 h-1.5 rounded-full bg-gray-200 transition-all"></div>
      </div>

      {/* STEP 1: Connect Data */}
      <div id="step-1" class="fade-in">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-6">
            <i class="fas fa-plug text-brand-600 text-2xl"></i>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Connect your data</h2>
          <p class="text-gray-500 text-sm mb-8">We'll scan your inbox for receipts and invoices to auto-detect your subscriptions.</p>

          <button onclick="simulateGmailConnect()" class="w-full py-3 px-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-sm hover:border-brand-300 hover:bg-brand-50 transition-all flex items-center justify-center gap-3 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Connect Gmail
          </button>

          <button onclick="skipToStep2()" class="w-full py-2.5 px-4 text-gray-500 text-sm hover:text-gray-700 transition">
            Skip for now &rarr;
          </button>

          <p class="mt-6 text-xs text-gray-400">
            <i class="fas fa-shield-alt mr-1"></i>
            We only scan invoices & receipts. Never personal emails.
          </p>
        </div>
      </div>

      {/* STEP 2: Add Tools */}
      <div id="step-2" class="hidden fade-in">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 mb-4">
              <i class="fas fa-plus-circle text-green-500 text-2xl"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Add your tools</h2>
            <p class="text-gray-500 text-sm">Add the SaaS tools you're paying for. You can always add more later.</p>
          </div>

          {/* Quick add suggestions */}
          <div class="flex flex-wrap gap-2 mb-6 justify-center">
            {['Slack', 'Notion', 'Zoom', 'Figma', 'GitHub', 'Jira', 'Canva', 'Dropbox'].map((tool) => (
              <button onclick={`quickAdd('${tool}')`}
                class="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 transition quick-add-btn"
                data-tool={tool}>
                + {tool}
              </button>
            ))}
          </div>

          {/* Tools added list */}
          <div id="added-tools" class="space-y-2 mb-4"></div>

          {/* Manual add form */}
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <div class="grid grid-cols-2 gap-3 mb-3">
              <input type="text" id="tool-name" placeholder="Tool name" class="col-span-2 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-100 outline-none" />
              <input type="number" id="tool-cost" placeholder="$/month" step="0.01" class="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-100 outline-none" />
              <select id="tool-cycle" class="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-100 outline-none bg-white">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <select id="tool-category" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-3 focus:border-brand-400 focus:ring-1 focus:ring-brand-100 outline-none bg-white">
              <option value="other">Category...</option>
              <option value="communication">Communication</option>
              <option value="productivity">Productivity</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="storage">Storage</option>
              <option value="writing">Writing</option>
              <option value="marketing">Marketing</option>
              <option value="analytics">Analytics</option>
            </select>
            <button onclick="addTool()" id="add-tool-btn" class="w-full py-2 px-4 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition">
              <i class="fas fa-plus mr-1"></i> Add tool
            </button>
          </div>

          <button onclick="goToStep3()" id="step2-next" class="w-full py-3 px-4 btn-primary text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50"
            disabled>
            See my results &rarr;
          </button>
          <button onclick="goToStep3()" class="w-full py-2 mt-2 text-gray-400 text-xs hover:text-gray-600 transition text-center">
            Skip and add later
          </button>
        </div>
      </div>

      {/* STEP 3: Instant Results */}
      <div id="step-3" class="hidden fade-in">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div id="step3-loading" class="py-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 mb-4">
              <i class="fas fa-cog fa-spin text-brand-600 text-2xl"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Analyzing your tools...</h2>
            <p class="text-gray-500 text-sm">Running the decision engine</p>
          </div>

          <div id="step3-results" class="hidden">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-4">
              <i class="fas fa-exclamation-triangle text-waste text-2xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-1">Quick look</h2>
            <div id="instant-waste" class="text-3xl font-extrabold text-waste my-4"></div>
            <p class="text-gray-500 text-sm mb-6">potential monthly savings detected</p>

            <div id="instant-insights" class="text-left space-y-3 mb-8"></div>

            <button onclick="completeOnboarding()" class="w-full py-3 px-4 btn-primary text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all">
              Go to my control panel &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>

    <script dangerouslySetInnerHTML={{__html: `
      let addedTools = [];
      const defaultCosts = { Slack: 12.50, Notion: 10, Zoom: 14.99, Figma: 15, GitHub: 4, Jira: 7.75, Canva: 12.99, Dropbox: 11.99 };
      const defaultCategories = { Slack: 'communication', Notion: 'productivity', Zoom: 'communication', Figma: 'design', GitHub: 'development', Jira: 'productivity', Canva: 'design', Dropbox: 'storage' };

      function simulateGmailConnect() {
        alert('Gmail OAuth integration would connect here in production. For now, we\\'ll skip to manual entry.');
        skipToStep2();
      }

      function skipToStep2() {
        document.getElementById('step-1').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');
        document.getElementById('step-dot-1').classList.replace('bg-brand-500', 'bg-brand-200');
        document.getElementById('step-dot-2').classList.replace('bg-gray-200', 'bg-brand-500');
      }

      function quickAdd(name) {
        document.getElementById('tool-name').value = name;
        document.getElementById('tool-cost').value = defaultCosts[name] || '';
        const catSel = document.getElementById('tool-category');
        catSel.value = defaultCategories[name] || 'other';
        addTool();
        // Disable the quick add button
        document.querySelectorAll('.quick-add-btn').forEach(btn => {
          if (btn.dataset.tool === name) btn.classList.add('opacity-30', 'pointer-events-none');
        });
      }

      async function addTool() {
        const name = document.getElementById('tool-name').value.trim();
        const cost = parseFloat(document.getElementById('tool-cost').value) || 0;
        const cycle = document.getElementById('tool-cycle').value;
        const category = document.getElementById('tool-category').value;

        if (!name) return;

        try {
          const res = await fetch('/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, costMonthly: cost, billingCycle: cycle, category })
          });
          if (res.ok) {
            const data = await res.json();
            addedTools.push(data.subscription);
            renderAddedTools();
            // Clear form
            document.getElementById('tool-name').value = '';
            document.getElementById('tool-cost').value = '';
            document.getElementById('tool-category').value = 'other';
            document.getElementById('step2-next').disabled = false;
          }
        } catch(e) { console.error(e); }
      }

      function renderAddedTools() {
        const el = document.getElementById('added-tools');
        el.innerHTML = addedTools.map(t =>
          '<div class="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100 fade-in">' +
            '<div class="flex items-center gap-2">' +
              '<i class="fas fa-check-circle text-green-500 text-sm"></i>' +
              '<span class="text-sm font-medium text-gray-800">' + t.name + '</span>' +
            '</div>' +
            '<span class="text-sm font-semibold text-gray-600">$' + (t.cost_monthly || 0).toFixed(2) + '/mo</span>' +
          '</div>'
        ).join('');
      }

      async function goToStep3() {
        document.getElementById('step-2').classList.add('hidden');
        document.getElementById('step-3').classList.remove('hidden');
        document.getElementById('step-dot-2').classList.replace('bg-brand-500', 'bg-brand-200');
        document.getElementById('step-dot-3').classList.replace('bg-gray-200', 'bg-brand-500');

        // Run analysis
        try {
          const res = await fetch('/api/analyze', { method: 'POST' });
          const data = await res.json();

          setTimeout(() => {
            document.getElementById('step3-loading').classList.add('hidden');
            document.getElementById('step3-results').classList.remove('hidden');

            document.getElementById('instant-waste').textContent = '$' + (data.totalWaste || 0).toFixed(2) + '/mo';

            const insightsEl = document.getElementById('instant-insights');
            const topInsights = (data.decisions || []).filter(d => d.actionType !== 'keep').slice(0, 3);

            if (topInsights.length === 0) {
              insightsEl.innerHTML = '<div class="p-4 bg-green-50 rounded-xl text-center"><p class="text-green-700 font-medium text-sm"><i class="fas fa-check-circle mr-2"></i>Looking good! Add more tools to get personalized insights.</p></div>';
            } else {
              insightsEl.innerHTML = topInsights.map(d => {
                const color = d.actionType === 'cancel' ? 'red' : d.actionType === 'downgrade' ? 'yellow' : 'orange';
                const bgColor = d.actionType === 'cancel' ? 'bg-red-50 border-red-100' : d.actionType === 'downgrade' ? 'bg-yellow-50 border-yellow-100' : 'bg-orange-50 border-orange-100';
                const textColor = d.actionType === 'cancel' ? 'text-red-600' : d.actionType === 'downgrade' ? 'text-yellow-700' : 'text-orange-600';
                const icon = d.actionType === 'cancel' ? 'fa-times-circle' : d.actionType === 'downgrade' ? 'fa-arrow-down' : 'fa-compress-arrows-alt';
                return '<div class="p-3 rounded-xl border ' + bgColor + ' fade-in"><div class="flex items-start gap-3"><i class="fas ' + icon + ' ' + textColor + ' mt-0.5"></i><div><p class="text-sm font-medium text-gray-800">' + d.message + '</p><p class="text-xs ' + textColor + ' font-semibold mt-1">Save $' + d.impactMonthly.toFixed(2) + '/mo</p></div></div></div>';
              }).join('');
            }
          }, 1500);
        } catch(e) {
          document.getElementById('step3-loading').innerHTML = '<p class="text-red-500">Error analyzing. Continue to dashboard.</p>';
          setTimeout(() => { document.getElementById('step3-results').classList.remove('hidden'); }, 1000);
        }
      }

      async function completeOnboarding() {
        await fetch('/api/onboarding/complete', { method: 'POST' });
        window.location.href = '/app';
      }
    `}} />
  </div>
);
