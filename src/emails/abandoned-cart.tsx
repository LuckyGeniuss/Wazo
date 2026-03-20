import { Html, Head, Body, Container, Text, Link, Preview, Section, Hr } from "@react-email/components";
import * as React from "react";

interface AbandonedCartEmailProps {
  customerName: string;
  storeName: string;
  storeSlug: string;
  cartItems: {
    name: string;
    quantity: number;
    price: string;
    imageUrl?: string;
  }[];
}

export const AbandonedCartEmail = ({ 
  customerName,
  storeName,
  storeSlug,
  cartItems,
}: AbandonedCartEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You left items in your cart - {storeName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>Did you forget something?</Text>
            <Text style={paragraph}>
              Hello, {customerName}!
            </Text>
            <Text style={paragraph}>
              We noticed you left some great items in your cart at <Link href={`${process.env.NEXT_PUBLIC_APP_URL || "https://wazo-market.vercel.app"}/${storeSlug}`} style={anchor}>{storeName}</Link>.
              They are still waiting for you!
            </Text>

            <Hr style={hr} />
            <Text style={subHeading}>Your cart:</Text>
            {cartItems.map((item, index) => (
              <div key={index} style={itemContainer}>
                {item.imageUrl && (
                   
                  <img src={item.imageUrl} alt={item.name} width="50" height="50" style={itemImage} />
                )}
                <div style={itemDetails}>
                  <Text style={itemText}>{item.name} x {item.quantity}</Text>
                  <Text style={itemText}>{item.price}</Text>
                </div>
              </div>
            ))}
            <Hr style={hr} />

            <Link href={`${process.env.NEXT_PUBLIC_APP_URL || "https://wazo-market.vercel.app"}/${storeSlug}/cart`} style={button}>
              Return to Cart
            </Link>

            <Text style={paragraph}>
              If you had any issues during checkout, please reply to this email, and we will be happy to help.
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
};

export default AbandonedCartEmail;

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

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#fff",
  display: "block",
  fontSize: "16px",
  fontWeight: "bold",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "100%",
  padding: "12px 20px",
  margin: "24px 0",
};