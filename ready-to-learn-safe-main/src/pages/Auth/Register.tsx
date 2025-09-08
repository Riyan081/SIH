import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, User, Building, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'student' | 'institution'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  // Form states
  const [studentForm, setStudentForm] = useState({
    institutionId: '',
    name: '',
    rollNo: '',
    division: '',
    class: '',
    admissionYear: '',
    phone: '',
    parentPhone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [institutionForm, setInstitutionForm] = useState({
    name: '',
    institutionId: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: {
      state: '',
      district: '',
      city: '',
      pincode: '',
      address: ''
    }
  });


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (activeTab === 'student') {
        const {
          institutionId, name, rollNo, division, class: studentClass, admissionYear,
          phone, parentPhone, email, password, confirmPassword
        } = studentForm;

        // Validation
        if (!institutionId || !name || !rollNo || !division || !studentClass || 
            !admissionYear || !phone || !parentPhone || !email || !password) {
          setError('Please fill in all required fields');
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        // Validate roll number is numeric
        if (isNaN(Number(rollNo)) || Number(rollNo) < 1) {
          setError('Roll number must be a positive number');
          return;
        }

        // Validate admission year
        const currentYear = new Date().getFullYear();
        if (isNaN(Number(admissionYear)) || Number(admissionYear) < 2000 || Number(admissionYear) > currentYear + 5) {
          setError(`Admission year must be between 2000 and ${currentYear + 5}`);
          return;
        }

        const studentData = {
          institutionId,
          name, 
          rollNo: Number(rollNo), 
          division, 
          class: studentClass, 
          admissionYear: Number(admissionYear),
          phone, 
          parentPhone, 
          email, 
          password, 
          confirmPassword
        };

        await register(studentData, 'student');
      } else {
        const {
          name, institutionId, email, password, confirmPassword, phone, location
        } = institutionForm;

        // Validation
        if (!name || !institutionId || !email || !password || !phone ||
            !location.state || !location.district || !location.city || 
            !location.pincode || !location.address) {
          setError('Please fill in all required fields');
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (password.length < 8) {
          setError('Institution password must be at least 8 characters long');
          return;
        }

        const institutionData = {
          name, institutionId, email, password, confirmPassword, phone, location
        };

        await register(institutionData, 'institution');
      }

      toast.success('Registration successful! Welcome to SafeEd.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleStudentInputChange = (field: string, value: string) => {
    setStudentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleInstitutionInputChange = (field: string, value: string) => {
    if (field.startsWith('location.')) {
      const locationField = field.replace('location.', '');
      setInstitutionForm(prev => ({
        ...prev,
        location: { ...prev.location, [locationField]: value }
      }));
    } else {
      setInstitutionForm(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
              Create Your Account
            </CardTitle>
            <p className="text-muted-foreground">
              Join SafeEd and start your disaster preparedness journey
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-name">Full Name</Label>
                      <Input
                        id="student-name"
                        type="text"
                        placeholder="John Doe"
                        value={studentForm.name}
                        onChange={(e) => handleStudentInputChange('name', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-email">Email Address</Label>
                      <Input
                        id="student-email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={studentForm.email}
                        onChange={(e) => handleStudentInputChange('email', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institutionId">Institution ID *</Label>
                    <Input
                      id="institutionId"
                      type="text"
                      placeholder="Enter your institution ID (e.g., SCHOOL_123)"
                      value={studentForm.institutionId}
                      onChange={(e) => handleStudentInputChange('institutionId', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Contact your institution administrator for the correct Institution ID
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roll-no">Roll Number</Label>
                      <Input
                        id="roll-no"
                        type="number"
                        placeholder="123"
                        min="1"
                        max="999999"
                        value={studentForm.rollNo}
                        onChange={(e) => handleStudentInputChange('rollNo', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="division">Division</Label>
                      <Input
                        id="division"
                        type="text"
                        placeholder="A / B / C"
                        value={studentForm.division}
                        onChange={(e) => handleStudentInputChange('division', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Select
                        value={studentForm.class}
                        onValueChange={(value) => handleStudentInputChange('class', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Class 1</SelectItem>
                          <SelectItem value="2">Class 2</SelectItem>
                          <SelectItem value="3">Class 3</SelectItem>
                          <SelectItem value="4">Class 4</SelectItem>
                          <SelectItem value="5">Class 5</SelectItem>
                          <SelectItem value="6">Class 6</SelectItem>
                          <SelectItem value="7">Class 7</SelectItem>
                          <SelectItem value="8">Class 8</SelectItem>
                          <SelectItem value="9">Class 9</SelectItem>
                          <SelectItem value="10">Class 10</SelectItem>
                          <SelectItem value="11">Class 11</SelectItem>
                          <SelectItem value="12">Class 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admission-year">Admission Year</Label>
                    <Input
                      id="admission-year"
                      type="number"
                      placeholder="2024"
                      min="2000"
                      max={new Date().getFullYear() + 5}
                      value={studentForm.admissionYear}
                      onChange={(e) => handleStudentInputChange('admissionYear', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the year you were/will be admitted (e.g., 2021, 2024)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        value={studentForm.phone}
                        onChange={(e) => handleStudentInputChange('phone', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parent-phone">Parent's Phone</Label>
                      <Input
                        id="parent-phone"
                        type="tel"
                        placeholder="9876543211"
                        value={studentForm.parentPhone}
                        onChange={(e) => handleStudentInputChange('parentPhone', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="student-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={studentForm.password}
                          onChange={(e) => handleStudentInputChange('password', e.target.value)}
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
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={studentForm.confirmPassword}
                          onChange={(e) => handleStudentInputChange('confirmPassword', e.target.value)}
                          disabled={isLoading}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="institution" className="space-y-4 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution-name">Institution Name</Label>
                      <Input
                        id="institution-name"
                        type="text"
                        placeholder="ABC University"
                        value={institutionForm.name}
                        onChange={(e) => handleInstitutionInputChange('name', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institution-id">Institution ID</Label>
                      <Input
                        id="institution-id"
                        type="text"
                        placeholder="ABC_UNIV_001"
                        value={institutionForm.institutionId}
                        onChange={(e) => handleInstitutionInputChange('institutionId', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution-email">Email Address</Label>
                      <Input
                        id="institution-email"
                        type="email"
                        placeholder="admin@abcuniversity.edu"
                        value={institutionForm.email}
                        onChange={(e) => handleInstitutionInputChange('email', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institution-phone">Phone Number</Label>
                      <Input
                        id="institution-phone"
                        type="tel"
                        placeholder="9876543210"
                        value={institutionForm.phone}
                        onChange={(e) => handleInstitutionInputChange('phone', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="Maharashtra"
                        value={institutionForm.location.state}
                        onChange={(e) => handleInstitutionInputChange('location.state', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        type="text"
                        placeholder="Pune"
                        value={institutionForm.location.district}
                        onChange={(e) => handleInstitutionInputChange('location.district', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Pune"
                        value={institutionForm.location.city}
                        onChange={(e) => handleInstitutionInputChange('location.city', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        type="text"
                        placeholder="411001"
                        value={institutionForm.location.pincode}
                        onChange={(e) => handleInstitutionInputChange('location.pincode', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Education Street, Pune"
                      value={institutionForm.location.address}
                      onChange={(e) => handleInstitutionInputChange('location.address', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="institution-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a secure password"
                          value={institutionForm.password}
                          onChange={(e) => handleInstitutionInputChange('password', e.target.value)}
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
                      <p className="text-xs text-muted-foreground">
                        At least 8 characters with letters, numbers, and symbols
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institution-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="institution-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={institutionForm.confirmPassword}
                          onChange={(e) => handleInstitutionInputChange('confirmPassword', e.target.value)}
                          disabled={isLoading}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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
                      Creating Account...
                    </div>
                  ) : (
                    `Create ${activeTab === 'student' ? 'Student' : 'Institution'} Account`
                  )}
                </Button>
              </form>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/auth/login" 
                  className="text-primary hover:text-primary-dark font-medium underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
