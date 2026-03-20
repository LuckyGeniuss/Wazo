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
} from "@react-email/components";
import * as React from "react";

interface ReturnConfirmationEmailProps {
  customerName: string;
  storeName: string;
  orderId: string;
  refundAmount: string;
  refundMethod: string;
  estimatedDays?: number;
  storeSlug: string;
  appUrl?: string;
}

export const ReturnConfirmationEmail = ({
  customerName,
  storeName,
  orderId,
  refundAmount,
  refundMethod,
  estimatedDays = 5,
  storeSlug,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
}: ReturnConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your return for order #{orderId.slice(0, 8).toUpperCase()} is confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>↩️ Return Confirmed</Text>
          <Text style={paragraph}>Hello, {customerName}!</Text>
          <Text style={paragraph}>
            Your return request for order #{orderId.slice(0, 8).toUpperCase()} from{" "}
            <Link href={`₴{appUrl}/${storeSlug}`} style={anchor}>
              {storeName}
            </Link>{" "}
            has been approved and processed.
          </Text>

          <Section style={infoBox}>
            <Text style={infoRow}>
              <strong>Refund Amount:</strong> {refundAmount}
            </Text>
            <Text style={infoRow}>
              <strong>Refund Method:</strong> {refundMethod}
            </Text>
            <Text style={infoRow}>
              <strong>Estimated Time:</strong> {estimatedDays} business days
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={paragraph}>
            If you have any questions regarding your return, please contact us via your{" "}
            <Link href={`₴{appUrl}/account`} style={anchor}>
              account
            </Link>
            .
          </Text>
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

export default ReturnConfirmationEmail;

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

const infoBox = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "20px 0",
  borderLeft: "4px solid #22c55e",
};

const infoRow = {
  color: "#525252",
  fontSize: "15px",
  margin: "8px 0",
  lineHeight: "22px",
};
