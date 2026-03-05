import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { sessionType, durationMinutes, cyclesCompleted, binauralBeatsEnabled } = req.body;

    const session = await prisma.mindSession.create({
      data: {
        userId: req.userId!,
        sessionType: sessionType || 'BREATHING',
        durationMinutes: durationMinutes || 10,
        completedMinutes: durationMinutes || 10,
        cyclesCompleted: cyclesCompleted || 0,
        binauralBeatsEnabled: binauralBeatsEnabled ?? true,
        completedAt: new Date(),
      },
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save session' });
  }
});

router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const sessions = await prisma.mindSession.findMany({
      where: { userId: req.userId! },
    });

    const stats = {
      totalSessions: sessions.length,
      totalMinutes: sessions.reduce((sum, s) => sum + s.completedMinutes, 0),
      totalCycles: sessions.reduce((sum, s) => sum + s.cyclesCompleted, 0),
      avgDuration: sessions.length ? sessions.reduce((sum, s) => sum + s.completedMinutes, 0) / sessions.length : 0,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
