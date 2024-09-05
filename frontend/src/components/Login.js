// frontend/src/components/Login.js
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const handleSuccess = (response) => {
    // Handle success response
    window.location.href = '/auth/google'; // Redirect to backend for Google OAuth
  };

  const handleFailure = (response) => {
    console.error('Google login failed', response);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onFailure={handleFailure}
          buttonText="Login with Google"
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;
