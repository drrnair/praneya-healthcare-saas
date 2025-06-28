import { Request, Response } from 'express';

export const healthCheckHandler = (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Praneya Healthcare API'
  });
};
