// Utility functions

export function generateId(prefix: string = ''): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}_${id}` : id;
}

// Simple password hashing (for edge runtime - no bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'saas_control_salt_v1');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
}

// JWT-like token using HMAC (edge-compatible)
const SECRET = 'saas_control_layer_secret_key_2026';

export async function createToken(userId: string): Promise<string> {
  const payload = { userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }; // 7 days
  const payloadStr = btoa(JSON.stringify(payload));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadStr));
  const sigStr = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${payloadStr}.${sigStr}`;
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const [payloadStr, sigStr] = token.split('.');
    if (!payloadStr || !sigStr) return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = Uint8Array.from(atob(sigStr), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payloadStr));
    if (!valid) return null;

    const payload = JSON.parse(atob(payloadStr));
    if (payload.exp < Date.now()) return null;
    return payload.userId;
  } catch {
    return null;
  }
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    communication: 'fa-comments',
    productivity: 'fa-tasks',
    design: 'fa-palette',
    development: 'fa-code',
    storage: 'fa-database',
    writing: 'fa-pen',
    marketing: 'fa-bullhorn',
    analytics: 'fa-chart-line',
    other: 'fa-cube',
  };
  return icons[category] || icons.other;
}

export function getStatusColor(actionType: string): string {
  switch (actionType) {
    case 'cancel': return 'red';
    case 'downgrade': return 'yellow';
    case 'consolidate': return 'orange';
    case 'keep': return 'green';
    default: return 'gray';
  }
}
