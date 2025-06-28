import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Nutrition data endpoint' });
});

export const nutritionRoutes = router;
