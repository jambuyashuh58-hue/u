import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// PUT /api/user/profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId! },
      data: { name, avatarUrl },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/user/onboarding
router.post('/onboarding', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { goals, challenges, baselineScores } = req.body;

    if (goals?.length) {
      await prisma.userGoal.deleteMany({ where: { userId: req.userId! } });
      await prisma.userGoal.createMany({
        data: goals.map((goal: string, i: number) => ({
          userId: req.userId!, goal, isPrimary: i === 0,
        })),
      });
    }

    if (challenges?.length) {
      await prisma.userChallenge.deleteMany({ where: { userId: req.userId! } });
      await prisma.userChallenge.createMany({
        data: challenges.map((c: string) => ({ userId: req.userId!, challenge: c })),
      });
    }

    if (baselineScores) {
      await prisma.assessment.create({
        data: {
          userId: req.userId!,
          assessmentType: 'BASELINE',
          ...baselineScores,
          overallScore: Object.values(baselineScores).reduce((a: number, b: any) => a + b, 0) / Object.keys(baselineScores).length,
        },
      });
    }

    await prisma.user.update({
      where: { id: req.userId! },
      data: { onboardingCompleted: true, currentWeek: 1 },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Failed to save onboarding' });
  }
});

// GET /api/user/progress
router.get('/progress', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
    });

    const [checkIns, sessions, supplements] = await Promise.all([
      prisma.dailyCheckIn.count({ where: { userId: req.userId! } }),
      prisma.mindSession.count({ where: { userId: req.userId! } }),
      prisma.supplementLog.count({ where: { userId: req.userId! } }),
    ]);

    res.json({
      currentWeek: user?.currentWeek || 1,
      dailyStreak: user?.dailyStreak || 0,
      totalCheckIns: checkIns,
      totalSessions: sessions,
      totalSupplements: supplements,
      programProgress: ((user?.currentWeek || 1) / 6) * 100,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

export default router;
