import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Family management endpoint' });
});

export const familyRoutes = router;
