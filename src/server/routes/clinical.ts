import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Clinical data endpoint' });
});

export const clinicalRoutes = router;
