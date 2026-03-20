import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Section,
  Hr,
  Button,
} from "@react-email/components";
import * as React from "react";

interface OrderShippedEmailProps {
  orderId: string;
  customerName: string;
  storeName: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  orderItems: {
    name: string;
    quantity: number;
    price: string;
    imageUrl?: string;
  }[];
  storeSlug: string;
  appUrl?: string;
}

export const OrderShippedEmail = ({
  orderId,
  customerName,
  storeName,
  trackingNumber,
  estimatedDelivery,
  orderItems,
  storeSlug,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wazo-market.vercel.app",
}: OrderShippedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your order #{orderId.slice(0, 8).toUpperCase()} has been shipped!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>
            📦 Your order is on the way!
          </Text>
          <Text style={paragraph}>
            Hello, {customerName},
          </Text>
          <Text style={paragraph}>
            Great news! Your order #{orderId.slice(0, 8).toUpperCase()} from{" "}
            <Link href={`₴{appUrl}/${storeSlug}`} style={anchor}>
              {storeName}
            </Link>{" "}
            has been shipped and is on its way to you!
          </Text>

          {trackingNumber && (
            <Section style={trackingBox}>
              <Text style={trackingLabel}>Nova Poshta Tracking Number:</Text>
              <Link
                href={`https://novaposhta.ua/tracking/?cargo_number=${trackingNumber}`}
                style={trackingNumber_}
              >
                {trackingNumber}
              </Link>
              {estimatedDelivery && (
                <Text style={deliveryText}>
                  Estimated Delivery Date: <strong>{estimatedDelivery}</strong>
                </Text>
              )}
            </Section>
          )}

          <Hr style={hr} />
          <Text style={subHeading}>Order Summary:</Text>
          {orderItems.map((item, index) => (
            <div key={index} style={itemContainer}>
              {item.imageUrl && (
                 
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  width="50"
                  height="50"
                  style={itemImage}
                />
              )}
              <div style={itemDetails}>
                <Text style={itemText}>
                  {item.name} × {item.quantity}
                </Text>
                <Text style={itemText}>Price: {item.price}</Text>
              </div>
            </div>
          ))}
          <Hr style={hr} />

          <Button
            href={`₴{appUrl}/account`}
            style={button}
          >
            Track Order
          </Button>

          <Text style={paragraph}>
            Best regards,
            <br />
            {storeName} Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderShippedEmail;

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

const box = { padding: "0 48px" };

const hr = { borderColor: "#e6ebf1", margin: "20px 0" };

const heading = {
  color: "#171717",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
};

const paragraph = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = { color: "#2250f4", textDecoration: "none" };

const subHeading = {
  color: "#171717",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0",
};

const trackingBox = {
  backgroundColor: "#f0f7ff",
  borderRadius: "8px",
  padding: "16px",
  margin: "20px 0",
  borderLeft: "4px solid #2250f4",
};

const trackingLabel = {
  color: "#525252",
  fontSize: "14px",
  margin: "0 0 4px",
};

const trackingNumber_ = {
  color: "#2250f4",
  fontSize: "20px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "block",
  margin: "4px 0",
};

const deliveryText = {
  color: "#525252",
  fontSize: "14px",
  margin: "8px 0 0",
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

const itemDetails = { flex: "1" };

const itemText = {
  color: "#525252",
  fontSize: "14px",
  margin: "0",
  padding: "0",
};

const button = {
  backgroundColor: "#2250f4",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "20px 0",
};
