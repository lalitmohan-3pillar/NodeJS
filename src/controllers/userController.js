const asyncHandler = require('express-async-handler');
var session = require('express-session')
const cookie = require('cookie')
const AdminService = require('../services/userService');
const MenuDetailService = require('../services/menuDetailService');

/**
 * This controller is handling request for User's login/register
 * @module UserController
 */
/** 

 * This is for creating the New User
 * @api {post} /assessment/register  Register the New User
 * @apiName createUser
 * @function CreateUser
 * @param {string} name -Name of the User
 * @param {string} email -E-mail of the User
 * @param {string} username -Username of the User
 * @param {string} password -Password of the User
 * @param {string} confirmpassword -Confirmpassword of the User
 *
 **/
const createUser = asyncHandler(async (req, res) => {
    const { name, email, username, password, confirmpassword } = req.body;
    if (!name || !email || !username || !password || !confirmpassword) {
        req.flash('message', 'All fields are mandatory')
        res.redirect(`${process.env.PREFIXPATH}/register`);
    }
    if (password !== confirmpassword) {
        req.flash('message', 'password and confirmpassword not matched')
        res.redirect(`${process.env.PREFIXPATH}/register`);
    }
    else {
        const user = await AdminService.getUser(username);

        if (user && user.username === username) {
            req.flash('message', `User with username '${user.username}' already present.`)
            res.redirect(`${process.env.PREFIXPATH}/register`);
        }
        else {
            await AdminService.createUser(req.body);

            req.flash('success-message', 'User created successfully')
            res.redirect(`${process.env.PREFIXPATH}/login`);
        }
    }
})

/**
 * This is post method for loginUser 
 * @api {post} /assessment/login  Login the User
 * @apiName loginUser
 * @function PostLogin
 * @param {string} username -Username of the User
 * @param {string} password -Password of the User
 * @param {boolean} remember -Remember checkbox
 *
 **/
const loginUser = asyncHandler(async (req, res) => {
    const { username, password, remember } = req.body;
    if (!username || !password) {
        req.flash('message', 'Username and password both fields are mandatory')
        res.redirect(`${process.env.PREFIXPATH}/login`);
    }
    else {
        const accessUser = await AdminService.loginUser(username, password);
        if (accessUser.user) {
            const details = await MenuDetailService.Detail();
            if (accessUser.accessToken) {
                if (details !== null) {
                    session = req.session;
                    session.name = accessUser.user.name;
                    session.username = accessUser.user.username;
                    session.email = accessUser.user.email;
                    session.jwt = accessUser.accessToken;
                    if (remember) {
                        cookie.username = username;
                        cookie.password = password;
                    }
                    else {
                        cookie.username = '';
                        cookie.password = '';
                    }
                    res.redirect(`${process.env.PREFIXPATH}`);
                }
            }
            else {
                req.flash('message', 'Invalid Password')
                res.redirect(`${process.env.PREFIXPATH}/login`);
            }
        }
        else {
            req.flash('message', 'Invalid username or password')
            res.redirect(`${process.env.PREFIXPATH}/login`);
        }
    }
});

/**
 * This is for load login details
 * @function GetLogin
 * @api {get} /assessment/login  Login the User
 * @apiName getlogin
 *
 **/

const getlogin = async (req, res) => {
    const details = await MenuDetailService.Detail();
    if (details !== null) {
        if (cookie.username != '') {
            res.render('login', {
                details: details,
                mymessages: req.flash('message'),
                success_message: req.flash('success-message'),
                posturl: `${process.env.PREFIXPATH}/login`,
                username: cookie.username,
                password: cookie.password
            });
        } else {
            res.render('login', {
                details: details,
                mymessages: req.flash('message'),
                success_message: req.flash('success-message'),
                posturl: `${process.env.PREFIXPATH}/login`,
            });
        }
    }
};

/**
 * This is get method for load Register 
 * @api {get} /assessment/register  register the User
 * @apiName getregister
 * @function GetRegister
 **/
const getregister = async (req, res) => {
    const details = await MenuDetailService.Detail();
    if (details !== null) {
        res.render('register', {
            details: details,
            mymessages: req.flash('message'),
            posturl: `${process.env.PREFIXPATH}/register`
        });
    }
}

/**
 * This is logout page
 * @function Logout
 * @api {get} /assessment/logout  logout the User
 * @apiName logout
 *
 **/
const logout = async (req, res) => {
    const details = await MenuDetailService.Detail();
    if (details !== null) {
        req.session.destroy((err) => {
            if (err)
                console.log(err);
        })
        if (cookie) {
            res.render('login', {
                details: details,
                posturl: `${process.env.PREFIXPATH}/login`,
                username: cookie.username,
                password: cookie.password
            });
        } else {
            res.render('login', {
                details: details,
                posturl: `${process.env.PREFIXPATH}/login`
            });
        }
    }
}

/**
 * This is load for profile
 * @api {get} /assessment/profile  load the profile of the User
 * @apiName profile

 * @function GetProfile
 **/
const profile = async (req, res) => {
    const user = await AdminService.getUser(req.session.username);
    res.render('userProfile', {
        details: res.locals.menuItemsWithCart,
        UserInfo: user,
        session: req.session.name,
        changeprofile: req.flash('profileChange'),
        messages: req.flash('messages')

    });
}

/**
 * This post method for update profile
 * @api {post} /assessment/profile  update the profile of the User
 * @apiName changeProfile
 * @function UpdateProfile
 * @param {string} name -name of the User
 * @param {string} email -email of the User
 * @param {boolean} shippingAddress -shippingAddress of the User
 *
 **/
const changeProfile = asyncHandler(async (req, res) => {
    const { name, email, shippingAddress } = req.body;
    if (!name || !email || !shippingAddress) {
        req.flash('messages', 'All fields are mandatory')
        res.redirect(`${process.env.PREFIXPATH}/profile`);
    }
    else {

        const changedProfile = await AdminService.changeProfile(req.session.username, req.body);
        if (changedProfile) {
            req.session.name = changedProfile;
        }

        req.flash('profileChange', 'Profile Changed successfully');
        res.redirect(`${process.env.PREFIXPATH}/profile`);
    }
});


module.exports = { createUser, loginUser, getlogin, getregister, logout, profile, changeProfile }