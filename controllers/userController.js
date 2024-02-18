const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 

const registerUser = asyncHandler(async (req,res) => {
    const { username, email, password} = req.body;

    if(!username || !email || !password)
    {
        res.status(400);
        res.json({message: "All fields are mandatory."});
        // throw new Error("All fields are mandatory.")
    }

    const userAvailable = await User.findOne({email});

    if(userAvailable)
    {
        res.status(400).json({message: "User already exist."});
        // throw new Error("User already registerd!");
        return false;
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password,10);
    console.log("Hashed Password: ",hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });
    console.log(user);
    if(user)
    {
        res.status(201).json({_id: user.id, email: user.email});
    }else{
        res.status(400);
        throw new Error("User data is not valid.");
    }
    res.json({message: "Registered User.",user: user});
});

const loginUser = asyncHandler(async (req,res) => {
    // const users = await User.find();
    // res.status(200).json(users);

    const {email,password} = req.body;
    if(!email || !password)
    {
        res.status(400).json({message: "All fields are mandatory."});
        return false;
    }

    const user = await User.findOne({email});
    console.log(user);
    //compare password with hashing
    if(user && (await bcrypt.compare(password, user.password)))
    {
        const accessToken = jwt.sign({
            user:{
                username: user.usernae,
                email: user.email,
                id: user.id
            }
        }, process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "1h"}
        );
        res.json({accessToken});
    }else{
        return res.status(401).json({message: "Credential does not match."})
        // return false;
    }
    res.json({message: "Logged in User."});
});

const currentUser = asyncHandler(async (req,res) => {
    const users = await User.find();
    res.status(200).json(users);
    res.json({message: "Current User Information."});
});

module.exports = {
    registerUser,
    loginUser,
    currentUser
};