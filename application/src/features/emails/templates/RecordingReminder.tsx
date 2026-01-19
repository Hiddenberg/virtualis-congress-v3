/* eslint-disable @next/next/no-img-element */
import {
   Body,
   Button,
   Container,
   Head,
   Heading,
   Html,
   Preview,
   Section,
   Text,
} from "@react-email/components";

interface RecordingReminderProps {
   organizationName: string;
   speakerName: string;
   conferenceTitle: string;
   recordingUrl: string;
   trackingUrl: string;
   deadlineText?: string;
}

export default function RecordingReminder({
   organizationName,
   speakerName,
   conferenceTitle,
   recordingUrl,
   trackingUrl,
   deadlineText,
}: RecordingReminderProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>{`Recordatorio de entrega de grabación - ${organizationName}`}</title>
         </Head>
         <Preview>
            Recordatorio de entrega de grabación - {conferenceTitle}
         </Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header */}
               <Section style={headerStyle}>
                  <Heading style={brandTitleStyle}>
                     Virtualis Recordings
                  </Heading>
                  <Text style={headerSubtitleStyle}>
                     Plataforma de grabación
                  </Text>
               </Section>

               {/* Main Content */}
               <Section style={contentStyle}>
                  <Heading style={messageTitleStyle}>
                     Recordatorio de entrega de grabación
                  </Heading>

                  <Text style={introStyle}>Hola {speakerName},</Text>

                  {deadlineText ? (
                     <Text style={introSecondaryStyle}>
                        Te escribimos para recordar que la fecha límite para
                        completar tu grabación es el{" "}
                        <strong>{deadlineText}</strong>.
                     </Text>
                  ) : (
                     <Text style={introSecondaryStyle}>
                        Te escribimos para recordar que aún no hemos recibido la
                        grabación de tu conferencia para el evento:{" "}
                        <strong>{conferenceTitle}</strong>.
                     </Text>
                  )}

                  {/* Conference Context */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>Tu conferencia</Heading>
                     {/* <Text style={detailsLabelStyle}>Título:</Text> */}
                     <Text style={recordingTitleStyle}>{conferenceTitle}</Text>
                  </Section>

                  {/* Deadline Highlight */}
                  {deadlineText && (
                     <Section style={deadlineContainerStyle}>
                        <Text style={deadlineTitleStyle}>Fecha límite</Text>
                        <Text style={deadlineTextStyle}>
                           Por favor completa la grabación de tu conferencia es
                           a más tardar el <strong>{deadlineText}</strong>.
                        </Text>
                     </Section>
                  )}

                  {/* Important Message: No animations */}
                  <Section style={importantMessageContainerStyle}>
                     <Text style={importantMessageTitleStyle}>
                        ⚠️ Importante
                     </Text>
                     <Text style={importantMessageTextStyle}>
                        Por favor{" "}
                        <strong>
                           evita usar animaciones en movimiento, audios o videos
                        </strong>{" "}
                        en tus diapositivas, ya que el sistema de grabación no
                        los soporta. Utiliza transiciones estáticas y elementos
                        fijos para garantizar una presentación óptima.
                     </Text>
                     <Text style={importantMessageTextStyle}>
                        Si necesitas agregar audios o videos en tu diapositiva,
                        por favor graba tu conferencia usando una herraminta
                        como &quot;Zoom&quot;, &quot;Loom&quot;,
                        &quot;OBS&quot;, etc. y sube el video a la plataforma
                        seleccionando la opción &quot;Voy a subir un video que
                        grabé en zoom&quot;.
                     </Text>
                  </Section>

                  {/* CTA: Upload Recording */}
                  <Section style={ctaContainerStyle}>
                     <Button href={recordingUrl} style={ctaPrimaryButtonStyle}>
                        Completar grabación
                     </Button>
                     <Text style={ctaHelperTextStyle}>
                        Si el botón no funciona, copia y pega este enlace en tu
                        navegador:
                     </Text>
                     <Text style={linkTextStyle}>{recordingUrl}</Text>
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

const footerLinkStyle = {
   color: "#1e3a8a",
   textDecoration: "none",
   fontWeight: "700",
};

// Styles aligned with existing templates
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
   fontSize: "26px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "14px",
   textAlign: "center" as const,
   letterSpacing: "-0.5px",
   margin: "0 0 14px 0",
};

const introStyle = {
   fontSize: "16px",
   color: "#374151",
   margin: 0,
   textAlign: "center" as const,
   fontWeight: "600",
};

const introSecondaryStyle = {
   fontSize: "15px",
   color: "#4b5563",
   marginTop: "8px",
   marginBottom: "22px",
   textAlign: "center" as const,
};

const detailsContainerStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #f3f4f6 100%)",
   borderRadius: "16px",
   padding: "22px",
   marginBottom: "26px",
   border: "2px solid #93c5fd",
};

const detailsTitleStyle = {
   fontSize: "18px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "10px",
   textAlign: "center" as const,
   margin: "0 0 10px 0",
};

const recordingTitleStyle = {
   fontSize: "16px",
   color: "#1f2937",
   fontWeight: "700",
   margin: 0,
   textAlign: "center" as const,
};

const deadlineContainerStyle = {
   backgroundColor: "#fef3c7",
   borderLeft: "4px solid #f59e0b",
   padding: "14px",
   marginBottom: "24px",
   borderRadius: "0 12px 12px 0",
   border: "1px solid #fbbf24",
};

const deadlineTitleStyle = {
   fontSize: "15px",
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

const importantMessageContainerStyle = {
   backgroundColor: "#fee2e2",
   borderLeft: "4px solid #dc2626",
   padding: "14px",
   marginBottom: "24px",
   borderRadius: "12px",
   border: "1px solid #fca5a5",
};

const importantMessageTitleStyle = {
   fontSize: "18px",
   fontWeight: "700",
   color: "#991b1b",
   textAlign: "center" as const,
   marginBottom: "6px",
   margin: "0 0 6px 0",
};

const importantMessageTextStyle = {
   fontSize: "14px",
   color: "#7f1d1d",
   fontWeight: "500",
   margin: 0,
};

const ctaContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "22px",
};

const ctaPrimaryButtonStyle = {
   backgroundColor: "#2563eb",
   color: "#ffffff",
   padding: "14px 28px",
   borderRadius: "12px",
   textDecoration: "none",
   fontWeight: "700",
   fontSize: "16px",
   display: "inline-block",
   boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
   border: "none",
   cursor: "pointer",
};

const ctaHelperTextStyle = {
   fontSize: "12px",
   color: "#6b7280",
   marginTop: "12px",
   marginBottom: "6px",
};

const linkTextStyle = {
   fontSize: "12px",
   color: "#1e3a8a",
   wordBreak: "break-all" as const,
   margin: 0,
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
