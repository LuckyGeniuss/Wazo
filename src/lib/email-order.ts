import { Resend } from 'resend';
import { OrderConfirmationBuyerEmail } from '@/emails/order-confirmation-buyer';
import { render } from '@react-email/render';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmailToBuyer({
  email,
  orderId,
  customerName,
  totalPrice,
  storeName,
}: {
  email: string;
  orderId: string;
  customerName: string;
  totalPrice: number;
  storeName: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is missing');
    return null;
  }

  try {
    const html = await render(
      OrderConfirmationBuyerEmail({
        orderId,
        customerName,
        totalPrice,
        storeName,
      })
    );

    const { data, error } = await resend.emails.send({
      from: 'Storefront <onboarding@resend.dev>', // Change to your verified domain later
      to: [email],
      subject: `Замовлення #${orderId.substring(0, 8)} підтверджено - ${storeName}`,
      html: html,
    });

    if (error) {
      console.error('Resend error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error sending buyer order confirmation email:', error);
    return null;
  }
}
