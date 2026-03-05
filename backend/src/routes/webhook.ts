import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/webhooks/revenuecat
router.post('/revenuecat', async (req, res) => {
  try {
    const { event } = req.body;
    const { app_user_id, type, product_id, expiration_at_ms } = event || {};

    if (!app_user_id || !type) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ revenueCatId: app_user_id }, { id: app_user_id }] },
    });

    if (!user) {
      console.log('User not found for RevenueCat webhook:', app_user_id);
      return res.status(200).json({ received: true });
    }

    let subscriptionStatus = 'FREE';
    let subscriptionPlan = null;
    let subscriptionExpires = null;

    if (type === 'INITIAL_PURCHASE' || type === 'RENEWAL' || type === 'PRODUCT_CHANGE') {
      if (product_id?.includes('monthly')) subscriptionStatus = 'MONTHLY';
      else if (product_id?.includes('quarterly')) subscriptionStatus = 'QUARTERLY';
      else if (product_id?.includes('yearly')) subscriptionStatus = 'YEARLY';
      
      subscriptionPlan = product_id;
      subscriptionExpires = expiration_at_ms ? new Date(expiration_at_ms) : null;
    } else if (type === 'EXPIRATION' || type === 'CANCELLATION') {
      subscriptionStatus = 'EXPIRED';
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: subscriptionStatus as any, subscriptionPlan, subscriptionExpires },
    });

    console.log(`Updated subscription for ${user.email}: ${subscriptionStatus}`);
    res.json({ received: true });
  } catch (error) {
    console.error('RevenueCat webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
