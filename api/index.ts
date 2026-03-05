import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

// Prisma singleton for serverless
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Auth middleware
const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ultramind-default-secret') as any;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'UltraMind API is running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, name: name || '' },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'ultramind-default-secret', { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account', details: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    await prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'ultramind-default-secret', { expiresIn: '30d' });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        subscriptionStatus: user.subscriptionStatus,
        currentWeek: user.currentWeek,
        dailyStreak: user.dailyStreak
      } 
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { goals: true, challenges: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      subscriptionStatus: user.subscriptionStatus, 
      currentWeek: user.currentWeek, 
      dailyStreak: user.dailyStreak,
      onboardingCompleted: user.onboardingCompleted
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user', details: error.message });
  }
});

// Check-in Routes
app.get('/api/check-ins/today', authMiddleware, async (req: any, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = await prisma.dailyCheckIn.findFirst({
      where: { userId: req.userId, date: { gte: today } },
    });
    res.json(checkIn);
  } catch (error: any) {
    console.error('Get check-in error:', error);
    res.status(500).json({ error: 'Failed to get check-in', details: error.message });
  }
});

app.post('/api/check-ins', authMiddleware, async (req: any, res) => {
  try {
    const { energyLevel, moodLevel, clarityLevel, sleepHours, sleepQuality, completedNutrition, completedSupplements, completedMovement, completedMindfulness, notes } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn = await prisma.dailyCheckIn.upsert({
      where: { userId_date: { userId: req.userId, date: today } },
      update: { energyLevel, moodLevel, clarityLevel, sleepHours, sleepQuality, completedNutrition, completedSupplements, completedMovement, completedMindfulness, notes },
      create: { userId: req.userId, date: today, energyLevel, moodLevel, clarityLevel, sleepHours, sleepQuality, completedNutrition, completedSupplements, completedMovement, completedMindfulness, notes },
    });

    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayCheckIn = await prisma.dailyCheckIn.findFirst({
      where: { userId: req.userId, date: { gte: yesterday, lt: today } },
    });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const newStreak = yesterdayCheckIn ? (user?.dailyStreak || 0) + 1 : 1;
    await prisma.user.update({ where: { id: req.userId }, data: { dailyStreak: newStreak } });

    res.json(checkIn);
  } catch (error: any) {
    console.error('Save check-in error:', error);
    res.status(500).json({ error: 'Failed to save check-in', details: error.message });
  }
});

app.get('/api/check-ins/stats', authMiddleware, async (req: any, res) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const checkIns = await prisma.dailyCheckIn.findMany({
      where: { userId: req.userId, date: { gte: startDate } },
      orderBy: { date: 'asc' },
    });

    const avgEnergy = checkIns.length ? checkIns.reduce((sum, c) => sum + c.energyLevel, 0) / checkIns.length : 0;
    const avgMood = checkIns.length ? checkIns.reduce((sum, c) => sum + c.moodLevel, 0) / checkIns.length : 0;
    const avgClarity = checkIns.length ? checkIns.reduce((sum, c) => sum + c.clarityLevel, 0) / checkIns.length : 0;

    res.json({ avgEnergy, avgMood, avgClarity, totalCheckIns: checkIns.length, checkIns });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats', details: error.message });
  }
});

// User Routes
app.post('/api/user/onboarding', authMiddleware, async (req: any, res) => {
  try {
    const { primaryGoal, challenges, assessmentScores } = req.body;

    if (primaryGoal) {
      await prisma.userGoal.create({ data: { userId: req.userId, goalType: primaryGoal, isPrimary: true } });
    }

    if (challenges?.length) {
      await prisma.userChallenge.createMany({
        data: challenges.map((c: any) => ({ userId: req.userId, challengeType: c.type, severity: c.severity || 5 })),
      });
    }

    if (assessmentScores) {
      await prisma.assessment.create({
        data: { userId: req.userId, assessmentType: 'BASELINE', ...assessmentScores },
      });
    }

    await prisma.user.update({ where: { id: req.userId }, data: { onboardingCompleted: true, currentWeek: 1 } });
    res.json({ success: true });
  } catch (error: any) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Failed to save onboarding', details: error.message });
  }
});

