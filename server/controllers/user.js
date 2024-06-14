const User = require('../models/user');

exports.read = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found or does not exist!'
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        return res.json(user);
    }

    catch (err) {
        console.log('READ DATA FAILED:', err);
        return res.status(500).json({
            error: 'Problem reading data from database!'
        });
    }
};

exports.update = async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found or does not exist!'
            });
        }

        if (!name || name.length < 3) {
            return res.status(400).json({
                error: 'Name must be at least 3 characters long!'
            });
        }
        else {
            user.name = name;
        }

        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    error: 'Password must be at least 8 characters long!'
                });
            }
            user.password = password;
        }

        const updatedUser = await user.save();
        updatedUser.hashed_password = undefined;
        updatedUser.salt = undefined;

        console.log('UPDATE USER:', req.user)
        return res.json(updatedUser);
    }

    catch (err) {
        console.log('UPDATE DATA FAILED:', err);
        return res.status(500).json({
            error: 'Update failed! Please try again.'
        });
    }
};