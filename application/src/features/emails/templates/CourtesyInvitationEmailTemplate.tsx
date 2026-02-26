import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface CourtesyInvitationEmailTemplateProps {
   recipientName?: string;
   promoCode: string;
   congressTitle: string;
   congressFormattedDates: string;
   registrationLink: string;
   organizationName: string;
}

export default function CourtesyInvitationEmailTemplate({
   recipientName,
   promoCode,
   congressTitle,
   congressFormattedDates,
   registrationLink,
   organizationName,
}: CourtesyInvitationEmailTemplateProps) {
   const greeting = recipientName ? `¡Hola, ${recipientName}!` : "¡Hola!";

   return (
      <Html lang="es-MX">
         <Head>
            <title>Invitación de cortesía - {congressTitle}</title>
         </Head>
         <Preview>
            Tienes una invitación especial para registrarte gratuitamente en {congressTitle}. Tu código: {promoCode}
         </Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header */}
               <Section style={headerStyle}>
                  <Text style={giftIconStyle}>🎁</Text>
                  <Heading style={brandTitleStyle}>Invitación de Cortesía</Heading>
                  <Text style={headerSubtitleStyle}>{organizationName}</Text>
               </Section>

               {/* Main Content */}
               <Section style={contentStyle}>
                  <Heading style={messageTitleStyle}>{greeting}</Heading>

                  <Text style={introStyle}>
                     Has sido invitado(a) a participar de forma gratuita en <span style={highlightStyle}>{congressTitle}</span>.
                     Te hemos reservado un lugar especial con acceso completo al congreso.
                  </Text>

                  {/* Promo Code - Prominent */}
                  <Section style={codeContainerStyle}>
                     <Text style={codeLabelStyle}>Tu código de invitación exclusivo:</Text>
                     <Section style={codeBoxStyle}>
                        <Text style={codeTextStyle}>{promoCode}</Text>
                     </Section>
                     <Text style={codeHintStyle}>
                        Guarda este código. Lo necesitarás al momento de completar tu registro para aplicar el 100% de descuento.
                     </Text>
                  </Section>

                  {/* Congress Details */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>📅 Detalles del congreso</Heading>
                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Evento:</Text>
                        <Text style={detailValueStyle}>{congressTitle}</Text>
                     </Section>
                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Fechas:</Text>
                        <Text style={detailValueStyle}>{congressFormattedDates}</Text>
                     </Section>
                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Organiza:</Text>
                        <Text style={detailValueStyle}>{organizationName}</Text>
                     </Section>
                  </Section>

                  {/* CTA */}
                  <Section style={ctaContainerStyle}>
                     <Button href={registrationLink} style={ctaButtonStyle}>
                        Completar mi registro gratuito
                     </Button>
                     <Text style={ctaHelperTextStyle}>
                        Al llegar al paso de pago, ingresa tu código en el campo &quot;Código promocional&quot; para obtener tu
                        inscripción sin costo.
                     </Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Instructions */}
                  <Section style={instructionsContainerStyle}>
                     <Text style={instructionsTitleStyle}>📋 Cómo usar tu invitación</Text>
                     <Section>
                        <Text style={instructionItemStyle}>1. Haz clic en el botón de arriba para ir al registro</Text>
                        <Text style={instructionItemStyle}>2. Completa el formulario de inscripción si aún no lo has hecho</Text>
                        <Text style={instructionItemStyle}>
                           3. Cuando llegues al paso de pago, busca el campo &quot;Código de invitación o descuento&quot;
                        </Text>
                        <Text style={instructionItemStyle}>4. Ingresa tu código: {promoCode}</Text>
                        <Text style={instructionItemStyle}>5. ¡Listo! Tu registro será gratuito</Text>
                     </Section>
                  </Section>

                  {/* Note */}
                  <Section style={noteContainerStyle}>
                     <Text style={noteTitleStyle}>⚠️ Importante</Text>
                     <Text style={noteTextStyle}>
                        Este código es personal e intransferible. Solo puede ser utilizado una vez. Si tienes alguna duda,
                        contacta a la organización del evento.
                     </Text>
                  </Section>
               </Section>

               {/* Footer */}
               <Section style={footerStyle}>
                  <Text style={footerTextStyle}>
                     Este correo fue enviado por <span style={footerLinkStyle}>{organizationName}</span>
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
                     Este es un correo automático. Por favor no respondas a este mensaje.
                  </Text>
               </Section>
            </Container>
         </Body>
      </Html>
   );
}

