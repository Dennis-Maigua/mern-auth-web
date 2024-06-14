import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';

const Forgot = () => {
    const [values, setValues] = useState({
        email: '',
        buttonText: 'Request Reset Link'
    });

    const { email, buttonText } = values;

    const handleChange = ({ target }) => {
        const { name, value } = target;

        setValues({ ...values, [name]: value });
    };

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Requesting' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/forgot-password`, { email }
            );

            console.log('FORGOT PASSWORD SUCCESS:', response);

            setValues({ ...values, email: '', buttonText: 'Requested' });
            toast.success(response.data.message);
        }

        catch (err) {
            console.log('FORGOT PASSWORD FAILED:', err.response.data.error);
            setValues({ ...values, buttonText: 'Request Reset Link' });
            toast.error(err.response.data.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <h1 className='text-center text-2xl text-gray-500 mb-5'> Forgot Password </h1>

            <form onSubmit={clickSubmit} className='w-full p-10 shadow-md rounded'>
                <div className='space-y-6'>
                    <input
                        type='email'
                        name='email'
                        value={email}
                        placeholder='Email'
                        onChange={handleChange}
                        className='px-4 h-10 w-full shadow rounded'
                    />
                    <input
                        type='submit'
                        value={buttonText}
                        className='w-full py-2 text-white font-semibold bg-red-500 hover:bg-red-600 shadow rounded cursor-pointer'
                    />
                </div>
            </form>
            <br />

            <div className='mx-10 flex items-center justify-between'>
                <Link to='/signin' className='text-gray-500 font-medium hover:text-red-500'> Sign In </Link>
                <Link to='/signup' className='text-gray-500 font-medium hover:text-red-500'> Sign Up </Link>
            </div>
        </Layout>
    );
};

export default Forgot;