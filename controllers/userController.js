
const expressAsyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/userModel")
//@route post /api/contacts
//@access public
const registerUser = expressAsyncHandler(async (req, res)=>{
        const{username, email, password} = req.body
        if(!username || !email || ! password){
                res.status(400)
                throw new Error("All fields are mandatory!")
        }
        const userAvailable = await User.findOne({email});
        if(userAvailable){
                res.status(400)
                throw new Error("User already registered!")
        }
        //hash
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashedpassword:" + hashedPassword)
        const user = await User.create({
                username,
                email,
                password: hashedPassword,
        })

        console.log(`User created ${user}`)
        if(user){
                res.status(201).json({_id: user.id, email: user.email})
        } else{
                res.status(400);
                throw new Error('User data us not valid')
        }
        res.json({message: "Register the user"})
});

//@des Register a user
//@route post /api/contacts
//@access public
const loginUser = expressAsyncHandler(async (req, res)=>{
        const {email, password} = req.body
        if(!email || !password){
                res.status(400)
                throw new Error("all fields are mandotory")
        }
        const user = await User.findOne({email})
        //campare password with hashed password
        if(user && (await bcrypt.compare(password, user.password))){
                console.log('works')
                const accessToken = jwt.sign({
                        user:{
                                username: user.username,
                                email: user.email,
                                id: user.id,
                        },
                }, process.env.ACCESS_TOKEN_SECERT,
                {expiresIn: "15m"})
                res.status(200).json({accessToken})
        }else{
                res.status(401)
                throw new Error("email or password is not vaild")
        }
        res.json({message: "Login the user"})
});

//@des current  user info
//@route post /api/contacts
//@access private
const currentUser = expressAsyncHandler(async (req, res)=>{

        res.json(req.user)
});




module.exports = {registerUser, loginUser, currentUser}