const { db } = require('../config/firebase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.cancelSubscription = async (req, res) => {
  try {
    // Get user from Firestore
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    console.log('🔍 cancelSubscription: user data', {
      email: userData.email,
      stripeSubscriptionId: userData.stripeSubscriptionId,
      stripeSubscriptionIdType: typeof userData.stripeSubscriptionId
    });

    if (!userData.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    // Extract subscription ID (handle both string and object shapes from older data)
    let subscriptionId = userData.stripeSubscriptionId;
    if (typeof subscriptionId === 'object' && subscriptionId !== null) {
      subscriptionId =
        subscriptionId.id ||
        subscriptionId.subscriptionId ||
        subscriptionId.subscription?.id ||
        null;
    }

    if (!subscriptionId || typeof subscriptionId !== 'string') {
      console.error('❌ cancelSubscription: invalid stripeSubscriptionId shape', {
        raw: userData.stripeSubscriptionId
      });
      return res.status(500).json({
        message: 'Invalid subscription ID stored for user'
      });
    }

    console.log('🔍 cancelSubscription: cancelling Stripe subscription', subscriptionId);

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    // Update user in Firestore
    await userRef.update({
      subscriptionStatus: 'cancelled',
      isPremium: false,
      stripeSubscriptionId: null,
      updatedAt: new Date()
    });

    res.json({ 
      success: true, 
      message: 'Subscription cancelled successfully',
      subscriptionStatus: 'cancelled'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      message: 'Error cancelling subscription',
      error: error.message 
    });
  }
}; 