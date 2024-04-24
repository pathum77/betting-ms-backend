const settingsModel = require('../models/settingsModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.addDrawType = async (req, res) => {
    try {
        const name = req.body.name;

        if (!name) {
            res.status(400).json({ title: 'Error!', message: 'Name is required' });
        } else {
            settingsModel.drawType.find({ name: name }).then((response) => {
                if (response.length > 0) {
                    res.status(400).json({ title: 'Error!', message: 'Name already exists' });
                } else {
                    const drawType = new settingsModel.drawType({ name: name });

                    drawType.id = drawType._id.toString();

                    drawType.save().then(() => {
                        res.status(200).json({ title: 'Success!', message: 'Draw type added successfully' });
                    });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Plaase try again.' });
    }
};

exports.getDrawTypes = async (req, res) => {
    try {
        settingsModel.drawType.find().then((response) => {
            res.status(200).json(response);
        });
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Plaase try again.' });
    }
};

exports.addPlace = async (req, res) => {
    try {
        const name = req.body.name;

        if (!name) {
            res.status(400).json({ title: 'Error!', message: 'Name is required' });
        } else {
            settingsModel.place.find({ name: name }).then((response) => {
                if (response.length > 0) {
                    res.status(400).json({ title: 'Error!', message: 'Name already exists' });
                } else {
                    const place = new settingsModel.place({ name: name });

                    place.id = place._id.toString();

                    place.save().then(() => {
                        res.status(200).json({ title: 'Success!', message: 'Draw type added successfully' });
                    });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Plaase try again.' });
    }
};

exports.getPlaces = async (req, res) => {
    try {
        settingsModel.place.find().then((response) => {
            res.status(200).json(response);
        });
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Plaase try again.' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        if (!oldPassword || !newPassword || !confirmPassword) {
            res.status(400).json({ title: 'Error!', message: 'All input fields are required!' });
        } else if (newPassword.length < 8) {
            res.status(400).json({ title: 'Error!', message: 'Password must be at least 8 characters!' });
        } else if (newPassword !== confirmPassword) {
            res.status(400).json({ title: 'Error!', message: 'Password confirmation did not matched with the new password!' });
        } else {
            const userOldPassword = await userModel.user.find({ id: userId }, 'password');

            const comparedPassword = await bcrypt.compare(oldPassword, userOldPassword[0].password);

            if (comparedPassword === false) {
                res.status(401).json({ title: 'Unauthorized!', message: 'Old password was incorrect!' });
            } else {
                const salt = await bcrypt.genSalt();
                const hashPassword = await bcrypt.hash(confirmPassword, salt);
                console.log(hashPassword);
                await userModel.user.updateOne({ _id: userId }, { password: hashPassword });
                res.status(200).json({ title: 'Success!', message: 'Password changed successfully' });
            }
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: error.message });
    }
};