const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addManager = async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const role = req.body.role;
        const username = req.body.username;
        const password = req.body.password;

        
        if (!firstName || !lastName || !role || !username || !password) {
            res.status(400).json({ title: 'Error!', message: 'All fiends are required!' });
        } else if (password.length < 8) {
            res.status(400).json({ title: 'Error!', message: 'Password must be at least 8 characters!' });
        } else if (role !== 'manager') {
            res.status(400).json({ title: 'Error!', message: 'This action can\'t be proceed' });
        } else {
            userModel.user.find({ username: username }).then(async (response) => {
                if (response.length > 0) {
                    res.status(400).json({ title: 'Error!', message: 'This username is already taken. Try with a different one!' });
                } else {
                    const salt = await bcrypt.genSalt();
                    const hashPassword = await bcrypt.hash(password, salt);

                    const newUser = new userModel.user({
                        firstName: firstName,
                        lastName: lastName,
                        role: role,
                        username: username,
                        password: hashPassword
                    });

                    newUser.id = newUser._id.toString();

                    newUser.save().then(() => {
                        res.status(201).json({ title: 'User added', message: 'New user added successfully' });
                    });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Plaese try again.' });
    }
};

exports.addAgent = async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const role = req.body.role;
        const username = req.body.username;
        const password = req.body.password;

        
        if (!firstName || !lastName || !role || !username || !password) {
            res.status(400).json({ title: 'Error!', message: 'All fiends are required!' });
        } else if (password.length < 8) {
            res.status(400).json({ title: 'Error!', message: 'Password must be at least 8 characters!' });
        } else if (role !== 'agent') {
            res.status(400).json({ title: 'Error!', message: 'This action can\'t be proceed' });
        } else {
            userModel.user.find({ username: username }).then(async (response) => {
                if (response.length > 0) {
                    res.status(400).json({ title: 'Error!', message: 'This username is already taken. Try with a different one!' });
                } else {
                    const salt = await bcrypt.genSalt();
                    const hashPassword = await bcrypt.hash(password, salt);

                    const newUser = new userModel.user({
                        firstName: firstName,
                        lastName: lastName,
                        role: role,
                        username: username,
                        password: hashPassword
                    });

                    newUser.id = newUser._id.toString();

                    newUser.save().then(() => {
                        res.status(201).json({ title: 'User added', message: 'New user added successfully' });
                    });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Plaese try again.' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const role = req.user.role;

        if(role === 'admin') {
            userModel.user.find({}, 'firstName lastName role').then((response) => {
                res.status(200).json(response);
            });
        } else if(role === 'manager') {
            userModel.user.find({ role: 'agent' }, 'firstName lastName role').then((response) => {
                res.status(200).json(response);
            });
        } else {
            res.status(400).json({ title: 'Error!', message: 'This action can\'t be proceed' });
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Plaese try again.' });
    }
};

exports.login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            res.status(400).json({ title: 'Error!', message: 'All fiends are required!' });
        } else {
            const user = await userModel.user.find({ username: username });

            if (user.length === 0) {
                res.status(401).json({ title: 'Error!', message: 'User credentials invalid!' });
            } else {
                const comparedPassword = await bcrypt.compare(password, user[0].password);

                if (comparedPassword === false) {
                    res.status(401).json({ title: 'Unauthorized!', message: 'User credentials invalid!' });
                } else {
                    const token = jwt.sign({ userId: user[0]._id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '7d' });
                    res.status(200).json({ title: 'Success', message: 'You have successfully logged in.', token: token, role: user[0].role });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Plaese try again.' });
    }
};

exports.getUserRole = async (req, res) => {
    try {
        res.status(200).json({ title: 'success', role: req.user.role });
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Plaese try again.' });
    }
};