const router = require('express').Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require("../middleware/auth");

router.post("/register", async (req,res) => {
   try{
       const {email, password, passwordCheck, userName} = req.body;

   if(!email || !password || !userName){
       return res.status(400).json({msg: "Not all required fields have been entered"});
   }
   if(password.length < 5){
    return res.status(400).json({msg: "Minimum password length: 5 characters"});
   }
   if(password !== passwordCheck){
    return res.status(400).json({msg: "Passwords do not match"});
   }

   const existingUser = await User.findOne({email: email});
   if(existingUser){
    return res.status(400).json({msg: "Email ID already registered"});
   }

   const existingUserName = await User.findOne({userName: userName});
   if(existingUserName){
    return res.status(400).json({msg: "Username already exists"});
   }

   const salt = await bcrypt.genSalt();
   const passHash = await bcrypt.hash(password, salt);

   const newUser = new User({
       email,
       password: passHash,
       userName
   })

   const savedUser = await newUser.save();
   res.json(savedUser);

}
   catch(err){
       res.status(500).json({error: err.message});
   }
});

router.post("/login", async (req,res) => {
    try {
        
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({msg: "Not all required fields have been entered"});
        }

        const user = await User.findOne({email: email});

        if(!user){
            return res.status(400).json({msg: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({msg: "Incorrect Password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_TOKEN);
        res.json({
            token,
            user:{
                id: user._id,
                email: user.email,
                userName: user.userName
            }
        });

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.delete("/delete",auth, async (req,res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

router.post("/tokenCheck", async (req, res) =>{
    try{
        const token = req.header("x-auth-token");
        if(!token){
        return res.json(false);
        }

        const verifiedToken = jwt.verify(token,process.env.JWT_TOKEN);
         if(!verifiedToken){
        return res.json(false);
        }

        const user = await User.findById(verifiedToken.id);
        if(!user){
            return res.json(false);
        }
        return res.json(true);


    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
})

router.get("/", auth, async (req, res) => {
    const user  = await User.findById(req.user);
    res.json({
        userName: user.userName,
        email: user.email,
        id: user._id
    });

})




module.exports = router;  