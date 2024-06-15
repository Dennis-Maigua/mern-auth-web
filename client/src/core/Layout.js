import React, { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { isAuth, signout } from '../auth/helpers';
import logo from '../assets/logo.png';

const Layout = ({ children }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return pathname === path ? 'text-red-500' : 'text-gray-600';
    }

    return (
        <Fragment>
            <nav className='p-4 mx-auto flex items-center justify-between shadow'>
                <Link to='/' className='flex space-x-1'>
                    <img src={logo} className='h-8' alt='logo' />
                    <span className='text-2xl font-bold'> Mern-Auth-Web </span>
                </Link>

                <ul className='hidden md:flex md:w-auto md:flex-row font-medium space-x-8'>
                    <li>
                        <Link to='/' className={`hover:text-red-500 ${isActive('/')}`}> Home </Link>
                    </li>
                    <li>
                        <Link to='/wills' className={`hover:text-red-500 ${isActive('/wills')}`}> Wills </Link>
                    </li>
                    <li>
                        <Link to='/lockscreen' className={`hover:text-red-500 ${isActive('/lockscreen')}`}> Lock Screen </Link>
                    </li>
                </ul>

                <div className='md:flex space-x-4 font-medium'>
                    {!isAuth() && (
                        <Fragment>
                            <Link to='/signin' className='py-2 px-4 text-sm border hover:bg-gray-100 shadow rounded'> Sign In </Link>
                            <Link to='/signup' className='py-2 px-4 text-sm text-white bg-red-500 hover:bg-red-600 shadow rounded'> Sign Up </Link>
                        </Fragment>
                    )}

                    {isAuth() && isAuth().role === 'admin' && (
                        <Fragment>
                            <Link to='/admin' className={`hover:text-red-500 ${isActive('/admin')}`}> {isAuth().name} </Link>
                            <span className='text-gray-600 hover:text-red-500 cursor-pointer' onClick={() => {
                                signout(() => {
                                    navigate('/');
                                });
                            }}>
                                Log Out
                            </span>
                        </Fragment>
                    )}

                    {isAuth() && isAuth().role === 'subscriber' && (
                        <Fragment>
                            <Link to='/user' className={`hover:text-red-500 ${isActive('/user')}`}> {isAuth().name} </Link>
                            <span className='text-gray-600 hover:text-red-500 cursor-pointer' onClick={() => {
                                signout(() => {
                                    navigate('/');
                                });
                            }}>
                                Log Out
                            </span>
                        </Fragment>
                    )}
                </div>
            </nav>

            <div className='max-w-screen-sm mx-auto'>
                <div className='py-8 px-4'>
                    {children}
                </div>
            </div>
        </Fragment>
    );
};

export default Layout;