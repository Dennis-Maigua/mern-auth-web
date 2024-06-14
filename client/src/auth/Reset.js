import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';

const Reset = () => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset Password'
    });

    const { token } = useParams();

    useEffect(() => {
        if (token) {
            const { name } = jwtDecode(token);
            setValues(values => ({ ...values, name, token }));
        }
    }, [token]);

    const { name, newPassword, buttonText } = values;

    const handleChange = ({ target }) => {
        const { name, value } = target;

        setValues({ ...values, [name]: value });
    };

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Resetting' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/reset-password`, { newPassword, resetPasswordLink: token }
            );

            console.log('RESET PASSWORD SUCCESS:', response);
            setValues({ ...values, newPassword: '', buttonText: 'Reset Done' });
            toast.success(response.data.message);
        }

        catch (err) {
            console.log('RESET PASSWORD FAILED:', err.response.data.error);
            setValues({ ...values, buttonText: 'Reset Password' });
            toast.error(err.response.data.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <h1 className='text-center text-2xl text-gray-500 mb-5'>
                Hello {name}, please type your new password to continue:
            </h1>

            <form onSubmit={clickSubmit} className='w-full p-10 shadow-md rounded'>
                <div className='space-y-6'>
                    <input
                        type='password'
                        name='newPassword'
                        value={newPassword}
                        placeholder='********'
                        onChange={handleChange}
                        className='px-4 mt-2 mb-4 h-10 w-full shadow rounded'
                    />
                    <input
                        type='submit'
                        value={buttonText}
                        className='w-full py-2 text-white font-semibold bg-red-500 hover:bg-red-600 shadow rounded cursor-pointer'
                    />
                </div>
            </form>
        </Layout>
    );
};

export default Reset;