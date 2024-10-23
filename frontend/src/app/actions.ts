'use server'

import { getGlobal } from '@/utils/api-helpers';
const brevo = require('@getbrevo/brevo');

let apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');



export async function sendOrderConfirmation(email: string, cart: any[], subtotal: number, shipping: number, total: number) {
  const emailHtml = `
    <h1 style="color: black; margin: 0; padding: 0;">Oak Ridge Pioneer Hero Store - Order Confirmation</h1>
    <p style="color: black; margin: 0; padding: 0;">Thank you for your order!</p>
    <h2 style="color: green; margin: 0; padding: 0;">Order Details:</h2>
    <ul style="color: black; margin: 0; padding: 0 0 0 20px;">
      ${cart
        .map(
          (item: any) => `
        <li style="margin: 0; padding: 0;"><strong>${item.name}</strong> - Quantity: ${item.quantity} - Price: ${item.price * item.quantity} Points</li>
      `
        )
        .join("")}
    </ul>
    <p style="color: black; margin: 0; padding: 0;">Total: ${total} Points</p>
    <p style="color: black; margin: 0; padding: 0;">Expect to receive your order within 3-5 business days.</p>
    <p style="color: black; margin: 0; padding: 0;">For any questions, please email <a href="mailto:erin.mantor@ocps.net">erin.mantor@ocps.net</a></p>
  `;

  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: email }];
  sendSmtpEmail.sender = { email: "erin.mantor@ocps.net", name: "Oak Ridge Pioneer Hero Store" };
  sendSmtpEmail.subject = "Oak Ridge Pioneer Hero Store - Order Confirmation";
  sendSmtpEmail.htmlContent = emailHtml;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", data);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendOrderNotification(
  formData: any,
  cart: any[],
  total: number
) {
  console.log("sendOrderNotification called with formData:", formData);
  const { email, first_name, last_name } = formData;

  // Fetch the global config to get the email list
  const globalConfig = await getGlobal('en'); // Assuming 'en' for English, adjust if needed
  const notificationEmails = globalConfig.data.attributes.notificationEmails || [];

  const itemsList = cart.map((item: any) => 
    `<div style="margin: 0; padding: 0;"><strong>${item.name}</strong> - Quantity: ${item.quantity} - Price: ${item.price * item.quantity} Points</div>`
  )
  .join('');

  const emailContent = `
    <h1 style="color: black; margin: 0; padding: 0;">Oak Ridge Pioneer Hero Store - New Order Notification</h1>
    <h2 style="color: green; margin: 0; padding: 0;">Customer Details:</h2>
    <p style="color: black; margin: 0; padding: 0;">
    Name: ${first_name} ${last_name}<br>
    Email: ${email}
    </p>
    <h2 style="color: green; margin: 0; padding: 0;">Order Details:</h2>
    <div style="color: black; margin: 0; padding: 0;">
    ${itemsList}
    </div>
    <h2 style="color: green; margin: 0; padding: 0;">Total: ${total} Points</h2>
  <h2 style="color: green; margin: 0; padding: 0;">View Order Details:</h2>
  <p style="color: black; margin: 0; padding: 0;">
    To view and manage this order, please visit:
    <a href="https://school-store-production.up.railway.app/admin/content-manager/collection-types/api::order.order?page=1&pageSize=10&sort=createdAt:DESC">
      Order Management Dashboard
    </a>
  </p>
  `;

  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.to = notificationEmails.map((email: { email: string }) => ({ email: email.email }));
  sendSmtpEmail.sender = { email: "erin.mantor@ocps.net", name: "Oak Ridge Pioneer Hero Store" };
  sendSmtpEmail.subject = "Oak Ridge Pioneer Hero Store - New Order Notification";
  sendSmtpEmail.textContent = emailContent;

  try {
    console.log("Sending email to:", sendSmtpEmail.to);
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    // console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function createOrder(
  formData: {
    email: string;
    first_name: string;
    last_name: string;
    student_id: string;
    password: string;
    // ... other form fields ...
  },
  cart: any[],
  total: number
) {
  try {
    console.log("Creating order in Strapi");
    console.log("Form data:", formData);
    console.log("Cart:", cart);
    console.log("Total:", total);
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          email: formData.email,
          student_id: formData.student_id,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          total,
          cart_items: cart.map(item => ({
            id: item.id,
            quantity: item.quantity
          })),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Failed to create order in Strapi');
    }

    const data = await response.json();
    console.log("Order created successfully:", data);
    return data.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}