import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BackgroundGradientAnimation } from '../Gradient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const ForgotPassword = () => {
    const [formData, setFormData] = React.useState({
        username: '',
        securityQuestion: '',
        securityAnswer: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleReset = async (e) => {
        e.preventDefault();

        if (
            !formData.username ||
            !formData.securityQuestion ||
            !formData.securityAnswer ||
            !formData.newPassword ||
            !formData.confirmNewPassword
        ) {
            toast.warn('All fields are required!', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error("Passwords don't match!", {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        try {
            const response = await fetch('http://localhost/Flixie.io/server/forgot.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.result === 'Password updated successfully!') {
                toast.success('Password reset successfully!', {
                    position: 'top-right',
                    autoClose: 1000,
                });
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                toast.error(result.result || 'An error occurred.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error('Failed to connect to the server!', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <BackgroundGradientAnimation>
            <ToastContainer />
            <div className="flex flex-col items-center justify-center w-screen h-screen overflow-auto pt-20 md:pb-20 z-50">
                <form className="flex items-center justify-center w-full h-full px-4 md:px-0" onSubmit={handleReset}>
                    <div className="flex flex-col items-center justify-center w-full px-4 py-8 text-white font-sans lg:py-0 md:w-2/3 lg:w-1/3 mt-10 mb-10">
                        <div className="w-full border border-slate-700 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-2xl">
                            <div className="p-6 space-y-4 sm:p-8">
                                <p className="text-2xl font-semibold leading-tight tracking-tight text-center md:text-3xl">
                                    Reset Your Password
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
                                    <label className="block mb-1 text-sm md:text-md font-light">Security Question</label>
                                    <input
                                        placeholder="Your favorite movie?"
                                        className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                                        id="securityQuestion"
                                        type="text"
                                        value={formData.securityQuestion}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm md:text-md font-light">Answer</label>
                                    <input
                                        placeholder="Answer"
                                        className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                                        id="securityAnswer"
                                        type="text"
                                        value={formData.securityAnswer}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm md:text-md font-light">New Password</label>
                                    <input
                                        className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                                        placeholder="••••••••"
                                        id="newPassword"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm md:text-md font-light">Confirm New Password</label>
                                    <input
                                        className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                                        placeholder="••••••••"
                                        id="confirmNewPassword"
                                        type="password"
                                        value={formData.confirmNewPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-light rounded-lg text-sm md:text-md px-5 py-2.5 text-center text-white"
                                    type="submit"
                                >
                                    Reset Password
                                </button>
                                <p className="text-sm md:text-md text-center mt-4">
                                    Remember your password?{' '}
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

export default ForgotPassword;
