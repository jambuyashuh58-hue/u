import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/check-ins - Get user's check-ins
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    const where: any = { userId: req.userId };
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const checkIns = await prisma.dailyCheckIn.findMany({
      where,
      orderBy: { date: 'desc' },
      take: Number(limit),
    });

    res.json(checkIns);
  } catch (error) {
    console.error('Get check-ins error:', error);
    res.status(500).json({ error: 'Failed to get check-ins' });
  }
});

// GET /api/check-ins/today
router.get('/today', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn = await prisma.dailyCheckIn.findUnique({
      where: {
        userId_date: { userId: req.userId!, date: today },
      },
    });

    res.json(checkIn || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get check-in' });
  }
});

// POST /api/check-ins - Create or update today's check-in
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { energyLevel, mood, brainClarity, sleepHours, sleepQuality, notes,
      nutritionDone, supplementsDone, movementDone, mindfulnessDone } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn = await prisma.dailyCheckIn.upsert({
      where: {
        userId_date: { userId: req.userId!, date: today },
      },
      update: {
        energyLevel, mood, brainClarity, sleepHours, sleepQuality, notes,
        nutritionDone, supplementsDone, movementDone, mindfulnessDone,
      },
      create: {
        userId: req.userId!,
        date: today,
        energyLevel, mood, brainClarity, sleepHours, sleepQuality, notes,
        nutritionDone, supplementsDone, movementDone, mindfulnessDone,
      },
    });

    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayCheckIn = await prisma.dailyCheckIn.findUnique({
      where: {
        userId_date: { userId: req.userId!, date: yesterday },
      },
    });

    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    const newStreak = yesterdayCheckIn ? (user?.dailyStreak || 0) + 1 : 1;

    await prisma.user.update({
      where: { id: req.userId! },
      data: { dailyStreak: newStreak, lastActiveAt: new Date() },
    });

    res.json({ ...checkIn, streak: newStreak });
  } catch (error) {
    console.error('Create check-in error:', error);
    res.status(500).json({ error: 'Failed to save check-in' });
  }
});

// GET /api/check-ins/stats - Get check-in statistics
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const checkIns = await prisma.dailyCheckIn.findMany({
      where: {
        userId: req.userId!,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    const stats = {
      totalCheckIns: checkIns.length,
      avgEnergy: checkIns.length ? checkIns.reduce((sum, c) => sum + c.energyLevel, 0) / checkIns.length : 0,
      avgMood: checkIns.length ? checkIns.reduce((sum, c) => sum + c.mood, 0) / checkIns.length : 0,
      avgClarity: checkIns.length ? checkIns.reduce((sum, c) => sum + c.brainClarity, 0) / checkIns.length : 0,
      completionRate: checkIns.length ? checkIns.filter(c => c.nutritionDone && c.supplementsDone && c.movementDone && c.mindfulnessDone).length / checkIns.length : 0,
      trend: checkIns.map(c => ({
        date: c.date,
        energy: c.energyLevel,
        mood: c.mood,
        clarity: c.brainClarity,
      })),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
