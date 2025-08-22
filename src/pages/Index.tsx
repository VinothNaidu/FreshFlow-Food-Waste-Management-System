import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Users, BarChart3, Leaf, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

const Index = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginForm, setLoginForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in (using sessionStorage to prevent cross-tab conflicts)
  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = sessionStorage.getItem('token');
      const userData = sessionStorage.getItem('user');
      
      if (token && userData && token !== 'null' && userData !== 'null') {
        try {
          console.log('🔍 Checking existing authentication...');
          
          const response = await fetch('http://localhost:3000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Existing token is valid, redirecting...');
            
            // Redirect based on role
            const role = data.user.role.toLowerCase();
            if (role === 'admin') {
              window.location.href = '/admin-dashboard';
            } else if (role === 'manager') {
              window.location.href = '/manager-dashboard';
            } else {
              window.location.href = '/staff-dashboard';
            }
            return;
          } else {
            console.log('❌ Existing token is invalid, clearing storage');
            // Clear invalid tokens
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
          }
        } catch (err) {
          console.error('Error checking existing auth:', err);
          // Clear on error
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkExistingAuth();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Basic validation
    if (isSignUp && !loginForm.name) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }
    
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    if (!loginForm.email.includes('@')) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    if (loginForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const payload = isSignUp 
        ? { name: loginForm.name, email: loginForm.email, password: loginForm.password, role: loginForm.role }
        : { email: loginForm.email, password: loginForm.password };

      console.log(`🔄 ${isSignUp ? 'Registration' : 'Login'} attempt:`, {
        endpoint,
        email: loginForm.email,
        role: loginForm.role
      });

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log(`📊 ${isSignUp ? 'Registration' : 'Login'} response:`, data);

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isSignUp) {
        setSuccess('Account created successfully! You can now login.');
        setIsSignUp(false);
        setLoginForm({ name: "", email: "", password: "", role: "Staff" });
      } else {
        // Store token and user info safely (using sessionStorage to prevent cross-tab conflicts)
        if (data.token && data.user) {
          console.log('💾 Storing authentication data in session...');
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('user', JSON.stringify(data.user));
          
          console.log('✅ Login successful, redirecting based on role:', data.user.role);
          
          // Redirect based on role
          const role = data.user.role.toLowerCase();
          if (role === 'admin') {
            window.location.href = '/admin-dashboard';
          } else if (role === 'manager') {
            window.location.href = '/manager-dashboard';
          } else {
            window.location.href = '/staff-dashboard';
          }
        } else {
          throw new Error('Invalid response from server');
        }
      }
    } catch (err) {
      console.error(`❌ ${isSignUp ? 'Registration' : 'Login'} error:`, err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setLoginForm({ name: "", email: "", password: "", role: "Staff" });
    setError(null);
    setSuccess(null);
  };

  // Show loading while checking existing auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Checking authentication...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">FreshFlow</h1>
            </div>
            <p className="text-sm text-gray-600 text-center md:text-left">
              Sustainable Food Management System
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Welcome Section */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              Smart Food Waste Management
            </h2>
            <p className="text-lg text-gray-600">
              FreshFlow helps grocery stores manage inventory, track expiration dates, and streamline 
              donation and composting processes to reduce food waste and maximize sustainability.
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Smart Inventory</h3>
                  <p className="text-sm text-gray-600">Track products & expiry dates</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Live Analytics</h3>
                  <p className="text-sm text-gray-600">Real-time waste tracking</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Leaf className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Waste Management</h3>
                  <p className="text-sm text-gray-600">Donation & composting requests</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Role Management</h3>
                  <p className="text-sm text-gray-600">Staff, Manager & Admin roles</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Login/Signup Form */}
          <div className="max-w-md mx-auto w-full">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isSignUp ? 'Create FreshFlow Account' : 'Login to FreshFlow'}
                </CardTitle>
                <CardDescription>
                  {isSignUp 
                    ? 'Join the smart food management system'
                    : 'Access your waste management dashboard'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 text-green-500 text-sm bg-green-50 p-3 rounded-md">
                      <Leaf className="h-4 w-4" />
                      {success}
                    </div>
                  )}
                  
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={loginForm.name}
                        onChange={(e) => setLoginForm({...loginForm, name: e.target.value})}
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleAuth(e)}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      autoFocus={!isSignUp}
                      onKeyPress={(e) => e.key === 'Enter' && handleAuth(e)}
                    />
                  </div>
                  
                  <div className="space-y-2 relative">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password (min 6 characters)"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && handleAuth(e)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-8 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={loginForm.role}
                      onChange={(e) => setLoginForm({...loginForm, role: e.target.value})}
                    >
                      <option value="Staff">Grocery Staff</option>
                      <option value="Manager">Grocery Manager</option>
                    </select>
                  </div>
                  
                  <Button onClick={handleAuth} className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isSignUp ? 'Creating account...' : 'Signing in...'}
                      </div>
                    ) : (
                      isSignUp ? 'Create Account' : 'Login'
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      type="button"
                      variant="link" 
                      className="text-sm"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        resetForms();
                      }}
                    >
                      {isSignUp 
                        ? 'Already have an account? Login here' 
                        : "Don't have an account? Sign up here"
                      }
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;