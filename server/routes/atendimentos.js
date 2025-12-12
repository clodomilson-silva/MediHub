import express from 'express';
import { authMiddleware, checkRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// TODO: Implementar rotas de atendimentos
router.get('/', checkRole('admin', 'medico'), async (req, res) => {
  res.json({ message: 'Rota de atendimentos - em desenvolvimento' });
});

export default router;
