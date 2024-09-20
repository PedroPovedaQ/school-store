'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(email: string, cart: any[], subtotal: number, shipping: number, total: number) {
  const emailHtml = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order!</p>
    <h2>Order Details:</h2>
    <ul>
      ${cart
        .map(
          (item: any) => `
        <li><strong>${item.name}</strong> - Quantity: ${item.quantity} - Price: $${(
            item.price * item.quantity
          ).toFixed(2)}</li>
      `
        )
        .join("")}
    </ul>
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Shipping: $${shipping.toFixed(2)}</p>
    <p>Total: $${total.toFixed(2)}</p>
    <p>Expect to receive your order within 3-5 business days.</p>
    <p>For any questions, please email <a href="mailto:School.co@gmail.com">School.co@gmail.com</a></p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "School  <School.co@gmail.com>",
      to: email,
      bcc: "pedropovedaq@gmail.com",
      subject: "Order Confirmation - School ",
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error('Error sending email');
    }

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
  subtotal: number,
  shipping: number,
  total: number
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { email, first_name, last_name, company, address, apartment, city, state, zip_code } = formData;

  const itemsList = cart.map((item: any) => 
    `${item.name} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}`
  ).join('\n');

  const fullAddress = `${address}${apartment ? ', ' + apartment : ''}, ${city}, ${state} ${zip_code}`;

  const emailContent = `
    New Order Notification

    Customer Details:
    Name: ${first_name} ${last_name}
    Email: ${email}
    Company: ${company || 'N/A'}
    Address: ${fullAddress}

    Order Details:
    ${itemsList}

    Subtotal: $${subtotal.toFixed(2)}
    Shipping: $${shipping.toFixed(2)}
    Total: $${total.toFixed(2)}
  `;

  try {
    const data = await resend.emails.send({
      from: "School  <School.co@gmail.com>",
      to: ["pedropovedaq@gmail.com", "School.co@gmail.com"],
      subject: "New Order Notification",
      text: emailContent,
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}