import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BackgroundGradientAnimation } from '../Gradient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const Auth = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    termsAccepted: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const SignIn = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.securityAnswer ||
      !formData.securityQuestion
    ) {
      toast.warn('All fields are required!', {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (!formData.termsAccepted) {
      toast.warn('Please accept the terms and conditions!', {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      try {
        const response = await fetch('http://localhost/Flixie.io/server/SignUp.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
          toast.success('Account created successfully!', {
            position: "top-right",
            autoClose: 3000,
          });
          navigate('/');
        } else {
          toast.error(result.result || 'An error occurred.', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error('An error occurred while processing your request!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <BackgroundGradientAnimation>
      <ToastContainer /> {/* Add ToastContainer */}
      <div className="flex flex-col items-center justify-center w-screen h-screen overflow-auto pt-20 md:pb-20 z-50">
        <form className="flex items-center justify-center  w-full h-full px-4 md:px-0" onSubmit={SignIn}>
          <div className="flex flex-col items-center justify-center w-full px-4 py-8  text-white font-sans lg:py-0 md:w-2/3 lg:w-1/3 mt-10 mb-10">
            <div className="w-full  border border-slate-700 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-2xl">
              <div className="p-6 space-y-4 sm:p-8">
                <p className="text-2xl font-semibold leading-tight tracking-tight text-center md:text-3xl">
                  Create an account
                </p>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">Your Email</label>
                  <input
                    placeholder="JohnDoe"
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
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">Security Question</label>
                  <input
                    className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                    placeholder="What is your favorite color?"
                    id="securityQuestion"
                    type="text"
                    value={formData.securityQuestion}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm md:text-md font-light">Answer</label>
                  <input
                    className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                    placeholder="Answer"
                    id="securityAnswer"
                    type="text"
                    value={formData.securityAnswer}
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

export default Auth;
