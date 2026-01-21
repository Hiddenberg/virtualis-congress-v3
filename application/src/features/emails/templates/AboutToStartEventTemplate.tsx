import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface AboutToStartEventTemplateProps {
   userName: string;
   eventTitle: string;
   startTime: string;
   joinURL: string;
}

export default function AboutToStartEventTemplate({ userName, eventTitle, startTime, joinURL }: AboutToStartEventTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>¡El congreso está por comenzar! - Virtualis Congress</title>
         </Head>
         <Preview>{eventTitle} comienza pronto - ¡Prepárate para conectarte!</Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header */}
               <Section style={headerStyle}>
                  <Heading style={brandTitleStyle}>Virtualis Congress</Heading>
                  <Text style={headerSubtitleStyle}>Tu plataforma de congresos profesionales</Text>
               </Section>

               {/* Main Content */}
               <Section style={contentStyle}>
                  {/* Alert Message */}
                  <Section style={alertContainerStyle}>
                     <Text style={alertIconStyle}>⏰</Text>
                     <Heading style={messageTitleStyle}>¡Ya casi es hora, {userName}!</Heading>
                     <Text style={alertDescriptionStyle}>
                        El congreso <span style={highlightStyle}>{eventTitle}</span> está por comenzar. Es momento de prepararte
                        para esta experiencia educativa única.
                     </Text>
                  </Section>

                  {/* Event Details */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>📅 Detalles del evento</Heading>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Congreso:</Text>
                        <Text style={detailValueStyle}>{eventTitle}</Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Hora de inicio:</Text>
                        <Text style={detailValueStyle}>{startTime}</Text>
                     </Section>
                  </Section>

                  {/* CTA Button */}
                  <Section style={ctaContainerStyle}>
                     <Button href={joinURL} style={ctaButtonStyle}>
                        🚀 Acceder al congreso ahora
                     </Button>
                     <Text style={ctaHelperTextStyle}>Si el botón no funciona, copia y pega este enlace en tu navegador:</Text>
                     <Text style={linkTextStyle}>{joinURL}</Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Quick Tips Section */}
                  <Section style={tipsStyle}>
                     <Heading style={tipsTitleStyle}>💡 Consejos para una mejor experiencia</Heading>

                     <Section style={tipsContainerStyle}>
                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Verifica que tu conexión a internet sea estable
                        </Text>

                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Asegúrate de tener tus auriculares o audio funcionando correctamente
                        </Text>

                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Ten a la mano una libreta para tomar notas importantes
                        </Text>

                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Conecta unos minutos antes para evitar contratiempos
                        </Text>
                     </Section>
                  </Section>

                  {/* Urgency Reminder */}
                  <Section style={urgencyStyle}>
                     <Text style={urgencyIconStyle}>🔔</Text>
                     <Text style={urgencyTextStyle}>
                        <strong>No te lo pierdas:</strong> El congreso comenzará en breve. Te recomendamos acceder a la plataforma
                        ahora para garantizar que todo esté listo cuando iniciemos.
                     </Text>
                  </Section>
               </Section>

               {/* Footer */}
               <Section style={footerStyle}>
                  <Text style={footerTextStyle}>¡Nos vemos dentro de unos momentos!</Text>
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

// Styles following the consistent pattern from other templates
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

const alertContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "40px",
};

const alertIconStyle = {
   fontSize: "56px",
   marginBottom: "16px",
   display: "block",
   animation: "pulse 2s infinite",
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

const alertDescriptionStyle = {
   fontSize: "18px",
   color: "#4b5563",
   lineHeight: "1.7",
   fontWeight: "500",
   margin: 0,
};

const highlightStyle = {
   fontWeight: "700",
   color: "#1e3a8a",
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
   marginBottom: "16px",
   paddingBottom: "12px",
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
   marginBottom: "32px",
};

const ctaButtonStyle = {
   backgroundColor: "#3b82f6",
   color: "#ffffff",
   padding: "18px 40px",
   borderRadius: "12px",
   textDecoration: "none",
   fontWeight: "700",
   fontSize: "18px",
   display: "inline-block",
   boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
   border: "none",
   cursor: "pointer",
};

const ctaHelperTextStyle = {
   fontSize: "12px",
   color: "#6b7280",
   marginTop: "16px",
   marginBottom: "6px",
};

const linkTextStyle = {
   fontSize: "12px",
   color: "#1e3a8a",
   wordBreak: "break-all" as const,
   margin: 0,
};

const dividerStyle = {
   borderColor: "#e5e7eb",
   margin: "36px 0",
};

const tipsStyle = {
   marginBottom: "32px",
};

const tipsTitleStyle = {
   fontSize: "20px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "20px",
   textAlign: "center" as const,
   margin: "0 0 20px 0",
};

const tipsContainerStyle = {
   backgroundColor: "#f8fafc",
   borderRadius: "12px",
   padding: "24px",
   border: "1px solid #e2e8f0",
};

const tipItemStyle = {
   fontSize: "15px",
   color: "#374151",
   marginBottom: "14px",
   lineHeight: "1.6",
   display: "flex",
   alignItems: "flex-start",
   margin: "0 0 14px 0",
};

const tipBulletStyle = {
   display: "inline-block",
   color: "#10b981",
   fontSize: "18px",
   fontWeight: "700",
   marginRight: "12px",
   flexShrink: 0,
};

const urgencyStyle = {
   background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
   borderLeft: "4px solid #f59e0b",
   padding: "24px",
   borderRadius: "0 12px 12px 0",
   border: "2px solid #fbbf24",
   display: "flex",
   alignItems: "center",
   gap: "16px",
};

const urgencyIconStyle = {
   fontSize: "32px",
   flexShrink: 0,
   display: "inline-block",
   marginRight: "12px",
};

const urgencyTextStyle = {
   fontSize: "15px",
   color: "#78350f",
   lineHeight: "1.6",
   margin: 0,
   fontWeight: "500",
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

const footerItalicStyle = {
   marginTop: "20px",
   fontStyle: "italic",
   color: "#9ca3af",
};
