/**
 * Standard Email Dispatcher for Pet Shop Operations
 * This is a pluggable wrapper. By default, it logs to console for local dev.
 * In production, swap with Resend, SendGrid, or Postmark.
 */

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  // --- MOCK LOGIC FOR LOCAL DEV ---
  console.log('----------------------------------------------------');
  console.log(`[EMAIL DISPATCH] To: ${to}`);
  console.log(`[EMAIL DISPATCH] Subject: ${subject}`);
  console.log('[EMAIL DISPATCH] Content truncated for security...');
  console.log('----------------------------------------------------');

  // If RESEND_API_KEY is present, we could actually send it:
  // if (process.env.RESEND_API_KEY) {
  //   const res = await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
  //     },
  //     body: JSON.stringify({
  //       from: 'PetShop <notifications@petshop.com>',
  //       to, subject, html
  //     })
  //   });
  //   return res.ok;
  // }

  return true; 
}

export function generateOrderEmailTemplate(order: any) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; color: #333;">
      <h1 style="color: #FF6B00; text-align: center; font-size: 24px; margin-bottom: 30px;">Order Confirmed! 🐾</h1>
      <p style="font-size: 16px; margin-bottom: 20px;">Hi ${order.user?.name || 'there'},</p>
      <p style="font-size: 16px; margin-bottom: 30px; line-height: 1.6;">Your order <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> has been successfully placed. We're getting the treats ready!</p>
      
      <div style="background: #fdfdfd; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px dashed #ddd;">
        <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #666; letter-spacing: 1px;">Summary</h3>
        ${order.items.map((item: any) => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>${item.name} (x${item.quantity})</span>
            <strong>₹${(item.price * item.quantity).toLocaleString()}</strong>
          </div>
        `).join('')}
        <div style="height: 1px; background: #eee; margin: 15px 0;"></div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
          <span>Total Paid</span>
          <span style="color: #FF6B00;">₹${order.total.toLocaleString()}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 40px;">
          <a href="${process.env.NEXTAUTH_URL}/orders" style="background: #FF6B00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Track Mission Progress</a>
      </div>
      
      <p style="font-size: 12px; color: #999; text-align: center; margin-top: 50px;">
        Pet Shop & Logistics Platform. All Rights Reserved.
      </p>
    </div>
  `;
}
