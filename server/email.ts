// Email Service for Order Confirmations
// Supports Resend as primary provider, with fallback logging

interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  total: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  affiliateCode?: string;
}

interface StoreNotificationData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  total: string;
  itemCount: number;
  hasAffiliate: boolean;
  affiliateCode?: string;
}

// Check if email service is configured
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// Get store email configuration
function getStoreEmail(): string {
  return process.env.STORE_EMAIL || 'orders@tigonspray.com';
}

function getFromEmail(): string {
  return process.env.FROM_EMAIL || 'noreply@tigonspray.com';
}

// Send order confirmation to customer
export async function sendOrderConfirmation(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  const emailHtml = generateOrderConfirmationHtml(data);
  
  if (!isEmailConfigured()) {
    console.log('📧 [Email Service] Would send order confirmation to:', data.customerEmail);
    console.log('📧 [Email Service] Order ID:', data.orderId);
    console.log('📧 [Email Service] Email service not configured. Set RESEND_API_KEY to enable.');
    return { success: true }; // Return success so order flow continues
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `TIGON Spray <${getFromEmail()}>`,
        to: [data.customerEmail],
        subject: `Order Confirmation - #${data.orderId.slice(-8).toUpperCase()}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return { success: false, error: errorData.message || 'Failed to send email' };
    }

    console.log('📧 Order confirmation sent to:', data.customerEmail);
    return { success: true };
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

// Send notification to store owner
export async function sendStoreNotification(data: StoreNotificationData): Promise<{ success: boolean; error?: string }> {
  const emailHtml = generateStoreNotificationHtml(data);
  const storeEmail = getStoreEmail();
  
  if (!isEmailConfigured()) {
    console.log('📧 [Email Service] Would send store notification to:', storeEmail);
    console.log('📧 [Email Service] New order from:', data.customerEmail);
    return { success: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `TIGON Spray Orders <${getFromEmail()}>`,
        to: [storeEmail],
        subject: `New Order #${data.orderId.slice(-8).toUpperCase()} - $${data.total}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return { success: false, error: errorData.message };
    }

    console.log('📧 Store notification sent to:', storeEmail);
    return { success: true };
  } catch (error: any) {
    console.error('Store notification error:', error);
    return { success: false, error: error.message };
  }
}

// Generate order confirmation HTML
function generateOrderConfirmationHtml(data: OrderEmailData): string {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">TIGON Spray</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Premium Golf Cart Care</p>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: #d1fae5; color: #059669; padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 600;">
          ✓ Order Confirmed
        </div>
      </div>

      <h2 style="color: #111827; margin: 0 0 8px 0;">Thank you, ${data.customerName}!</h2>
      <p style="color: #6b7280; margin: 0 0 24px 0;">Your order has been received and is being processed.</p>

      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; color: #374151; font-size: 14px;">
          <strong>Order Number:</strong> #${data.orderId.slice(-8).toUpperCase()}
        </p>
      </div>

      <!-- Order Items -->
      <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 16px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 12px; text-align: left; font-size: 14px; color: #6b7280;">Item</th>
            <th style="padding: 12px; text-align: center; font-size: 14px; color: #6b7280;">Qty</th>
            <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px; font-weight: bold; color: #111827;">Total</td>
            <td style="padding: 12px; text-align: right; font-weight: bold; color: #059669; font-size: 18px;">$${data.total}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Shipping Address -->
      <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 16px;">Shipping Address</h3>
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; color: #374151; line-height: 1.6;">
          ${data.shippingAddress.name}<br>
          ${data.shippingAddress.address}<br>
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
        </p>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin: 0;">
        You'll receive a shipping confirmation email with tracking information once your order ships.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
        Questions? Contact us at support@tigonspray.com
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} TIGON Spray. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Generate store notification HTML
function generateStoreNotificationHtml(data: StoreNotificationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    
    <div style="background: #059669; padding: 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🛒 New Order Received!</h1>
    </div>

    <div style="padding: 32px;">
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 20px;">
          Order #${data.orderId.slice(-8).toUpperCase()}
        </h2>
        
        <table style="width: 100%;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Customer:</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 500;">${data.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Email:</td>
            <td style="padding: 8px 0; color: #111827;">${data.customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Items:</td>
            <td style="padding: 8px 0; color: #111827;">${data.itemCount} item(s)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Total:</td>
            <td style="padding: 8px 0; color: #059669; font-weight: bold; font-size: 18px;">$${data.total}</td>
          </tr>
          ${data.hasAffiliate ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Affiliate:</td>
            <td style="padding: 8px 0; color: #8b5cf6; font-weight: 500;">${data.affiliateCode}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
        View full order details in your admin dashboard.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export type { OrderEmailData, StoreNotificationData };
