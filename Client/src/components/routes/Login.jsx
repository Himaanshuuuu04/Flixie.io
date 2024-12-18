import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundGradientAnimation } from '../Gradient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../contextAPI/AuthContext';
import GithubButton from "../Github";
import GoogleButton from "../Google";
import { account,ID } from '../Appwrite/Config';

const Login = () => {
  const { setLogged } = useAuthContext();
  const [formdata, setFormData] = React.useState({
    email: '',
    otp: '',
  });
  const navigate = useNavigate();
  const [userId, setUserId] = React.useState(null); // Store user ID for OTP verification

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Email OTP Generation
  const generateOTP = async () => {
    if (!formdata.email) {
      toast.warn('Please enter a valid email.', { position: "top-right", autoClose: 3000 });
      return;
    }
    try {
      const emailToken = await account.createEmailToken( ID.unique(),formdata.email);
      setUserId(emailToken.userId); // Save user ID for OTP verification
      toast.success('OTP sent to your email. Please check your inbox.', { position: "top-right", autoClose: 3000 });
    } catch (error) {
      console.error('Error creating email token:', error.message);
      toast.error(`Failed to send OTP: ${error.message}`, { position: "top-right", autoClose: 3000 });
    }
  };

  // OTP Verification
  const verifyOTP = async () => {
    if (!formdata.otp) {
      toast.warn('Please enter the OTP.', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!userId) {
      toast.error('User ID missing. Please request a new OTP.', { position: "top-right", autoClose: 3000 });
      return;
    }
    try {
      await account.createSession(userId, formdata.otp);
      toast.success('Login successful! Redirecting to the dashboard...', { position: "top-right", autoClose: 3000 });
      setLogged(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      toast.error(`Failed to verify OTP: ${error.message}`, { position: "top-right", autoClose: 3000 });
    }
  };

  // OAuth Login
  const handleOAuthLogin = async (provider) => {
    try {
      await account.createOAuth2Session(provider, `${window.location.origin}/`, `${window.location.origin}/Login`);
    } catch (error) {
      console.error(`OAuth login failed with ${provider}:`, error.message);
      toast.error(`OAuth login failed with ${provider}. Please try again.`, { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center w-screen h-screen overflow-auto pt-20 md:pb-20 z-50">
        <div className="flex items-center justify-center w-full h-full px-4 md:px-0">
          <div className="flex flex-col items-center justify-center w-full px-4 py-8 text-white font-sans lg:py-0 md:w-2/3 lg:w-1/3 mt-10 mb-10">
            <div className="w-full border border-slate-700 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-2xl">
              <div className="p-6 space-y-4 sm:p-8">
                <p className="text-2xl font-semibold leading-tight tracking-tight text-center md:text-3xl">
                  Login to Flixie
                </p>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">Email</label>
                  <input
                    placeholder="Your email"
                    className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                    id="email"
                    type="email"
                    name="email"
                    value={formdata.email}
                    onChange={handleChange}
                  />
                  <button
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-900 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-bold rounded-lg text-sm md:text-md px-5 py-2.5 text-center text-white"
                    onClick={generateOTP}
                  >
                    Get OTP
                  </button>
                </div>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">OTP</label>
                  <input
                    placeholder="Enter OTP"
                    className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                    id="otp"
                    type="text"
                    name="otp"
                    value={formdata.otp}
                    onChange={handleChange}
                  />
                  <button
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-900 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-bold rounded-lg text-sm md:text-md px-5 py-2.5 text-center text-white"
                    onClick={verifyOTP}
                  >
                    Login
                  </button>
                </div>
                <div className="mt-6">
                  <p className="text-sm md:text-md text-center mb-4">Or login with:</p>
                  <div className="flex justify-center gap-8">
                    <button onClick={() => handleOAuthLogin('google')}>
                      <GoogleButton />
                    </button>
                    <button onClick={() => handleOAuthLogin('github')}>
                      <GithubButton />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
  );
};

export default Login;