const bodyStyle = {
   fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
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
   background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
   padding: "40px 30px",
   textAlign: "center" as const,
};

const giftIconStyle = {
   fontSize: "48px",
   marginBottom: "12px",
   display: "block",
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
   color: "#d1fae5",
   fontWeight: "500",
   fontSize: "16px",
   opacity: "0.95",
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

const introStyle = {
   fontSize: "16px",
   color: "#4b5563",
   marginBottom: "28px",
   textAlign: "center" as const,
   lineHeight: "1.7",
   fontWeight: "500",
};

const highlightStyle = {
   fontWeight: "700",
   color: "#047857",
};

const codeContainerStyle = {
   backgroundColor: "#ecfdf5",
   borderRadius: "16px",
   padding: "28px 24px",
   marginBottom: "32px",
   border: "2px solid #10b981",
   textAlign: "center" as const,
};

const codeLabelStyle = {
   fontSize: "14px",
   color: "#065f46",
   fontWeight: "600",
   marginBottom: "12px",
   margin: "0 0 12px 0",
};

const codeBoxStyle = {
   backgroundColor: "#ffffff",
   borderRadius: "12px",
   padding: "20px 24px",
   marginBottom: "12px",
   border: "2px dashed #10b981",
};

const codeTextStyle = {
   fontSize: "24px",
   fontWeight: "700",
   color: "#047857",
   letterSpacing: "2px",
   margin: 0,
   fontFamily: "monospace",
};

const codeHintStyle = {
   fontSize: "13px",
   color: "#047857",
   fontWeight: "500",
   margin: 0,
};

const detailsContainerStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #f3f4f6 100%)",
   borderRadius: "16px",
   padding: "28px 24px",
   marginBottom: "36px",
   border: "2px solid #93c5fd",
};

const detailsTitleStyle = {
   fontSize: "20px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "20px",
   textAlign: "center" as const,
   margin: "0 0 20px 0",
};

const detailItemContainerStyle = {
   marginBottom: "14px",
   paddingBottom: "10px",
   borderBottom: "1px solid #e2e8f0",
};

const detailLabelStyle = {
   fontSize: "14px",
   color: "#6b7280",
   fontWeight: "600",
   marginBottom: "4px",
   margin: "0 0 4px 0",
};

const detailValueStyle = {
   fontSize: "16px",
   color: "#1f2937",
   fontWeight: "600",
   margin: 0,
};

const ctaContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "28px",
};

const ctaButtonStyle = {
   backgroundColor: "#059669",
   color: "#ffffff",
   padding: "18px 40px",
   borderRadius: "12px",
   textDecoration: "none",
   fontWeight: "700",
   fontSize: "17px",
   display: "inline-block",
   boxShadow: "0 6px 16px rgba(5, 150, 105, 0.4)",
   border: "none",
   cursor: "pointer",
};

const ctaHelperTextStyle = {
   fontSize: "13px",
   color: "#6b7280",
   marginTop: "16px",
   margin: "16px 0 0 0",
};

const dividerStyle = {
   borderColor: "#e5e7eb",
   margin: "36px 0",
};

const instructionsContainerStyle = {
   backgroundColor: "#f8fafc",
   border: "1px solid #e2e8f0",
   borderRadius: "12px",
   padding: "18px",
   marginBottom: "24px",
};

const instructionsTitleStyle = {
   fontSize: "16px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "12px",
   margin: "0 0 12px 0",
};

const instructionItemStyle = {
   fontSize: "14px",
   color: "#374151",
   margin: "8px 0 0 0",
   fontWeight: "500",
};

const noteContainerStyle = {
   backgroundColor: "#fffbeb",
   border: "1px solid #fcd34d",
   borderRadius: "12px",
   padding: "18px",
};

const noteTitleStyle = {
   fontSize: "15px",
   fontWeight: "700",
   color: "#92400e",
   marginBottom: "8px",
   margin: "0 0 8px 0",
};

const noteTextStyle = {
   fontSize: "14px",
   color: "#78350f",
   margin: 0,
   lineHeight: "1.6",
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
   color: "#047857",
   textDecoration: "none",
   fontWeight: "700",
};

const footerItalicStyle = {
   marginTop: "20px",
   fontStyle: "italic",
   color: "#9ca3af",
};
