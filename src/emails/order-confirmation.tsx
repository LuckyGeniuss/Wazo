import { Html, Head, Body, Container, Text, Link, Preview, Section, Hr } from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  storeName: string;
  totalPrice: string;
  orderItems: {
    name: string;
    quantity: number;
    price: string;
    imageUrl?: string;
  }[];
  storeSlug: string;
}

export const OrderConfirmationEmail = ({ 
  orderId,
  customerName,
  storeName,
  totalPrice,
  orderItems,
  storeSlug
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Order Confirmation from {storeName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Your order #{orderId.slice(0,8).toUpperCase()} is confirmed!</Text>
          <Text style={paragraph}>
            Hello, {customerName},
          </Text>
          <Text style={paragraph}>
            Thank you for your order at <Link href={`http://localhost:3000/${storeSlug}`} style={anchor}>{storeName}</Link>.
            Your order has been successfully received and will be processed shortly.
          </Text>

          <Hr style={hr} />
          <Text style={subHeading}>Order Details:</Text>
          {orderItems.map((item, index) => (
            <div key={index} style={itemContainer}>
              {item.imageUrl && (
                 
                <img src={item.imageUrl} alt={item.name} width="50" height="50" style={itemImage} />
              )}
              <div style={itemDetails}>
                <Text style={itemText}>{item.name} x {item.quantity}</Text>
                <Text style={itemText}>Price: {item.price}</Text>
              </div>
            </div>
          ))}
          <Hr style={hr} />
          <Text style={{ ...paragraph, fontSize: '18px', fontWeight: 'bold' }}>
            Total: {totalPrice}
          </Text>
          <Hr style={hr} />

          <Text style={paragraph}>
            You can track your order status by logging into your <Link href="http://localhost:3000/account" style={anchor}>account</Link>.
          </Text>
          <Text style={paragraph}>
            If you have any questions, please contact us.
          </Text>
          <Text style={paragraph}>
            Best regards,<br />
            {storeName} Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const heading = {
  color: "#171717",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const paragraph = {
  color: "#525252",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#2250f4",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "16px",
  textDecoration: "none",
};

const subHeading = {
  color: "#171717",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: "20px",
  fontWeight: "bold",
  margin: "20px 0",
  padding: "0",
};

const itemContainer = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
};

const itemImage = {
  width: "50px",
  height: "50px",
  objectFit: "cover" as const,
  marginRight: "15px",
  borderRadius: "8px",
};

const itemDetails = {
  flex: "1",
};

const itemText = {
  color: "#525252",
  fontSize: "14px",
  margin: "0",
  padding: "0",
};
