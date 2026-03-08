'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Shield, 
  Users, 
  FileText, 
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Search,
  Ban,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Bot,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user, role, canAccessAdminDashboard, isLoading } = useUserRole();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [articlesCount, setArticlesCount] = useState(0);

  // Fetch real users from Supabase directly
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const supabase = createClient();
      
      // Fetch all users from public.users table
      const { data: usersData, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users: ' + error.message);
        setUsers([]);
      } else {
        // Transform users data to match UI expectations
        const transformedUsers = (usersData || []).map(u => ({
          id: u.id,
          email: u.email,
          name: u.name || u.email?.split('@')[0] || 'Unknown',
          role: u.role || 'free',
          status: u.is_suspended ? 'suspended' : 'active',
          joinedAt: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A',
          subscription: u.subscription_status || 'none'
        }));
        setUsers(transformedUsers);
        console.log('Fetched users:', transformedUsers.length);
      }

      // Fetch articles count
      const { count: articlesTotal, error: articlesError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      if (!articlesError) {
        setArticlesCount(articlesTotal || 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading users');
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || !canAccessAdminDashboard)) {
      router.push('/auth/login');
    }
    if (!isLoading && user && canAccessAdminDashboard) {
      fetchUsers();
    }
  }, [user, canAccessAdminDashboard, isLoading, router, fetchUsers]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }
  
  if (!user) {
    router.push('/auth/login');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Redirecting to login...</div>
      </div>
    );
  }
  
  if (!canAccessAdminDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
          <p className="text-sm text-muted-foreground">Current role: {role || 'none'}</p>
        </div>
      </div>
    );
  }

  // Calculate real stats from users - all from Supabase
  const paidRoles = ['paid', 'contributor', 'editor', 'admin'];
  const stats = {
    totalUsers: users.length,
    activeSubscribers: users.filter(u => u.subscription === 'active' || paidRoles.includes(u.role)).length,
    totalArticles: articlesCount,
    // Revenue and growth would come from Stripe integration - showing 0 until Stripe is integrated
    monthlyRevenue: 0,
    growthRate: 0
  };

  // Calculate role stats from real users
  const roleStats = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, { free: 0, paid: 0, contributor: 0, editor: 0, admin: 0 });

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search) {
      return u.email.toLowerCase().includes(search.toLowerCase()) ||
             u.name.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (!error) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast.success(`Role updated to ${newRole}`);
      } else {
        console.error('Error updating role:', error);
        toast.error('Failed to update role: ' + error.message);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Error updating role');
    }
  };

  const handleSuspend = async (userId) => {
    const targetUser = users.find(u => u.id === userId);
    const newSuspendedStatus = targetUser?.status === 'active' ? true : false;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .update({ is_suspended: newSuspendedStatus })
        .eq('id', userId);
      
      if (!error) {
        setUsers(users.map(u => u.id === userId ? { ...u, status: newSuspendedStatus ? 'suspended' : 'active' } : u));
        toast.success('User status updated');
      } else {
        console.error('Error updating status:', error);
        toast.error('Failed to update status: ' + error.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    editor: 'bg-orange-100 text-orange-800',
    contributor: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    free: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">System overview and user management</p>
              </div>
            </div>
            <Link href="/admin/drafts">
              <Button variant="outline">
                <Bot className="h-4 w-4 mr-2" />
                AI Draft Inbox
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.totalUsers')}</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Subscribers</p>
                    <p className="text-3xl font-bold">{stats.activeSubscribers}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.totalArticles')}</p>
                    <p className="text-3xl font-bold">{stats.totalArticles}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.revenue')}</p>
                    <p className="text-3xl font-bold text-muted-foreground">$0</p>
                    <p className="text-xs text-muted-foreground">Stripe pending</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Growth</p>
                    <p className="text-3xl font-bold text-muted-foreground">--</p>
                    <p className="text-xs text-muted-foreground">No data yet</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">{t('admin.userManagement')}</TabsTrigger>
              <TabsTrigger value="roles">{t('admin.roles')}</TabsTrigger>
              <TabsTrigger value="stats">{t('admin.systemStats')}</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="contributor">Contributor</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchUsers} disabled={usersLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${usersLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {/* Users Table */}
              <Card>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading users...</span>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                    {search && <p className="text-sm text-muted-foreground">Try a different search term</p>}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(u => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-sm text-muted-foreground">{u.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={roleColors[u.role]}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={u.status === 'active' ? 'default' : 'destructive'}>
                              {u.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {u.subscription === 'active' ? (
                              <Badge variant="outline" className="bg-green-50">Active</Badge>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </TableCell>
                          <TableCell>{u.joinedAt}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/admin/users/${u.id}`)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleRoleChange(u.id, 'paid')}>
                                  Set as Paid
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(u.id, 'contributor')}>
                                  Set as Contributor
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(u.id, 'editor')}>
                                  Set as Editor
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleSuspend(u.id)}
                                  className="text-destructive"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  {u.status === 'active' ? 'Suspend' : 'Unsuspend'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="roles">
              <div className="grid md:grid-cols-5 gap-4">
                {Object.entries(roleStats).map(([role, count]) => (
                  <Card key={role}>
                    <CardContent className="p-6 text-center">
                      <Badge className={`${roleColors[role]} mb-2`}>{role}</Badge>
                      <p className="text-3xl font-bold">{count}</p>
                      <p className="text-sm text-muted-foreground">users</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Statistics</CardTitle>
                    <CardDescription>Real data from database</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Articles</span>
                      <span className="font-semibold">{articlesCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Users</span>
                      <span className="font-semibold">{users.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Admin Users</span>
                      <span className="font-semibold">{roleStats.admin || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contributors</span>
                      <span className="font-semibold">{roleStats.contributor || 0}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Stripe integration pending</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Monthly Subscriptions</span>
                      <span className="font-semibold text-muted-foreground">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Subscriptions</span>
                      <span className="font-semibold text-muted-foreground">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lifetime Purchases</span>
                      <span className="font-semibold text-muted-foreground">$0</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground italic">
                      <span colSpan="2">Connect Stripe to see real revenue data</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
