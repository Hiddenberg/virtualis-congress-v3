/* eslint-disable @next/next/no-img-element */
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

interface ACPWIMRecordingInvitationTemplateProps {
   inviteeName: string;
   recordingTitle: string;
   recordingLink: string;
   organizationName: string;
   trackingUrl: string;
   maxDeadline?: string;
}

const ACP_MEXICO_LOGO_URL =
   "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1757633836/ACP_Mexico_Chapter_EndorsedBy_Logo_rgb_1_kn5xnf.webp";

export default function ACPWIMRecordingInvitationTemplate({
   inviteeName,
   recordingTitle,
   recordingLink,
   organizationName,
   trackingUrl,
   maxDeadline,
}: ACPWIMRecordingInvitationTemplateProps) {
   const formattedDate = new Date().toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
   });

   return (
      <Html lang="es-MX">
         <Head>
            <title>Invitación como ponente - Congreso Internacional Women in Medicine</title>
         </Head>
         <Preview>Invitación para grabar su ponencia &quot;{recordingTitle}&quot; - Congreso Women in Medicine</Preview>
         <Body style={bodyStyle}>
            <Container style={containerStyle}>
               {/* Header - ACP Mexico Chapter branding */}
               <Section style={headerStyle}>
                  <img
                     src={ACP_MEXICO_LOGO_URL}
                     alt="American College of Physicians - Capítulo México"
                     width="280"
                     style={logoStyle}
                  />
                  <Text style={headerSubtitleStyle}>American College of Physicians</Text>
                  <Text style={headerTaglineStyle}>Leading Internal Medicine, Improving Lives</Text>
               </Section>

               {/* Main Content - Formal invitation letter */}
               <Section style={contentStyle}>
                  <Text style={dateStyle}>Fecha: {formattedDate}</Text>
                  <Text style={salutationStyle}>Estimada {inviteeName},</Text>

                  <Text style={paragraphStyle}>
                     Para el American College of Physicians (ACP), Capítulo México, es un gusto invitarle a participar como
                     ponente en el Congreso Internacional &quot;Women in Medicine&quot;, que se llevará a cabo del 12 al 14 de
                     marzo de 2026.
                  </Text>

                  <Text style={paragraphStyle}>
                     Este congreso tiene como propósito reunir a médicas líderes y expertas en medicina interna y especialidades
                     afines, con el fin de compartir experiencias, conocimientos y avances relevantes en la atención integral de
                     la salud de la mujer, así como reflexionar sobre el liderazgo femenino en la medicina.
                  </Text>

                  <Text style={paragraphStyle}>
                     Con base en su reconocida trayectoria profesional, consideramos que su participación aportará un valor
                     académico significativo al programa del congreso, por lo que sería un honor contar con su colaboración como
                     ponente.
                  </Text>

                  {/* Lecture Details */}
                  <Section style={detailsContainerStyle}>
                     <Heading style={detailsTitleStyle}>Datos de la ponencia</Heading>
                     <Text style={detailItemStyle}>• Título de la ponencia: {recordingTitle}</Text>
                     {maxDeadline && <Text style={detailItemStyle}>• Fecha de presentación: {maxDeadline}</Text>}
                     <Text style={detailItemStyle}>• Horario: A coordinar con el equipo organizador</Text>
                  </Section>

                  <Text style={paragraphStyle}>
                     Le informamos que nuestro equipo se pondrá en contacto con usted para coordinar la programación y grabación
                     de su ponencia, conforme a la logística académica del evento.
                  </Text>

                  {/* Recording CTA */}
                  <Section style={ctaContainerStyle}>
                     <Text style={ctaIntroStyle}>
                        Para facilitar el proceso, puede acceder a la plataforma de grabación a través del siguiente enlace:
                     </Text>
                     <Button href={recordingLink} style={ctaButtonStyle}>
                        Acceder a la plataforma de grabación
                     </Button>
                     <Text style={ctaHelperTextStyle}>Si el botón no funciona, copie y pegue este enlace en su navegador:</Text>
                     <Text style={linkTextStyle}>{recordingLink}</Text>
                  </Section>

                  <Text style={paragraphStyle}>
                     Agradecemos de antemano su disposición y esperamos contar con su participación en este importante encuentro
                     internacional.
                  </Text>

                  <Text style={closingStyle}>Reciba un cordial saludo.</Text>

                  {/* Signature Block */}
                  <Section style={signatureContainerStyle}>
                     <Text style={signatureTextStyle}>Atentamente,</Text>
                     <Text style={signatureNameStyle}>Dr. Rubén Antonio Gómez Mendoza, FACP</Text>
                     <Text style={signatureTitleStyle}>Gobernador</Text>
                     <Text style={signatureOrgStyle}>American College of Physicians</Text>
                     <Text style={signatureOrgStyle}>Capítulo México</Text>
                     <Text style={signatureOrgStyle}>Comité Organizador</Text>
                  </Section>
               </Section>

               {/* Footer - Contact Information */}
               <Section style={footerStyle}>
                  <Text style={footerAddressStyle}>
                     Hospital Ángeles Lindavista. Consultorio 550, Quinto Piso. Río Bamba No.639. Colonia Magdalena de las
                     Salinas. Alcaldía: Gustavo A. Madero. Ciudad de México, México. Código Postal 07760.
                  </Text>
                  <Text style={footerContactStyle}>Teléfono: 5555866119</Text>
                  <Text style={footerContactStyle}>Email: govacp.mexico.ragom@gmail.com</Text>
                  <Hr style={dividerStyle} />
                  <Text style={footerTextStyle}>
                     Este correo fue enviado por <span style={footerLinkStyle}>{organizationName}</span>
                  </Text>
                  <Text style={footerTextStyle}>
                     Impulsado por <span style={footerLinkStyle}>Virtualis Congress</span>
                  </Text>
                  <Text
                     style={{
                        ...footerTextStyle,
                        ...footerItalicStyle,
                     }}
                  >
                     Este es un correo automático. Por favor no responda a este mensaje.
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

const bodyStyle = {
   fontFamily: "Georgia, 'Times New Roman', serif",
   lineHeight: "1.6",
   color: "#1f2937",
   backgroundColor: "#ffffff",
   margin: 0,
   padding: 0,
};

const containerStyle = {
   maxWidth: "600px",
   margin: "0 auto",
   backgroundColor: "#ffffff",
   overflow: "hidden",
};

const headerStyle = {
   padding: "32px 24px",
   textAlign: "center" as const,
   borderBottom: "2px solid #047857",
};

const logoStyle = {
   maxWidth: "280px",
   height: "auto",
   display: "block",
   margin: "0 auto 8px auto",
};

const headerSubtitleStyle = {
   color: "#374151",
   fontSize: "14px",
   fontWeight: "600" as const,
   margin: "0 0 4px 0",
};

const headerTaglineStyle = {
   color: "#6b7280",
   fontSize: "12px",
   fontStyle: "italic",
   margin: 0,
};

const contentStyle = {
   padding: "32px 40px",
};

const dateStyle = {
   fontSize: "14px",
   color: "#4b5563",
   marginBottom: "16px",
   margin: "0 0 16px 0",
};

const salutationStyle = {
   fontSize: "16px",
   color: "#1f2937",
   fontWeight: "600" as const,
   marginBottom: "24px",
   margin: "0 0 24px 0",
};

const paragraphStyle = {
   fontSize: "15px",
   color: "#374151",
   marginBottom: "20px",
   lineHeight: "1.7",
   textAlign: "justify" as const,
   margin: "0 0 20px 0",
};

const detailsContainerStyle = {
   backgroundColor: "#f0fdf4",
   borderLeft: "4px solid #047857",
   padding: "20px 24px",
   marginBottom: "24px",
   borderRadius: "0 8px 8px 0",
};

const detailsTitleStyle = {
   fontSize: "16px",
   fontWeight: "700" as const,
   color: "#065f46",
   marginBottom: "12px",
   margin: "0 0 12px 0",
};

const detailItemStyle = {
   fontSize: "14px",
   color: "#374151",
   marginBottom: "6px",
   lineHeight: "1.6",
   margin: "0 0 6px 0",
};

const ctaContainerStyle = {
   textAlign: "center" as const,
   marginBottom: "24px",
   padding: "20px",
   backgroundColor: "#f9fafb",
   borderRadius: "8px",
   border: "1px solid #e5e7eb",
};

const ctaIntroStyle = {
   fontSize: "14px",
   color: "#4b5563",
   marginBottom: "16px",
   lineHeight: "1.6",
   margin: "0 0 16px 0",
};

const ctaButtonStyle = {
   backgroundColor: "#047857",
   color: "#ffffff",
   padding: "14px 28px",
   borderRadius: "8px",
   textDecoration: "none",
   fontWeight: "600" as const,
   fontSize: "15px",
   display: "inline-block",
   border: "none",
   cursor: "pointer",
};

const ctaHelperTextStyle = {
   fontSize: "12px",
   color: "#6b7280",
   marginTop: "12px",
   marginBottom: "4px",
};

const linkTextStyle = {
   fontSize: "12px",
   color: "#047857",
   wordBreak: "break-all" as const,
   margin: 0,
};

const closingStyle = {
   fontSize: "15px",
   color: "#374151",
   marginBottom: "24px",
   margin: "0 0 24px 0",
};

const signatureContainerStyle = {
   marginTop: "24px",
};

const signatureTextStyle = {
   fontSize: "15px",
   color: "#374151",
   marginBottom: "8px",
   margin: "0 0 8px 0",
};

const signatureNameStyle = {
   fontSize: "15px",
   fontWeight: "700" as const,
   color: "#1f2937",
   marginBottom: "4px",
   margin: "0 0 4px 0",
};

const signatureTitleStyle = {
   fontSize: "14px",
   color: "#4b5563",
   marginBottom: "4px",
   margin: "0 0 4px 0",
};

const signatureOrgStyle = {
   fontSize: "14px",
   color: "#4b5563",
   marginBottom: "2px",
   margin: "0 0 2px 0",
};

const footerStyle = {
   padding: "24px 40px 32px",
   backgroundColor: "#f9fafb",
   borderTop: "1px solid #e5e7eb",
};

const footerAddressStyle = {
   fontSize: "12px",
   color: "#6b7280",
   marginBottom: "8px",
   lineHeight: "1.5",
   margin: "0 0 8px 0",
};

const footerContactStyle = {
   fontSize: "12px",
   color: "#6b7280",
   marginBottom: "4px",
   fontWeight: "600" as const,
   margin: "0 0 4px 0",
};

const dividerStyle = {
   borderColor: "#e5e7eb",
   margin: "20px 0 12px 0",
};

const footerTextStyle = {
   fontSize: "12px",
   color: "#9ca3af",
   marginBottom: "6px",
   fontWeight: "500",
   margin: "0 0 6px 0",
};

const footerLinkStyle = {
   color: "#047857",
   textDecoration: "none",
   fontWeight: "600",
};

const footerItalicStyle = {
   marginTop: "8px",
   fontStyle: "italic",
   color: "#9ca3af",
};
