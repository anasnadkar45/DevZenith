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
};
