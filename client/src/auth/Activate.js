import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';

const Activate = () => {
    const [values, setValues] = useState({
        name: '',
        buttonText: 'Activate Account'
    });

    const { token } = useParams();

    useEffect(() => {
        if (token) {
            const { name } = jwtDecode(token);
            setValues({ ...values, name });
        }
    }, [token]);

    const { name, buttonText } = values;

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Activating' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/activate-account`, { token }
            );

            console.log('ACCOUNT ACTIVATION SUCCESS:', response);
            setValues({ ...values, name: '', buttonText: 'Activated' });
            toast.success(response.data.message);
        }

        catch (err) {
            console.log('ACCOUNT ACTIVATION FAILED:', err.response.data.error);
            setValues({ ...values, buttonText: 'Activate Account' });
            toast.error(err.response.data.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            <div className='text-center'>
                <h1 className='text-2xl text-gray-500 mb-5'>
                    Hello {name}, please click the button below to continue:
                </h1>
                <button className='py-2 px-4 text-white font-semibold bg-red-500 hover:bg-red-600 shadow rounded' onClick={clickSubmit}>
                    {buttonText}
                </button>
            </div>
        </Layout>
    );
};

export default Activate;