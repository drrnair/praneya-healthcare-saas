import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Emergency access endpoint' });
});

export const emergencyRoutes = router;
