import {
   Body,
   Button,
   Container,
   Head,
   Heading,
   Hr,
   Html,
   Img,
   Preview,
   Section,
   Text,
} from "@react-email/components";

interface OnDemandReminderTemplateProps {
   userName: string;
   conferenceTitle: string;
   bannerImageUrl?: string;
   accessLink: string;
   organizationName: string;
}

export default function OnDemandReminderTemplate({
   userName,
   conferenceTitle,
   bannerImageUrl,
   accessLink,
   organizationName,
}: OnDemandReminderTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>
               ¡El congreso está disponible bajo demanda! - Virtualis Congress
            </title>
         </Head>
         <Preview>
            {conferenceTitle} ya está disponible bajo demanda. Accede ahora
            desde cualquier dispositivo.
         </Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header */}
               <Section style={headerStyle}>
                  <Heading style={brandTitleStyle}>Virtualis Congress</Heading>
                  <Text style={headerSubtitleStyle}>
                     Tu plataforma de congresos profesionales
                  </Text>
               </Section>

               {/* Banner Image */}
               <Section style={bannerContainerStyle}>
                  {/* Greeting */}
                  <Section style={greetingContainerStyle}>
                     <Heading style={messageTitleStyle}>
                        ¡Hola, {userName}!
                     </Heading>
                     <Text style={greetingTextStyle}>
                        Tenemos excelentes noticias para ti.
                     </Text>
                  </Section>

                  {/* Main Message */}
                  <Section style={mainMessageContainerStyle}>
                     <Text style={mainMessageIconStyle}>📹</Text>
                     <Heading style={mainMessageTitleStyle}>
                        Ahora disponible bajo demanda
                     </Heading>
                     <Text style={mainMessageTextStyle}>
                        El congreso{" "}
                        <span style={highlightStyle}>{conferenceTitle}</span> ya
                        está disponible para que lo veas cuando quieras. Ya no
                        tienes que preocuparte por perderte ninguna sesión.
                     </Text>
                  </Section>
                  {bannerImageUrl && (
                     <Img
                        src={bannerImageUrl}
                        alt={conferenceTitle}
                        style={bannerImageStyle}
                     />
                  )}
               </Section>

               {/* Main Content */}
               <Section style={contentStyle}>
                  {/* Benefits Section */}
                  <Section style={benefitsContainerStyle}>
                     <Heading style={benefitsTitleStyle}>
                        ✨ Accede a tu propio ritmo
                     </Heading>

                     <Section style={benefitItemStyle}>
                        <Text style={benefitIconStyle}>🎯</Text>
                        <Section>
                           <Text style={benefitTextTitleStyle}>
                              Mira cuando quieras
                           </Text>
                           <Text style={benefitTextStyle}>
                              No hay horarios fijos. Tienes acceso 24/7 a todas
                              las sesiones
                           </Text>
                        </Section>
                     </Section>

                     <Section style={benefitItemStyle}>
                        <Text style={benefitIconStyle}>⏸️</Text>
                        <Section>
                           <Text style={benefitTextTitleStyle}>
                              Pausa y reanuda
                           </Text>
                           <Text style={benefitTextStyle}>
                              Tómate el tiempo que necesites. Puedes pausar y
                              continuar después
                           </Text>
                        </Section>
                     </Section>

                     <Section style={benefitItemStyle}>
                        <Text style={benefitIconStyle}>📱</Text>
                        <Section>
                           <Text style={benefitTextTitleStyle}>
                              Desde cualquier dispositivo
                           </Text>
                           <Text style={benefitTextStyle}>
                              Accede desde tu computadora, tablet o celular
                           </Text>
                        </Section>
                     </Section>

                     <Section style={benefitItemStyle}>
                        <Text style={benefitIconStyle}>🔄</Text>
                        <Section>
                           <Text style={benefitTextTitleStyle}>
                              Revisa lo que quieras
                           </Text>
                           <Text style={benefitTextStyle}>
                              Vuelve a ver las sesiones que más te interesaron
                           </Text>
                        </Section>
                     </Section>
                  </Section>

                  {/* CTA Section */}
                  <Section style={ctaContainerStyle}>
                     <Button href={accessLink} style={ctaButtonStyle}>
                        Acceder al congreso ahora
                     </Button>
                     <Text style={ctaHelperTextStyle}>
                        Haz clic en el botón para ver todas las sesiones
                        disponibles
                     </Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Info Section */}
                  <Section style={infoContainerStyle}>
                     <Heading style={infoTitleStyle}>💡 Sabías que...</Heading>
                     <Text style={infoTextStyle}>
                        Muchos asistentes ven el contenido bajo demanda después
                        del evento para{" "}
                        <strong>reforzar los conocimientos</strong> adquiridos y
                        acceder a{" "}
                        <strong>sesiones que no pudieron ver en vivo</strong>.
                     </Text>
                  </Section>

                  {/* Final CTA */}
                  <Section style={finalCtaContainerStyle}>
                     <Text style={finalCtaTextStyle}>
                        No esperes más. Tu acceso al congreso está aquí.
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

