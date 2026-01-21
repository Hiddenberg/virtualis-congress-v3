import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface AccountCreatedTemplateProps {
   userName: string;
   organizationName: string;
   congressTitle: string;
   platformLink: string;
   congressDates: string;
}

export default function AccountCreatedTemplate({
   userName,
   organizationName,
   congressTitle,
   platformLink,
   congressDates,
}: AccountCreatedTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>¡Bienvenido a Virtualis Congress!</title>
         </Head>
         <Preview>Tu cuenta ha sido creada exitosamente. Completa tu registro para {congressTitle}</Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header */}
               <Section style={headerStyle}>
                  <Heading style={brandTitleStyle}>Virtualis Congress</Heading>
                  <Text style={headerSubtitleStyle}>Tu plataforma de congresos profesionales</Text>
               </Section>

               {/* Main Content */}
               <Section style={contentStyle}>
                  <Heading style={messageTitleStyle}>¡Hola, {userName}!</Heading>
                  <Text style={descriptionStyle}>
                     Tu cuenta ha sido creada exitosamente en <span style={platformNameStyle}>Virtualis Congress</span>. Ahora
                     puedes acceder a nuestra plataforma de congresos.
                  </Text>

                  {/* Congress Information */}
                  <Section style={congressInfoStyle}>
                     <Heading style={congressTitleStyle}>Información del Congreso</Heading>

                     <Text style={congressDetailStyle}>
                        <strong style={labelStyle}>Congreso:</strong> {congressTitle}
                     </Text>

                     <Text style={congressDetailStyle}>
                        <strong style={labelStyle}>Organizador:</strong> {organizationName}
                     </Text>

                     <Text style={congressDetailStyle}>
                        <strong style={labelStyle}>Fechas:</strong> {congressDates}
                     </Text>
                  </Section>

                  {/* Next Steps */}
                  <Section style={nextStepsStyle}>
                     <Heading style={nextStepsTitleStyle}>Próximos pasos para completar tu registro</Heading>

                     <Text style={stepDescriptionStyle}>
                        Para participar en <strong>{congressTitle}</strong>, necesitas completar los siguientes pasos:
                     </Text>

                     <Section style={stepContainerStyle}>
                        <Text style={stepItemStyle}>
                           <span style={stepNumberStyle}>1.</span>
                           <strong>Selecciona tu rol profesional</strong> en la plataforma para personalizar tu experiencia
                        </Text>

                        <Text style={stepItemStyle}>
                           <span style={stepNumberStyle}>2.</span>
                           <strong>Completa tu pago</strong> para confirmar tu participación en el congreso
                        </Text>
                     </Section>

                     {/* CTA Button */}
                     <Section style={ctaContainerStyle}>
                        <Button href={platformLink} style={ctaButtonStyle}>
                           Completar mi registro
                        </Button>
                     </Section>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Additional Information */}
                  <Text style={additionalInfoStyle}>
                     Una vez completados estos pasos, podrás acceder a todas las conferencias, materiales y recursos disponibles
                     para el congreso.
                  </Text>
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

// Styles using the same neutral color scheme as the OTP template
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

const congressInfoStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #f3f4f6 100%)",
   borderRadius: "16px",
   padding: "20px 15px",
   marginBottom: "40px",
   border: "2px solid #93c5fd",
};

const congressTitleStyle = {
   fontSize: "20px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "20px",
   textAlign: "center" as const,
   margin: "0 0 20px 0",
};

const congressDetailStyle = {
   fontSize: "15px",
   color: "#374151",
   marginBottom: "12px",
   lineHeight: "1.6",
   margin: "0 0 12px 0",
};

const labelStyle = {
   color: "#1e3a8a",
   fontWeight: "600",
};

const nextStepsStyle = {
   marginBottom: "40px",
};

const nextStepsTitleStyle = {
   fontSize: "22px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "16px",
   textAlign: "center" as const,
   margin: "0 0 16px 0",
};

const stepDescriptionStyle = {
   fontSize: "16px",
   color: "#4b5563",
   marginBottom: "24px",
   textAlign: "center" as const,
   lineHeight: "1.6",
};

const stepContainerStyle = {
   backgroundColor: "#f8fafc",
   borderRadius: "12px",
   padding: "24px",
   marginBottom: "32px",
   border: "1px solid #e2e8f0",
};

const stepItemStyle = {
   fontSize: "16px",
   color: "#374151",
   marginBottom: "16px",
   lineHeight: "1.6",
   display: "flex",
   alignItems: "flex-start",
   margin: "0 0 16px 0",
};

const stepNumberStyle = {
   display: "inline-block",
   backgroundColor: "#3b82f6",
   color: "#ffffff",
   borderRadius: "50%",
   width: "24px",
   height: "24px",
   textAlign: "center" as const,
   fontSize: "14px",
   fontWeight: "700",
   marginRight: "12px",
   lineHeight: "24px",
   flexShrink: 0,
};

const ctaContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "20px",
};

const ctaButtonStyle = {
   backgroundColor: "#3b82f6",
   color: "#ffffff",
   padding: "16px 32px",
   borderRadius: "12px",
   textDecoration: "none",
   fontWeight: "700",
   fontSize: "16px",
   display: "inline-block",
   boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
   border: "none",
   cursor: "pointer",
};

const dividerStyle = {
   borderColor: "#e5e7eb",
   margin: "40px 0",
};

const additionalInfoStyle = {
   fontSize: "15px",
   color: "#6b7280",
   textAlign: "center" as const,
   lineHeight: "1.6",
   marginBottom: "32px",
   fontStyle: "italic",
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
