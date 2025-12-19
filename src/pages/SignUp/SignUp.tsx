import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../state/store';
import { toast } from 'react-toastify';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const register = useStore((state) => state.register);

  // Allowed email domains for security
  const ALLOWED_DOMAINS = ['hospital.com', 'clinic.org', 'healthcare.gov', 'insurance.com'];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    } else {
      const emailDomain = formData.email.split('@')[1];
      if (!ALLOWED_DOMAINS.includes(emailDomain)) {
        newErrors.email = `Email must be from an authorized domain: ${ALLOWED_DOMAINS.join(', ')}`;
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.organizationCode) {
      newErrors.organizationCode = 'Organization code is required';
    } else if (formData.organizationCode.length < 6) {
      newErrors.organizationCode = 'Invalid organization code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const success = register({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        organizationCode: formData.organizationCode,
      });
      
      if (success) {
        toast.success('Account created successfully! Please sign in.');
        navigate('/login');
      } else {
        toast.error('Email already registered');
        setErrors({ ...errors, email: 'This email is already registered' });
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>🏥 Create Account</h1>
          <p>Join the Fraud Detection Platform</p>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={errors.firstName ? 'error' : ''}
                placeholder="John"
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={errors.lastName ? 'error' : ''}
                placeholder="Doe"
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Work Email Address</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="name@hospital.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
            <span className="helper-text">Only authorized organizational emails are accepted</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="organizationCode">Organization Code</label>
            <input
              id="organizationCode"
              type="text"
              value={formData.organizationCode}
              onChange={(e) => handleChange('organizationCode', e.target.value)}
              className={errors.organizationCode ? 'error' : ''}
              placeholder="Enter your organization code"
            />
            {errors.organizationCode && <span className="error-text">{errors.organizationCode}</span>}
            <span className="helper-text">Contact your administrator for this code</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={errors.password ? 'error' : ''}
              placeholder="Min. 8 characters"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          
          <button type="submit" className="btn-primary btn-signup">
            Create Account
          </button>
        </form>
        
        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="link-primary">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
