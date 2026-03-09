import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, newPassword } = body;
    
    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: 'User ID and new password are required' },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    // Check if service role key is configured
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    console.log('Password change request for userId:', userId);
    console.log('Supabase URL configured:', !!supabaseUrl);
    console.log('Service Role Key configured:', !!serviceRoleKey);
    
    if (!serviceRoleKey || !supabaseUrl) {
      console.error('Missing env vars - URL:', supabaseUrl, 'Key exists:', !!serviceRoleKey);
      return NextResponse.json(
        { error: 'Admin password change not configured. Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL.' },
        { status: 500 }
      );
    }
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Update user password using admin API
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );
    
    if (error) {
      console.error('Supabase error changing password:', error);
      return NextResponse.json(
        { error: 'Failed to change password: ' + error.message },
        { status: 500 }
      );
    }
    
    console.log('Password changed successfully for user:', userId);
    return NextResponse.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
