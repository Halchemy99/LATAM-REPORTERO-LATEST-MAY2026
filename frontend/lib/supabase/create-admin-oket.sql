-- Create admin user: Oket
-- Email: oket.hoxha@latamreportero.com
-- Password: emergent2026

-- Step 1: Create the user in auth.users
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud,
    confirmation_token
)
VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'oket.hoxha@latamreportero.com',
    crypt('emergent2026', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Oket"}',
    false,
    'authenticated',
    'authenticated',
    ''
);

-- Step 2: Update the user's role to admin in public.users table
-- (The trigger should have created the profile, now we update the role)
UPDATE public.users 
SET role = 'admin', name = 'Oket'
WHERE email = 'oket.hoxha@latamreportero.com';
