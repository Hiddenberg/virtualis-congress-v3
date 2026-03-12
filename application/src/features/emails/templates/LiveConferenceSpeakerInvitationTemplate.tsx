import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface LiveConferenceSpeakerInvitationTemplateProps {
   speakerName: string;
   conferenceTitle: string;
   conferenceFormattedDate: string;
   conferenceFormattedTime: string;
   transmissionLink: string;
   organizationName: string;
   congressTitle?: string;
}

export default function LiveConferenceSpeakerInvitationTemplate({
   speakerName,
   conferenceTitle,
   conferenceFormattedDate,
   conferenceFormattedTime,
   transmissionLink,
   organizationName,
   congressTitle,
}: LiveConferenceSpeakerInvitationTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>Invitación a transmisión en vivo - Virtualis Congress</title>
         </Head>
         <Preview>
            Únete a la transmisión de tu conferencia &quot;{conferenceTitle}&quot; - {conferenceFormattedDate}
         </Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header */}
               <Section style={headerStyle}>
                  <Text style={headerIconStyle}>📡</Text>
                  <Heading style={brandTitleStyle}>Virtualis Congress</Heading>
                  <Text style={headerSubtitleStyle}>Transmisión en vivo</Text>
               </Section>

               {/* Main Content */}
               <Section style={contentStyle}>
                  <Heading style={messageTitleStyle}>¡Hola, {speakerName}!</Heading>
                  <Text style={introStyle}>
                     Te invitamos a unirte a la transmisión en vivo de tu conferencia{" "}
                     <span style={highlightStyle}>{conferenceTitle}</span>. Utiliza el enlace siguiente para conectarte como
                     ponente en el momento indicado.
                  </Text>

                  {/* Conference Details */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>📋 Detalles de tu conferencia</Heading>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Conferencia:</Text>
                        <Text style={detailValueStyle}>{conferenceTitle}</Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Fecha:</Text>
                        <Text style={detailValueStyle}>{conferenceFormattedDate}</Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Horario:</Text>
                        <Text style={detailValueStyle}>{conferenceFormattedTime}</Text>
                     </Section>

                     {congressTitle && (
                        <Section style={detailItemContainerStyle}>
                           <Text style={detailLabelStyle}>Congreso:</Text>
                           <Text style={detailValueStyle}>{congressTitle}</Text>
                        </Section>
                     )}
                  </Section>

                  {/* CTA Button */}
                  <Section style={ctaContainerStyle}>
                     <Button href={transmissionLink} style={ctaButtonStyle}>
                        🎬 Unirme a la transmisión
                     </Button>
                     <Text style={ctaHelperTextStyle}>Si el botón no funciona, copia y pega este enlace en tu navegador:</Text>
                     <Text style={linkTextStyle}>{transmissionLink}</Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Tips Section */}
                  <Section style={tipsStyle}>
                     <Heading style={tipsTitleStyle}>💡 Recomendaciones para la transmisión</Heading>

                     <Section style={tipsContainerStyle}>
                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Conéctate unos minutos antes del horario programado
                        </Text>

                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Verifica que tu cámara y micrófono funcionen correctamente
                        </Text>

                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Asegúrate de tener una conexión a internet estable
                        </Text>

                        <Text style={tipItemStyle}>
                           <span style={tipBulletStyle}>✓</span>
                           Ten tu presentación lista para compartir pantalla si es necesario
                        </Text>
                     </Section>
                  </Section>

                  {/* Important Note */}
                  <Section style={noteStyle}>
                     <Text style={noteIconStyle}>⚠️</Text>
                     <Text style={noteTextStyle}>
                        <strong>Importante:</strong> Este enlace es exclusivo para tu conferencia. No lo compartas públicamente.
                        Si tienes algún problema para conectarte, contacta al equipo organizador.
                     </Text>
                  </Section>
               </Section>

               {/* Footer */}
               <Section style={footerStyle}>
                  <Text style={footerTextStyle}>¡Esperamos verte en la transmisión!</Text>
                  <Text style={footerTextStyle}>
                     {organizationName} · Impulsado por <strong>Virtualis</strong> Congress
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
   background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
   padding: "40px 30px",
   textAlign: "center" as const,
};

const headerIconStyle = {
   fontSize: "48px",
   marginBottom: "12px",
   display: "block",
   margin: "0 0 12px 0",
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
   color: "#e0e7ff",
   fontWeight: "700",
   fontSize: "14px",
   letterSpacing: "1px",
   textTransform: "uppercase" as const,
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
   color: "#1e3a8a",
};

const detailsContainerStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
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
   borderBottom: "1px solid #bfdbfe",
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
   backgroundColor: "#2563eb",
   color: "#ffffff",
   padding: "18px 40px",
   borderRadius: "12px",
   textDecoration: "none",
   fontWeight: "700",
   fontSize: "18px",
   display: "inline-block",
   boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
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

const noteStyle = {
   background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
   borderLeft: "4px solid #f59e0b",
   padding: "24px",
   borderRadius: "0 12px 12px 0",
   border: "2px solid #fbbf24",
   display: "flex",
   alignItems: "flex-start",
   gap: "16px",
};

const noteIconStyle = {
   fontSize: "24px",
   flexShrink: 0,
   display: "inline-block",
   marginRight: "12px",
};

const noteTextStyle = {
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
