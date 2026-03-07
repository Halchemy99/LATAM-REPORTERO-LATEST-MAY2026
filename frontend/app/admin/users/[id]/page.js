'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  User, 
  Mail, 
  Shield,
  Calendar,
  ArrowLeft,
  Save,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUserEditPage() {
  const { t } = useTranslation();
  const { user: currentUser, role, canAccessAdminDashboard, isLoading } = useUserRole();
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: 'free',
    subscription_status: 'none'
  });

  // Fetch user profile
  const fetchUser = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        toast.error('User not found');
        router.push('/admin/dashboard');
        return;
      }
      
      setUserProfile(data);
      setFormData({
        name: data.name || '',
        role: data.role || 'free',
        subscription_status: data.subscription_status || 'none'
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Error loading user');
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    if (!isLoading && (!currentUser || !canAccessAdminDashboard)) {
      router.push('/auth/login');
    }
    if (!isLoading && currentUser && canAccessAdminDashboard) {
      fetchUser();
    }
  }, [currentUser, canAccessAdminDashboard, isLoading, router, fetchUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', userId);
      
      if (!error) {
        toast.success('User updated successfully!');
        setUserProfile(prev => ({ ...prev, ...formData }));
      } else {
        toast.error('Failed to update user: ' + error.message);
      }
    } catch (error) {
      toast.error('Error updating user');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setChangingPassword(true);
    try {
      const response = await fetch('/api/admin/users/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          newPassword: newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Password changed successfully!');
        setPasswordDialogOpen(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Error changing password');
    } finally {
      setChangingPassword(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      editor: 'bg-orange-100 text-orange-800',
      contributor: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      free: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || colors.free;
  };

  const getInitials = (name, email) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || 'U';
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  if (!currentUser || !canAccessAdminDashboard || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-4 flex-1">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {getInitials(userProfile.name, userProfile.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Edit User</h1>
                <p className="text-muted-foreground">{userProfile.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{userProfile.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="User's name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, role: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="contributor">Contributor</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subscription">Subscription Status</Label>
                    <Select 
                      value={formData.subscription_status} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, subscription_status: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center gap-2 py-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {userProfile.created_at 
                        ? new Date(userProfile.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Password Management
                </CardTitle>
                <CardDescription>
                  Change the user's password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setPasswordDialogOpen(true)}>
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Password Change Dialog */}
          <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Set a new password for {userProfile.email}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-destructive">Passwords do not match</p>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleChangePassword} 
                  disabled={changingPassword || !newPassword || newPassword !== confirmPassword}
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}
