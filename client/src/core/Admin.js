import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';
import { getCookie, isAuth, signout, updateUser } from '../auth/helpers';

const Admin = () => {
    const [values, setValues] = useState({
        role: '',
        name: '',
        email: '',
        password: '',
        buttonText: 'Update'
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const { role, name, email, password, buttonText } = values;
    const token = getCookie('token');
    const navigate = useNavigate();

    const loadProfile = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/admin/${isAuth()._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('LOAD ADMIN PROFILE SUCCESS:', response);
            const { role, name, email } = response.data;
            setValues({ ...values, role, name, email });
        }

        catch (err) {
            console.log('LOAD ADMIN PROFILE FAILED:', err.response.data.error);

            if (err.response.status === 401) {
                signout(() => {
                    navigate('/')
                });
            }
        }
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;

        setValues({ ...values, [name]: value });
    };

    const clickUpdate = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Updating' });

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/admin/update`, { name, password }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('UPDATE ADMIN PROFILE SUCCESS:', response);
            updateUser(response, () => {
                setValues({ ...values, buttonText: 'Updated' });
                toast.success('Profile is updated successfully!');
            });
        }

        catch (err) {
            console.log('UPDATE ADMIN PROFILE FAILED:', err.response.data.error);
            setValues({ ...values, buttonText: 'Update' });
            toast.error(err.response.data.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <h1 className='text-center text-2xl text-gray-500 mb-5'> Admin Profile </h1>

            <form onSubmit={clickUpdate} className='w-full p-10 shadow-md rounded'>
                <div>
                    <span className='px-2 font-medium p-0 text-red-500'> Role: </span>
                    <input
                        type='text'
                        name='role'
                        defaultValue={role}
                        placeholder='Role'
                        className='px-4 mt-2 mb-5 h-10 w-full text-gray-400 shadow rounded'
                        disabled
                    />

                    <span className='px-2 font-medium p-0 text-red-500'> Name: </span>
                    <input
                        type='text'
                        name='name'
                        value={name}
                        placeholder='Name'
                        onChange={handleChange}
                        className='px-4 mt-2 mb-5 h-10 w-full shadow rounded'
                    />

                    <span className='px-2 font-medium p-0 text-red-500'> Email: </span>
                    <input
                        type='email'
                        name='email'
                        defaultValue={email}
                        placeholder='Email'
                        className='px-4 mt-2 mb-5 h-10 w-full text-gray-400 shadow rounded'
                        disabled
                    />

                    <span className='px-2 font-medium p-0 text-red-500'> Password: </span>
                    <input
                        type='password'
                        name='password'
                        value={password}
                        placeholder='********'
                        onChange={handleChange}
                        className='px-4 mt-2 mb-4 h-10 w-full shadow rounded'
                    />

                    <input
                        type='submit'
                        value={buttonText}
                        className='w-full py-2 mt-2 text-white font-semibold bg-red-500 hover:bg-red-600 shadow rounded cursor-pointer'
                    />
                </div>
            </form>
        </Layout>
    );
};

export default Admin;