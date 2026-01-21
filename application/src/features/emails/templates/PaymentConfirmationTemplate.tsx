import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface PaymentConfirmationTemplateProps {
   userName: string;
   congressTitle: string;
   platformLink: string;
   modalitySelected: "virtual" | "in-person";
   hasAccessToRecordings: boolean;
   congressStartDate: string;
   organizationName: string;
}

export default function PaymentConfirmationTemplate({
   userName,
   congressTitle,
   platformLink,
   modalitySelected,
   hasAccessToRecordings,
   congressStartDate,
   organizationName,
}: PaymentConfirmationTemplateProps) {
   const modalityText = modalitySelected === "virtual" ? "Virtual" : "Presencial";
   const modalityIcon = modalitySelected === "virtual" ? "💻" : "🏢";

   return (
      <Html lang="es-MX">
         <Head>
            <title>¡Pago confirmado! - Virtualis Congress</title>
         </Head>
         <Preview>Tu pago ha sido procesado exitosamente para {congressTitle}</Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header */}
               <Section style={headerStyle}>
                  <Heading style={brandTitleStyle}>Virtualis Congress</Heading>
                  <Text style={headerSubtitleStyle}>Tu plataforma de congresos profesionales</Text>
               </Section>

               {/* Main Content */}
               <Section style={contentStyle}>
                  {/* Success Message */}
                  <Section style={successContainerStyle}>
                     <Text style={successIconStyle}>✅</Text>
                     <Heading style={messageTitleStyle}>¡Felicidades, {userName}!</Heading>
                     <Text style={successDescriptionStyle}>
                        Tu pago ha sido procesado exitosamente. Ya estás oficialmente registrado para participar en{" "}
                        <span style={platformNameStyle}>{congressTitle}</span>.
                     </Text>
                  </Section>

                  {/* Registration Details */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>Detalles de tu registro</Heading>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Congreso:</Text>
                        <Text style={detailValueStyle}>{congressTitle}</Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Modalidad seleccionada:</Text>
                        <Text style={detailValueStyle}>
                           {modalityIcon} {modalityText}
                        </Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Acceso a grabaciones:</Text>
                        <Text
                           style={{
                              ...detailValueStyle,
                              ...accessBadgeStyle(hasAccessToRecordings),
                           }}
                        >
                           {hasAccessToRecordings ? "✅ Incluido" : "❌ No incluido"}
                        </Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Fecha de inicio:</Text>
                        <Text style={detailValueStyle}>{congressStartDate}</Text>
                     </Section>
                  </Section>

                  {/* What's Next Section */}
                  <Section style={nextStepsStyle}>
                     <Heading style={nextStepsTitleStyle}>¿Qué sigue ahora?</Heading>

                     <Section style={stepContainerStyle}>
                        <Text style={stepItemStyle}>
                           <span style={stepNumberStyle}>1.</span>
                           Accede a la plataforma para explorar el programa completo del congreso
                        </Text>

                        <Text style={stepItemStyle}>
                           <span style={stepNumberStyle}>2.</span>
                           {modalitySelected === "virtual"
                              ? "Prepara tu equipo y conexión a internet para la experiencia virtual"
                              : "Revisa la información de ubicación y logística para la modalidad presencial"}
                        </Text>

                        <Text style={stepItemStyle}>
                           <span style={stepNumberStyle}>3.</span>
                           <span>
                              Marca tu calendario: nos vemos el <strong>{congressStartDate}</strong>
                           </span>
                        </Text>

                        {hasAccessToRecordings && (
                           <Text style={stepItemStyle}>
                              <span style={stepNumberStyle}>4.</span>
                              Después del congreso, podrás acceder a todas las grabaciones desde tu cuenta
                           </Text>
                        )}
                     </Section>

                     {/* CTA Button */}
                     <Section style={ctaContainerStyle}>
                        <Button href={platformLink} style={ctaButtonStyle}>
                           Acceder a la plataforma
                        </Button>
                     </Section>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Reminder Section */}
                  <Section style={reminderStyle}>
                     <Text style={reminderTitleStyle}>📅 Recordatorio importante</Text>
                     <Text style={reminderTextStyle}>
                        Te esperamos el <strong>{congressStartDate}</strong> para comenzar esta experiencia educativa única.{" "}
                        {modalitySelected === "virtual"
                           ? "Recibirás los enlaces de acceso antes del evento."
                           : "Recibirás toda la información de ubicación y logística próximamente."}
                     </Text>
                  </Section>

                  {/* Support Section */}
                  {/* <Section style={securityNoticeStyle}>
                     <Text style={securityTitleStyle}>¿Necesitas ayuda?</Text>
                     <Text style={securityTextStyle}>
                        Si tienes alguna pregunta sobre tu registro o necesitas asistencia técnica,
                        nuestro equipo de soporte está aquí para ayudarte. No dudes en contactarnos
                        a través de la plataforma.
                     </Text>
                  </Section> */}
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

// Styles using the same neutral color scheme
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

const successContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "40px",
};

const successIconStyle = {
   fontSize: "48px",
   marginBottom: "16px",
   display: "block",
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

const successDescriptionStyle = {
   fontSize: "18px",
   color: "#4b5563",
   lineHeight: "1.7",
   fontWeight: "500",
   margin: 0,
};

const detailsContainerStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #f3f4f6 100%)",
   borderRadius: "16px",
   padding: "32px 24px",
   marginBottom: "40px",
   border: "2px solid #93c5fd",
};

const detailsTitleStyle = {
   fontSize: "20px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "24px",
   textAlign: "center" as const,
   margin: "0 0 24px 0",
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

const accessBadgeStyle = (hasAccess: boolean) => ({
   color: hasAccess ? "#059669" : "#dc2626",
   fontWeight: "700",
});

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

const reminderStyle = {
   backgroundColor: "#fef3c7",
   borderLeft: "4px solid #f59e0b",
   padding: "20px",
   marginBottom: "32px",
   borderRadius: "0 12px 12px 0",
   border: "1px solid #fbbf24",
};

const reminderTitleStyle = {
   fontSize: "16px",
   fontWeight: "700",
   color: "#92400e",
   marginBottom: "12px",
   margin: "0 0 12px 0",
};

const reminderTextStyle = {
   fontSize: "14px",
   color: "#78350f",
   fontWeight: "500",
   lineHeight: "1.6",
   margin: 0,
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
