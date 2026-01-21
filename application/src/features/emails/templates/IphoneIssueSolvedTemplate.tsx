import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface IphoneIssueSolvedTemplateProps {
   userName: string;
   congressTitle: string;
   platformLink: string;
   organizationName: string;
}

export default function IphoneIssueSolvedTemplate({
   userName,
   congressTitle,
   platformLink,
   organizationName,
}: IphoneIssueSolvedTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>Problema resuelto - Virtualis Congress</title>
         </Head>
         <Preview>El problema de acceso desde iPhone ha sido solucionado - {congressTitle}</Preview>
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
                     <Heading style={messageTitleStyle}>¡Problema resuelto!</Heading>
                  </Section>

                  {/* Announcement Section */}
                  <Text style={mainTextStyle}>Hola {userName},</Text>

                  <Text style={mainTextStyle}>
                     Queremos informarte que hemos identificado y resuelto un problema técnico que afectó el acceso a{" "}
                     <span style={highlightStyle}>{congressTitle}</span> para usuarios de iPhone. Si experimentaste dificultades
                     al intentar conectarte desde un dispositivo iPhone, lamentamos sinceramente el inconveniente.
                  </Text>

                  {/* Solution Announcement */}
                  <Section style={solutionContainerStyle}>
                     <Text style={solutionIconStyle}>🔧</Text>
                     <Heading style={solutionTitleStyle}>El acceso ya está disponible</Heading>
                     <Text style={solutionTextStyle}>
                        Nuestro equipo técnico ha solucionado el problema. Todos los usuarios ahora pueden acceder al congreso sin
                        inconvenientes desde cualquier dispositivo, incluyendo iPhones.
                     </Text>
                  </Section>

                  {/* Compensation Section */}
                  <Section style={compensationContainerStyle}>
                     <Heading style={compensationTitleStyle}>🎁 Acceso a grabaciones</Heading>
                     <Text style={compensationTextStyle}>
                        Para aquellos usuarios que se vieron afectados por esta situación, tendrán acceso completo a las{" "}
                        <strong>grabaciones de todas las conferencias</strong> que pudieron haberse perdido durante el tiempo que
                        el problema estuvo presente.
                     </Text>
                     <Text style={compensationTextStyle}>
                        Si fuiste afectado, podrás ver las grabaciones cuando quieras, cuantas veces necesites, y desde cualquier
                        dispositivo al terminar el evento.
                     </Text>
                  </Section>

                  {/* CTA Button */}
                  <Section style={ctaContainerStyle}>
                     <Button href={platformLink} style={ctaButtonStyle}>
                        Acceder a la plataforma
                     </Button>
                     <Text style={ctaHelperTextStyle}>Si el botón no funciona, copia y pega este enlace en tu navegador:</Text>
                     <Text style={linkTextStyle}>{platformLink}</Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Information Section */}
                  <Section style={nextStepsStyle}>
                     <Heading style={nextStepsTitleStyle}>Información importante</Heading>

                     <Section style={stepsContainerStyle}>
                        <Text style={stepItemStyle}>
                           <span style={stepNumberStyle}>✓</span>
                           El problema de acceso desde iPhone ha sido completamente resuelto
                        </Text>

                        <Text style={stepItemStyle}>
                           <span style={stepNumberStyle}>✓</span>
                           Todos los dispositivos ahora tienen acceso sin restricciones
                        </Text>

                        <Text style={stepItemStyle}>
                           <span style={stepNumberStyle}>✓</span>
                           Las grabaciones están disponibles para usuarios afectados
                        </Text>

                        <Text style={stepItemStyle}>
                           <span style={stepNumberStyle}>✓</span>
                           Puedes continuar disfrutando del congreso normalmente
                        </Text>
                     </Section>
                  </Section>

                  {/* Support Note */}
                  <Section style={supportContainerStyle}>
                     <Text style={supportTitleStyle}>💬 ¿Experimentaste problemas de acceso?</Text>
                     <Text style={supportTextStyle}>
                        Si tuviste dificultades para acceder desde tu iPhone y necesitas ayuda para acceder a las grabaciones, o
                        si experimentas cualquier otro problema técnico, no dudes en contactarnos a través de la plataforma.
                        Estamos aquí para ayudarte.
                     </Text>
                  </Section>

                  {/* Final Message */}
                  <Section style={finalApologyStyle}>
                     <Text style={finalApologyTextStyle}>
                        Agradecemos tu comprensión y paciencia mientras trabajamos continuamente para brindarte la mejor
                        experiencia educativa posible.
                     </Text>
                     <Text style={signatureStyle}>— El equipo de {organizationName}</Text>
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

const successContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "32px",
};

const successIconStyle = {
   fontSize: "56px",
   marginBottom: "12px",
   display: "block",
};

const messageTitleStyle = {
   fontSize: "28px",
   fontWeight: "700",
   color: "#059669",
   marginBottom: "16px",
   textAlign: "center" as const,
   letterSpacing: "-0.5px",
   margin: "0 0 16px 0",
};

const mainTextStyle = {
   fontSize: "16px",
   color: "#4b5563",
   lineHeight: "1.7",
   marginBottom: "16px",
   fontWeight: "500",
};

const highlightStyle = {
   fontWeight: "700",
   color: "#1e3a8a",
};

const solutionContainerStyle = {
   background: "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)",
   borderRadius: "16px",
   padding: "28px 24px",
   marginTop: "32px",
   marginBottom: "32px",
   border: "2px solid #6ee7b7",
   textAlign: "center" as const,
};

const solutionIconStyle = {
   fontSize: "40px",
   display: "block",
   marginBottom: "12px",
};

const solutionTitleStyle = {
   fontSize: "22px",
   fontWeight: "700",
   color: "#065f46",
   marginBottom: "12px",
   margin: "0 0 12px 0",
};

const solutionTextStyle = {
   fontSize: "16px",
   color: "#047857",
   lineHeight: "1.6",
   fontWeight: "500",
   margin: 0,
};

const compensationContainerStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #f3f4f6 100%)",
   borderRadius: "16px",
   padding: "32px 28px",
   marginBottom: "36px",
   border: "2px solid #93c5fd",
};

const compensationTitleStyle = {
   fontSize: "20px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "16px",
   textAlign: "center" as const,
   margin: "0 0 16px 0",
};

const compensationTextStyle = {
   fontSize: "16px",
   color: "#1f2937",
   lineHeight: "1.7",
   marginBottom: "12px",
   textAlign: "center" as const,
   fontWeight: "500",
};

const ctaContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "36px",
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

const nextStepsStyle = {
   marginBottom: "36px",
};

const nextStepsTitleStyle = {
   fontSize: "20px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "20px",
   textAlign: "center" as const,
   margin: "0 0 20px 0",
};

const stepsContainerStyle = {
   backgroundColor: "#f8fafc",
   borderRadius: "12px",
   padding: "24px",
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
   color: "#10b981",
   fontSize: "20px",
   fontWeight: "700",
   marginRight: "12px",
   flexShrink: 0,
};

const supportContainerStyle = {
   backgroundColor: "#fef3c7",
   borderLeft: "4px solid #f59e0b",
   padding: "20px",
   marginBottom: "32px",
   borderRadius: "0 12px 12px 0",
   border: "1px solid #fbbf24",
};

const supportTitleStyle = {
   fontSize: "16px",
   fontWeight: "700",
   color: "#92400e",
   marginBottom: "12px",
   margin: "0 0 12px 0",
};

const supportTextStyle = {
   fontSize: "14px",
   color: "#78350f",
   lineHeight: "1.6",
   margin: 0,
   fontWeight: "500",
};

const finalApologyStyle = {
   textAlign: "center" as const,
   padding: "24px 20px",
};

const finalApologyTextStyle = {
   fontSize: "15px",
   color: "#4b5563",
   lineHeight: "1.7",
   marginBottom: "20px",
   fontStyle: "italic",
};

const signatureStyle = {
   fontSize: "16px",
   color: "#1f2937",
   fontWeight: "600",
   marginTop: "16px",
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