// ==================== STYLES ====================
// Following the platform's design system

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

const bannerContainerStyle = {
   width: "100%",
   padding: 0,
   margin: 0,
   borderRadius: "16px 16px 0 0",
};

const bannerImageStyle = {
   width: "100%",
   height: "auto",
   display: "block",
   borderRadius: "16px 16px 0 0",
};

const headerStyle = {
   background: "linear-gradient(135deg, #374151 0%, #4b5563 100%)",
   padding: "30px 30px",
   textAlign: "center" as const,
};

const brandTitleStyle = {
   color: "#ffffff",
   fontSize: "24px",
   fontWeight: "700",
   marginBottom: "4px",
   letterSpacing: "-0.5px",
   margin: "0 0 4px 0",
};

const headerSubtitleStyle = {
   color: "#e5e7eb",
   fontWeight: "500",
   fontSize: "14px",
   opacity: "0.9",
   margin: 0,
};

const contentStyle = {
   padding: "40px 40px",
};

const greetingContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "32px",
};

const messageTitleStyle = {
   fontSize: "28px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "12px",
   textAlign: "center" as const,
   letterSpacing: "-0.5px",
   margin: "0 0 12px 0",
};

const greetingTextStyle = {
   fontSize: "16px",
   color: "#6b7280",
   fontWeight: "500",
   margin: 0,
};

const mainMessageContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "36px",
   padding: "24px",
   backgroundColor: "#f0f9ff",
   borderRadius: "12px",
   border: "1px solid #bfdbfe",
};

const mainMessageIconStyle = {
   fontSize: "48px",
   marginBottom: "12px",
   display: "block",
};

const mainMessageTitleStyle = {
   fontSize: "24px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "16px",
   textAlign: "center" as const,
   margin: "0 0 16px 0",
};

const mainMessageTextStyle = {
   fontSize: "16px",
   color: "#4b5563",
   lineHeight: "1.7",
   margin: 0,
};

const highlightStyle = {
   color: "#0369a1",
   fontWeight: "600",
};

const benefitsContainerStyle = {
   marginBottom: "32px",
};

const benefitsTitleStyle = {
   fontSize: "20px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "20px",
   textAlign: "center" as const,
};

const benefitItemStyle = {
   display: "flex",
   marginBottom: "16px",
   padding: "12px 0",
   borderBottom: "1px solid #e5e7eb",
};

const benefitIconStyle = {
   fontSize: "24px",
   marginRight: "12px",
   marginTop: "2px",
   minWidth: "24px",
};

const benefitTextTitleStyle = {
   fontSize: "15px",
   fontWeight: "600",
   color: "#1f2937",
   margin: "0 0 4px 0",
};

const benefitTextStyle = {
   fontSize: "14px",
   color: "#6b7280",
   lineHeight: "1.6",
   margin: 0,
};

const ctaContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "32px",
   marginTop: "32px",
};

const ctaButtonStyle = {
   backgroundColor: "#0369a1",
   color: "#ffffff",
   padding: "14px 40px",
   borderRadius: "8px",
   textDecoration: "none",
   fontWeight: "600",
   fontSize: "16px",
   display: "inline-block",
   border: "none",
   cursor: "pointer",
   transition: "background-color 0.3s ease",
};

const ctaHelperTextStyle = {
   fontSize: "13px",
   color: "#9ca3af",
   marginTop: "12px",
   margin: "12px 0 0 0",
};

const dividerStyle = {
   borderColor: "#e5e7eb",
   margin: "24px 0",
};

const infoContainerStyle = {
   backgroundColor: "#fef3c7",
   padding: "20px",
   borderRadius: "8px",
   border: "1px solid #fcd34d",
   marginBottom: "24px",
};

const infoTitleStyle = {
   fontSize: "18px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "12px",
   textAlign: "center" as const,
};

const infoTextStyle = {
   fontSize: "15px",
   color: "#4b5563",
   lineHeight: "1.6",
   textAlign: "center" as const,
   margin: 0,
};

const finalCtaContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "24px",
};

const finalCtaTextStyle = {
   fontSize: "16px",
   color: "#1f2937",
   fontWeight: "600",
   margin: 0,
};

const footerStyle = {
   backgroundColor: "#f3f4f6",
   padding: "24px 30px",
   textAlign: "center" as const,
   borderTop: "1px solid #e5e7eb",
};

const footerTextStyle = {
   fontSize: "12px",
   color: "#6b7280",
   margin: "6px 0",
};

const footerLinkStyle = {
   color: "#0369a1",
   fontWeight: "600",
   textDecoration: "none",
};

const footerItalicStyle = {
   fontStyle: "italic" as const,
   fontSize: "11px",
};
