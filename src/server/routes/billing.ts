import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Billing endpoint' });
});

export const billingRoutes = router;
