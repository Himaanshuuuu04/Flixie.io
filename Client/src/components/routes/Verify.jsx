import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../Appwrite/Config'; // Import Appwrite account object
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verify = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const secret = urlParams.get('secret');
      const userId = urlParams.get('userId');

      if (!secret || !userId) {
        toast.error('Invalid verification link.', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      try {
        // Confirm email verification
        await account.createSession(userId, secret);

        toast.success('Email verified successfully! You can now log in.', {
          position: "top-right",
          autoClose: 3000,
        });

        // Redirect to login
        navigate('/Login');
      } catch (error) {
        console.error('Verification failed:', error.message);
        toast.error(`Verification failed - ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ToastContainer />
      <p className="text-white text-lg">Verifying your email...</p>
    </div>
  );
};

export default Verify;
