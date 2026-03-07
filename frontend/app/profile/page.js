'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation, useUserRole } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Shield,
  Calendar,
  Edit,
  Save,
  X,
  CreditCard,
  Globe,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, role, isLoading, logout } = useUserRole();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    preferred_language: 'en'
  });
  
  // Password change state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Password strength calculation
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    return Math.min(strength, 100);
  };
  
  const getPasswordStrengthLabel = (strength) => {
    if (strength < 30) return { label: 'Weak', color: 'bg-red-500' };
    if (strength < 60) return { label: 'Fair', color: 'bg-yellow-500' };
    if (strength < 80) return { label: 'Good', color: 'bg-blue-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };
  
  const passwordStrength = getPasswordStrength(newPassword);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  // Fetch full profile from database
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        setProfile(data);
        setFormData({
          name: data.name || user.name || '',
          preferred_language: data.preferred_language || 'en'
        });
      }
    };
    
    if (!isLoading && user) {
      fetchProfile();
    }
  }, [user, isLoading]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          preferred_language: formData.preferred_language
        })
        .eq('id', user.id);
      
      if (!error) {
        setProfile(prev => ({ ...prev, ...formData }));
        setEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile: ' + error.message);
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle password change for logged-in user
  const handleChangePassword = async () => {
    // Validation
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
      const supabase = createClient();
      
      // First verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      
      if (signInError) {
        toast.error('Current password is incorrect');
        setChangingPassword(false);
        return;
      }
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        toast.error('Failed to update password: ' + updateError.message);
      } else {
        toast.success('Password changed successfully!');
        setPasswordDialogOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Password change error:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = formData.name || user.name || user.email?.split('@')[0] || 'User';
  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(displayName, user.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{displayName}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge className={`mt-2 ${getRoleBadgeColor(role)}`}>
                  {role?.charAt(0).toUpperCase() + role?.slice(1)} Account
                </Badge>
              </div>
            </div>
            {!editing ? (
              <Button onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    {editing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                      />
                    ) : (
                      <p className="text-sm py-2">{displayName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 py-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    {editing ? (
                      <Select 
                        value={formData.preferred_language} 
                        onValueChange={(v) => setFormData(prev => ({ ...prev, preferred_language: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 py-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          {formData.preferred_language === 'en' ? 'English' : 
                           formData.preferred_language === 'es' ? 'Español' : 'Português'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center gap-2 py-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{memberSince}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account & Subscription */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Account & Subscription
                </CardTitle>
                <CardDescription>
                  Your account type and subscription status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="flex items-center gap-2 py-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Badge className={getRoleBadgeColor(role)}>
                        {role?.charAt(0).toUpperCase() + role?.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Subscription Status</Label>
                    <div className="flex items-center gap-2 py-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <Badge variant={profile?.subscription_status === 'active' ? 'default' : 'outline'}>
                        {profile?.subscription_status || 'None'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {role === 'free' && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">
                      Upgrade to a paid plan to access premium content and features.
                    </p>
                    <Button onClick={() => router.push('/pricing')}>
                      View Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Change your account password</p>
                  </div>
                  <Button variant="outline" onClick={() => setPasswordDialogOpen(true)}>
                    Change Password
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-destructive">Sign Out</p>
                    <p className="text-sm text-muted-foreground">Sign out from your account</p>
                  </div>
                  <Button variant="destructive" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Role-specific info */}
            {(role === 'admin' || role === 'editor' || role === 'contributor') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {role === 'admin' ? 'Admin Access' : role === 'editor' ? 'Editor Access' : 'Contributor Access'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {role === 'admin' && (
                      <>
                        <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
                          Admin Dashboard
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/admin/drafts')}>
                          AI Draft Inbox
                        </Button>
                      </>
                    )}
                    {role === 'editor' && (
                      <Button variant="outline" onClick={() => router.push('/editor/dashboard')}>
                        Editor Dashboard
                      </Button>
                    )}
                    {role === 'contributor' && (
                      <Button variant="outline" onClick={() => router.push('/contributor/dashboard')}>
                        Contributor Dashboard
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
            </div>
            
            {/* New Password */}
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
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength:</span>
                    <span className={`font-medium ${
                      strengthInfo.label === 'Weak' ? 'text-red-500' :
                      strengthInfo.label === 'Fair' ? 'text-yellow-500' :
                      strengthInfo.label === 'Good' ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {strengthInfo.label}
                    </span>
                  </div>
                  <Progress value={passwordStrength} className={`h-2 ${strengthInfo.color}`} />
                  
                  {/* Password requirements */}
                  <div className="grid grid-cols-2 gap-1 text-xs mt-2">
                    <div className={`flex items-center gap-1 ${newPassword.length >= 6 ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {newPassword.length >= 6 ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      6+ characters
                    </div>
                    <div className={`flex items-center gap-1 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {/[A-Z]/.test(newPassword) ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      Uppercase
                    </div>
                    <div className={`flex items-center gap-1 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {/[0-9]/.test(newPassword) ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      Number
                    </div>
                    <div className={`flex items-center gap-1 ${/[^a-zA-Z0-9]/.test(newPassword) ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {/[^a-zA-Z0-9]/.test(newPassword) ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      Special char
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Passwords do not match
                </p>
              )}
              {confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Passwords match
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setPasswordDialogOpen(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleChangePassword} 
              disabled={changingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 6}
            >
              {changingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
