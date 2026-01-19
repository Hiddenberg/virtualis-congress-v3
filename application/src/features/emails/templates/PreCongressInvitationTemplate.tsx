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

interface PreCongressInvitationTemplateProps {
   conferenceTitle: string;
   conferenceDescription: string;
   conferenceFormattedDate: string;
   accessLink: string;
   organizationName: string;
}

export default function PreCongressInvitationTemplate({
   conferenceTitle,
   conferenceDescription,
   conferenceFormattedDate,
   accessLink,
   organizationName,
}: PreCongressInvitationTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>Invitación al Precongreso - Virtualis Congress</title>
         </Head>
         <Preview>
            Te invitamos al precongreso &quot;{conferenceTitle}&quot; -{" "}
            {conferenceFormattedDate}
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
                  <Heading style={messageTitleStyle}>
                     ¡Estás invitado al Precongreso!
                  </Heading>

                  <Text style={introStyle}>
                     Acompáñanos en el precongreso{" "}
                     <span style={highlightStyle}>{conferenceTitle}</span>. Es
                     una gran oportunidad para aprender, conectar y prepararte
                     para las conferencias principales.
                  </Text>

                  {/* Conference Details */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>
                        Detalles del evento
                     </Heading>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Título:</Text>
                        <Text style={detailValueStyle}>{conferenceTitle}</Text>
                     </Section>

                     <Section style={detailItemContainerStyle}>
                        <Text style={detailLabelStyle}>Fecha y hora:</Text>
                        <Text style={detailValueStyle}>
                           {conferenceFormattedDate}
                        </Text>
                     </Section>

                     {conferenceDescription && (
                        <Section
                           style={{
                              marginTop: "8px",
                           }}
                        >
                           <Text style={detailLabelStyle}>Descripción:</Text>
                           <Text style={descriptionStyle}>
                              {conferenceDescription}
                           </Text>
                        </Section>
                     )}
                  </Section>

                  {/* CTA */}
                  <Section style={ctaContainerStyle}>
                     <Button href={accessLink} style={ctaButtonStyle}>
                        Unirme al precongreso
                     </Button>
                     <Text style={ctaHelperTextStyle}>
                        Si el botón no funciona, copia y pega este enlace en tu
                        navegador:
                     </Text>
                     <Text style={linkTextStyle}>{accessLink}</Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Note */}
                  <Section style={noteContainerStyle}>
                     <Text style={noteTitleStyle}>ℹ️ Información</Text>
                     <Text style={noteTextStyle}>
                        Este precongreso está disponible para todos los usuarios
                        registrados en la plataforma. Te recomendamos conectarte
                        unos minutos antes para verificar tu audio y conexión.
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

// Styles aligned with existing templates (neutral + blue palette)
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

const descriptionStyle = {
   fontSize: "15px",
   color: "#374151",
   lineHeight: "1.6",
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

const noteContainerStyle = {
   backgroundColor: "#f8fafc",
   border: "1px solid #e2e8f0",
   borderRadius: "12px",
   padding: "18px",
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
