/* eslint-disable @next/next/no-img-element */
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface RecordingInvitationTemplateProps {
   inviteeName: string;
   recordingTitle: string;
   recordingLink: string;
   organizationName: string;
   trackingUrl: string;
   maxDeadline?: string;
}

export default function RecordingInvitationTemplate({
   inviteeName,
   recordingTitle,
   recordingLink,
   organizationName,
   trackingUrl,
   maxDeadline,
}: RecordingInvitationTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>Invitación para grabación - Virtualis Recordings</title>
         </Head>
         <Preview>Invitación para grabar &quot;{recordingTitle}&quot;</Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header */}
               <Section style={headerStyle}>
                  <Heading style={brandTitleStyle}>Virtualis Recordings</Heading>
                  <Text style={headerSubtitleStyle}>Plataforma de grabación</Text>
               </Section>

               {/* Main Content */}
               <Section style={contentStyle}>
                  <Heading style={messageTitleStyle}>¡Hola, {inviteeName}!</Heading>

                  {/* Intro */}
                  <Text style={introStyle}>
                     Te hemos enviado esta invitación para que puedas grabar tu presentación utilizando nuestra plataforma. Hemos
                     configurado todo para que tu experiencia de grabación sea simple y profesional.
                  </Text>

                  {/* Recording Info */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>Detalles de la grabación</Heading>
                     <Text style={detailsLabelStyle}>Has sido invitado(a) a grabar:</Text>
                     <Text style={recordingTitleStyle}>{recordingTitle}</Text>
                  </Section>

                  {/* Deadline (opcional) */}
                  {maxDeadline && (
                     <Section style={deadlineContainerStyle}>
                        <Text style={deadlineTitleStyle}>Fecha límite</Text>
                        <Text style={deadlineTextStyle}>
                           Por favor completa tu grabación a más tardar el <strong>{maxDeadline}</strong>.
                        </Text>
                     </Section>
                  )}

                  {/* CTA */}
                  <Section style={ctaContainerStyle}>
                     <Button href={recordingLink} style={ctaButtonStyle}>
                        🎥 Comenzar grabación
                     </Button>
                     <Text style={ctaHelperTextStyle}>Si el botón no funciona, copia y pega este enlace en tu navegador:</Text>
                     <Text style={linkTextStyle}>{recordingLink}</Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Instructions */}
                  <Section style={instructionsContainerStyle}>
                     <Text style={instructionsTitleStyle}>📋 Instrucciones para la grabación</Text>
                     <Section>
                        <Text style={instructionItemStyle}>1. Haz clic en el botón &quot;Comenzar grabación&quot; de arriba</Text>
                        <Text style={instructionItemStyle}>
                           2. Permite el acceso a tu cámara y micrófono cuando se te solicite
                        </Text>
                        <Text style={instructionItemStyle}>3. Realiza una prueba de grabación para verificar audio y video</Text>
                        <Text style={instructionItemStyle}>4. Cuando estés listo(a), inicia la grabación oficial</Text>
                        <Text style={instructionItemStyle}>5. Al finalizar, la grabación se subirá automáticamente</Text>
                     </Section>
                  </Section>

                  {/* Note */}
                  <Section style={noteContainerStyle}>
                     <Text style={noteTitleStyle}>ℹ️ Importante</Text>
                     <Text style={noteTextStyle}>
                        Este enlace es único para ti y tu grabación. Por favor, no lo compartas con otras personas.
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

                  {/* Tracking pixel */}
                  <img
                     src={trackingUrl}
                     alt=""
                     width="1"
                     height="1"
                     style={{
                        display: "none",
                     }}
                     aria-hidden="true"
                  />
               </Section>
            </Container>
         </Body>
      </Html>
   );
}

// Styles aligned with existing templates (neutral + blue palette)
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

const introStyle = {
   fontSize: "16px",
   color: "#4b5563",
   marginBottom: "28px",
   textAlign: "center" as const,
   lineHeight: "1.7",
   fontWeight: "500",
};

const deadlineContainerStyle = {
   backgroundColor: "#fef3c7",
   borderLeft: "4px solid #f59e0b",
   padding: "16px",
   marginBottom: "24px",
   borderRadius: "0 12px 12px 0",
   border: "1px solid #fbbf24",
};

const deadlineTitleStyle = {
   fontSize: "16px",
   fontWeight: "700",
   color: "#92400e",
   marginBottom: "6px",
   margin: "0 0 6px 0",
};

const deadlineTextStyle = {
   fontSize: "14px",
   color: "#78350f",
   fontWeight: "500",
   margin: 0,
};

const detailsContainerStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #f3f4f6 100%)",
   borderRadius: "16px",
   padding: "28px 22px",
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

const detailsLabelStyle = {
   fontSize: "14px",
   color: "#6b7280",
   fontWeight: "600",
   marginBottom: "8px",
   margin: "0 0 8px 0",
};

const recordingTitleStyle = {
   fontSize: "18px",
   color: "#1f2937",
   fontWeight: "700",
   margin: 0,
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
   marginBottom: "8px",
   margin: "0 0 8px 0",
};

const instructionItemStyle = {
   fontSize: "14px",
   color: "#374151",
   margin: "6px 0 0 0",
   fontWeight: "500",
};

const noteContainerStyle = {
   backgroundColor: "#f9fafb",
   border: "1px solid #e5e7eb",
   borderRadius: "12px",
   padding: "18px",
   textAlign: "center" as const,
};

const noteTitleStyle = {
   fontSize: "15px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "8px",
   margin: "0 0 8px 0",
};

const noteTextStyle = {
   fontSize: "14px",
   color: "#4b5563",
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
   color: "#1e3a8a",
   textDecoration: "none",
   fontWeight: "700",
};

const footerItalicStyle = {
   marginTop: "20px",
   fontStyle: "italic",
   color: "#9ca3af",
};
