const User = require('../models/user');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { mailTransport } = require('../utils/mail');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                error: 'Email is already taken!'
            });
        }

        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '1h' });

        const emailData = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Activate Your Account',
            html: `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <style>
                        @media only screen and (max-width: 620px) {
                            h1 {
                                font-size: 20px;
                                padding: 5px;
                            }
                        }
                        div {
                            margin: 0 auto;
                            text-align: center;
                            font-family: sans-serif;
                            color: #272727;
                        }
                        h1 {
                            background: #f6f6f6;
                            padding: 10px;
                        }
                        button {
                            color: white;
                            background: #E8363C;
                            padding: 15px;
                            border-radius: 5px;
                            border: 0;
                            font-size: 16px;
                        }
                    </style>
                </head>
                <body>
                    <div>
                        <h1> Activation Required </h1>                        
                        <p> To activate your account, please use the following link: </p>
                        <a href="${process.env.CLIENT_URL}/auth/activate/${token}"> 
                            <button> Activation Link </button> 
                        </a>
                        <br />
                        <p> This link is only valid for 1 hour and will expire after use. </p>
                    </div>
                </body>
            </html>
        `
        };

        await mailTransport(req, res, emailData);
    }

    catch (err) {
        console.log('SIGN UP ERROR:', err);
        return res.status(500).json({
            error: 'Problem with sign up! Please try again.'
        });
    }
};

exports.activate = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(404).json({
            error: 'Invalid or missing token!'
        });
    }

    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function (err, decoded) {
        const { name, email, password } = jwt.decode(token);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                error: 'Account is already activated!'
            });
        }

        if (err) {
            console.log('ACCOUNT ACTIVATION ERROR:', err);
            return res.status(401).json({
                error: 'Expired token or link!'
            });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        return res.json({
            message: 'Activation success! Please sign in.'
        });
    });
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: 'User not found or does not exist!'
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Incorrect email or password!'
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        user.hashed_password = undefined;
        user.salt = undefined;

        return res.json({
            message: `Hey ${user.name}, Welcome back!`,
            token,
            user
        });
    }

    catch (err) {
        console.log('SIGN IN ERROR:', err);
        return res.status(500).json({
            error: 'Problem with sign in! Please try again.'
        });
    }
};

exports.requireSignin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(404).json({
            error: 'Invalid or missing token!'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
            console.log('JWT VERIFICATION ERROR:', err);
            return res.status(401).json({
                error: 'Expired token!'
            });
        }

        req.user = decoded;
        next();
    });
};

exports.adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(404).json({
                error: 'User not found or does not exist!'
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                error: 'Forbidden! Access denied.'
            });
        }

        req.profile = user;
        next();
    }

    catch (err) {
        console.log('ADMIN PROFILE ERROR:', err);
        return res.status(500).json({
            error: 'Problem with admin profile! Please try again.'
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: 'User not found or does not exist!'
            });
        }

        const token = jwt.sign({ _id: user._id, name: user.name },
            process.env.JWT_PASSWORD_RESET, { expiresIn: '1h' });

        const emailData = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset Your Password',
            html: `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <style>
                        @media only screen and (max-width: 620px) {
                            h1 {
                                font-size: 20px;
                                padding: 5px;
                            }
                        }
                        div {
                            margin: 0 auto;
                            text-align: center;
                            font-family: sans-serif;
                            color: #272727;
                        }
                        h1 {
                            background: #f6f6f6;
                            padding: 10px;
                        }
                        button {
                            color: white;
                            background: #E8363C;
                            padding: 15px;
                            border-radius: 5px;
                            border: 0;
                            font-size: 16px;
                        }
                    </style>
                </head>
                <body>
                    <div>
                        <h1> Reset Password </h1>                        
                        <p> To reset your password, please use the following link: </p>
                        <a href="${process.env.CLIENT_URL}/auth/password/reset/${token}"> 
                            <button> Reset Link </button> 
                        </a>
                        <br />
                        <p> This link is only valid for 1 hour and will expire after use. </p>
                    </div>
                </body>
            </html>
        `
        };

        return await user
            .updateOne({ resetPasswordLink: token })
            .then(() => {
                mailTransport(req, res, emailData);
            })
            .catch((err) => {
                console.log('DATABASE ERROR:', err);
                return res.status(500).json({
                    error: 'Problem with database on forgot password!'
                });
            });
    }

    catch (err) {
        console.log('FORGOT PASSWORD ERROR:', err);
        return res.status(500).json({
            error: 'Problem with forgot password! Please try again.'
        });
    }
};

exports.resetPassword = async (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_PASSWORD_RESET, async function (err, decoded) {
            if (err) {
                console.log('JWT VERIFICATION ERROR:', err);
                return res.status(401).json({
                    error: 'Expired token or link!'
                });
            }

            let user = await User.findOne({ resetPasswordLink });
            try {
                if (!user) {
                    return res.status(404).json({
                        error: 'User not found or does not exist!'
                    });
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);

                await user
                    .save()
                    .then(() => {
                        return res.json({
                            message: `Success! Please sign in with your new password.`
                        });
                    })
                    .catch((err) => {
                        console.log('DATABASE ERROR:', err);
                        return res.status(500).json({
                            error: 'Problem with database on reset password!'
                        });
                    });
            }

            catch (err) {
                console.log('RESET PASSWORD ERROR:', err);
                return res.status(500).json({
                    error: 'Problem with reset password! Please try again.'
                });
            }
        });
    }
};