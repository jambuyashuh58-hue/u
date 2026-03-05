// supplement.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    const supplements = await prisma.supplement.findMany({
      where: { weekNumber: { lte: user?.currentWeek || 1 } },
      orderBy: [{ timeOfDay: 'asc' }, { scheduledTime: 'asc' }],
    });
    res.json(supplements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get supplements' });
  }
});

router.post('/log', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { supplementId, skipped = false } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await prisma.supplementLog.upsert({
      where: {
        userId_supplementId_date: { userId: req.userId!, supplementId, date: today },
      },
      update: { takenAt: new Date(), skipped },
      create: { userId: req.userId!, supplementId, date: today, takenAt: new Date(), skipped },
    });
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log supplement' });
  }
});

router.get('/today', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logs = await prisma.supplementLog.findMany({
      where: { userId: req.userId!, date: today },
      include: { supplement: true },
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get today logs' });
  }
});

export default router;
