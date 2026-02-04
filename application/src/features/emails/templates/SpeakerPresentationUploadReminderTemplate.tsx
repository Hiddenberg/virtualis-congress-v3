import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface SpeakerPresentationUploadReminderTemplateProps {
   speakerName: string;
   conferenceTitle: string;
   uploadLink: string;
   organizationName: string;
   deadlineDate?: string;
   conferenceDate?: string;
}

export default function SpeakerPresentationUploadReminderTemplate({
   speakerName,
   conferenceTitle,
   uploadLink,
   organizationName,
   deadlineDate,
   conferenceDate,
}: SpeakerPresentationUploadReminderTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>Recordatorio: Sube tu presentación - Virtualis Congress</title>
         </Head>
         <Preview>Recuerda subir tu presentación para {conferenceTitle}</Preview>
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
                     {/* <Text style={alertIconStyle}>📎</Text> */}
                     <Heading style={messageTitleStyle}>¡Hola, {speakerName}!</Heading>
                     <Text style={alertDescriptionStyle}>
                        Te recordamos que aún no has subido el archivo de tu presentación{" "}
                        <span style={highlightStyle}>(PowerPoint, PDF u otro formato compatible)</span> para tu conferencia{" "}
                        <span style={highlightStyle}>{conferenceTitle}</span>.
                     </Text>
                     <Text style={alertDescriptionStyle}>
                        Es importante que la subas con anticipación para asegurar que todo esté listo para el día del evento.
                     </Text>
                  </Section>

                  {/* Conference Details */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>📋 Detalles de tu conferencia</Heading>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Conferencia:</Text>
                        <Text style={detailValueStyle}>{conferenceTitle}</Text>
                     </Section>

                     {conferenceDate && (
                        <Section style={detailItemContainerStyle}>
                           <Text style={detailLabelStyle}>Fecha de tu conferencia:</Text>
                           <Text style={detailValueStyle}>{conferenceDate}</Text>
                        </Section>
                     )}

                     {deadlineDate && (
                        <Section style={detailItemContainerStyle}>
                           <Text style={detailLabelStyle}>Fecha límite para subir tu presentación:</Text>
                           <Text style={deadlineValueStyle}>{deadlineDate}</Text>
                        </Section>
                     )}
                  </Section>

                  {/* CTA Button */}
                  <Section style={ctaContainerStyle}>
                     <Button href={uploadLink} style={ctaButtonStyle}>
                        📤 Subir presentación ahora
                     </Button>
                     <Text style={ctaHelperTextStyle}>Si el botón no funciona, copia y pega este enlace en tu navegador:</Text>
                     <Text style={linkTextStyle}>{uploadLink}</Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Instructions Section */}
                  <Section style={instructionsStyle}>
                     <Heading style={instructionsTitleStyle}>💡 Instrucciones para subir tu presentación</Heading>

                     <Section style={instructionsContainerStyle}>
                        <Text style={instructionItemStyle}>
                           <span style={instructionBulletStyle}>1.</span>
                           Haz clic en el botón de arriba o visita el enlace proporcionado
                        </Text>

                        <Text style={instructionItemStyle}>
                           <span style={instructionBulletStyle}>2.</span>
                           Selecciona tu archivo de presentación (PowerPoint, PDF u otro formato compatible)
                        </Text>

                        <Text style={instructionItemStyle}>
                           <span style={instructionBulletStyle}>3.</span>
                           Espera a que se procese y verifica que se haya subido correctamente
                        </Text>

                        <Text style={instructionItemStyle}>
                           <span style={instructionBulletStyle}>4.</span>
                           Asegúrate de que tu presentación esté completa y lista para el día del evento
                        </Text>
                     </Section>
                  </Section>

                  {/* Important Reminder */}
                  <Section style={urgencyStyle}>
                     <Text style={urgencyIconStyle}>⚠️</Text>
                     <Text style={urgencyTextStyle}>
                        <strong>Importante:</strong> Subir tu presentación con anticipación nos permite verificar que todo
                        funcione correctamente y evitar cualquier inconveniente el día de tu conferencia. Si tienes alguna
                        pregunta o necesitas ayuda, no dudes en contactarnos.
                     </Text>
                  </Section>
               </Section>

               {/* Footer */}
               <Section style={footerStyle}>
                  <Text style={footerTextStyle}>¡Esperamos verte pronto en {organizationName}!</Text>
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

const deadlineValueStyle = {
   fontSize: "16px",
   color: "#dc2626",
   fontWeight: "700",
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

const instructionsStyle = {
   marginBottom: "32px",
};

const instructionsTitleStyle = {
   fontSize: "20px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "20px",
   textAlign: "center" as const,
   margin: "0 0 20px 0",
};

const instructionsContainerStyle = {
   backgroundColor: "#f8fafc",
   borderRadius: "12px",
   padding: "24px",
   border: "1px solid #e2e8f0",
};

const instructionItemStyle = {
   fontSize: "15px",
   color: "#374151",
   marginBottom: "14px",
   lineHeight: "1.6",
   display: "flex",
   alignItems: "flex-start",
   margin: "0 0 14px 0",
};

const instructionBulletStyle = {
   display: "inline-block",
   color: "#3b82f6",
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
