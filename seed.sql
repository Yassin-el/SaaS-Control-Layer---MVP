-- Seed data for SaaS Control Layer
-- Demo user: demo@example.com / password123

INSERT OR IGNORE INTO users (id, email, password_hash, name, onboarded) VALUES
('user_demo_001', 'demo@example.com', 'a98aa9c3955d2ade3c6e2e6e9017055b212a9368ebddacada490de3b1bdaf7b0', 'Alex Demo', 1);

-- Subscriptions
INSERT OR IGNORE INTO subscriptions (id, user_id, name, cost_monthly, billing_cycle, usage_level, category, source, status, next_renewal) VALUES
('sub_001', 'user_demo_001', 'Slack', 12.50, 'monthly', 'high', 'communication', 'manual', 'active', '2026-05-01'),
('sub_002', 'user_demo_001', 'Notion', 10.00, 'monthly', 'high', 'productivity', 'manual', 'active', '2026-05-01'),
('sub_003', 'user_demo_001', 'Zoom', 14.99, 'monthly', 'low', 'communication', 'manual', 'active', '2026-04-15'),
('sub_004', 'user_demo_001', 'Figma', 15.00, 'monthly', 'medium', 'design', 'manual', 'active', '2026-05-10'),
('sub_005', 'user_demo_001', 'Adobe Creative Cloud', 54.99, 'monthly', 'low', 'design', 'manual', 'active', '2026-04-20'),
('sub_006', 'user_demo_001', 'GitHub Pro', 4.00, 'monthly', 'high', 'development', 'manual', 'active', '2026-05-01'),
('sub_007', 'user_demo_001', 'Jira', 7.75, 'monthly', 'low', 'productivity', 'manual', 'active', '2026-05-01'),
('sub_008', 'user_demo_001', 'Google Workspace', 12.00, 'monthly', 'high', 'communication', 'gmail', 'active', '2026-05-01'),
('sub_009', 'user_demo_001', 'Canva Pro', 12.99, 'monthly', 'low', 'design', 'manual', 'active', '2026-04-25'),
('sub_010', 'user_demo_001', 'Monday.com', 9.00, 'monthly', 'low', 'productivity', 'manual', 'active', '2026-05-01'),
('sub_011', 'user_demo_001', 'Dropbox', 11.99, 'monthly', 'low', 'storage', 'manual', 'active', '2026-05-05'),
('sub_012', 'user_demo_001', 'Grammarly', 12.00, 'monthly', 'medium', 'writing', 'manual', 'active', '2026-05-01');

