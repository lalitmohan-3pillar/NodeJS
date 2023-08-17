const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const AdminService = {};

/**
 * A collection of UserService functions for handling user login/register functions
 * @module UserService 
 */

/**
 * This query is based on username and password.
 * and give access to user. it returns user and jwt token.
 * @function LoginUser
 *
 * @param {string} username - The username.
 * @param {string} password - The password.
 * 
 * @returns {object} - User Info and JWT token
 */
AdminService.loginUser = async (username, password) => {

    const user = await User.findOne({ username: username });
    if (user) {
        if (await bcrypt.compare(password, user.password)) {

            var accessToken = jwt.sign(
                {
                    user: {
                        username: user.name,
                        email: user.email,
                        id: user._id
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );
        }
    }
    return { user, accessToken };
};

/**
 * This query is based on username.
 * and returns user Info.
 * @function GetUser
 * @param {string} username - The username. 
 * @returns {object} - User Info 
 * 
 */
AdminService.getUser = async (username) => {
    const user = await User.findOne({ username: username });
    return user;
}

/**
 * Create User with name,email,username,password .
 * @function CreateUser
 * @param {string} name - The name.
 * @param {string} email - The email. 
 * @param {string} username - The username.  
 * @param {string} password - The password. 
 *
 * 
 */
AdminService.createUser = async ({ name, email, username, password }) => {

    //Hash Password
    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
        name: name,
        email: email,
        username: username,
        password: hashPassword,
        confirmpassword: password,
        shippingAddress: ''
    });
};


/**
 * Update the User info for name, email, shippingAddress .
 * @function ChangeProfile
 * @param {string} name - The name.
 * @param {string} email - The email. 
 * @param {string} shippingAddress - The shippingAddress.
 * @returns {string} - name
 */
AdminService.changeProfile = async (username, { name, email, shippingAddress }) => {
    const updatedProfile = await User.findOneAndUpdate({ username: username },
        {
            name: name, email: email, shippingAddress: shippingAddress
        },
        { new: true });
    return updatedProfile.name;
};

module.exports = AdminService;
