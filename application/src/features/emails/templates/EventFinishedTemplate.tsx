import {
   Body,
   Button,
   Container,
   Head,
   Heading,
   Hr,
   Html,
   Preview,
   Section,
   Text,
} from "@react-email/components";

interface EventFinishedTemplateProps {
   userName: string;
   congressTitle: string;
   recordingsLink: string;
   organizationName: string;
   totalConferences?: number;
}

export default function EventFinishedTemplate({
   userName,
   congressTitle,
   recordingsLink,
   organizationName,
   totalConferences,
}: EventFinishedTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>{`¡${congressTitle} fue todo un éxito! - Virtualis Congress`}</title>
         </Head>
         <Preview>
            Gracias por ser parte de {congressTitle}. Accede ahora a todas las
            grabaciones de las conferencias.
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

               {/* Main Content */}
               <Section style={contentStyle}>
                  {/* Success Message */}
                  <Section style={successContainerStyle}>
                     <Text style={successIconStyle}>🎉</Text>
                     <Heading style={messageTitleStyle}>
                        ¡{congressTitle} fue todo un éxito!
                     </Heading>
                     <Text style={successDescriptionStyle}>
                        Hola <span style={highlightStyle}>{userName}</span>,
                     </Text>
                     <Text style={successDescriptionStyle}>
                        Queremos agradecerte por haber sido parte de esta
                        experiencia única. Fueron{" "}
                        <strong>{totalConferences}</strong> conferencias llenas
                        de conocimiento, inspiración y aprendizaje.
                     </Text>
                  </Section>

                  {/* Key Highlights Section */}
                  <Section style={highlightsContainerStyle}>
                     <Heading style={highlightsTitleStyle}>
                        ✨ Lo que hicimos juntos
                     </Heading>

                     <Section style={highlightItemStyle}>
                        <Text style={highlightIconStyle}>🎓</Text>
                        <Section>
                           <Text style={highlightTextTitleStyle}>
                              Aprendizaje de alto nivel
                           </Text>
                           <Text style={highlightTextStyle}>
                              Conferencias impartidas por expertos líderes en la
                              industria
                           </Text>
                        </Section>
                     </Section>

                     <Section style={highlightItemStyle}>
                        <Text style={highlightIconStyle}>🤝</Text>
                        <Section>
                           <Text style={highlightTextTitleStyle}>
                              Conexiones valiosas
                           </Text>
                           <Text style={highlightTextStyle}>
                              Networking con profesionales de toda la comunidad
                           </Text>
                        </Section>
                     </Section>

                     <Section style={highlightItemStyle}>
                        <Text style={highlightIconStyle}>💡</Text>
                        <Section>
                           <Text style={highlightTextTitleStyle}>
                              Conocimientos actualizados
                           </Text>
                           <Text style={highlightTextStyle}>
                              Las últimas tendencias y mejores prácticas del
                              sector
                           </Text>
                        </Section>
                     </Section>
                  </Section>

                  {/* Special Note for Non-Payers (subtle FOMO) */}
                  <Section style={specialNoteStyle}>
                     <Text style={specialNoteTitleStyle}>
                        💎 ¿No pudiste asistir en vivo?
                     </Text>
                     <Text style={specialNoteTextStyle}>
                        Aún estás a tiempo de aprovechar todo el contenido
                        valioso del congreso. Las grabaciones te permiten
                        acceder al mismo conocimiento de calidad que
                        compartieron los expertos, sin importar si participaste
                        en vivo o no.
                     </Text>
                     <Text style={specialNoteTextStyle}>
                        No dejes pasar esta oportunidad de crecimiento
                        profesional. Todas las conferencias están esperándote en
                        la plataforma.
                     </Text>
                  </Section>

                  {/* Recordings Access Section */}
                  <Section style={recordingsContainerStyle}>
                     <Heading style={recordingsTitleStyle}>
                        📹 Revive todas las conferencias
                     </Heading>
                     <Text style={recordingsDescriptionStyle}>
                        ¿Te perdiste alguna conferencia? ¿Quieres repasar los
                        contenidos más importantes?
                     </Text>
                     <Text style={recordingsDescriptionStyle}>
                        <strong>¡Buenas noticias!</strong> Ahora tienes acceso
                        completo a todas las grabaciones del congreso. Puedes
                        verlas en cualquier momento, las veces que quieras, y al
                        ritmo que mejor te convenga.
                     </Text>

                     {/* Benefits of recordings */}
                     <Section style={recordingsBenefitsStyle}>
                        <Text style={recordingsBenefitItemStyle}>
                           ✅ Acceso ilimitado a todas las sesiones
                        </Text>
                        <Text style={recordingsBenefitItemStyle}>
                           ✅ Ve las conferencias a tu propio ritmo
                        </Text>
                        <Text style={recordingsBenefitItemStyle}>
                           ✅ Pausa, retrocede y toma notas sin límites
                        </Text>
                        <Text style={recordingsBenefitItemStyle}>
                           ✅ Disponible en todos tus dispositivos
                        </Text>
                     </Section>

                     {/* <Section style={availabilityNoticeStyle}>
                        <Text style={availabilityTextStyle}>
                           ⏰ <strong>Disponible hasta:</strong> {recordingsAvailableUntil}
                        </Text>
                     </Section> */}
                  </Section>

                  {/* CTA Button */}
                  <Section style={ctaContainerStyle}>
                     <Button href={recordingsLink} style={ctaButtonStyle}>
                        Acceder a las grabaciones
                     </Button>
                     <Text style={ctaHelperTextStyle}>
                        Haz clic en el botón para comenzar a ver las
                        conferencias grabadas
                     </Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Thank You Section */}
                  <Section style={thankYouContainerStyle}>
                     <Text style={thankYouTextStyle}>
                        Una vez más, gracias por confiar en nosotros y ser parte
                        de <strong>{congressTitle}</strong>. Tu participación y
                        compromiso con el aprendizaje continuo es lo que hace
                        que estos eventos sean tan especiales.
                     </Text>
                     <Text style={thankYouSignatureStyle}>
                        ¡Nos vemos en el próximo congreso! 🚀
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

