import express from 'express';
import { authMiddleware, checkRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// TODO: Implementar rotas de receitas
router.get('/', checkRole('admin', 'medico'), async (req, res) => {
  res.json({ message: 'Rota de receitas - em desenvolvimento' });
});

export default router;
