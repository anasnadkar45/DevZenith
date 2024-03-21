const express = require('express');
const zod = require("zod");
const { User , Account, Resource } = require('../db');
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require('../config')
const {authMiddleware} = require('../middleware')
const router = express.Router();



// Adding new user to DB
const signupBody = zod.object({
    username: zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string(),
})

router.post('/signup', async(req, res) => {
    const {success} = signupBody.safeParse(req.body);
    
    if(!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if(existingUser){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const newUser = await User.create({
        username : req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    })

    const userId = newUser._id;

    console.log('JWT_SECRET:', JWT_SECRET);

    const token = jwt.sign({
        userId
    },JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
    password : zod.string(),
})

router.post('/signin', async (req, res) => {
    const {success} = signinBody.safeParse(req.body);

    if(!success) {
        res.status(411).json({
            message:'Error while logging in'
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        return res.json({
            token: token,
            message : console.log(token)
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

router.put('/', authMiddleware , async(req,res) => {
    const {success} = updateBody.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    })
})

router.get('/user-profile', authMiddleware, async (req, res) => {
    try {
        // Find the user by ID retrieved from the token
        const user = await User.findById(req.userId);
        console.log(user);
        
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Exclude sensitive data like password before sending the response
        const userProfile = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            // Add more fields as needed
        };

        res.json(userProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// router.post('/addresource', async (req, res) => {
//     try {
//         const newResource = await Resource.create({
//             name: req.body.name,
//             url: req.body.url,
//         })
//         if (newResource) {
//             console.log(newResource)
//         } else {
//             console.log("something went wrong")
//         }
//         return res.status(200).json({
//             message: "Resource added successfully",
//         })
//     } catch (err) {
//         console.error(err)
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         })
//     }
// })
module.exports = router;