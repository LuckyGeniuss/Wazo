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

interface LowStockItem {
  productId: string;
  productName: string;
  currentStock: number;
  imageUrl?: string;
}

interface LowStockAlertEmailProps {
  storeName: string;
  storeId: string;
  items: LowStockItem[];
  appUrl?: string;
}

export const LowStockAlertEmail = ({
  storeName,
  storeId,
  items,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
}: LowStockAlertEmailProps) => (
  <Html>
    <Head />
    <Preview>{`⚠️ ${items.length} items are running low!`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>⚠️ Low Stock Alert</Text>
          <Text style={paragraph}>
            Hello! The following items in your store <strong>{storeName}</strong> are running critically low on stock:
          </Text>

          <Hr style={hr} />

          {items.map((item) => (
            <Section key={item.productId} style={itemBox}>
              {item.imageUrl && (
                 
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  width="48"
                  height="48"
                  style={itemImage}
                />
              )}
              <div style={itemInfo}>
                <Text style={itemName}>{item.productName}</Text>
                <Text style={stockCount}>
                  Stock:{" "}
                  <span style={{ color: item.currentStock <= 2 ? "#ef4444" : "#f59e0b" }}>
                    {item.currentStock} pcs
                  </span>
                </Text>
              </div>
              <Link
                href={`₴{appUrl}/dashboard/${storeId}/products/${item.productId}`}
                style={restockLink}
              >
                Restock
              </Link>
            </Section>
          ))}

          <Hr style={hr} />

          <Button href={`₴{appUrl}/dashboard/${storeId}/inventory`} style={button}>
            Manage Inventory
          </Button>

          <Text style={footer}>
            This email was sent automatically by the inventory monitoring system.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default LowStockAlertEmail;

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

const itemBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  marginBottom: "8px",
  backgroundColor: "#fff9f0",
  borderRadius: "8px",
  border: "1px solid #fed7aa",
};

const itemImage = {
  width: "48px",
  height: "48px",
  objectFit: "cover" as const,
  borderRadius: "6px",
  flexShrink: 0,
};

const itemInfo = { flex: 1 };

const itemName = {
  color: "#171717",
  fontSize: "15px",
  fontWeight: "bold",
  margin: "0 0 4px",
};

const stockCount = {
  color: "#525252",
  fontSize: "13px",
  margin: "0",
};

const restockLink = {
  color: "#2250f4",
  fontSize: "13px",
  fontWeight: "bold",
  textDecoration: "none",
  whiteSpace: "nowrap" as const,
};

const button = {
  backgroundColor: "#f59e0b",
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

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "20px",
};
