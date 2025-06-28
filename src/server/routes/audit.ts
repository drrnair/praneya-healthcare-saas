import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Audit logs endpoint' });
});

export const auditRoutes = router;
