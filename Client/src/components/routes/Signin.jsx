import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BackgroundGradientAnimation } from '../Gradient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GithubButton from "../Github";
import GoogleButton from "../Google";
import { account } from '../Appwrite/Config'; // Import the Appwrite Account object


const Signin = () => {
 
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const navigate = useNavigate();
  const  [method,setMethod] = React.useState('oauth');

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
  
    // Validation checks
    if (
      (!formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword) && method === 'email'
    ) {
      toast.warn('All fields are required!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    if (!formData.termsAccepted) {
      toast.warn('Please accept the terms and conditions!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    try {
      // Create a new user
      const user = await account.create(
        'unique()', // Automatically generates a unique user ID
        formData.email,
        formData.password,
        formData.username // Use the username as the name
      );
  
      // Send verification email
      await account.createMagicURLToken(
        user.$id,
        formData.email,
        `${window.location.origin}/verify` // Redirect after verification
      );
  
      // Success toast
      toast.success('Account created successfully! Please check your email for verification.', {
        position: "top-right",
        autoClose: 3000,
      });
  
      // Navigate to a 'check your email' or login page
      navigate('/CheckEmail');
    } catch (error) {
      console.error('Error creating account:', error.message);
      toast.error(`Failed to create account - ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const handleOAuthLogin = async (provider) => {
    try {
      // Redirect to OAuth login page
      await account.createOAuth2Session(
        provider,
        `${window.location.origin}/Home`, // Success redirect
        `${window.location.origin}/login` // Failure redirect
      );
      setMethod('oauth');
    } catch (error) {
      console.error(`OAuth login failed with ${provider}:`, error.message);
      toast.error(`OAuth login failed with ${provider}: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  

  return (
    <BackgroundGradientAnimation>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center w-screen h-screen overflow-auto pt-20 md:pb-20 z-50">
        <form className="flex items-center justify-center w-full h-full px-4 md:px-0" onSubmit={submit}>
          <div className="flex flex-col items-center justify-center w-full px-4 py-8 text-white font-sans lg:py-0 md:w-2/3 lg:w-1/3 mt-10 mb-10">
            <div className="w-full border border-slate-700 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-2xl">
              <div className="p-6 space-y-4 sm:p-8">
                <p className="text-2xl font-semibold leading-tight tracking-tight text-center md:text-3xl">
                  Create an account
                </p>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">Username</label>
                  <input
                    placeholder="JohnDoe123"
                    className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">Your Email</label>
                  <input
                    placeholder="example@mail.com"
                    className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">Password</label>
                  <input
                    className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                    placeholder="••••••••"
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">Confirm Password</label>
                  <input
                    className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                    placeholder="••••••••"
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 focus:ring-primary-600 ring-offset-gray-800"
                      type="checkbox"
                      aria-describedby="terms"
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ml-3 text-sm md:text-md">
                    <label className="font-light">
                      I accept the{' '}
                      <a href="#" className="font-light text-primary-600 hover:underline text-blue-400">
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-light rounded-lg text-sm md:text-md px-5 py-2.5 text-center text-white"
                  type="submit"
                >
                  Create an account
                </button>
                <div className="mt-6">
                  <p className="text-sm md:text-md text-center mb-4">Or Signin with </p>
                  <div className="flex justify-center gap-8">
                  <button
                    type="button" // Prevents the button from being treated as a form submit button
                    onClick={() => handleOAuthLogin('google')}
                  >
                    <GoogleButton />
                  </button>
                  <button
                    type="button" // Prevents the button from being treated as a form submit button
                    onClick={() => handleOAuthLogin('github')}
                  >
                    <GithubButton />
                  </button>
                  </div>
                </div>
                <p className="text-sm md:text-md text-center mt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="font-light text-blue-400 hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Signin;
