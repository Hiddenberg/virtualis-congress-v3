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

interface NonPayersCongressInvitationTemplateProps {
   conferenceTitle: string;
   conferenceFormattedStartDate: string;
   accessLink: string;
   organizationName: string;
}

export default function NonPayersCongressInvitationTemplate({
   conferenceTitle,
   conferenceFormattedStartDate,
   accessLink,
   organizationName,
}: NonPayersCongressInvitationTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>¡No te pierdas este congreso! - Virtualis Congress</title>
         </Head>
         <Preview>
            ¡Completa tu registro para {conferenceTitle} y únete a nosotros el{" "}
            {conferenceFormattedStartDate}!
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
                  {/* Enthusiastic Opening */}
                  <Section style={openingContainerStyle}>
                     <Text style={enthusiasticIconStyle}>🎉</Text>
                     <Heading style={messageTitleStyle}>
                        ¡Tu lugar está reservado!
                     </Heading>
                     <Text style={openingTextStyle}>
                        Podrías perderte de una experiencia educativa única. Has
                        dado el primer paso al registrarte al evento{" "}
                        <span style={highlightStyle}>{conferenceTitle}</span>,
                        pero tu inscripción aún no está completa.
                     </Text>
                  </Section>

                  {/* Event Details */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>
                        📅 Detalles del congreso
                     </Heading>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Congreso:</Text>
                        <Text style={detailValueStyle}>{conferenceTitle}</Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Fecha de inicio:</Text>
                        <Text style={detailValueStyle}>
                           {conferenceFormattedStartDate}
                        </Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Organiza:</Text>
                        <Text style={detailValueStyle}>{organizationName}</Text>
                     </Section>
                  </Section>

                  {/* Benefits Section */}
                  <Section style={benefitsContainerStyle}>
                     <Heading style={benefitsTitleStyle}>
                        ✨ Lo que te espera
                     </Heading>

                     <Section style={benefitItemStyle}>
                        <Text style={benefitIconStyle}>🎓</Text>
                        <Section>
                           <Text style={benefitTextTitleStyle}>
                              Aprendizaje de alto nivel
                           </Text>
                           <Text style={benefitTextStyle}>
                              Conferencias impartidas por expertos reconocidos
                              en la industria
                           </Text>
                        </Section>
                     </Section>

                     <Section style={benefitItemStyle}>
                        <Text style={benefitIconStyle}>🤝</Text>
                        <Section>
                           <Text style={benefitTextTitleStyle}>
                              Networking valioso
                           </Text>
                           <Text style={benefitTextStyle}>
                              Conecta con profesionales y colegas de tu área
                           </Text>
                        </Section>
                     </Section>

                     <Section style={benefitItemStyle}>
                        <Text style={benefitIconStyle}>💼</Text>
                        <Section>
                           <Text style={benefitTextTitleStyle}>
                              Crecimiento profesional
                           </Text>
                           <Text style={benefitTextStyle}>
                              Adquiere conocimientos actualizados que impulsarán
                              tu carrera
                           </Text>
                        </Section>
                     </Section>

                     <Section style={benefitItemStyle}>
                        <Text style={benefitIconStyle}>📱</Text>
                        <Section>
                           <Text style={benefitTextTitleStyle}>
                              Acceso desde cualquier lugar
                           </Text>
                           <Text style={benefitTextStyle}>
                              Participa cómodamente desde tu casa u oficina
                           </Text>
                        </Section>
                     </Section>
                  </Section>

                  {/* Urgency Section */}
                  <Section style={urgencyContainerStyle}>
                     <Text style={urgencyIconStyle}>⏰</Text>
                     <Text style={urgencyTitleStyle}>¡El tiempo corre!</Text>
                     <Text style={urgencyTextStyle}>
                        No dejes pasar esta oportunidad
                     </Text>
                  </Section>

                  {/* CTA Button */}
                  <Section style={ctaContainerStyle}>
                     <Button href={accessLink} style={ctaButtonStyle}>
                        Completar mi registro ahora
                     </Button>
                     <Text style={ctaHelperTextStyle}>
                        Haz clic en el botón para finalizar tu inscripción y
                        asegurar tu lugar
                     </Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Final Encouragement */}
                  <Section style={encouragementContainerStyle}>
                     <Text style={encouragementTextStyle}>
                        Estamos emocionados de tenerte con nosotros. ¡Nos vemos
                        en <strong>{conferenceTitle}</strong>!
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

const openingContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "36px",
};

const enthusiasticIconStyle = {
   fontSize: "52px",
   marginBottom: "16px",
   display: "block",
};

const messageTitleStyle = {
   fontSize: "32px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "20px",
   textAlign: "center" as const,
   letterSpacing: "-0.5px",
   margin: "0 0 20px 0",
};

const openingTextStyle = {
   fontSize: "17px",
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

const benefitsContainerStyle = {
   backgroundColor: "#f8fafc",
   borderRadius: "16px",
   padding: "32px 28px",
   marginBottom: "36px",
   border: "2px solid #e2e8f0",
};

const benefitsTitleStyle = {
   fontSize: "22px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "24px",
   textAlign: "center" as const,
   margin: "0 0 24px 0",
};

const benefitItemStyle = {
   display: "flex",
   alignItems: "flex-start",
   marginBottom: "20px",
   gap: "16px",
};

const benefitIconStyle = {
   fontSize: "28px",
   display: "block",
   flexShrink: 0,
   margin: 0,
};

const benefitTextTitleStyle = {
   fontSize: "16px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "4px",
   margin: "0 0 4px 0",
};

const benefitTextStyle = {
   fontSize: "14px",
   color: "#6b7280",
   lineHeight: "1.5",
   margin: 0,
};

const urgencyContainerStyle = {
   background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
   borderRadius: "16px",
   padding: "28px 24px",
   marginBottom: "32px",
   border: "2px solid #fbbf24",
   textAlign: "center" as const,
};

const urgencyIconStyle = {
   fontSize: "40px",
   display: "block",
   marginBottom: "12px",
};

const urgencyTitleStyle = {
   fontSize: "22px",
   fontWeight: "700",
   color: "#92400e",
   marginBottom: "12px",
   margin: "0 0 12px 0",
};

const urgencyTextStyle = {
   fontSize: "16px",
   color: "#78350f",
   fontWeight: "500",
   lineHeight: "1.6",
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
   margin: "36px 0",
};

const encouragementContainerStyle = {
   textAlign: "center" as const,
   padding: "20px 0",
};

const encouragementTextStyle = {
   fontSize: "16px",
   color: "#4b5563",
   fontWeight: "500",
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