// Styles following the platform's design system
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

const successContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "40px",
};

const successIconStyle = {
   fontSize: "56px",
   marginBottom: "16px",
   display: "block",
};

const messageTitleStyle = {
   fontSize: "32px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "24px",
   textAlign: "center" as const,
   letterSpacing: "-0.5px",
   margin: "0 0 24px 0",
};

const successDescriptionStyle = {
   fontSize: "17px",
   color: "#4b5563",
   lineHeight: "1.7",
   fontWeight: "500",
   marginBottom: "12px",
   margin: "0 0 12px 0",
};

const highlightStyle = {
   fontWeight: "700",
   color: "#1e3a8a",
};

const highlightsContainerStyle = {
   backgroundColor: "#f8fafc",
   borderRadius: "16px",
   padding: "32px 28px",
   marginBottom: "36px",
   border: "2px solid #e2e8f0",
};

const highlightsTitleStyle = {
   fontSize: "22px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "24px",
   textAlign: "center" as const,
   margin: "0 0 24px 0",
};

const highlightItemStyle = {
   display: "flex",
   alignItems: "flex-start",
   marginBottom: "20px",
   gap: "16px",
};

const highlightIconStyle = {
   fontSize: "28px",
   display: "block",
   flexShrink: 0,
   margin: 0,
};

const highlightTextTitleStyle = {
   fontSize: "16px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "4px",
   margin: "0 0 4px 0",
};

const highlightTextStyle = {
   fontSize: "14px",
   color: "#6b7280",
   lineHeight: "1.5",
   margin: 0,
};

const recordingsContainerStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #f3f4f6 100%)",
   borderRadius: "16px",
   padding: "32px 28px",
   marginBottom: "36px",
   border: "2px solid #93c5fd",
};

const recordingsTitleStyle = {
   fontSize: "24px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "16px",
   textAlign: "center" as const,
   margin: "0 0 16px 0",
};

const recordingsDescriptionStyle = {
   fontSize: "16px",
   color: "#374151",
   lineHeight: "1.7",
   marginBottom: "14px",
   textAlign: "center" as const,
   margin: "0 0 14px 0",
};

const recordingsBenefitsStyle = {
   backgroundColor: "#ffffff",
   borderRadius: "12px",
   padding: "20px 24px",
   marginTop: "24px",
   marginBottom: "20px",
   border: "1px solid #bfdbfe",
};

const recordingsBenefitItemStyle = {
   fontSize: "15px",
   color: "#1f2937",
   marginBottom: "10px",
   fontWeight: "500",
   margin: "0 0 10px 0",
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
   fontSize: "17px",
   display: "inline-block",
   boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
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
   margin: "40px 0",
};

const specialNoteStyle = {
   backgroundColor: "#fef2f2",
   borderLeft: "4px solid #ef4444",
   borderRadius: "0 12px 12px 0",
   padding: "24px",
   marginBottom: "32px",
   border: "1px solid #fecaca",
};

const specialNoteTitleStyle = {
   fontSize: "18px",
   fontWeight: "700",
   color: "#991b1b",
   marginBottom: "14px",
   margin: "0 0 14px 0",
};

const specialNoteTextStyle = {
   fontSize: "15px",
   color: "#7f1d1d",
   lineHeight: "1.7",
   marginBottom: "12px",
   fontWeight: "500",
   margin: "0 0 12px 0",
};

const thankYouContainerStyle = {
   textAlign: "center" as const,
   padding: "24px 0",
};

const thankYouTextStyle = {
   fontSize: "16px",
   color: "#4b5563",
   lineHeight: "1.7",
   marginBottom: "16px",
   fontWeight: "500",
   margin: "0 0 16px 0",
};

const thankYouSignatureStyle = {
   fontSize: "17px",
   color: "#1e3a8a",
   fontWeight: "700",
   fontStyle: "italic",
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