app.get('/api/user/progress', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const checkInCount = await prisma.dailyCheckIn.count({ where: { userId: req.userId } });
    const sessionCount = await prisma.mindSession.count({ where: { userId: req.userId } });

    res.json({
      currentWeek: user?.currentWeek || 1,
      dailyStreak: user?.dailyStreak || 0,
      checkInCount,
      sessionCount,
      programProgress: ((user?.currentWeek || 1) / 6) * 100,
    });
  } catch (error: any) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress', details: error.message });
  }
});

// Mind Session Routes
app.post('/api/mind-sessions', authMiddleware, async (req: any, res) => {
  try {
    const { sessionType, durationMinutes, cyclesCompleted, binauralBeatsEnabled } = req.body;
    const session = await prisma.mindSession.create({
      data: { 
        userId: req.userId, 
        sessionType: sessionType || 'BREATHING', 
        durationMinutes: durationMinutes || 10, 
        completedMinutes: durationMinutes || 10, 
        cyclesCompleted: cyclesCompleted || 0, 
        binauralBeatsEnabled: binauralBeatsEnabled ?? true, 
        completedAt: new Date() 
      },
    });
    res.json(session);
  } catch (error: any) {
    console.error('Save session error:', error);
    res.status(500).json({ error: 'Failed to save session', details: error.message });
  }
});

// Supplements Routes
app.get('/api/supplements', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const supplements = await prisma.supplement.findMany({
      where: { weekNumber: { lte: user?.currentWeek || 1 } },
      orderBy: [{ timeOfDay: 'asc' }, { scheduledTime: 'asc' }],
    });
    res.json(supplements);
  } catch (error: any) {
    console.error('Get supplements error:', error);
    res.status(500).json({ error: 'Failed to get supplements', details: error.message });
  }
});

app.post('/api/supplements/log', authMiddleware, async (req: any, res) => {
  try {
    const { supplementId, skipped } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await prisma.supplementLog.upsert({
      where: { userId_supplementId_date: { userId: req.userId, supplementId, date: today } },
      update: { takenAt: new Date(), skipped: skipped || false },
      create: { userId: req.userId, supplementId, date: today, takenAt: new Date(), skipped: skipped || false },
    });
    res.json(log);
  } catch (error: any) {
    console.error('Log supplement error:', error);
    res.status(500).json({ error: 'Failed to log supplement', details: error.message });
  }
});

// Journal Routes
app.post('/api/journal', authMiddleware, async (req: any, res) => {
  try {
    const { entryType, trigger, emotion, intensity, cognitiveDistortion, reframedThought, content } = req.body;
    const entry = await prisma.journalEntry.create({
      data: { userId: req.userId, entryType: entryType || 'GENERAL', trigger, emotion, intensity, cognitiveDistortion, reframedThought, content },
    });
    res.json(entry);
  } catch (error: any) {
    console.error('Save journal error:', error);
    res.status(500).json({ error: 'Failed to save entry', details: error.message });
  }
});

app.get('/api/journal', authMiddleware, async (req: any, res) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(entries);
  } catch (error: any) {
    console.error('Get journal error:', error);
    res.status(500).json({ error: 'Failed to get entries', details: error.message });
  }
});

// Program Routes
app.get('/api/program/weeks', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const weeks = await prisma.weekProgram.findMany({ orderBy: { weekNumber: 'asc' } });

    const enrichedWeeks = weeks.map(week => ({
      ...week,
      status: week.weekNumber < (user?.currentWeek || 1) ? 'completed' : week.weekNumber === (user?.currentWeek || 1) ? 'active' : 'locked',
    }));
    res.json(enrichedWeeks);
  } catch (error: any) {
    console.error('Get program error:', error);
    res.status(500).json({ error: 'Failed to get program', details: error.message });
  }
});

app.get('/api/program/current', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const week = await prisma.weekProgram.findUnique({ where: { weekNumber: user?.currentWeek || 1 } });
    res.json({ week, currentWeek: user?.currentWeek || 1 });
  } catch (error: any) {
    console.error('Get current week error:', error);
    res.status(500).json({ error: 'Failed to get current week', details: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Export for Vercel
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
