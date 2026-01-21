import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface SpeakerCertificateTemplateProps {
   speakerName: string;
   academicTitle: string;
   congressTitle: string;
   certificateUrl: string;
}

export default function SpeakerCertificateTemplate({
   speakerName,
   academicTitle,
   congressTitle,
   certificateUrl,
}: SpeakerCertificateTemplateProps) {
   return (
      <Html lang="es-MX">
         <Head>
            <title>Tu certificado de ponente está disponible - Virtualis Congress</title>
         </Head>
         <Preview>
            {academicTitle} {speakerName}, tu certificado de participación como ponente en {congressTitle} está listo para
            descargar
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
                  {/* Congratulations Section */}
                  <Section style={congratsContainerStyle}>
                     <Text style={congratsIconStyle}>🎓</Text>
                     <Heading style={messageTitleStyle}>
                        ¡Felicidades, {academicTitle} {speakerName}!
                     </Heading>
                     <Text style={congratsDescriptionStyle}>
                        Gracias por compartir tu conocimiento y experiencia en <span style={highlightStyle}>{congressTitle}</span>
                        . Tu participación fue invaluable para el éxito del evento.
                     </Text>
                  </Section>

                  {/* Certificate Info */}
                  <Section style={certificateInfoStyle}>
                     <Heading style={certificateInfoTitleStyle}>Tu certificado está disponible</Heading>

                     <Text style={certificateDescriptionStyle}>
                        Hemos preparado tu certificado oficial de participación como ponente. Este documento acredita tu
                        contribución profesional al congreso y puede ser utilizado para fines académicos y curriculares.
                     </Text>
                  </Section>

                  {/* CTA Button */}
                  <Section style={ctaContainerStyle}>
                     <Button href={certificateUrl} style={ctaButtonStyle}>
                        Descargar mi certificado
                     </Button>
                     <Text style={ctaHelperTextStyle}>Si el botón no funciona, copia y pega este enlace en tu navegador:</Text>
                     <Text style={linkTextStyle}>{certificateUrl}</Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Additional Information */}
                  <Section style={additionalInfoContainerStyle}>
                     <Heading style={additionalInfoTitleStyle}>Recomendaciones</Heading>

                     <Text style={recommendationItemStyle}>
                        <strong>📥 Descarga inmediata:</strong> Guarda tu certificado en un lugar seguro para futuras referencias
                     </Text>

                     <Text style={recommendationItemStyle}>
                        <strong>🖨️ Impresión:</strong> El certificado está optimizado para impresión en tamaño carta u oficio
                     </Text>

                     <Text style={recommendationItemStyle}>
                        <strong>💼 Portafolio profesional:</strong> Comparte este logro en tus redes profesionales y CV
                     </Text>
                  </Section>

                  <Hr style={dividerStyle} />

                  {/* Thank You Note */}
                  <Section style={thankYouSectionStyle}>
                     <Text style={thankYouTextStyle}>
                        Una vez más, agradecemos tu valiosa participación y esperamos contar contigo en futuros eventos. Tu
                        expertise y dedicación contribuyen significativamente al desarrollo profesional de nuestra comunidad.
                     </Text>
                  </Section>
               </Section>

               {/* Footer */}
               <Section style={footerStyle}>
                  <Text style={footerTextStyle}>
                     Certificado emitido por <strong>Virtualis Congress</strong>
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

// Styles using the same design system as other templates
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

const congratsContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "40px",
};

const congratsIconStyle = {
   fontSize: "64px",
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

const congratsDescriptionStyle = {
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

const certificateInfoStyle = {
   background: "linear-gradient(135deg, #dbeafe 0%, #f3f4f6 100%)",
   borderRadius: "16px",
   padding: "30px 25px",
   marginBottom: "40px",
   border: "2px solid #93c5fd",
};

const certificateInfoTitleStyle = {
   fontSize: "22px",
   fontWeight: "700",
   color: "#1e3a8a",
   marginBottom: "16px",
   textAlign: "center" as const,
   margin: "0 0 16px 0",
};

const certificateDescriptionStyle = {
   fontSize: "15px",
   color: "#374151",
   lineHeight: "1.7",
   textAlign: "center" as const,
   marginBottom: "24px",
};

const ctaContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "40px",
};

const ctaButtonStyle = {
   backgroundColor: "#3b82f6",
   color: "#ffffff",
   padding: "16px 40px",
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
   fontSize: "13px",
   color: "#6b7280",
   marginTop: "16px",
   marginBottom: "8px",
   lineHeight: "1.5",
};

const linkTextStyle = {
   fontSize: "13px",
   color: "#3b82f6",
   wordBreak: "break-all" as const,
   lineHeight: "1.5",
};

const dividerStyle = {
   borderColor: "#e5e7eb",
   margin: "40px 0",
};

const additionalInfoContainerStyle = {
   backgroundColor: "#f8fafc",
   borderRadius: "12px",
   padding: "24px",
   marginBottom: "32px",
   border: "1px solid #e2e8f0",
};

const additionalInfoTitleStyle = {
   fontSize: "20px",
   fontWeight: "700",
   color: "#1f2937",
   marginBottom: "20px",
   textAlign: "center" as const,
   margin: "0 0 20px 0",
};

const recommendationItemStyle = {
   fontSize: "15px",
   color: "#374151",
   marginBottom: "16px",
   lineHeight: "1.6",
   margin: "0 0 16px 0",
};

const thankYouSectionStyle = {
   textAlign: "center" as const,
   marginBottom: "20px",
};

const thankYouTextStyle = {
   fontSize: "15px",
   color: "#4b5563",
   lineHeight: "1.7",
   fontStyle: "italic",
   margin: 0,
};

const footerStyle = {
   backgroundColor: "#f9fafb",
   padding: "30px 40px",
   textAlign: "center" as const,
   borderTop: "1px solid #e5e7eb",
};

const footerTextStyle = {
   fontSize: "14px",
   color: "#6b7280",
   marginBottom: "8px",
   lineHeight: "1.5",
   margin: "0 0 8px 0",
};

const footerItalicStyle = {
   fontStyle: "italic",
   fontSize: "13px",
};
