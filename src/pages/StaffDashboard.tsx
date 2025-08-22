import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  Heart,
  Edit,
  Trash2,
  Bot,
  DollarSign,
  Bell,
  Zap,
  Loader2,
  LogOut,
  X,
  RefreshCw,
  Clock
} from "lucide-react";

const StaffDashboard = () => {
  const [user, setUser] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(""); // New category filter
  const [showCategoryFilter, setShowCategoryFilter] = useState(false); // Filter dropdown visibility
  const [inventoryItems, setInventoryItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [donationRequest, setDonationRequest] = useState({
    productId: "",
    items: "",
    quantity: "",
    organization: "",
    notes: ""
  });
  const [productForm, setProductForm] = useState({
    productName: "",
    productCategory: "Fruit",
    productQuantity: "",
    price: "",
    shelfLife: "",
    prodDate: new Date().toISOString().split('T')[0],
    endDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Available categories for filtering
  const categories = ["All", "Fruit", "Vegetable", "Dairy", "Bakery", "Meat", "Beverage", "Other"];

  // Authentication check and initialization
  useEffect(() => {
    const initializeUser = async () => {
      try {
        console.log('🔄 Initializing Staff Dashboard...');
        
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
        
        if (parsedUser.role !== 'Staff') {
          console.error('❌ Access denied: User is not Staff. Role:', parsedUser.role);
          setError(`Access denied. This dashboard is for Staff only. Your role: ${parsedUser.role}`);
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }
        
        setUser(parsedUser);
        console.log('✅ Staff user authenticated:', parsedUser);

        // Initialize data
        await fetchProducts();
        await fetchNotifications();
        
        setIsInitializing(false);
        setLastRefresh(new Date());
        
        // Set up refresh interval
        const interval = setInterval(() => {
          fetchProducts();
          fetchNotifications();
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

  const fetchProducts = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      console.log('🔄 Fetching products...');
      const response = await fetch('http://localhost:3000/api/products', { headers });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || 'Failed to fetch products');
      }
      
      const products = await response.json();
      console.log('✅ Products fetched successfully:', products.length, 'items');
      setInventoryItems(products);
      
      // Filter products that can be donated (not expired + 2-3 days expiry for manual donation)
      const canDonate = products.filter(product => {
        const daysLeft = product.daysUntilExpiry;
        return daysLeft >= 2 && daysLeft <= 3 && product.status !== 'expired';
      });
      setExpiringProducts(canDonate);
      console.log('📦 Products available for donation:', canDonate.length);

    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError('Network error while fetching products. Please check your connection.');
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
      
      const notifs = await response.json();
      // Show only unread notifications
      setNotifications(notifs.filter(n => !n.IsRead).slice(0, 5));
      console.log('📧 Notifications fetched:', notifs.length);
    } catch (err) {
      console.error('❌ Error fetching notifications:', err);
    }
  };

  const handleDismissNotification = async (notificationId) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      setLoading(true);
      console.log('🔄 Dismissing notification:', notificationId);
      
      const response = await fetch(`http://localhost:3000/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Dismiss notification error:', errorData);
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || 'Failed to dismiss notification');
      }

      // Remove the notification from the list immediately
      setNotifications(notifications.filter(n => n.NotificationID !== notificationId));
      console.log('✅ Notification dismissed successfully');
      setSuccess('Notification dismissed!');
    } catch (err) {
      console.error('❌ Error dismissing notification:', err);
      setError(`Failed to dismiss notification: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerAutomation = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🤖 Triggering automation...');
      
      const response = await fetch('http://localhost:3000/api/trigger-automation', {
        method: 'POST',
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (handleApiError(response, errorData)) return;
        throw new Error(errorData.error || 'Failed to trigger automation');
      }
      
      const data = await response.json();
      setSuccess(data.message || 'Automation check triggered! Refreshing data...');
      console.log('✅ Automation triggered successfully');
      
      // Refresh data after a short delay
      setTimeout(() => {
        fetchProducts();
        fetchNotifications();
        setLastRefresh(new Date());
      }, 3000);
    } catch (err) {
      console.error('❌ Automation trigger error:', err);
      setError('Network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!productForm.productName || !productForm.productCategory || !productForm.productQuantity || !productForm.price || !productForm.endDate) {
      setError("Please fill in all required fields (name, category, weight, price, expiry date)");
      return;
    }

    if (parseFloat(productForm.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    setError(null);

    try {
      console.log('➕ Adding product:', productForm);
      
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers,
        body: JSON.stringify(productForm)
      });

      const data = await response.json();

      if (!response.ok) {
        if (handleApiError(response, data)) return;
        throw new Error(data.error || "Failed to add product");
      }

      setSuccess("Product added successfully! Automation is processing it...");
      setShowAddItem(false);
      setProductForm({
        productName: "",
        productCategory: "Fruit",
        productQuantity: "",
        price: "",
        shelfLife: "",
        prodDate: new Date().toISOString().split('T')[0],
        endDate: ""
      });
      console.log('✅ Product added successfully');
      
      // FIXED: Immediate refresh after adding
      setTimeout(() => {
        fetchProducts();
        fetchNotifications();
        setLastRefresh(new Date());
      }, 2000);
    } catch (err) {
      console.error('❌ Add product error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!productForm.productName || !productForm.productCategory || !productForm.productQuantity || !productForm.price || !productForm.endDate) {
      setError("Please fill in all required fields (name, category, weight, price, expiry date)");
      return;
    }

    if (parseFloat(productForm.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    setError(null);

    try {
      console.log('✏️ Updating product:', selectedItem.ProductID, productForm);
      
      const response = await fetch(`http://localhost:3000/api/products/${selectedItem.ProductID}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(productForm)
      });

      const data = await response.json();

      if (!response.ok) {
        if (handleApiError(response, data)) return;
        throw new Error(data.error || "Failed to update product");
      }

      setSuccess("Product updated successfully! Automation is reprocessing it...");
      setShowUpdateModal(false);
      setSelectedItem(null);
      console.log('✅ Product updated successfully');
      
      // FIXED: Immediate refresh after updating with longer delay for automation
      setTimeout(() => {
        fetchProducts();
        fetchNotifications();
        setLastRefresh(new Date());
        setSuccess("Product updated and status refreshed!");
      }, 3000); // Longer delay to allow automation to process
    } catch (err) {
      console.error('❌ Update product error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      console.log('🗑️ Deleting product:', productId);
      
      const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const data = await response.json();
        if (handleApiError(response, data)) return;
        throw new Error(data.error || "Failed to delete product");
      }

      setSuccess("Product deleted successfully!");
      console.log('✅ Product deleted successfully');
      fetchProducts();
      setLastRefresh(new Date());
    } catch (err) {
      console.error('❌ Delete product error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDonationRequest = async () => {
    console.log('💝 Creating donation request:', donationRequest);

    if (!donationRequest.items || !donationRequest.quantity) {
      setError("Please fill in required fields (items and weight)");
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        productId: donationRequest.productId || null,
        items: donationRequest.items,
        quantity: donationRequest.quantity,
        organization: donationRequest.organization || "",
        notes: donationRequest.notes || ""
      };

      console.log('📤 Sending donation request:', requestData);

      const response = await fetch('http://localhost:3000/api/requests/donation', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('📨 Donation request response:', data);

      if (!response.ok) {
        if (handleApiError(response, data)) return;
        throw new Error(data.error || "Failed to create donation request");
      }

      setSuccess("Donation request created successfully!");
      setShowDonationModal(false);
      setDonationRequest({
        productId: "",
        items: "",
        quantity: "",
        organization: "",
        notes: ""
      });
      console.log('✅ Donation request created successfully');
      fetchProducts();
      setLastRefresh(new Date());
    } catch (err) {
      console.error('❌ Donation request error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectProductForDonation = (product) => {
    setDonationRequest({
      ...donationRequest,
      productId: product.ProductID.toString(),
      items: product.ProductName,
      quantity: product.ProductQuantity.toString()
    });
  };

  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setProductForm({
      productName: item.ProductName,
      productCategory: item.ProductCategory,
      productQuantity: item.ProductQuantity.toString(),
      price: item.OriginalPrice ? item.OriginalPrice.toString() : item.Price.toString(),
      shelfLife: item.ShelfLife?.toString() || "",
      prodDate: item.ProdDate ? item.ProdDate.split('T')[0] : "",
      endDate: item.EndDate ? item.EndDate.split('T')[0] : ""
    });
    setShowUpdateModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "critical": return "destructive";
      case "expiring-soon": return "secondary";
      case "expired": return "outline";
      default: return "default";
    }
  };

  const getStatusText = (item) => {
    if (item.status === "expired") return "Expired";
    if (item.status === "critical") {
      if (item.daysUntilExpiry === 0) return "Expires Today!";
      if (item.daysUntilExpiry === 1) return "Expires Tomorrow!";
      return "Critical!";
    }
    if (item.status === "expiring-soon") return "Discounted";
    return "Good";
  };

  const getAutomationBadge = (item) => {
    if (item.DiscountApplied) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          <Bot className="h-3 w-3 mr-1" />
          Auto 50% Off
        </Badge>
      );
    }
    if (item.AutoDonationRequested) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
          <Heart className="h-3 w-3 mr-1" />
          Donation Requested
        </Badge>
      );
    }
    if (item.AutoCompostRequested) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          <Bot className="h-3 w-3 mr-1" />
          Compost Requested
        </Badge>
      );
    }
    return null;
  };

  const formatPrice = (item) => {
    if (item.DiscountApplied && item.OriginalPrice) {
      return (
        <div className="flex items-center space-x-2">
          <span className="line-through text-gray-500 text-sm">RM{item.OriginalPrice}</span>
          <span className="font-bold text-green-600">RM{item.Price}</span>
        </div>
      );
    }
    return <span className="font-medium">RM{item.Price}</span>;
  };

  // Enhanced filtering with category support
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ProductCategory?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === "All" || item.ProductCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: inventoryItems.length,
    expiring: inventoryItems.filter(item => item.status === "critical" || item.status === "expiring-soon").length,
    discounted: inventoryItems.filter(item => item.DiscountApplied).length,
    automated: inventoryItems.filter(item => item.AutoDonationRequested || item.AutoCompostRequested).length
  };

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Initializing Staff Dashboard...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
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
              <Button 
                onClick={() => {
                  fetchProducts();
                  fetchNotifications();
                  setLastRefresh(new Date());
                }} 
                variant="outline" 
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={triggerAutomation} variant="outline" disabled={loading}>
                <Zap className="h-4 w-4 mr-2" />
                {loading ? "Running..." : "Check Automation"}
              </Button>
              <Button onClick={() => setShowDonationModal(true)} variant="outline" disabled={expiringProducts.length === 0}>
                <Heart className="h-4 w-4 mr-2" />
                Request Donation
              </Button>
              <Button onClick={() => setShowAddItem(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
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
        {/* Notifications */}
        {notifications.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
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
                          {notif.Type === 'request_update' ? '📝' : '📬'}
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expiring}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Auto-Discounted</p>
                  <p className="text-2xl font-bold text-green-600">{stats.discounted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Auto Requests</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.automated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Button 
              variant="outline" 
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter by Category
              {categoryFilter && categoryFilter !== "All" && (
                <Badge variant="secondary" className="ml-1">
                  {categoryFilter}
                </Badge>
              )}
            </Button>
            
            {showCategoryFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                <div className="py-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setCategoryFilter(category === "All" ? "" : category);
                        setShowCategoryFilter(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        (categoryFilter === category || (category === "All" && !categoryFilter)) 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700'
                      }`}
                    >
                      {category}
                      {category !== "All" && (
                        <span className="text-gray-500 ml-2">
                          ({inventoryItems.filter(item => item.ProductCategory === category).length})
                        </span>
                      )}
                      {category === "All" && (
                        <span className="text-gray-500 ml-2">
                          ({inventoryItems.length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Summary */}
        {categoryFilter && categoryFilter !== "All" && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-blue-800 font-medium">
                Showing {filteredItems.length} products in "{categoryFilter}" category
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCategoryFilter("")}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear Filter
              </Button>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>
              Manage your products. When you update expiry dates, automation will immediately reprocess: 
              Same day/expired → Compost | 1 day → Donation | 2-3 days → 50% Discount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.ProductID} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{item.ProductName}</h3>
                        <p className="text-sm text-gray-600">{item.ProductCategory}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getStatusColor(item.status)}>
                            {getStatusText(item)}
                          </Badge>
                          {getAutomationBadge(item)}
                        </div>
                        <div className="mt-1">
                          {formatPrice(item)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="font-medium">{item.ProductQuantity} kg</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Days Left</p>
                      <p className={`font-medium ${
                        item.daysUntilExpiry < 0 ? 'text-red-600' :
                        item.daysUntilExpiry <= 1 ? 'text-orange-600' :
                        item.daysUntilExpiry <= 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {item.daysUntilExpiry >= 0 ? item.daysUntilExpiry : 'Expired'}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Expiry Date</p>
                      <p className="font-medium">{item.expiryDate}</p>
                    </div>
                    
                    {/* Show update/delete for own products */}
                    {item.canEdit && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openUpdateModal(item)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteProduct(item.ProductID)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No products found</p>
                  {categoryFilter ? (
                    <p className="text-sm">No products in "{categoryFilter}" category match your search</p>
                  ) : (
                    <p className="text-sm">Add some products to get started</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Product Modal */}
        {showAddItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Add products with any expiry date. Automation will immediately process them accordingly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input 
                    id="productName" 
                    value={productForm.productName}
                    onChange={(e) => setProductForm({...productForm, productName: e.target.value})}
                    placeholder="Enter product name" 
                  />
                </div>
                <div>
                  <Label htmlFor="productCategory">Category *</Label>
                  <select
                    id="productCategory"
                    value={productForm.productCategory}
                    onChange={(e) => setProductForm({...productForm, productCategory: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="Fruit">Fruit</option>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Meat">Meat</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    step="0.1"
                    value={productForm.productQuantity}
                    onChange={(e) => setProductForm({...productForm, productQuantity: e.target.value})}
                    placeholder="Enter weight in kg" 
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (RM) *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    placeholder="Enter price" 
                  />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input 
                    id="expiry" 
                    type="date" 
                    value={productForm.endDate}
                    onChange={(e) => setProductForm({...productForm, endDate: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tip: Past dates = compost, tomorrow = donation, 2-3 days = discount
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setShowAddItem(false)} 
                    variant="outline" 
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddProduct} 
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Product"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Update Product Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Update Product</CardTitle>
                <CardDescription>
                  Update product details. Changing expiry date will immediately retrigger automation and reset all automation flags.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="updateProductName">Product Name *</Label>
                  <Input 
                    id="updateProductName" 
                    value={productForm.productName}
                    onChange={(e) => setProductForm({...productForm, productName: e.target.value})}
                    placeholder="Enter product name" 
                  />
                </div>
                <div>
                  <Label htmlFor="updateProductCategory">Category *</Label>
                  <select
                    id="updateProductCategory"
                    value={productForm.productCategory}
                    onChange={(e) => setProductForm({...productForm, productCategory: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="Fruit">Fruit</option>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Meat">Meat</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="updateWeight">Weight (kg) *</Label>
                  <Input 
                    id="updateWeight" 
                    type="number" 
                    step="0.1"
                    value={productForm.productQuantity}
                    onChange={(e) => setProductForm({...productForm, productQuantity: e.target.value})}
                    placeholder="Enter weight in kg" 
                  />
                </div>
                <div>
                  <Label htmlFor="updatePrice">Price (RM) *</Label>
                  <Input 
                    id="updatePrice" 
                    type="number" 
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    placeholder="Enter price" 
                  />
                </div>
                <div>
                  <Label htmlFor="updateExpiry">Expiry Date *</Label>
                  <Input 
                    id="updateExpiry" 
                    type="date" 
                    value={productForm.endDate}
                    onChange={(e) => setProductForm({...productForm, endDate: e.target.value})}
                  />
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    ⚡ Changing this date will immediately reset automation and reprocess the product
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setShowUpdateModal(false)} 
                    variant="outline" 
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateProduct} 
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Product"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Donation Request Modal - Only for 2-3 day products */}
        {showDonationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create Donation Request</CardTitle>
                <CardDescription>Select discounted products (2-3 days to expiry) to request manual donation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {expiringProducts.length > 0 ? (
                  <div>
                    <Label>Available Products for Donation (2-3 days to expiry):</Label>
                    <div className="max-h-64 overflow-y-auto border rounded p-2 space-y-2">
                      {expiringProducts.map(product => (
                        <div 
                          key={product.ProductID}
                          onClick={() => selectProductForDonation(product)}
                          className={`p-2 rounded cursor-pointer border ${
                            donationRequest.productId === product.ProductID.toString() 
                              ? 'bg-blue-50 border-blue-300' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{product.ProductName}</span>
                            <span className="text-sm text-gray-600">{product.ProductQuantity} kg</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            Expires in {product.daysUntilExpiry} days | Discounted 50%
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            ✅ Available for manual donation request
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No products available for manual donation</p>
                    <p className="text-sm">Only discounted products (2-3 days to expiry) can be manually requested for donation</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="customItems">Or Enter Custom Items</Label>
                  <Input
                    id="customItems"
                    value={donationRequest.items}
                    onChange={(e) => setDonationRequest({...donationRequest, items: e.target.value, productId: ""})}
                    placeholder="e.g., Mixed Fruits"
                  />
                </div>

                <div>
                  <Label htmlFor="donationWeight">Weight (kg) *</Label>
                  <Input
                    id="donationWeight"
                    type="number"
                    step="0.1"
                    value={donationRequest.quantity}
                    onChange={(e) => setDonationRequest({...donationRequest, quantity: e.target.value})}
                    placeholder="Enter weight in kg"
                  />
                </div>

                <div>
                  <Label htmlFor="donationOrg">Preferred Organization</Label>
                  <Input
                    id="donationOrg"
                    value={donationRequest.organization}
                    onChange={(e) => setDonationRequest({...donationRequest, organization: e.target.value})}
                    placeholder="e.g., Local Food Bank"
                  />
                </div>

                <div>
                  <Label htmlFor="donationNotes">Notes</Label>
                  <Input
                    id="donationNotes"
                    value={donationRequest.notes}
                    onChange={(e) => setDonationRequest({...donationRequest, notes: e.target.value})}
                    placeholder="Additional notes for manager"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setShowDonationModal(false)} 
                    variant="outline" 
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateDonationRequest} 
                    className="flex-1"
                    disabled={loading || (!donationRequest.items || !donationRequest.quantity)}
                  >
                    {loading ? "Creating..." : "Create Request"}
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

export default StaffDashboard;