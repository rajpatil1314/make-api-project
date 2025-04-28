
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usermodel = require('../models/userModel');
require('dotenv').config();

//  const  signup = async (req, res) => {
//   const { username, email, dateOfBirth, role, location, password, confirmPassword } = req.body;

//   if (password !== confirmPassword) {
//     return res.status(400).send('Passwords do not match');
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await usermodel.create({ username, email, dateOfBirth, role, location, password: hashedPassword });
//     res.status(201).send('User registered successfully');
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// const login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await usermodel.findOne({ username });
//     if (!user) return res.status(400).send('User not found');

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).send('Invalid credentials');

//     const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).send({ msg: 'Login successful', token });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };
const signup = async (req, res) => {
  const {username, email, role, location, password, confirmPassword} = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (req.body.role) {
    return res.status(400).json({ message: "role is not required" });
  }

  try {
    const isExistUser = await usermodel.findOne({ email });
    if (isExistUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (hash) {
        const user = await usermodel.create({ username, email, password: hash });
        const { password, ...rest } = user._doc;

        return res
          .status(201)
          .json({ message: "User created successfully", user: rest });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const isExistUser = await usermodel.findOne({ email });
    if (!isExistUser) {
      return res.status(400).json({ message: "please create account first " });
    }
    bcrypt.compare(password, isExistUser.password, (err, result)=> {
      if(err)
      {
        return res.status(400).json({message:err.message})
      }
      if(!result)
      {
        return res.status(400).json({message:"invalid password"})
      }

      const{password,...rest}=isExistUser._doc
      jwt.sign({ user:rest }, process.env.PRIVATEKEY ,   (err, token)=> {
        if(err)
          {
            return res.status(400).json({message:err.message})
          }
          if(!token)
          {
            return res.status(400).json({message:"token not created"})
          }

          console.log(token)
         res.cookie("verificationToken",token).status(200).json({message:"user login successfully ",user:rest})

      });
  });




    
  } catch (error) {
    res.status(400).json({message:error.message})
  }

 
}




const getAllUsers = async (req, res) => {
  try {
    const users = await usermodel.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await usermodel.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// const updateUser = async (req, res) => {
//   try {
//     await user.findByIdAndUpdate(req.params.id);
//     res.send('User updated successfully');
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };



const updateUser = async (req, res) => {
  try {
    const updatedUser = await usermodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).send('User not found');
    res.send('User updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send('User deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};


module.exports={
    signup,
    login,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}