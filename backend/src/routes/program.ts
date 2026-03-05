import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/weeks', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    const weeks = await prisma.weekProgram.findMany({
      orderBy: { weekNumber: 'asc' },
    });

    const enrichedWeeks = weeks.map(week => ({
      ...week,
      status: week.weekNumber < (user?.currentWeek || 1) ? 'completed' 
        : week.weekNumber === (user?.currentWeek || 1) ? 'active' : 'locked',
    }));

    res.json(enrichedWeeks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get program' });
  }
});

router.get('/current', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    const week = await prisma.weekProgram.findUnique({
      where: { weekNumber: user?.currentWeek || 1 },
    });
    res.json({ week, currentWeek: user?.currentWeek || 1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get current week' });
  }
});

router.post('/advance', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if ((user?.currentWeek || 1) >= 6) {
      return res.status(400).json({ error: 'Already at final week' });
    }

    const updated = await prisma.user.update({
      where: { id: req.userId! },
      data: { currentWeek: (user?.currentWeek || 1) + 1 },
    });

    res.json({ currentWeek: updated.currentWeek });
  } catch (error) {
    res.status(500).json({ error: 'Failed to advance week' });
  }
});

export default router;
