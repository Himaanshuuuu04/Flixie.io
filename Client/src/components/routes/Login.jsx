import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BackgroundGradientAnimation } from '../Gradient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles
import { useAuthContext } from '../contextAPI/AuthContext';
import GithubButton from "../Github";
import GoogleButton from "../Google";
import { account } from '../Appwrite/Config'; // Import Appwrite's account object

const Login = () => {
  const { loginDone } = useAuthContext(); // Removed loginWithOAuth as it is defined locally
  const [formData, setFormData] = React.useState({
    identifier: '',
    password: '',
  });
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Email/Password Login
  const login = (e) => {
    e.preventDefault();
    
    if (formData.identifier === '' || formData.password === '') {
      toast.warn('All fields are required!', {
        position: "top-right",
        autoClose: 3000,
      });
      return; // Exit the function early if fields are empty
    }
  
    account.createEmailPasswordSession(formData.identifier, formData.password)
      .then((response) => {
        console.log(response); // Success
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
        });
        loginDone(); // Update auth context state
        navigate('/Home'); // Redirect to the dashboard or another page
      })
      .catch((error) => {
        console.error('Login failed:', error.message);
        toast.error('Login failed! Please check your credentials.', {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };
  
  

  // OAuth Login
  const handleOAuthLogin = async (provider) => {
    try {
      // Redirects the user to the OAuth login page
      await account.createOAuth2Session(provider, `${window.location.origin}/Home`, `${window.location.origin}/login`);
    } catch (error) {
      
      console.error(`OAuth login failed with ${provider}:`, error.message);
      toast.error(`OAuth login failed with ${provider}! Please try again.`, { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <BackgroundGradientAnimation>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center w-screen h-screen overflow-auto pt-20 md:pb-20 z-50">
        <form className="flex items-center justify-center w-full h-full px-4 md:px-0" onSubmit={login}>
          <div className="flex flex-col items-center justify-center w-full px-4 py-8 text-white font-sans lg:py-0 md:w-2/3 lg:w-1/3 mt-10 mb-10">
            <div className="w-full border border-slate-700 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-2xl">
              <div className="p-6 space-y-4 sm:p-8">
                <p className="text-2xl font-semibold leading-tight tracking-tight text-center md:text-3xl">
                  Log in to your account
                </p>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">Email</label>
                  <input
                    placeholder="JohnDoe@example.com"
                    className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                    id="identifier"
                    type="email"
                    value={formData.identifier}
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
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-900 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-bold rounded-lg text-sm md:text-md px-5 py-2.5 text-center text-white "
                  type="submit"
                >
                  Login
                </button>
                <p className="text-sm md:text-md text-center mt-4">
                  Create an account{' '}
                  <Link to="/Signin" className="font-light text-blue-400 hover:underline">
                    SignUp
                  </Link>
                </p>
                <div className="text-center">
                  <Link to="/ForgotPassword" className="text-blue-400 hover:underline font-light">
                    Forgot Your Password?
                  </Link>
                </div>
                <div className="mt-6">
                  <p className="text-sm md:text-md text-center mb-4">Or login with:</p>
                  <div className="flex justify-center gap-8">
                    <button
                      
                      onClick={() => handleOAuthLogin('google')}
                    >
                      <GoogleButton />
                    </button>
                    <button
                      
                      onClick={() => handleOAuthLogin('github')}
                    >
                      <GithubButton />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Login;
