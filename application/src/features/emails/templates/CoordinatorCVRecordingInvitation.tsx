import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface CoordinatorCVRecordingInvitationProps {
   congressTitle: string;
   conferenceTitle: string;
   speakerName: string;
   coordinatorName: string;
   recordingUrl: string;
   trackingUrl: string;
}

export default function CoordinatorCVRecordingInvitationTemplate({
   congressTitle,
   conferenceTitle,
   speakerName,
   coordinatorName,
   recordingUrl,
   trackingUrl,
}: CoordinatorCVRecordingInvitationProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>Graba la presentación del ponente - Virtualis Congress</title>
         </Head>
         <Preview>
            {coordinatorName}, te invitamos a grabar un video presentando el CV de {speakerName} para {conferenceTitle}
         </Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header */}
               <Section style={headerStyle}>
                  <Heading style={brandTitleStyle}>Virtualis Congress</Heading>
                  <Text style={headerSubtitleStyle}>Tu plataforma de congresos profesionales</Text>
               </Section>

               {/* Main Content */}
               <Section style={contentStyle}>
                  {/* Greeting */}
                  <Section style={greetingSectionStyle}>
                     <Text style={greetingIconStyle}>🎬</Text>
                     <Heading style={messageTitleStyle}>¡Hola, {coordinatorName}!</Heading>
                     <Text style={introStyle}>
                        Como coordinador(a) de <span style={highlightStyle}>{conferenceTitle}</span>, te invitamos a grabar un
                        video corto presentando el currículum del ponente. Este video se mostrará al público antes de que comience
                        la conferencia, dando la bienvenida y el contexto profesional del ponente.
                     </Text>
                  </Section>

                  {/* Speaker & Conference Context */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>📋 Detalles de la grabación</Heading>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Ponente a presentar:</Text>
                        <Text style={detailValueStyle}>{speakerName}</Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Conferencia:</Text>
                        <Text style={detailValueStyle}>{conferenceTitle}</Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Congreso:</Text>
                        <Text style={detailValueStyle}>{congressTitle}</Text>
                     </Section>
                  </Section>

                  {/* What to record */}
                  <Section style={instructionsContainerStyle}>
                     <Heading style={instructionsTitleStyle}>🎯 ¿Qué debes grabar?</Heading>
                     <Text style={instructionTextStyle}>
                        Un video breve (aproximadamente 2-4 minutos) donde presentes al ponente ante el público. Incluye su
                        trayectoria profesional, logros destacados y por qué su participación en esta conferencia es relevante. El
                        tono debe ser cercano y profesional, como si estuvieras presentándolo en persona al inicio del evento.
                     </Text>
                     <Section style={tipsContainerStyle}>
                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Habla con naturalidad, mirando a cámara
                        </Text>
                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Menciona los puntos más relevantes del CV del ponente
                        </Text>
                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Mantén un ambiente con buena iluminación y audio claro
                        </Text>
                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Duración sugerida: 2 a 4 minutos
                        </Text>
                     </Section>
                  </Section>

                  {/* CTA */}
                  <Section style={ctaContainerStyle}>
                     <Button href={recordingUrl} style={ctaButtonStyle}>
                        🎥 Grabar presentación del ponente
                     </Button>
                     <Text style={ctaHelperTextStyle}>Si el botón no funciona, copia y pega este enlace en tu navegador:</Text>
                     <Text style={linkTextStyle}>{recordingUrl}</Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Encouragement */}
                  <Section style={encouragementStyle}>
                     <Text style={encouragementIconStyle}>💡</Text>
                     <Text style={encouragementTextStyle}>
                        <strong>Tu presentación marca la diferencia:</strong> Este video será la primera impresión que el público
                        tendrá del ponente. Una buena introducción genera expectativa y prepara a la audiencia para una
                        conferencia memorable.
                     </Text>
                  </Section>
               </Section>

               {/* Footer */}
               <Section style={footerStyle}>
                  <Text style={footerTextStyle}>¡Gracias por contribuir al éxito del congreso!</Text>
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

                  <img src={trackingUrl} alt="" width="1" height="1" style={{ display: "none" }} aria-hidden="true" />
               </Section>
            </Container>
         </Body>
      </Html>
   );
}

// Styles aligned with existing templates
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

const greetingSectionStyle = {
   textAlign: "center" as const,
   marginBottom: "36px",
};

const greetingIconStyle = {
   fontSize: "48px",
   marginBottom: "12px",
   display: "block",
};

const messageTitleStyle = {
   fontSize: "26px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "16px",
   letterSpacing: "-0.5px",
   margin: "0 0 16px 0",
};

const introStyle = {
   fontSize: "16px",
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
   marginBottom: "32px",
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

const instructionsContainerStyle = {
   backgroundColor: "#f8fafc",
   borderRadius: "12px",
   padding: "24px",
   marginBottom: "32px",
   border: "1px solid #e2e8f0",
};

const instructionsTitleStyle = {
   fontSize: "18px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "12px",
   margin: "0 0 12px 0",
};

const instructionTextStyle = {
   fontSize: "15px",
   color: "#374151",
   lineHeight: "1.7",
   marginBottom: "16px",
   fontWeight: "500",
   margin: "0 0 16px 0",
};

const tipsContainerStyle = {
   backgroundColor: "#ffffff",
   borderRadius: "10px",
   padding: "18px",
   border: "1px solid #e2e8f0",
};

const tipItemStyle = {
   fontSize: "14px",
   color: "#374151",
   marginBottom: "10px",
   lineHeight: "1.6",
   display: "flex",
   alignItems: "flex-start",
   margin: "0 0 10px 0",
};

const tipBulletStyle = {
   display: "inline-block",
   color: "#10b981",
   fontSize: "16px",
   fontWeight: "700",
   marginRight: "10px",
   flexShrink: 0,
};

const ctaContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "32px",
};

const ctaButtonStyle = {
   backgroundColor: "#3b82f6",
   color: "#ffffff",
   padding: "18px 36px",
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

const encouragementStyle = {
   background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
   borderLeft: "4px solid #10b981",
   padding: "24px",
   borderRadius: "0 12px 12px 0",
   border: "2px solid #6ee7b7",
   display: "flex",
   alignItems: "flex-start",
   gap: "16px",
};

const encouragementIconStyle = {
   fontSize: "28px",
   flexShrink: 0,
   display: "inline-block",
};

const encouragementTextStyle = {
   fontSize: "15px",
   color: "#065f46",
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
