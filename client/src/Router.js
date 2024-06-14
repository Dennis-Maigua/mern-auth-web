import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Activate from './auth/Activate';
import Forgot from './auth/Forgot';
import Reset from './auth/Reset';
import User from './core/User';
import Admin from './core/Admin';
import UserRoute from './auth/UserRoute';
import AdminRoute from './auth/AdminRoute';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/auth/activate/:token' element={<Activate />} />
                <Route path='/auth/password/forgot' element={<Forgot />} />
                <Route path='/auth/password/reset/:token' element={<Reset />} />
                <Route exact path='/' element={<UserRoute />}>
                    <Route path='/user' element={<User />} />
                </Route>
                <Route exact path='/' element={<AdminRoute />}>
                    <Route path='/admin' element={<Admin />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;