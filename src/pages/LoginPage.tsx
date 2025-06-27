
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen">
      <LoginForm onRegisterClick={() => window.location.href = '/signup'} />
    </div>
  );
};

export default LoginPage;
