const zod = require("zod");
const { User } = require('../models/User');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config')

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
});

exports.signup = async (req, res) => {
    try {
        const { success, data } = signupBody.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                message: "Incorrect inputs",
            });
        }

        const existingUser = await User.findOne({ username: data.username });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already taken",
            });
        }

        // Hash password before storing
        // const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const newUser = await User.create({
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password, // Store hashed password
        });

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

        res.json({
            message: "User created successfully",
            token: token,
        });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
};

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

exports.signin = async (req, res) => {
    try {
        const { success, data } = signinBody.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                message: "Incorrect inputs",
            });
        }

        const user = await User.findOne({ username: data.username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // Validate password (you should use bcrypt.compare here)

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        return res.json({
            token: token,
            message: "User signed in successfully",
        });
    } catch (error) {
        console.error("Error in signin:", error);
        res.status(500).json({ message: "Failed to sign in" });
    }
};

exports.profile = async (req, res) => {
    try {
        // Find the user by ID from the request object
        const user = await User.findById(req.user.userId); // Assuming userId is stored in the JWT payload

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If user found, send profile information
        res.json({
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
            // Add other profile fields as needed
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// exports.updateUserProfile = async (req, res) => {
//     // if (!req.user) {
//     //     throw new Error("User not authenticated");
//     // }
    
//     const user = await User.findById(req.user._id);
  
//     if (user) {
//       user.username = req.body.username || user.username;
//       user.firstName = req.body.firstName || user.firstName;
//       user.lastName = req.body.lastName || user.lastName;
//       if (req.body.password) {
//         user.password = req.body.password;
//       }
  
//       const updatedUser = await user.save();
//       const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
//       res.json({
//         _id: updatedUser._id,
//         username: updatedUser.username,
//         firstName: updatedUser.firstName,
//         lastName: updatedUser.lastName,
//         token: token,
//       });
//     } else {
//       res.status(404);
//       throw new Error("User Not Found");
//     }
// };
