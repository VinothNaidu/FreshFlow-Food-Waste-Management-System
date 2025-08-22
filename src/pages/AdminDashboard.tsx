import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Users,
  Database,
  Activity,
  ArrowLeft,
  Eye,
  UserCheck,
  BarChart3,
  FileText,
  MessageSquare,
  Edit,
  Trash2,
  Search,
  UserX,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Bell,
  Reply,
  Check,
  X,
  Loader2,
  LogOut,
  RefreshCw,
  Clock,
  Plus
} from "lucide-react";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [userFilter, setUserFilter] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionForm, setSuggestionForm] = useState({
    title: "",
    type: "Donation",
    organization: "",
    address: "",
    notes: ""
  });
  const [success, setSuccess] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  
  // Enhanced User Management
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff',
    status: 'active'
  });
  const [editingUser, setEditingUser] = useState(null);

  // System stats
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeStores: 1,
    totalWasteTracked: 0,
    systemUptime: 99.8,
    pendingRequests: 0,
    feedbackCount: 0
  });

  // Live data from requests and waste
  const [dashboardData, setDashboardData] = useState({
    recentRequests: [],
    wasteData: [],
    inventoryData: []
  });

  // Authentication check and initialization
  useEffect(() => {
    const initializeUser = async () => {
      try {
        console.log('🔄 Initializing Admin Dashboard...');
        
        const userData = sessionStorage.getItem('user');
        const token = sessionStorage.getItem('token');
        
        if (!userData || !token || token === 'null' || userData === 'null') {
          console.error('❌ No valid authentication data found');
          setError('Authentication required. Please login again.');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }

        // Verify token is still valid
        const verifyResponse = await fetch('http://localhost:3000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!verifyResponse.ok) {
          console.error('❌ Token verification failed');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          setError('Session expired. Please login again.');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }

        const parsedUser = JSON.parse(userData);
        
        if (parsedUser.role !== 'Admin') {
          console.error('❌ Access denied: User is not Admin. Role:', parsedUser.role);
          setError(`Access denied. This dashboard is for Admins only. Your role: ${parsedUser.role}`);
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }
        
        setUser(parsedUser);
        console.log('✅ Admin user authenticated:', parsedUser);

        // Initialize data
        await fetchAllData();
        
        setIsInitializing(false);
        setLastRefresh(new Date());
        
        // Set up refresh interval
        const interval = setInterval(() => {
          fetchAllData();
          setLastRefresh(new Date());
        }, 30000);
        return () => clearInterval(interval);

      } catch (err) {
        console.error('❌ Initialization error:', err);
        setError('Failed to initialize dashboard. Please try refreshing the page.');
        setIsInitializing(false);
      }
    };

    initializeUser();
  }, []);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    if (!token || token === 'null') {
      console.error('❌ No token available for API call');
      setError('Authentication token missing. Please login again.');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return null;
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleApiError = (response, errorData) => {
    if (response.status === 401 || response.status === 403) {
      console.error('❌ Authentication/Authorization error:', errorData);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setError('Session expired or access denied. Please login again.');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    try {
      const headers = getAuthHeaders();
      if (headers) {
        await fetch('http://localhost:3000/api/auth/logout', {
          method: 'POST',
          headers
        });
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchUsers(),
      fetchFeedback(),
      fetchNotifications(),
      fetchDashboardStats(),
      fetchLiveData()
    ]);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchAllData();
      setSuccess('Data refreshed successfully!');
      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      console.log('🔄 Fetching users for admin dashboard...');
      const response = await fetch('http://localhost:3000/api/all-users', { headers });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || 'Failed to fetch users');
      }
      
      const data = await response.json();
      console.log('✅ Users fetched successfully:', data);
      setAllUsers(data);
      setSystemStats(prev => ({ ...prev, totalUsers: data.length }));
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setError(`Failed to fetch users: ${err.message}`);
      // Set empty array to prevent undefined errors
      setAllUsers([]);
    }
  };

  const fetchFeedback = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/feedback', { headers });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || 'Failed to fetch feedback');
      }
      
      const data = await response.json();
      setFeedbackList(data);
      setSystemStats(prev => ({ ...prev, feedbackCount: data.length }));
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  const fetchNotifications = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/notifications', { headers });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        console.error('Failed to fetch notifications:', errorData);
        return;
      }
      
      const data = await response.json();
      setNotifications(data.filter(n => !n.IsRead).slice(0, 10));
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch waste summary
      const wasteResponse = await fetch('http://localhost:3000/api/waste-data');
      if (wasteResponse.ok) {
        const wasteData = await wasteResponse.json();
        setSystemStats(prev => ({ 
          ...prev, 
          totalWasteTracked: wasteData.totalWaste 
        }));
      }

      // Fetch requests count
      const headers = getAuthHeaders();
      if (headers) {
        const requestsResponse = await fetch('http://localhost:3000/api/requests', { headers });
        if (requestsResponse.ok) {
          const requests = await requestsResponse.json();
          setSystemStats(prev => ({ 
            ...prev, 
            pendingRequests: requests.filter(r => r.status === 'pending').length 
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const fetchLiveData = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      // Fetch recent requests for data management view (filter out admin-read items)
      const requestsResponse = await fetch('http://localhost:3000/api/requests', { headers });
      if (requestsResponse.ok) {
        const requests = await requestsResponse.json();
        const unreadRequests = requests.filter(r => !r.AdminRead).slice(0, 10);
        setDashboardData(prev => ({ ...prev, recentRequests: unreadRequests }));
      }

      // Fetch products for inventory view (filter out admin-read items)
      const productsResponse = await fetch('http://localhost:3000/api/products', { headers });
      if (productsResponse.ok) {
        const products = await productsResponse.json();
        const unreadProducts = products.filter(p => !p.AdminRead).slice(0, 10);
        setDashboardData(prev => ({ ...prev, inventoryData: unreadProducts }));
      }
    } catch (err) {
      console.error('Error fetching live data:', err);
    }
  };

  // Enhanced User Management Functions
  const openUserModal = (userToUpdate = null) => {
    if (userToUpdate) {
      setEditingUser(userToUpdate);
      setUserForm({
        name: userToUpdate.name,
        email: userToUpdate.email,
        password: '', // Don't populate password for updating
        role: userToUpdate.role,
        status: userToUpdate.status
      });
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'Staff',
        status: 'active'
      });
    }
    setShowUserModal(true);
  };

  const handleUserSubmit = async () => {
    if (!userForm.name || !userForm.email || (!editingUser && !userForm.password)) {
      setError('Please fill in all required fields');
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      let response;
      
      if (editingUser) {
        // Update existing user
        interface UpdateUserData {
          name: string;
          email: string;
          role: string;
          status: string;
          password?: string;
        }
        
        const updateData: UpdateUserData = {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          status: userForm.status
        };
        
        if (userForm.password && userForm.password.trim()) {
          updateData.password = userForm.password;
        }

        const endpoint = userForm.role === 'Manager' ? 
          `http://localhost:3000/api/manager/${editingUser.id}` : 
          `http://localhost:3000/api/staff/${editingUser.id}`;
        
        response = await fetch(endpoint, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updateData)
        });
      } else {
        // Create new user
        response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers,
          body: JSON.stringify(userForm)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }

      setSuccess(`User ${editingUser ? 'updated' : 'created'} successfully!`);
      setShowUserModal(false);
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'Staff',
        status: 'active'
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error(`Error ${editingUser ? 'updating' : 'creating'} user:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissNotification = async (notificationId) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || 'Failed to dismiss notification');
      }

      // Remove the notification from the list immediately
      setNotifications(notifications.filter(n => n.NotificationID !== notificationId));
      console.log('✅ Notification dismissed successfully');
    } catch (err) {
      console.error('❌ Error dismissing notification:', err);
      setError(`Failed to dismiss notification: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (type, itemId) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/admin/mark-read', {
        method: 'POST',
        headers,
        body: JSON.stringify({ type, itemId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || 'Failed to mark as read');
      }

      // Refresh the data to remove the item from view
      fetchLiveData();
    } catch (err) {
      console.error('Error marking item as read:', err);
      setError(err.message);
    }
  };

  const handleCreateSuggestion = async () => {
    if (!suggestionForm.title || !suggestionForm.organization || !suggestionForm.address) {
      setError('Please fill in all required fields');
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/create-suggestion', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...suggestionForm,
          productId: selectedInventoryItem?.ProductID
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || 'Failed to create suggestion');
      }

      setSuccess(`${suggestionForm.type} suggestion created for ${suggestionForm.organization}!`);
      setShowSuggestionModal(false);
      setSuggestionForm({
        title: "",
        type: "Donation",
        organization: "",
        address: "",
        notes: ""
      });
      setSelectedInventoryItem(null);
      
      // Refresh data to remove the processed item
      fetchLiveData();
    } catch (err) {
      console.error('Error creating suggestion:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveInventoryItem = async (productId) => {
    if (!confirm('Are you sure you want to remove this item from inventory?')) {
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || 'Failed to remove item');
      }

      setSuccess('Inventory item removed successfully!');
      fetchLiveData();
    } catch (err) {
      console.error('Error removing inventory item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openSuggestionModal = (product) => {
    setSelectedInventoryItem(product);
    setSuggestionForm({
      title: `${product.ProductName} Processing`,
      type: product.AutoCompostRequested || product.status === 'expired' ? 'Compost' : 'Donation',
      organization: "",
      address: "",
      notes: `Product: ${product.ProductName} (${product.ProductQuantity} kg, expires ${product.expiryDate})`
    });
    setShowSuggestionModal(true);
  };

  const handleUserStatusChange = async (userId, role, newStatus) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    setLoading(true);
    try {
      let response;
      if (role === 'Staff') {
        response = await fetch(`http://localhost:3000/api/staff/${userId}/status`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: newStatus })
        });
      } else if (role === 'Manager') {
        response = await fetch(`http://localhost:3000/api/manager/${userId}/status`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: newStatus })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || `Failed to ${newStatus} user`);
      }

      setSuccess(`${role} ${newStatus} successfully!`);
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error('Error changing user status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, role) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/staff/${userId}?role=${role}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || 'Failed to delete user');
      }

      setSuccess('User deleted successfully!');
      fetchUsers(); // Refresh user list
      closeModal();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackAction = async (feedbackId, action) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    setLoading(true);
    try {
      let response;
      if (action === 'delete') {
        response = await fetch(`http://localhost:3000/api/feedback/${feedbackId}`, {
          method: 'DELETE',
          headers
        });
      } else if (action === 'mark-done') {
        response = await fetch(`http://localhost:3000/api/feedback/${feedbackId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: 'reviewed' })
        });
      }

      if (response && !response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || `Failed to ${action} feedback`);
      }

      setSuccess(`Feedback ${action === 'delete' ? 'deleted' : 'marked as reviewed'} successfully!`);
      fetchFeedback();
      closeModal();
    } catch (err) {
      console.error(`Error ${action}ing feedback:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    if (type === "view-user" || type === "confirm-delete") {
      setSelectedUser(data);
    } else if (type === "view-feedback") {
      setSelectedFeedback(data);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
    setSelectedFeedback(null);
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
                         user.email.toLowerCase().includes(userFilter.toLowerCase());
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredFeedback = feedbackList.filter(item =>
    item.Name.toLowerCase().includes(feedbackFilter.toLowerCase()) ||
    item.Content.toLowerCase().includes(feedbackFilter.toLowerCase())
  );

  const renderModal = () => {
    if (!modalType) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>
              {modalType === "view-user" ? "User Details" :
               modalType === "confirm-delete" ? "Confirm Delete" :
               "Feedback Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modalType === "confirm-delete" ? (
              <div>
                <p className="mb-4">
                  Are you sure you want to permanently delete <strong>{selectedUser?.name}</strong>? 
                  This action cannot be undone and will remove all associated data.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={closeModal} disabled={loading}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteUser(selectedUser?.id, selectedUser?.role)}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete Permanently"}
                  </Button>
                </div>
              </div>
            ) : modalType === "view-user" ? (
              <div>
                <div className="space-y-3">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm text-gray-700">{selectedUser?.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-gray-700">{selectedUser?.email}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <p className="text-sm text-gray-700">{selectedUser?.role}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={selectedUser?.status === "active" ? "default" : "secondary"}>
                      {selectedUser?.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Last Login</Label>
                    <p className="text-sm text-gray-700">{selectedUser?.lastLogin}</p>
                  </div>
                  <div>
                    <Label>Created</Label>
                    <p className="text-sm text-gray-700">{selectedUser?.created}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={closeModal}>Close</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="space-y-3">
                  <div>
                    <Label>User</Label>
                    <p className="text-sm text-gray-700">{selectedFeedback?.Name}</p>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <p className="text-sm text-gray-700">
                      {selectedFeedback?.CreatedAt ? new Date(selectedFeedback.CreatedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={selectedFeedback?.Status === "reviewed" ? "default" : "outline"}>
                      {selectedFeedback?.Status || 'pending'}
                    </Badge>
                  </div>
                  <div>
                    <Label>Content</Label>
                    <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded max-h-32 overflow-y-auto">
                      {selectedFeedback?.Content}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={closeModal}>Close</Button>
                  {selectedFeedback?.Status !== 'reviewed' && (
                    <Button 
                      onClick={() => handleFeedbackAction(selectedFeedback?.Fb_ID, 'mark-done')}
                      disabled={loading}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark Done
                    </Button>
                  )}
                  <Button 
                    variant="destructive"
                    onClick={() => handleFeedbackAction(selectedFeedback?.Fb_ID, 'delete')}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Initializing Admin Dashboard...</p>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <p>Loading user data...</p>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">System Administration Panel</p>
                  {lastRefresh && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Last updated: {lastRefresh.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <Badge variant="destructive" className="flex items-center">
                  <Bell className="h-3 w-3 mr-1" />
                  {notifications.length}
                </Badge>
              )}
              <Button 
                onClick={refreshData} 
                variant="outline" 
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => window.print()}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-700">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-700">{success}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setSuccess(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* System Notifications */}
        {notifications.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Bell className="h-5 w-5 mr-2" />
                System Notifications
                <Badge variant="secondary" className="ml-2">
                  {notifications.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div key={notif.NotificationID} className="flex items-start justify-between p-3 bg-white rounded border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-blue-800">{notif.Title}</span>
                        <Badge variant="outline" className="text-xs">
                          {notif.Type === 'feedback' ? '💬' : 
                           notif.Type === 'request_update' ? '📝' : '📬'}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-700">{notif.Message}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {new Date(notif.CreatedAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismissNotification(notif.NotificationID)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">{systemStats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Stores</p>
                  <p className="text-2xl font-bold text-green-600">{systemStats.activeStores}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Waste Tracked</p>
                  <p className="text-2xl font-bold text-purple-600">{systemStats.totalWasteTracked} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-2xl font-bold text-orange-600">{systemStats.systemUptime}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="data">Live Data Management</TabsTrigger>
            <TabsTrigger value="feedback">Feedback Review</TabsTrigger>
          </TabsList>

          {/* Enhanced User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Create, manage, activate, deactivate, or remove user accounts for both staff and managers</CardDescription>
                  </div>
                  <Button onClick={() => openUserModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <div className="flex items-center space-x-2 flex-1 max-w-md">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded px-3 py-2"
                  >
                    <option value="">All Status ({allUsers.length})</option>
                    <option value="active">Active ({allUsers.filter(u => u.status === 'active').length})</option>
                    <option value="inactive">Inactive ({allUsers.filter(u => u.status === 'inactive').length})</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={`${user.role}-${user.id}`} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">Last login: {user.lastLogin}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openModal('view-user', user)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openUserModal(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                        
                        {/* Allow deactivation for both Staff and Manager */}
                        {(user.role === 'Staff' || user.role === 'Manager') && (
                          <Button
                            size="sm"
                            variant={user.status === "active" ? "secondary" : "default"}
                            onClick={() => handleUserStatusChange(
                              user.id, 
                              user.role, 
                              user.status === "active" ? "inactive" : "active"
                            )}
                            disabled={loading}
                          >
                            {user.status === "active" ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => openModal('confirm-delete', user)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No users found matching your criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Data Management Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Staff Requests</CardTitle>
                  <CardDescription>Live updates from staff donation and compost requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {dashboardData.recentRequests.length > 0 ? (
                      dashboardData.recentRequests.map(request => (
                        <div key={request.id} className="p-3 border rounded-lg relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-1 right-1"
                            onClick={() => handleMarkAsRead('request', request.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="flex justify-between items-start pr-8">
                            <div>
                              <p className="font-medium text-sm">{request.staff}</p>
                              <p className="text-xs text-gray-600">{request.items}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={request.type === 'donation' ? 'default' : 'secondary'} className="text-xs">
                                  {request.type}
                                </Badge>
                                {request.isAutoGenerated && (
                                  <Badge variant="outline" className="text-xs">🤖 Auto</Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(request.date).toLocaleDateString()}
                                {request.approveDate && ` → Approved: ${new Date(request.approveDate).toLocaleDateString()}`}
                              </p>
                            </div>
                            <Badge 
                              variant={
                                request.status === 'approved' ? 'default' : 
                                request.status === 'rejected' ? 'destructive' : 'outline'
                              }
                              className="text-xs"
                            >
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 text-sm py-4">No recent requests</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Inventory Status</CardTitle>
                  <CardDescription>Real-time product status and automation alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {dashboardData.inventoryData.length > 0 ? (
                      dashboardData.inventoryData.map(product => (
                        <div key={product.ProductID} className="p-3 border rounded-lg relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-1 right-1"
                            onClick={() => handleMarkAsRead('product', product.ProductID)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="flex justify-between items-start pr-8">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{product.ProductName}</p>
                              <p className="text-xs text-gray-600">{product.ProductCategory} • {product.ProductQuantity} kg</p>
                              <p className="text-xs text-gray-600">
                                {product.DiscountApplied ? 
                                  <>
                                    <span className="line-through text-gray-400">RM{product.OriginalPrice}</span>{' '}
                                    <span className="font-bold text-green-600">RM{product.Price}</span>
                                  </> : 
                                  `RM${product.Price}`
                                }
                              </p>
                              <p className="text-xs text-gray-500">
                                Expires: {product.expiryDate} ({product.daysUntilExpiry >= 0 ? `${product.daysUntilExpiry} days` : 'Expired'})
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant={
                                  product.status === 'expired' ? 'destructive' :
                                  product.status === 'critical' ? 'destructive' :
                                  product.status === 'expiring-soon' ? 'secondary' : 'default'
                                }
                                className="text-xs mb-2"
                              >
                                {product.status}
                              </Badge>
                              <div className="flex flex-col space-y-1">
                                {(product.AutoDonationRequested || product.AutoCompostRequested || product.status === 'critical' || product.status === 'expired') ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => openSuggestionModal(product)}
                                  >
                                    📝 Create Suggestion
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="text-xs"
                                    onClick={() => handleRemoveInventoryItem(product.ProductID)}
                                  >
                                    🗑️ Remove
                                  </Button>
                                )}
                              </div>
                              {product.DiscountApplied && (
                                <p className="text-xs text-green-600 mt-1">🤖 Auto-discounted</p>
                              )}
                              {product.AutoDonationRequested && (
                                <p className="text-xs text-blue-600 mt-1">💝 Donation requested</p>
                              )}
                              {product.AutoCompostRequested && (
                                <p className="text-xs text-yellow-600 mt-1">🗂️ Compost requested</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 text-sm py-4">No inventory data</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Activity Summary</CardTitle>
                <CardDescription>Real-time overview of system performance and automation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{systemStats.pendingRequests}</p>
                    <p className="text-sm text-blue-600">Pending Requests</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {dashboardData.inventoryData.filter(p => p.DiscountApplied).length}
                    </p>
                    <p className="text-sm text-green-600">Auto-Discounted</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{systemStats.feedbackCount}</p>
                    <p className="text-sm text-purple-600">Feedback Items</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {dashboardData.inventoryData.filter(p => p.status === 'critical').length}
                    </p>
                    <p className="text-sm text-orange-600">Critical Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Review Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manager Feedback Review</CardTitle>
                <CardDescription>Review and respond to feedback submitted by managers and staff</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center space-x-2 max-w-md">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Filter feedback..."
                      value={feedbackFilter}
                      onChange={(e) => setFeedbackFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredFeedback.length > 0 ? (
                    filteredFeedback.map((feedback) => (
                      <div key={feedback.Fb_ID} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{feedback.Name}</h3>
                            <Badge variant={feedback.Status === "reviewed" ? "default" : "outline"}>
                              {feedback.Status || 'pending'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openModal('view-feedback', feedback)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {feedback.Status !== 'reviewed' && (
                              <Button 
                                size="sm"
                                onClick={() => handleFeedbackAction(feedback.Fb_ID, 'mark-done')}
                                disabled={loading}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Mark Done
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleFeedbackAction(feedback.Fb_ID, 'delete')}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {feedback.Content}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted: {feedback.CreatedAt ? new Date(feedback.CreatedAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No feedback available</p>
                      <p className="text-sm">Feedback will appear here when submitted by managers</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {renderModal()}

        {/* User Create/Update Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{editingUser ? 'Update User' : 'Add New User'}</CardTitle>
                <CardDescription>
                  {editingUser ? 'Update user information' : 'Create a new staff or manager account'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="userName">Name *</Label>
                  <Input
                    id="userName"
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="userPassword">Password {editingUser ? '(leave blank to keep current)' : '*'}</Label>
                  <Input
                    id="userPassword"
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    placeholder={editingUser ? "Enter new password or leave blank" : "Enter password"}
                  />
                </div>
                <div>
                  <Label htmlFor="userRole">Role *</Label>
                  <select
                    id="userRole"
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="userStatus">Status *</Label>
                  <select
                    id="userStatus"
                    value={userForm.status}
                    onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setShowUserModal(false)} 
                    variant="outline" 
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUserSubmit} 
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (editingUser ? "Updating..." : "Creating...") : (editingUser ? "Update User" : "Create User")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Suggestion Modal */}
        {showSuggestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create Suggestion for Manager</CardTitle>
                <CardDescription>
                  Create a waste management suggestion for {selectedInventoryItem?.ProductName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="suggestionTitle">Title *</Label>
                  <Input
                    id="suggestionTitle"
                    value={suggestionForm.title}
                    onChange={(e) => setSuggestionForm({...suggestionForm, title: e.target.value})}
                    placeholder="e.g., Urgent Apple Processing"
                  />
                </div>
                
                <div>
                  <Label htmlFor="suggestionType">Type *</Label>
                  <select
                    id="suggestionType"
                    value={suggestionForm.type}
                    onChange={(e) => setSuggestionForm({...suggestionForm, type: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="Donation">Donation</option>
                    <option value="Compost">Compost</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="suggestionOrg">Organization *</Label>
                  <Input
                    id="suggestionOrg"
                    value={suggestionForm.organization}
                    onChange={(e) => setSuggestionForm({...suggestionForm, organization: e.target.value})}
                    placeholder="e.g., KL Food Bank Association"
                  />
                </div>
                
                <div>
                  <Label htmlFor="suggestionAddress">Address *</Label>
                  <Input
                    id="suggestionAddress"
                    value={suggestionForm.address}
                    onChange={(e) => setSuggestionForm({...suggestionForm, address: e.target.value})}
                    placeholder="e.g., Jalan Klang Lama, KL"
                  />
                </div>
                
                <div>
                  <Label htmlFor="suggestionNotes">Notes</Label>
                  <textarea
                    id="suggestionNotes"
                    value={suggestionForm.notes}
                    onChange={(e) => setSuggestionForm({...suggestionForm, notes: e.target.value})}
                    className="w-full h-20 p-3 border rounded-md resize-none text-sm"
                    placeholder="Additional details..."
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setShowSuggestionModal(false)} 
                    variant="outline" 
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateSuggestion} 
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Suggestion"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;