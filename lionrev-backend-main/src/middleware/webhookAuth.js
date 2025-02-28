import { z } from 'zod';
import crypto from 'crypto';

// Function to verify Zapier signature
const verifyZapierSignature = (signature, body) => {
  const zapierSecret = process.env.ZAPIER_WEBHOOK_SECRET;
  if (!zapierSecret) {
    console.error('Zapier secret is not set');
    return false;
  }

  const expectedSignature = crypto.createHmac('sha256', zapierSecret).update(JSON.stringify({
    "email": body.email,
    "lead_id": body.lead_id,
    "phone_number": body.phone_number,
    "zip_code": body.zip_code,
    "service_interested": body.service_interested
  })).digest('hex');
  return signature === expectedSignature;
};

// Webhook signature validation
export const validateWebhookSignature = (req, res, next) => {
 const zapierSignature = req.headers['x-zapier-signature'];
  
  if (!zapierSignature) {
    return res.status(401).json({ error: 'Missing webhook signature' });
  }

  const isValid = verifyZapierSignature(zapierSignature, req.body);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  next();
};
