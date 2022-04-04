const router = require("express").Router();
const { registerValidation, loginValidation } = require("../auth/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require('../models/sqlDB')
    // validation
const Joi = require("joi");
const schema = Joi.object({
    nom: Joi.string().min(4).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
});

router.post("/register", async(req, res) => {
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    try {
        let params = req.body
        params.password = password
        params.data = Date.now()
        if (params.nom == '' || params.nom == undefined) {
            res.status(400).json({ error: 'No username' })
            return
        }
        if (await db.Jugador.findOne({ where: { nom: params.nom } })) {
            res.status(400).json({ msg: 'Username ' + params.nom + ' is already taken' })
            return
        } else {
            await db.Jugador.create(params)
            res.status(200).json({ msg: 'Player created' })
        }
        res.json({ error: null, data: params });
    } catch (error) {
        res.status(400).json({ error });
    }
});

// login route
// Sending email and proper password we get our token back
router.post("/login", async(req, res) => {
    // validate the user
    try {
        const { error } = loginValidation(req.body);
        // throw validation errors
        if (error) return res.status(400).json({ error: error.details[0].message });
        const user = await db.Jugador.findOne({ where: { nom: req.body.nom } });

        // throw error when email is wrong
        if (!user) return res.status(400).json({ error: "Username is wrong" });
        // check for password correctness
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(400).json({ error: "Password is wrong" });

        //create JWT
        const token = jwt.sign({
                nom: user.nom,
                id: user.id,
            },
            process.env.TOKEN_SECRET
        );
        res.header("auth-token", token).json({
            jwt: token,
            nom: req.body.nom
        });
    } catch (e) { console.log(e); }
});

module.exports = router;