const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        });

        user.password = undefined;
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: 'Erro no registro' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Senha inválida' });
        }

        user.password = undefined;
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: 'Erro no login' });
    }
});

module.exports = router;