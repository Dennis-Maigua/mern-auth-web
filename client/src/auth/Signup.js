import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';
import { isAuth } from './helpers';

const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        buttonText: 'Submit'
    });

    const { name, email, password, buttonText } = values;

    const handleChange = ({ target }) => {
        const { name, value } = target;

        setValues({ ...values, [name]: value });
    };

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Submitting' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/signup`, { name, email, password }
            );

            console.log('USER SIGNUP SUCCESS:', response);
            setValues({ ...values, name: '', email: '', password: '', buttonText: 'Submitted' });
            toast.success(response.data.message);
        }

        catch (err) {
            console.log('USER SIGNUP FAILED:', err.response.data.error);
            setValues({ ...values, buttonText: 'Submit' });
            toast.error(err.response.data.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {isAuth() ? <Navigate to='/' /> : null}
            <h1 className='text-center text-2xl text-gray-500 mb-5'> Sign Up </h1>

            <form onSubmit={clickSubmit} className='w-full p-10 shadow-md rounded'>
                <div className='space-y-6'>
                    <input
                        type='text'
                        name='name'
                        value={name}
                        placeholder='Name'
                        onChange={handleChange}
                        className='px-4 h-10 w-full shadow rounded'
                    />
                    <input
                        type='email'
                        name='email'
                        value={email}
                        placeholder='Email'
                        onChange={handleChange}
                        className='px-4 h-10 w-full shadow rounded'
                    />
                    <input
                        type='password'
                        name='password'
                        value={password}
                        placeholder='Password'
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
                <Link to='/auth/password/forgot' className='text-gray-500 font-medium hover:text-red-500'> Forgot password? </Link>
            </div>
        </Layout>
    );
};

export default Signup;