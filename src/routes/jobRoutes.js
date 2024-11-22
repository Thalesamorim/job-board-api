const router = require('express').Router();
const authMiddleware = require('../middleware/authmiddleware');
const Job = require('../models/job');

// Listar todas as vagas
router.get('/', authMiddleware, async (req, res) => {
    try {
        const jobs = await Job.find().sort('-createdAt');
        res.json(jobs);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao buscar vagas' });
    }
});

// Buscar uma vaga específica
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Vaga não encontrada' });
        }
        res.json(job);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao buscar vaga' });
    }
});

// Criar uma nova vaga
router.post('/', authMiddleware, async (req, res) => {
    try {
        const job = await Job.create({ ...req.body });
        res.json(job);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar vaga' });
    }
});

// Atualizar uma vaga
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        res.json(job);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar vaga' });
    }
});

// Deletar uma vaga
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vaga deletada com sucesso' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao deletar vaga' });
    }
});

module.exports = router;