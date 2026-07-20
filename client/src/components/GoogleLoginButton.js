import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";


function GoogleLoginButton({ rememberMe, onError }) {
  const { loginWithGoogle } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential, rememberMe);
    } catch (err) {
      onError("Could not sign in with Google. Please try again.");
    }
  };

  return (
    <div className="google-login-wrapper">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError("Google sign-in failed.")}
        useOneTap={false}
      
      />
    </div>
  );
}

export default GoogleLoginButton;
