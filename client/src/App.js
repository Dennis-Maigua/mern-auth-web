import React from 'react';
import Layout from './core/Layout';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Layout>
      <ToastContainer />
      <h1 className='text-center text-2xl text-gray-500 mb-3'> Home / Landing Page </h1>
    </Layout>
  );
};

export default App;
