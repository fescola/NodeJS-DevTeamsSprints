const router = require("express").Router();
const User = require("../models/User");
const { registerValidation } = require("../validation");

// validation
const Joi = require("@hapi/joi");
const schema = Joi.object({
  name: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

router.post("/register", async (req, res) => {
    const { error } = schema.validate(req.body);

    if(error){
        return res.status(400).json({error: error.details[0].message});
    }
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist){
    return res.status(400).json({ error: "Email already exists" });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    try {
      const savedUser = await user.save();
      res.json({ error: null, data: savedUser });
    } catch (error) {
      res.status(400).json({ error });
    }
  });

module.exports = router;