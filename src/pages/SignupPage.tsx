
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';

const SignupPage = () => {
  return (
    <div className="min-h-screen">
      <RegisterForm onLoginClick={() => window.location.href = '/login'} />
    </div>
  );
};

export default SignupPage;
