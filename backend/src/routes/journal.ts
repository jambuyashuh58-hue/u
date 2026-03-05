import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get entries' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { entryType, trigger, emotion, intensity, cognitiveDistortion, reframedThought, content } = req.body;

    const entry = await prisma.journalEntry.create({
      data: {
        userId: req.userId!,
        entryType: entryType || 'GENERAL',
        trigger, emotion, intensity, cognitiveDistortion, reframedThought, content,
      },
    });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save entry' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.journalEntry.deleteMany({
      where: { id: req.params.id, userId: req.userId! },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

export default router;
