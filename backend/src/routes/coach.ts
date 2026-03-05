import express from 'express';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, premiumRequired, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const COACH_SYSTEM_PROMPT = `You are an empathetic AI wellness coach for UltraMind brain health program. 
Be conversational, supportive, and provide actionable guidance on nutrition, supplements, stress, and mindfulness.
When suggesting actions, include JSON: {"type":"action","title":"...","description":"...","cta":"..."}`;

// GET /api/coach/messages
router.get('/messages', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.coachMessage.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// POST /api/coach/message
router.post('/message', authMiddleware, premiumRequired, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: 'Message content required' });
    }

    // Save user message
    const userMessage = await prisma.coachMessage.create({
      data: {
        userId: req.userId!,
        role: 'USER',
        content: content.trim(),
      },
    });

    // Get user context
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      include: { goals: true, challenges: true },
    });

    // Get recent check-ins for context
    const recentCheckIns = await prisma.dailyCheckIn.findMany({
      where: { userId: req.userId! },
      orderBy: { date: 'desc' },
      take: 7,
    });

    // Get conversation history
    const history = await prisma.coachMessage.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const contextPrompt = `
User: ${user?.name || 'User'}, Week ${user?.currentWeek || 1} of program
Goals: ${user?.goals.map(g => g.goal).join(', ') || 'Not set'}
Challenges: ${user?.challenges.map(c => c.challenge).join(', ') || 'Not set'}
Recent avg energy: ${recentCheckIns.length ? (recentCheckIns.reduce((s, c) => s + c.energyLevel, 0) / recentCheckIns.length).toFixed(1) : 'N/A'}
Streak: ${user?.dailyStreak || 0} days`;

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: COACH_SYSTEM_PROMPT + '\n\n' + contextPrompt },
        ...history.reverse().map(m => ({
          role: m.role.toLowerCase() as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantContent = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';

    // Parse any actions from the response
    let actions = null;
    const actionMatch = assistantContent.match(/\{[\s\S]*"type"\s*:\s*"action"[\s\S]*\}/g);
    if (actionMatch) {
      try {
        actions = actionMatch.map(a => JSON.parse(a));
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Save assistant message
    const assistantMessage = await prisma.coachMessage.create({
      data: {
        userId: req.userId!,
        role: 'ASSISTANT',
        content: assistantContent,
        actions,
      },
    });

    res.json({
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    console.error('Coach message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// DELETE /api/coach/messages - Clear conversation
router.delete('/messages', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.coachMessage.deleteMany({
      where: { userId: req.userId! },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear messages' });
  }
});

export default router;
