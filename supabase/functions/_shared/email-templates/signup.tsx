/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Button, Hr } from 'npm:@react-email/components@0.0.22';

interface SignupEmailProps {
  siteName?: string;
  siteUrl?: string;
  confirmationUrl?: string;
  recipient?: string;
}

export default function SignupEmail({
  siteName = 'HostOnce Hub',
  siteUrl = 'https://host-once-hub.lovable.app',
  confirmationUrl = '',
  recipient = '',
}: SignupEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>🌐 {siteName}</Text>
          </Section>
          <Hr style={hr} />
          <Section style={contentSection}>
            <Text style={heading}>Confirm Your Email</Text>
            <Text style={paragraph}>
              Thanks for signing up for <strong>{siteName}</strong>! Please confirm your email address to get started.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={confirmationUrl}>
                Confirm Email
              </Button>
            </Section>
            <Text style={smallText}>
              If you didn't create an account, you can safely ignore this email.
            </Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>© {new Date().getFullYear()} {siteName}. All rights reserved.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px', maxWidth: '560px', borderRadius: '8px' };
const logoSection = { padding: '24px 32px 0' };
const logoText = { fontSize: '20px', fontWeight: '700' as const, color: 'hsl(150, 10%, 10%)', margin: '0' };
const contentSection = { padding: '0 32px' };
const heading = { fontSize: '24px', fontWeight: '700' as const, color: 'hsl(150, 10%, 10%)', margin: '24px 0 16px' };
const paragraph = { fontSize: '15px', lineHeight: '1.6', color: 'hsl(150, 5%, 45%)', margin: '0 0 16px' };
const buttonContainer = { textAlign: 'center' as const, margin: '24px 0' };
const button = { backgroundColor: 'hsl(82, 77%, 55%)', borderRadius: '8px', color: 'hsl(150, 10%, 10%)', fontSize: '15px', fontWeight: '600' as const, textDecoration: 'none', textAlign: 'center' as const, display: 'inline-block', padding: '12px 32px' };
const smallText = { fontSize: '13px', color: 'hsl(150, 5%, 55%)', margin: '16px 0 0' };
const hr = { borderColor: 'hsl(150, 10%, 90%)', margin: '24px 32px' };
const footer = { fontSize: '12px', color: 'hsl(150, 5%, 55%)', textAlign: 'center' as const, padding: '0 32px' };
