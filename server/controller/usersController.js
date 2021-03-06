/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
// external import
const bcrypt = require('bcrypt');

// internal import
const User = require('../models/user');
const Post = require('../models/post');

// update the user
const usersControllerUpd = async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        try {
            // update the  user by findByIdAndUpdate method
            const ress = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json({
                message: ress,
            });
        } catch (err) {
            res.status(500).json({
                error: 'can not find user!',
            });
        }
    } else {
        res.status(500).json({
            error: 'You can update only your account',
        });
    }
};

// delete user
const usersControllerDel = async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            // find the user
            const user = await User.findById(req.params.id);

            try {
                // delete all the post off the user
                await Post.deleteMany({ username: user.username });
                // delete the user by findByIdAndDelete
                await User.findByIdAndDelete(req.params.id);

                res.status(200).json({
                    message: 'User deleted successfully',
                });
            } catch (err) {
                res.status(500).json({
                    error: err,
                });
            }
        } catch (err) {
            res.status(404).json({
                error: 'User not found',
            });
        }
    } else {
        res.status(500).json({
            error: 'You can delete only your account',
        });
    }
};

// get one user
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;

        res.status(200).json({
            message: others,
        });
    } catch (err) {
        res.status(500).json({
            error: 'can not find user!',
        });
    }
};

module.exports = {
    usersControllerUpd,
    usersControllerDel,
    getUser,
};
