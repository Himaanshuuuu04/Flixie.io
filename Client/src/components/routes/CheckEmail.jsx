import React from 'react';
import { Link } from 'react-router-dom';

const CheckEmail = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-900 to-purple-900">
      <div className="text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Check Your Email</h1>
        <p className="text-lg mb-6">
          We’ve sent a verification link to your email address. Please check your inbox to verify your account.
        </p>
        <p className="text-sm text-gray-300">
          Didn't receive the email? Check your spam folder or{' '}
          <Link to="/Signin" className="text-blue-300 underline">
            try signing up again
          </Link>.
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
