import {
   Body,
   Container,
   Head,
   Heading,
   Html,
   Preview,
   Section,
   Text,
} from "@react-email/components";

interface OTPCodeTemplateProps {
   otpCode: string;
   userEmail: string;
   organizationName: string;
}

export default function OTPCodeTemplate({
   otpCode,
   userEmail,
   organizationName,
}: OTPCodeTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>Código de verificación - Virtualis Congress</title>
         </Head>
         <Preview>Tu código de verificación para Virtualis Congress</Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header */}
               <Section style={headerStyle}>
                  <Heading style={brandTitleStyle}>Virtualis Congress</Heading>
                  <Text style={headerSubtitleStyle}>
                     Tu plataforma de congresos profesionales
                  </Text>
               </Section>

               {/* Main Content */}
               <Section style={contentStyle}>
                  <Heading style={messageTitleStyle}>
                     Código de verificación
                  </Heading>
                  <Text style={descriptionStyle}>
                     Has solicitado un código de verificación para acceder a tu
                     cuenta de{" "}
                     <span style={platformNameStyle}>Virtualis Congress</span>.
                     Utiliza el siguiente código para completar el proceso de
                     verificación.
                  </Text>

                  {/* OTP Code Section */}
                  <Section style={otpContainerStyle}>
                     <Heading style={otpTitleStyle}>
                        Tu código de verificación
                     </Heading>
                     <Text style={otpCodeStyle}>{otpCode}</Text>
                     <Text style={otpInfoStyle}>
                        Este código expirará en 15 minutos.
                     </Text>
                  </Section>

                  <Text style={descriptionStyle}>
                     Si no solicitaste este código, por favor ignora este correo
                     o contacta a nuestro equipo de soporte.
                  </Text>

                  {/* Security Notice */}
                  <Section style={securityNoticeStyle}>
                     <Text style={securityTitleStyle}>
                        Información de seguridad:
                     </Text>
                     <Text style={securityTextStyle}>
                        Este código fue solicitado para la cuenta{" "}
                        <span style={emailAccountStyle}>{userEmail}</span>.
                        Nunca compartas este código con nadie, incluyendo
                        personal de{" "}
                        <span style={platformNameStyle}>
                           Virtualis Congress
                        </span>
                        .
                     </Text>
                  </Section>
               </Section>

               {/* Footer */}
               <Section style={footerStyle}>
                  <Text style={footerTextStyle}>
                     Este correo fue enviado por{" "}
                     <span style={footerLinkStyle}>{organizationName}</span>
                  </Text>
                  <Text style={footerTextStyle}>
                     Impulsado por <strong>Virtualis</strong> Congress
                  </Text>
                  <Text
                     style={{
                        ...footerTextStyle,
                        ...footerItalicStyle,
                     }}
                  >
                     Este es un correo automático. Por favor no respondas a este
                     mensaje.
                  </Text>
               </Section>
            </Container>
         </Body>
      </Html>
   );
}

// Styles matching the original HTML template
const bodyStyle = {
   fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
   lineHeight: "1.6",
   color: "#374151",
   backgroundColor: "#f9fafb",
   margin: 0,
   padding: 0,
};

const containerStyle = {
   maxWidth: "600px",
   margin: "0 auto",
   backgroundColor: "#ffffff",
   boxShadow: "0 10px 25px rgba(55, 65, 81, 0.1)",
   borderRadius: "16px",
   overflow: "hidden",
};

const headerStyle = {
   background: "linear-gradient(135deg, #374151 0%, #4b5563 100%)",
   padding: "40px 30px",
   textAlign: "center" as const,
};

const brandTitleStyle = {
   color: "#ffffff",
   fontSize: "28px",
   fontWeight: "700",
   marginBottom: "8px",
   letterSpacing: "-0.5px",
   margin: "0 0 8px 0",
};

const headerSubtitleStyle = {
   color: "#e5e7eb",
   fontWeight: "500",
   fontSize: "16px",
   opacity: "0.9",
   margin: 0,
};

const contentStyle = {
   padding: "50px 40px",
};

const messageTitleStyle = {
   fontSize: "28px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "20px",
   textAlign: "center" as const,
   letterSpacing: "-0.5px",
   margin: "0 0 20px 0",
};

const descriptionStyle = {
   fontSize: "16px",
   color: "#4b5563",
   marginBottom: "40px",
   textAlign: "center" as const,
   lineHeight: "1.7",
   fontWeight: "500",
};

const otpContainerStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #f3f4f6 100%)",
   borderRadius: "16px",
   padding: "32px 24px",
   marginBottom: "40px",
   textAlign: "center" as const,
   border: "2px solid #3b82f6",
};

const otpTitleStyle = {
   fontSize: "20px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "20px",
   margin: "0 0 20px 0",
};

const otpCodeStyle = {
   fontFamily:
      "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
   fontSize: "36px",
   fontWeight: "800",
   letterSpacing: "6px",
   color: "#1d4ed8",
   background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
   padding: "20px 32px",
   borderRadius: "12px",
   border: "2px solid #3b82f6",
   display: "inline-block",
   margin: "12px 0 20px",
   boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
};

const otpInfoStyle = {
   fontSize: "14px",
   color: "#a8a29e",
   marginTop: "12px",
   fontWeight: "600",
   margin: "12px 0 0 0",
};

const securityNoticeStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #f3f4f6 100%)",
   borderLeft: "4px solid #3b82f6",
   padding: "20px",
   marginBottom: "32px",
   borderRadius: "0 12px 12px 0",
   border: "1px solid #93c5fd",
};

const securityTitleStyle = {
   fontSize: "16px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "12px",
   margin: "0 0 12px 0",
};

const securityTextStyle = {
   fontSize: "14px",
   color: "#57534e",
   fontWeight: "500",
   lineHeight: "1.6",
   margin: 0,
};

const emailAccountStyle = {
   fontWeight: "700",
   color: "#1f2937",
   backgroundColor: "#dbeafe",
   padding: "2px 6px",
   borderRadius: "4px",
};

const platformNameStyle = {
   fontWeight: "700",
   color: "#1e3a8a",
};

const footerStyle = {
   background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
   padding: "40px 30px",
   textAlign: "center" as const,
   borderTop: "2px solid #e5e7eb",
};

const footerTextStyle = {
   fontSize: "14px",
   color: "#6b7280",
   marginBottom: "8px",
   fontWeight: "500",
   margin: "0 0 8px 0",
};

const footerLinkStyle = {
   color: "#1e3a8a",
   textDecoration: "none",
   fontWeight: "700",
};

const footerItalicStyle = {
   marginTop: "20px",
   fontStyle: "italic",
   color: "#9ca3af",
};
