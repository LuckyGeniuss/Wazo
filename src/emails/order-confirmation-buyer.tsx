import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationBuyerEmailProps {
  orderId: string;
  customerName: string;
  totalPrice: number;
  storeName: string;
}

export const OrderConfirmationBuyerEmail = ({
  orderId,
  customerName,
  totalPrice,
  storeName,
}: OrderConfirmationBuyerEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Ваше замовлення в магазині {storeName} прийнято!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Дякуємо за замовлення!</Heading>
          <Text style={text}>Вітаємо, {customerName}!</Text>
          <Text style={text}>
            Ваше замовлення <strong>#{orderId}</strong> в магазині <strong>{storeName}</strong> було успішно прийнято та обробляється.
          </Text>
          <Section style={section}>
            <Text style={text}>
              <strong>Сума замовлення:</strong> ₴{totalPrice.toLocaleString('uk-UA')}
            </Text>
          </Section>
          <Text style={text}>
            Ви отримаєте ще один лист, коли замовлення буде відправлено.
          </Text>
          <Text style={footer}>
            З повагою,<br />
            Команда {storeName}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '24px',
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  margin: '24px 0',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  padding: '0 24px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 12px',
  padding: '0 24px',
};

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '24px 0 0',
  padding: '0 24px',
};

export default OrderConfirmationBuyerEmail;
