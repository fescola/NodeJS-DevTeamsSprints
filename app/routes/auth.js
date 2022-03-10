const router = require("express").Router();
const User = require("../models/User");
const { registerValidation, loginValidation} = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  name: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

router.post("/register", async (req, res) => {
    const { error } = registerValidation(req.body);

    if(error){
        return res.status(400).json({error: error.details[0].message});
    }

    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist){
    return res.status(400).json({ error: "Email already exists" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password
    });
    try {
      const savedUser = await user.save();
      console.log(`new user saved: ${savedUser}`)
      res.json({ error: null, data: savedUser });
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  // login route
router.post("/login", async (req, res) => {
    // validate the user
    const { error } = loginValidation(req.body);
    // throw validation errors
    if (error) return res.status(400).json({ error:   error.details[0].message });
    const user = await User.findOne({ email: req.body.email });
    // throw error when email is wrong
    if (!user) return res.status(400).json({ error: "Email is wrong" });
    // check for password correctness
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
     return res.status(400).json({ error: "Password is wrong" });

    //create JWT
    const token = jwt.sign(
      {
        name:user.name,
        id:user.id,
      },
      process.env.TOKEN_SECRET
    );

    res.header("auth-token",token).json({
      error:null,
      data: {
        token,
      },
    });
    // res.json({
    //   error: null,
    //   data: {
    //     message: "Login successful",
    //   },
    // });
  });

module.exports = router;