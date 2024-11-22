const router = require('express').Router();
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authmiddleware');
const User = require('../models/user');

router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: 'Email já está em uso' });
            }
            user.email = email;
        }

        if (currentPassword && newPassword) {
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Senha atual incorreta' });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();
        user.password = undefined;
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar perfil' });
    }
});

module.exports = router;