import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, User, Building, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'student' | 'institution'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [studentForm, setStudentForm] = useState({
    email: '',
    password: '',
    institutionId: ''
  });

  const [institutionForm, setInstitutionForm] = useState({
    email: '',
    password: ''
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (activeTab === 'student') {
        const { email, password, institutionId } = studentForm;
        
        if (!email || !password) {
          setError('Please fill in all required fields');
          return;
        }

        await login(email, password, 'student', institutionId || undefined);
      } else {
        const { email, password } = institutionForm;
        
        if (!email || !password) {
          setError('Please fill in all required fields');
          return;
        }

        await login(email, password, 'institution');
      }

      toast.success('Login successful! Welcome to SafeEd.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (activeTab === 'student') {
      setStudentForm(prev => ({ ...prev, [field]: value }));
    } else {
      setInstitutionForm(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Landing Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">SafeEd</span>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Sign In to Your Account
            </CardTitle>
            <p className="text-muted-foreground">
              Access your disaster preparedness learning dashboard
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'student' | 'institution')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="institution" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Institution
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="student" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email Address</Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="student@example.com"
                      value={studentForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={studentForm.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution-id">Institution ID (Optional)</Label>
                    <Input
                      id="institution-id"
                      type="text"
                      placeholder="Your institution ID"
                      value={studentForm.institutionId}
                      onChange={(e) => handleInputChange('institutionId', e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank if you don't know your institution ID
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="institution" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="institution-email">Institution Email</Label>
                    <Input
                      id="institution-email"
                      type="email"
                      placeholder="admin@institution.edu"
                      value={institutionForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="institution-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={institutionForm.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    `Sign In as ${activeTab === 'student' ? 'Student' : 'Institution'}`
                  )}
                </Button>
              </form>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/auth/register" 
                  className="text-primary hover:text-primary-dark font-medium underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link 
                to="/auth/forgot-password" 
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
