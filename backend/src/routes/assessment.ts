import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const assessments = await prisma.assessment.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get assessments' });
  }
});

router.get('/baseline', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const baseline = await prisma.assessment.findFirst({
      where: { userId: req.userId!, assessmentType: 'BASELINE' },
    });
    res.json(baseline);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get baseline' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { assessmentType, nutritionScore, stressScore, sleepScore, exerciseScore, brainScore, fitnessScore, mindsetScore, answers } = req.body;

    const scores = [nutritionScore, stressScore, sleepScore, exerciseScore, brainScore, fitnessScore, mindsetScore].filter(Boolean);
    const overallScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

    const assessment = await prisma.assessment.create({
      data: {
        userId: req.userId!,
        assessmentType: assessmentType || 'WEEKLY',
        nutritionScore, stressScore, sleepScore, exerciseScore, brainScore, fitnessScore, mindsetScore,
        overallScore, answers,
      },
    });
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

router.get('/compare', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const [baseline, latest] = await Promise.all([
      prisma.assessment.findFirst({ where: { userId: req.userId!, assessmentType: 'BASELINE' } }),
      prisma.assessment.findFirst({ where: { userId: req.userId! }, orderBy: { createdAt: 'desc' } }),
    ]);

    if (!baseline || !latest) {
      return res.json({ baseline: null, latest: null, improvement: null });
    }

    const improvement = {
      nutrition: (latest.nutritionScore || 0) - (baseline.nutritionScore || 0),
      stress: (latest.stressScore || 0) - (baseline.stressScore || 0),
      sleep: (latest.sleepScore || 0) - (baseline.sleepScore || 0),
      exercise: (latest.exerciseScore || 0) - (baseline.exerciseScore || 0),
      brain: (latest.brainScore || 0) - (baseline.brainScore || 0),
      mindset: (latest.mindsetScore || 0) - (baseline.mindsetScore || 0),
      overall: (latest.overallScore || 0) - (baseline.overallScore || 0),
    };

    res.json({ baseline, latest, improvement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compare' });
  }
});

export default router;
