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

interface ReviewRequestEmailProps {
  customerName: string;
  storeName: string;
  productName: string;
  productImageUrl?: string;
  productId: string;
  storeSlug: string;
  appUrl?: string;
}

export const ReviewRequestEmail = ({
  customerName,
  storeName,
  productName,
  productImageUrl,
  productId,
  storeSlug,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
}: ReviewRequestEmailProps) => {
  const reviewBase = `₴{appUrl}/${storeSlug}/product/${productId}?rating=`;

  return (
    <Html>
      <Head />
      <Preview>Понравился ли вам {productName}? Оставьте отзыв!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>⭐ Как вам покупка?</Text>
            <Text style={paragraph}>Здравствуйте, {customerName}!</Text>
            <Text style={paragraph}>
              Надеемся, вам понравился ваш заказ из магазина{" "}
              <Link href={`₴{appUrl}/${storeSlug}`} style={anchor}>
                {storeName}
              </Link>
              . Ваше мнение очень важно для нас и других покупателей!
            </Text>

            {productImageUrl && (
               
              <img
                src={productImageUrl}
                alt={productName}
                width="120"
                height="120"
                style={productImage}
              />
            )}
            <Text style={productNameStyle}>{productName}</Text>

            <Hr style={hr} />
            <Text style={ratingLabel}>Оцените товар:</Text>
            <div style={starsContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Link
                  key={rating}
                  href={`₴{reviewBase}${rating}`}
                  style={starButton}
                >
                  {"★".repeat(rating)}{"☆".repeat(5 - rating)} {rating}/5
                </Link>
              ))}
            </div>
            <Hr style={hr} />

            <Text style={paragraph}>
              С уважением,
              <br />
              Команда {storeName}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ReviewRequestEmail;

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

const productImage = {
  width: "120px",
  height: "120px",
  objectFit: "cover" as const,
  borderRadius: "12px",
  display: "block",
  margin: "20px auto",
};

const productNameStyle = {
  color: "#171717",
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "8px 0 20px",
};

const ratingLabel = {
  color: "#525252",
  fontSize: "16px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 12px",
};

const starsContainer = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
  margin: "0 auto",
  maxWidth: "200px",
};

const starButton = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  color: "#f59e0b",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "8px 16px",
  margin: "4px 0",
};
