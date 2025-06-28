import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Health profiles endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create health profile' });
});

export const healthProfileRoutes = router;
