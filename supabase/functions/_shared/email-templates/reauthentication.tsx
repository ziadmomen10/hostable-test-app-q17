/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Hr, CodeInline } from 'npm:@react-email/components@0.0.22';

interface ReauthenticationEmailProps {
  siteName?: string;
  siteUrl?: string;
  token?: string;
  recipient?: string;
}

export default function ReauthenticationEmail({
  siteName = 'HostOnce Hub',
  siteUrl = 'https://host-once-hub.lovable.app',
  token = '',
  recipient = '',
}: ReauthenticationEmailProps) {
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
            <Text style={heading}>Verification Code</Text>
            <Text style={paragraph}>
              Enter this verification code to confirm your identity on <strong>{siteName}</strong>:
            </Text>
            <Section style={codeContainer}>
              <Text style={codeText}>{token}</Text>
            </Section>
            <Text style={smallText}>
              This code expires in 10 minutes. If you didn't request this, please secure your account.
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
const codeContainer = { textAlign: 'center' as const, margin: '24px 0', backgroundColor: '#f4f4f5', borderRadius: '8px', padding: '16px' };
const codeText = { fontSize: '32px', fontWeight: '700' as const, color: 'hsl(150, 10%, 10%)', letterSpacing: '4px', margin: '0' };
const smallText = { fontSize: '13px', color: 'hsl(150, 5%, 55%)', margin: '16px 0 0' };
const hr = { borderColor: 'hsl(150, 10%, 90%)', margin: '24px 32px' };
const footer = { fontSize: '12px', color: 'hsl(150, 5%, 55%)', textAlign: 'center' as const, padding: '0 32px' };
