const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, gender, dob, country } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, fullName, gender, dob, country });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    let userFound= await User.findOne({username:req.params.username}).select(-"password");
    if(!userFound) return res.status(400).json({message:"User not found"});

    res.json(userFound);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.UserSearchByRequestBody = async (req, res) => {
    try {
      const { email } = req.body; 
  
      if (!email) {
        return res.status(400).json({ message: "Please provide needed details" });
      }
  
  
      const userFound = await User.findOne({email}).select("-password"); 
  
      if (!userFound) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(userFound);
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  