-- Usage logs (last 10 days for each subscription)
INSERT OR IGNORE INTO usage_logs (id, subscription_id, user_id, used, logged_at) VALUES
-- Slack: heavy use
('ul_001', 'sub_001', 'user_demo_001', 1, '2026-04-02'),
('ul_002', 'sub_001', 'user_demo_001', 1, '2026-04-03'),
('ul_003', 'sub_001', 'user_demo_001', 1, '2026-04-04'),
('ul_004', 'sub_001', 'user_demo_001', 1, '2026-04-05'),
('ul_005', 'sub_001', 'user_demo_001', 1, '2026-04-06'),
('ul_006', 'sub_001', 'user_demo_001', 0, '2026-04-07'),
('ul_007', 'sub_001', 'user_demo_001', 1, '2026-04-08'),
-- Notion: heavy use
('ul_008', 'sub_002', 'user_demo_001', 1, '2026-04-02'),
('ul_009', 'sub_002', 'user_demo_001', 1, '2026-04-03'),
('ul_010', 'sub_002', 'user_demo_001', 1, '2026-04-05'),
('ul_011', 'sub_002', 'user_demo_001', 1, '2026-04-06'),
('ul_012', 'sub_002', 'user_demo_001', 1, '2026-04-07'),
('ul_013', 'sub_002', 'user_demo_001', 1, '2026-04-08'),
-- Zoom: low use
('ul_014', 'sub_003', 'user_demo_001', 0, '2026-04-02'),
('ul_015', 'sub_003', 'user_demo_001', 0, '2026-04-03'),
('ul_016', 'sub_003', 'user_demo_001', 1, '2026-04-05'),
('ul_017', 'sub_003', 'user_demo_001', 0, '2026-04-06'),
('ul_018', 'sub_003', 'user_demo_001', 0, '2026-04-07'),
('ul_019', 'sub_003', 'user_demo_001', 0, '2026-04-08'),
-- Figma: medium use
('ul_020', 'sub_004', 'user_demo_001', 1, '2026-04-02'),
('ul_021', 'sub_004', 'user_demo_001', 0, '2026-04-03'),
('ul_022', 'sub_004', 'user_demo_001', 1, '2026-04-05'),
('ul_023', 'sub_004', 'user_demo_001', 0, '2026-04-06'),
('ul_024', 'sub_004', 'user_demo_001', 1, '2026-04-08'),
-- Adobe CC: barely used
('ul_025', 'sub_005', 'user_demo_001', 0, '2026-04-02'),
('ul_026', 'sub_005', 'user_demo_001', 0, '2026-04-03'),
('ul_027', 'sub_005', 'user_demo_001', 0, '2026-04-05'),
('ul_028', 'sub_005', 'user_demo_001', 1, '2026-04-06'),
('ul_029', 'sub_005', 'user_demo_001', 0, '2026-04-07'),
('ul_030', 'sub_005', 'user_demo_001', 0, '2026-04-08'),
-- GitHub: heavy use
('ul_031', 'sub_006', 'user_demo_001', 1, '2026-04-02'),
('ul_032', 'sub_006', 'user_demo_001', 1, '2026-04-03'),
('ul_033', 'sub_006', 'user_demo_001', 1, '2026-04-04'),
('ul_034', 'sub_006', 'user_demo_001', 1, '2026-04-05'),
('ul_035', 'sub_006', 'user_demo_001', 1, '2026-04-06'),
('ul_036', 'sub_006', 'user_demo_001', 1, '2026-04-08'),
-- Jira: barely used
('ul_037', 'sub_007', 'user_demo_001', 0, '2026-04-02'),
('ul_038', 'sub_007', 'user_demo_001', 0, '2026-04-03'),
('ul_039', 'sub_007', 'user_demo_001', 0, '2026-04-05'),
('ul_040', 'sub_007', 'user_demo_001', 0, '2026-04-06'),
('ul_041', 'sub_007', 'user_demo_001', 1, '2026-04-08'),
-- Google Workspace: heavy use
('ul_042', 'sub_008', 'user_demo_001', 1, '2026-04-02'),
('ul_043', 'sub_008', 'user_demo_001', 1, '2026-04-03'),
('ul_044', 'sub_008', 'user_demo_001', 1, '2026-04-04'),
('ul_045', 'sub_008', 'user_demo_001', 1, '2026-04-05'),
('ul_046', 'sub_008', 'user_demo_001', 1, '2026-04-06'),
('ul_047', 'sub_008', 'user_demo_001', 1, '2026-04-08'),
-- Canva Pro: barely used
('ul_048', 'sub_009', 'user_demo_001', 0, '2026-04-02'),
('ul_049', 'sub_009', 'user_demo_001', 0, '2026-04-03'),
('ul_050', 'sub_009', 'user_demo_001', 0, '2026-04-06'),
('ul_051', 'sub_009', 'user_demo_001', 0, '2026-04-08'),
-- Monday.com: barely used
('ul_052', 'sub_010', 'user_demo_001', 0, '2026-04-02'),
('ul_053', 'sub_010', 'user_demo_001', 0, '2026-04-03'),
('ul_054', 'sub_010', 'user_demo_001', 0, '2026-04-05'),
('ul_055', 'sub_010', 'user_demo_001', 1, '2026-04-08'),
-- Dropbox: barely used
('ul_056', 'sub_011', 'user_demo_001', 0, '2026-04-02'),
('ul_057', 'sub_011', 'user_demo_001', 0, '2026-04-05'),
('ul_058', 'sub_011', 'user_demo_001', 0, '2026-04-06'),
('ul_059', 'sub_011', 'user_demo_001', 0, '2026-04-08'),
-- Grammarly: medium use
('ul_060', 'sub_012', 'user_demo_001', 1, '2026-04-02'),
('ul_061', 'sub_012', 'user_demo_001', 0, '2026-04-03'),
('ul_062', 'sub_012', 'user_demo_001', 1, '2026-04-05'),
('ul_063', 'sub_012', 'user_demo_001', 0, '2026-04-08');
