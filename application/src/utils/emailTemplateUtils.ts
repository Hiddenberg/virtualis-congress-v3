interface SpeakerRecordingInvitationEmailTemplateProps {
   trackingUrl: string;
   academicTitle: string;
   speakerName: string;
   conferenceTitle: string;
   conferenceDate: string;
   conferenceTime: string;
   recordingUrl: string;
}

interface PaymentConfirmationEmailTemplateProps {
   userName: string;
   userEmail: string;
   platformLink: string;
   congressName: string;
   congressStartDate: string;
   congressEndDate: string;
}

export function getSpeakerRecordingInvitationEmailTemplate(
   {
      trackingUrl,
      academicTitle,
      speakerName,
      conferenceTitle,
      conferenceDate,
      conferenceTime,
      recordingUrl,
   }: SpeakerRecordingInvitationEmailTemplateProps,
   language: "es-MX" | "en-US" | "pt-BR",
) {
   const spanishTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invitación a Grabación y Participación</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    ul {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }

    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }

    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>
<body>
   
  <div class="container">
   <div>
      <img src="${trackingUrl}" alt="">
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
   </div>

    <h1>Invitación como ponente en el Congreso Internacional ACP México Chapter</h1>
    <p>Hola <strong>${academicTitle} ${speakerName}</strong>,</p>
    
    <p>
      En nombre del <strong>American College of Physicians (ACP) Chapter México</strong>, es un honor invitarle a participar como ponente en el <strong>1er Congreso Internacional de Medicina Interna del ACP México Chapter</strong>, un
      evento académico de alto impacto que reunirá a internistas y especialistas de diversas partes
      del mundo con el propósito de <strong>compartir conocimientos de vanguardia y fortalecer la
      excelencia en nuestra especialidad.</strong>
    </p>
    
    <p>
      Nos entusiasma contar con su valiosa experiencia en esta edición, donde nos gustaría que
      impartiera la siguiente sesión:
    </p>
    
    <ul>
      <li><strong>Título de la ponencia:</strong> ${conferenceTitle}</li>
      <li><strong>Fecha en que será presentada:</strong> ${conferenceDate}</li>
      <li><strong>Horario:</strong> ${conferenceTime}</li>
    </ul>

    <p>
      Dado que el congreso será <strong>completamente virtual</strong>, hemos desarrollado una plataforma digital
      para facilitar la grabación de su sesión en el momento y horario que mejor le acomode,
      garantizando una experiencia óptima tanto para usted como para los asistentes. 
      <br>
      Asimismo,
      tendrá la opción de participar en una sesión en vivo para la ronda de preguntas y respuestas,
      si así lo prefiere.
    </p>
    
    <p>
      Para iniciar el proceso de grabación, haga clic en el siguiente enlace:
    </p>
    
    <a href="${recordingUrl}?showTutorial=true" class="button">Iniciar Grabación</a>
    
    <p>
      También puede copiar y pegar el siguiente enlace en su navegador:
    </p>
    
    <p>${recordingUrl}?showTutorial=true</p>
    
    <p>
      <strong>Nota:</strong> Se recomienda utilizar el navegador Google Chrome para una experiencia óptima.
    </p>
    
    <p>
      Quedamos atentos a cualquier duda o asistencia que requiera.
      <br>
      ¡Esperamos contar con su participación!
    </p>
    
    <p>
      Atentamente,
      <br>
      Meeting Program Committee
      <br>
      <strong>ACP México Chapter</strong>
    </p>

    <div class="footer">
       <div style="margin-bottom: 1rem;">
          <p style="margin: 0;">Impulsado por</p>
          <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
       </div>
      <p style="margin: 0;">Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>`;

   const englishTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invitation to Record and Participate</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    ul {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }

    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }

    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="container">
   <div>
      <img src="${trackingUrl}" alt="">
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
   </div>

    <h1>Invitation as a Speaker at the International ACP México Chapter Congress</h1>
    <p>Hello <strong>${academicTitle} ${speakerName}</strong>,</p>
    
    <p>
      On behalf of the <strong>American College of Physicians (ACP) Chapter México</strong>, it is an honor to invite you to participate as a speaker at the <strong>1st International Congress of Internal Medicine of the ACP México Chapter</strong>, an
      impactful academic event that will bring together internists and specialists from various parts of the world with the purpose of <strong>sharing cutting-edge knowledge and strengthening excellence in our specialty.</strong>
    </p>
    
    <p>
      We are excited to have your valuable expertise in this edition, where we would like you to deliver the following session:
    </p>
    
    <ul>
      <li><strong>Presentation Title:</strong> ${conferenceTitle}</li>
      <li><strong>Presentation Date:</strong> ${conferenceDate}</li>
      <li><strong>Time:</strong> ${conferenceTime}</li>
    </ul>

    <p>
      Since the congress will be <strong>completely virtual</strong>, we have developed a digital platform to facilitate the recording of your session at the time that best suits you, ensuring an optimal experience for both you and the attendees.
      <br>
      Additionally, you will have the option to participate in a live session for the Q&amp;A round, if you prefer.
    </p>
    
    <p>
      To start the recording process, please click the following link:
    </p>
    
    <a href="${recordingUrl}?showTutorial=true&language=en-US" class="button">Start Recording</a>
    
    <p>
      You can also copy and paste the following link into your browser:
    </p>
    
    <p>${recordingUrl}?showTutorial=true&language=en-US</p>
    
    <p>
      <strong>Note:</strong> It is recommended to use the Google Chrome browser for an optimal experience.
    </p>
    
    <p>
      We remain at your disposal for any questions or assistance you may require.
      <br>
      We look forward to your participation!
    </p>
    
    <p>
      Sincerely,
      <br>
      Meeting Program Committee
      <br>
      <strong>ACP México Chapter</strong>
    </p>

    
    <div class="footer">
       <div style="margin-bottom: 1rem;">
          <p style="margin: 0;">Powered by</p>
          <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
       </div>
      <p style="margin: 0;">This email was sent automatically. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
`;

   return language === "es-MX" ? spanishTemplate : englishTemplate;
}

export function getPaymentConfirmationEmailTemplate({
   userName,
   platformLink,
   congressName,
   congressStartDate,
   congressEndDate,
}: PaymentConfirmationEmailTemplateProps) {
   return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pago y Acceso a Virtualis Congress</title>
  <style>
    /* Reset básico */
    body, h1, h2, p, ul, li, a {
      margin: 0;
      padding: 0;
      text-decoration: none;
      list-style: none;
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f7f7f7;
      color: #333;
      line-height: 1.6;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background-color: #fff;
      margin: 40px auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header img {
      max-width: 200px;
      height: auto;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #007BFF;
      text-align: center;
    }
    p {
      margin-bottom: 15px;
      font-size: 16px;
    }
    a.button {
      display: inline-block;
      background-color: #007BFF;
      color: #fff;
      padding: 12px 25px;
      border-radius: 5px;
      font-size: 16px;
      margin-top: 20px;
      transition: background-color 0.3s ease;
    }
    a.button:hover {
      background-color: #0056b3;
    }
    .highlight {
      background-color: #e9f5ff;
      border-left: 5px solid #007BFF;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .highlight h2 {
      font-size: 18px;
      margin-bottom: 10px;
      color: #007BFF;
    }
    .highlight p {
      font-size: 16px;
      margin: 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #eaeaea;
      padding-top: 20px;
    }
    .footer img {
      max-width: 12rem;
      height: auto;
      margin-bottom: 10px;
    }
    /* Responsive */
    @media (max-width: 600px) {
      .container {
        margin: 20px;
        padding: 20px;
      }
      h1 {
        font-size: 22px;
      }
      p, a.button, .highlight h2, .highlight p {
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="Logo Virtualis Congress">
    </div>
    
    <h1>Confirmación de Pago y Bienvenida</h1>
    
    <p>Hola <strong>${userName}</strong>,</p>
    
    <p>
      Nos complace informarte que el pago de tu inscripción al congreso <strong>${congressName}</strong> ha sido confirmado exitosamente. 
      <br>
      Ahora cuentas con acceso a la plataforma de congresos virtuales donde podrás disfrutar de múltiples conferencias el día del evento.
    </p>
    
    <p>
      El congreso se llevará a cabo del <strong>${congressStartDate}</strong> al <strong>${congressEndDate}</strong> (Horario de Ciudad de México). 
      <br>
      Durante estas fechas, tendrás acceso exclusivo para ver todas las sesiones y contenidos en vivo.
    </p>
    
    <div class="highlight">
      <h2>¿Te perdiste alguna conferencia o quieres volver a verla?</h2>
      <p>No te preocupes, podrás ver las conferencias grabadas una vez que termine el evento durante algunos días después del evento.</p>
    </div>
    
    <p>
      Para comenzar, haz clic en el siguiente botón y accede a tu cuenta:
    </p>
    
    <p style="text-align: center;">
      <a href="${platformLink}" class="button">Acceder a la plataforma</a>
    </p>
    
    <p>
      Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
    </p>
    
    <p style="word-break: break-all;">${platformLink}</p>
    
    <p>
      Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos. Estamos aquí para ayudarte.
    </p>
    
    <p>Saludos cordiales,</p>
    <p>
      Equipo de Soporte<br>
      <strong>ACP México</strong>
    </p>
    
    <div class="footer">
      <p style="margin: 0; font-size: 12px;">Impulsado por</p>
      <img src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="Logo Virtualis Congress">
      <p>Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>`;
}

interface PresenterInvitationEmailTemplateProps {
   trackingUrl: string;
   conferenceTitle: string;
   conferenceDescription: string;
   presenterName: string;
   speakerNamesAndTitles: string;
   recordingUrl: string;
}
export function getPresenterInvitationEmailTemplate({
   trackingUrl,
   conferenceTitle,
   conferenceDescription,
   presenterName,
   speakerNamesAndTitles,
   recordingUrl,
}: PresenterInvitationEmailTemplateProps) {
   const presenterEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invitación a Grabación y Participación</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    ul {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }

    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }

    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="container">
   <div>
      <img src="${trackingUrl}" alt="">
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
   </div>

   <div>
      <h1>Invitación como presentador para la conferencia:</h1>
      <h2 style="margin: 0;">${conferenceTitle}</h2>
      <p style="margin-top: 0; font-size: 1.2rem;">${conferenceDescription}</p>
   </div>

    <p>Hola <strong>${presenterName}</strong>,</p>
    
    <p>
      En nombre del <strong>American College of Physicians (ACP) Chapter México</strong>, es un honor invitarle a participar como presentador en el <strong>1er Congreso Internacional de Medicina Interna del ACP México Chapter</strong>, un
      evento académico de alto impacto que reunirá a internistas y especialistas de diversas partes
      del mundo con el propósito de <strong>compartir conocimientos de vanguardia y fortalecer la
      excelencia en nuestra especialidad.</strong>
    </p>
    
    <p>
      Nos entusiasma contar con su valiosa experiencia en esta edición, donde nos gustaría que
      impartiera la siguiente sesión:
    </p>
    
    <ul>
      <li><strong>Título de la conferencia a presentar:</strong> ${conferenceTitle}</li>
      <li><strong>Conferencista al que presentará:</strong> ${speakerNamesAndTitles}</li>
    </ul>

    <p>
      Dado que el congreso será <strong>completamente virtual</strong>, hemos desarrollado una plataforma digital
      para facilitar la grabación de su sesión en el momento y horario que mejor le acomode,
      garantizando una experiencia óptima tanto para usted como para los asistentes. 
    </p>
    
    <p>
      Para iniciar el proceso de grabación, haga clic en el siguiente enlace:
    </p>
    
    <a href="${recordingUrl}?showTutorial=true" class="button">Iniciar Grabación</a>
    
    <p>
      También puede copiar y pegar el siguiente enlace en su navegador:
    </p>
    
    <p>${recordingUrl}?showTutorial=true</p>
    
    <p>
      <strong>Nota:</strong> Se recomienda utilizar el navegador Google Chrome para una experiencia óptima.
    </p>
    
    <p>
      Quedamos atentos a cualquier duda o asistencia que requiera.
      <br>
      ¡Esperamos contar con su participación!
    </p>
    
    <p>
      Atentamente,
      <br>
      Meeting Program Committee
      <br>
      <strong>ACP México Chapter</strong>
    </p>

    
    <div class="footer">
       <div style="margin-bottom: 1rem;">
          <p style="margin: 0;">Impulsado por</p>
          <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
       </div>
      <p style="margin: 0;">Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>`;

   return presenterEmailTemplate;
}

interface RecordingReminderEmailTemplateProps {
   trackingUrl: string;
   conferenceTitle: string;
   personName: string;
   recordingUrl: string;
}
export function getRecordingReminderEmailTemplate(
   { trackingUrl, conferenceTitle, personName, recordingUrl }: RecordingReminderEmailTemplateProps,
   language: "es-MX" | "en-US" | "pt-BR",
) {
   const recordingReminderEmailTemplateSpanish = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Recordatorio: Grabación Pendiente</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }

    .button__help {
      background-color: #facc15;
      color: #000 !important;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }
    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>  
<body>
  <div class="container">
    <div>
      <img src="${trackingUrl}" alt="">
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
    </div>

    <div>
      <h1>Recordatorio: Grabación Pendiente</h1>
      <h2 style="margin: 0;">${conferenceTitle}</h2>
    </div>

    <p>Hola <strong>${personName}</strong>,</p>

    <p>
      Esperamos que te encuentres bien. Queremos recordarte que aún no hemos recibido la grabación de tu sesión para el <strong>${conferenceTitle}</strong>.
    </p>
    
    <p>
      Dado que el congreso es completamente virtual, tu grabación es fundamental para asegurar una experiencia enriquecedora para todos los asistentes. 
    </p>
    
    <p>
      Te invitamos a completar el proceso de grabación a la brevedad posible. Para ello, por favor utiliza el siguiente enlace:
    </p>
    
    <a href="${recordingUrl}?showTutorial=true" class="button">Completar Grabación</a>
    
    <p>
      También puedes copiar y pegar el siguiente enlace en tu navegador:
    </p>
    
    <p>${recordingUrl}?showTutorial=true</p>
    
    <p>
      Si tienes alguna duda o necesitas asistencia haz click en el siguiente botón:
    </p>

    <a href="https://wa.me/5619920940?text=Hola, necesito ayuda para completar la grabación de mi sesión para el congreso ${conferenceTitle}" class="button button__help">Necesito ayuda</a>
    
    <p>
      Agradecemos tu colaboración y compromiso.
    </p>
    
    <p>
      Atentamente,
      <br>
      Meeting Program Committee
      <br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <div style="margin-bottom: 1rem;">
        <p style="margin: 0;">Impulsado por</p>
        <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
      </div>
      <p style="margin: 0;">Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>
`;

   const recordingReminderEmailTemplateEnglish = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reminder: Pending Recording</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }

    .button__help {
      background-color: #facc15;
      color: #000 !important;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }
    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>  
<body>
  <div class="container">
    <div>
      <img src="${trackingUrl}" alt="">
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
    </div>

    <div>
      <h1>Reminder: Pending Recording</h1>
      <h2 style="margin: 0;">${conferenceTitle}</h2>
    </div>

    <p>Hello <strong>${personName}</strong>,</p>

    <p>
      We hope you are well. We would like to remind you that we have not yet received the recording of your session for <strong>${conferenceTitle}</strong>.
    </p>
    
    <p>
      Since the conference is entirely virtual, your recording is essential to ensure an enriching experience for all attendees.
    </p>
    
    <p>
      We invite you to complete the recording process as soon as possible. Please use the following link:
    </p>
    
    <a href="${recordingUrl}?showTutorial=true&language=en-US" class="button">Complete Recording</a>
    
    <p>
      You can also copy and paste the following link into your browser:
    </p>
    
    <p>${recordingUrl}?showTutorial=true&language=en-US</p>
    
    <p>
      If you have any questions or need assistance, please click the following button:
    </p>

    <a href="https://wa.me/5619920940?text=Hello, I need help to complete the recording of my session for the congress ${conferenceTitle}" class="button button__help">I Need Help</a>
    
    <p>
      We appreciate your collaboration and commitment.
    </p>
    
    <p>
      Sincerely,
      <br>
      Meeting Program Committee
      <br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <div style="margin-bottom: 1rem;">
        <p style="margin: 0;">Powered by</p>
        <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
      </div>
      <p style="margin: 0;">This email was sent automatically. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
`;

   return language === "es-MX" ? recordingReminderEmailTemplateSpanish : recordingReminderEmailTemplateEnglish;
}

interface ReRecordingEmailTemplateProps {
   trackingUrl: string;
   conferenceTitle: string;
   personName: string;
   academicTitle: string;
   recordingUrl: string;
}
export function getReRecordingEmailTemplate({
   trackingUrl,
   conferenceTitle,
   personName,
   academicTitle,
   recordingUrl,
}: ReRecordingEmailTemplateProps) {
   const spanishReRecordingTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Importante: Regrabación de su sesión</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    ul {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }
    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <img src="${trackingUrl}" alt="">
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
    </div>
    
    <h1>Importante: Regrabación de su sesión</h1>
    <p>Hola <strong>${academicTitle} ${personName}</strong>,</p>
    
    <p>
      Esperamos que se encuentre bien. Lamentamos informarle que, debido a un inconveniente técnico, hemos detectado que la grabación de su sesión <strong>no se realizó correctamente</strong> ya que no se registró la conexión de su cámara ni el audio de su micrófono.
    </p>
    
    <p>
      Sabemos lo valiosa que es su ponencia y entendemos que esta situación puede ser frustrante. Por ello, le solicitamos amablemente que realice una nueva grabación para asegurar que su presentación se comparta en las mejores condiciones.
    </p>
    
    <p>A continuación, le recordamos los detalles de la sesión:</p>
    
    <ul>
      <li><strong>Título de la ponencia:</strong> ${conferenceTitle}</li>
    </ul>
    
    <p>
      Por favor, utilice el siguiente enlace para acceder a la plataforma y proceder con la regrabación:
    </p>
    
    <a href="${recordingUrl}?showTutorial=true" class="button">Regrabar sesión</a>
    
    <p>
      También puede copiar y pegar el siguiente enlace en su navegador:
    </p>
    
    <p>${recordingUrl}?showTutorial=true</p>
    
    <p>
      <strong>Nota:</strong> Le recomendamos utilizar el navegador Google Chrome para una experiencia óptima.
    </p>
    
    <p>
      Agradecemos mucho su comprensión y colaboración. Si tiene alguna duda o necesita asistencia adicional, por favor no dude en contactarnos. Estamos aquí para ayudarle.
    </p>
    
    <p>
      Atentamente,
      <br>
      Meeting Program Committee
      <br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <div style="margin-bottom: 1rem;">
        <p style="margin: 0;">Impulsado por</p>
        <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
      </div>
      <p style="margin: 0;">Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>
`;

   return spanishReRecordingTemplate;
}

interface RecordingCompletedEmailTemplateProps {
   conferenceTitle: string;
   speakerName: string;
   academicTitle: string;
   videoUrl: string;
}
export function getRecordingCompletedEmailTemplate(
   { conferenceTitle, speakerName, academicTitle, videoUrl }: RecordingCompletedEmailTemplateProps,
   language: "es-MX" | "en-US" | "pt-BR",
) {
   const spanishRecordingCompletedTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Notificación: Grabación de su conferencia completada</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }
    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
    </div>

    <h1>Grabación Completada: Su conferencia ya está disponible</h1>
    <p>Hola <strong>${academicTitle} ${speakerName}</strong>,</p>

    <p>
      Nos complace informarle que la grabación de su conferencia <strong>"${conferenceTitle}"</strong> se ha realizado correctamente y ya está disponible para su visualización.
    </p>
    
    <p>
      Para ver la grabación, por favor haga clic en el siguiente enlace e ingrese su correo electrónico (no es necesario registrarse):
    </p>

    <a href="${videoUrl}" class="button">Ver Grabación</a>

    <p>
      También puede copiar y pegar este enlace en su navegador:
    </p>

    <p>${videoUrl}</p>

    <p>
      Agradecemos su valiosa participación y quedamos a su disposición para cualquier consulta adicional.
    </p>
    
    <p>
      Atentamente,
      <br>
      Meeting Program Committee
      <br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <div style="margin-bottom: 1rem;">
        <p style="margin: 0;">Impulsado por</p>
        <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
      </div>
      <p style="margin: 0;">Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>
`;

   const englishRecordingCompletedTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Notification: Your Conference Recording is Complete</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }
    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
    </div>
    
    <h1>Your Conference Recording is Complete</h1>
    <p>Hello <strong>${academicTitle} ${speakerName}</strong>,</p>
    
    <p>
      We are pleased to inform you that the recording of your conference <strong>"${conferenceTitle}"</strong> has been successfully completed and is now available for viewing.
    </p>
    
    <p>
      To view your recording, please click on the link below and enter your email (no need to register):
    </p>
    
    <a href="${videoUrl}" class="button">View Recording</a>
    
    <p>
      You can also copy and paste the following link into your browser:
    </p>
    
    <p>${videoUrl}</p>
    
    <p>
      We appreciate your valuable participation and remain at your disposal for any further inquiries.
    </p>
    
    <p>
      Sincerely,
      <br>
      Meeting Program Committee
      <br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <div style="margin-bottom: 1rem;">
        <p style="margin: 0;">Powered by</p>
        <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
      </div>
      <p style="margin: 0;">This email was sent automatically. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
`;

   return language === "es-MX" ? spanishRecordingCompletedTemplate : englishRecordingCompletedTemplate;
}

type InaugurationInvitationEmailTemplateProps = {
   trackingUrl: string;
   speakerName: string;
   academicTitle: string;
   recordingUrl: string;
};

export function getInaugurationInvitationEmailTemplate({
   trackingUrl,
   speakerName,
   academicTitle,
   recordingUrl,
}: InaugurationInvitationEmailTemplateProps) {
   const inaugurationInvitationTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Instrucciones para la Videograbación del Mensaje de Inauguración</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    ul {
      color: #555555;
      line-height: 1.6;
      list-style: disc inside;
    }
    li {
      margin-bottom: 8px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }
    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <img src="${trackingUrl}" alt="">
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
    </div>
    
    <h1>Instrucciones para la Videograbación del Mensaje de Inauguración</h1>
    
    <p>Hola <strong>${academicTitle} ${speakerName}</strong>,</p>
    
    <p>
      Apreciamos profundamente su valiosa participación en la inauguración de nuestro <strong>1er Congreso Virtual de Medicina Interna ACP México Chapter 2025</strong>, un evento diseñado para fortalecer la educación médica continua con la participación de destacados expertos en cada área.
    </p>
    
    <p>
      Con el fin de garantizar que su mensaje llegue con la mayor claridad y calidad, le solicitamos tener en cuenta las siguientes sugerencias al grabar su video:
    </p>
    
    <p><strong>1. Duración</strong></p>
    <ul>
      <li>El mensaje debe durar máximo 3 minutos.</li>
    </ul>
    
    <p><strong>2. Contenido del mensaje</strong></p>
    <ul>
      <li>Un breve saludo y presentación.</li>
      <li>La importancia del congreso en la educación médica continua.</li>
      <li>Un reconocimiento a los profesores invitados, expertos de gran prestigio.</li>
      <li>Un mensaje motivador para los asistentes, destacando el impacto de este evento en la actualización médica.</li>
      <li>Un cierre cálido con sus mejores deseos para el congreso.</li>
    </ul>
    
    <p>
      Para grabar su mensaje, por favor haga clic en el siguiente enlace:
    </p>
    
    <a href="${recordingUrl}?showTutorial=true" class="button">Grabar Mensaje</a>
    
    <p>
      Si el botón no funciona, copie y pegue el siguiente enlace en su navegador:
    </p>
    
    <p>${recordingUrl}?showTutorial=true</p>
    
    <p>
      Si tiene alguna duda o requiere asistencia técnica, estamos a su disposición para apoyarle.
    </p>
    
    <p>
      Agradecemos enormemente su tiempo y colaboración para hacer de este congreso un evento memorable.
    </p>
    
    <p>
      Atentamente,<br>
      Organizing Committee<br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <div style="margin-bottom: 1rem;">
        <p style="margin: 0;">Impulsado por</p>
        <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
      </div>
      <p style="margin: 0;">Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>
`;

   return inaugurationInvitationTemplate;
}

interface QnAInvitationEmailTemplateProps {
   academicTitle: string;
   speakerName: string;
   conferenceTitle: string;
   qaDate: string;
   liveSessionUrl: string;
}

export function getQnAInvitationEmailTemplate(
   { academicTitle, speakerName, conferenceTitle, qaDate, liveSessionUrl }: QnAInvitationEmailTemplateProps,
   language: "es-MX" | "en-US" | "pt-BR",
) {
   const qnaInvitationTemplateSpanish = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invitación para Unirse a la Sesión en Vivo de Preguntas y Respuestas</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    ul {
      color: #555555;
      line-height: 1.6;
      list-style: disc inside;
    }
    li {
      margin-bottom: 8px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }
    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
    </div>
    
    <h1>Únase a su Sesión en Vivo de Preguntas y Respuestas</h1>
    
    <p>Hola <strong>${academicTitle} ${speakerName}</strong>,</p>
    
    <p>
      Le recordamos que, tras su ponencia <strong>"${conferenceTitle}"</strong>, se llevará a cabo la sesión en vivo de preguntas y respuestas. Esta es la oportunidad perfecta para interactuar con los asistentes y compartir sus ideas de forma directa.
    </p>

    <p>
      Le pedimos de favor unirse al mismo tiempo que se reproduce su conferencia para confirmar que todo está funcionando correctamente.
    </p>
    
    <p><strong>Detalles de la sesión, favor de unirse a:</strong></p>
    <ul>
      <li><strong>Fecha:</strong> ${qaDate}</li>
    </ul>
    
    <p>Para unirse a la sesión, por favor haga clic en el siguiente enlace:</p>
    
    <a href="${liveSessionUrl}" class="button">Unirse a la Sesión</a>
    
    <p>
      Si el botón anterior no funciona, copie y pegue el siguiente enlace en su navegador:
    </p>
    
    <p>${liveSessionUrl}</p>
    
    <p>
      Si tiene alguna consulta o inconveniente, no dude en contactarnos.
    </p>
    
    <p>
      Atentamente,<br>
      Meeting Program Committee<br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <div style="margin-bottom: 1rem;">
        <p style="margin: 0;">Impulsado por</p>
        <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
      </div>
      <p style="margin: 0;">Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>
`;

   const qnaInvitationTemplateEnglish = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invitation to Join Your Live Q&A Session</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    ul {
      color: #555555;
      line-height: 1.6;
      list-style: disc inside;
    }
    li {
      margin-bottom: 8px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      width: 20rem;
      height: 5rem;
      object-fit: cover;
    }
    .logo-footer {
      width: 12rem;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="">
    </div>
    
    <h1>Join Your Live Q&A Session</h1>
    
    <p>Hello <strong>${academicTitle} ${speakerName}</strong>,</p>
    
    <p>
      We would like to remind you that after your presentation <strong>"${conferenceTitle}"</strong>, a live Q&amp;A session will be held. This is the perfect opportunity to engage with the audience and share your ideas directly.
    </p>

    <p>
      We kindly ask you to join at the same time your presentation is being played so that we can confirm everything is working correctly.
    </p>
    
    <p><strong>Session Details – Please join at:</strong></p>
    <ul>
      <li><strong>Date:</strong> ${qaDate}</li>
    </ul>
    
    <p>To join the session, please click on the following link:</p>
    
    <a href="${liveSessionUrl}" class="button">Join the Session</a>
    
    <p>
      If the button above does not work, copy and paste the following link into your browser:
    </p>
    
    <p>${liveSessionUrl}</p>
    
    <p>
      If you have any questions or encounter any issues, please don’t hesitate to contact us.
    </p>
    
    <p>
      Sincerely,<br>
      Meeting Program Committee<br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <div style="margin-bottom: 1rem;">
        <p style="margin: 0;">Powered by</p>
        <img class="logo-footer" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="">
      </div>
      <p style="margin: 0;">This email was sent automatically. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
`;

   return language === "es-MX" ? qnaInvitationTemplateSpanish : qnaInvitationTemplateEnglish;
}

interface AttendantWelcomeEmailTemplateProps {
   attendeeName: string;
   eventTitle: string;
   eventDate: string;
   eventTime: string;
   joinUrl: string;
}

export function getAttendantWelcomeEmailTemplate({
   attendeeName,
   eventTitle,
   eventDate,
   eventTime,
   joinUrl,
}: AttendantWelcomeEmailTemplateProps) {
   const attendantWelcomeTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invitación para Asistir al Evento</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      width: 200px;
      height: auto;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <!-- Puedes reemplazar "logoUrl" con la URL del logo de tu organización -->
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="Logo">
    </div>
    
    <h1>¡Te invitamos al 1er Congreso Internacional de Medicina Interna de ACP México Chapter!</h1>
    
    <p>Hola <strong>${attendeeName}</strong>,</p>
    
    <p>
      Nos complace invitarte a nuestro <strong>${eventTitle}</strong>. El evento se llevará a cabo el <strong>${eventDate}</strong> a las <strong>${eventTime}</strong> y contará con la participación de destacados expertos.
    </p>
    
    <p>
      Para ingresar al evento, por favor haz clic en el siguiente enlace:
    </p>
    
    <a href="${joinUrl}" class="button">Ingresar al Evento</a>
    
    <p>
      Si el botón anterior no funciona, copia y pega el siguiente enlace en tu navegador:
    </p>
    
    <p>${joinUrl}</p>
    
    <p>
      Esperamos contar con tu presencia y compartir una experiencia única.
    </p>
    
    <p>
      Atentamente,<br>
      Comité Organizador<br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <p>Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>
`;
   return attendantWelcomeTemplate;
}

interface SecondDayEmailTemplateProps {
   attendeeName: string;
   attendeeEmail: string;
   joinUrl: string;
}
export function getSecondDayEmailTemplate({ attendeeName, attendeeEmail, joinUrl }: SecondDayEmailTemplateProps) {
   const secondDayTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Segundo Día del 1er Congreso Internacional de Medicina Interna</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
      text-align: center;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
    }
    .email-field {
      background-color: #eeeeee;
      padding: 10px;
      margin: 15px 0;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      display: block;
      margin: 0 auto 20px;
      width: 200px;
      height: auto;
      object-fit: cover;
    }
    /* Clase para resaltar la sección */
    .highlight {
      color: #ffffff;
      font-weight: bold;
      background-color: #3681d1;
      padding: 10px;
      border-radius: 4px;
      width: 80%;
      text-align: center;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="Logo">
    </div>
    
    <h1>¡Bienvenidos al Segundo Día!</h1>
    
    <p>Hola <strong>${attendeeName}</strong>,</p>
    
    <p>
      Queremos felicitarte y agradecerte por haber asistido al 1er Congreso Internacional de Medicina Interna. Tu participación ha sido fundamental para el éxito de este evento.
    </p>
    
    <p>
      Lamentamos sinceramente los inconvenientes técnicos que se presentaron el primer día. ¡Pero ya estamos trabajando arduamente en mejorar nuestra plataforma!
      <br>
   </p>
   <div class="highlight">
      <span>Ahora podrás acceder desde tu tablet, computadora o dispositivo móvil.</span>
   </div>
    
    <p>
      Te recomendamos encarecidamente ingresar usando una versión <strong>actualizada</strong> del navegador <strong>Google Chrome</strong> para una experiencia óptima.
    </p>
    
    <p>
      Al momento de ingresar, si te pide que escribas tu correo para iniciar sesión, por favor copia tu correo electrónico en el campo asignado.
      <br>
      Tu correo es:
    </p>
    
    <div class="email-field">
      ${attendeeEmail}
    </div>
    
    <p>
      Haz clic en el siguiente enlace para continuar y disfrutar del segundo día del congreso:
    </p>
    
    <a href="${joinUrl}" class="button">Ingresar al Congreso</a>
    
    <p>
      Si el botón anterior no funciona, copia y pega el siguiente enlace en tu navegador:
    </p>
    
    <p>${joinUrl}</p>
    
    <p>
      ¡Gracias por seguir con nosotros y por ser parte de esta experiencia transformadora!
    </p>
    
    <p>
      Atentamente,<br>
      Comité Organizador<br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <p style="margin: 0; font-size: 12px;">Impulsado por</p>
      <img src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="Logo Virtualis Congress">
      <p>Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>
`;

   return secondDayTemplate;
}

interface Day3EmailTemplateProps {
   attendeeName: string;
   attendeeEmail: string;
   joinUrl: string;
}
export function getDay3EmailTemplate(
   { attendeeName, attendeeEmail, joinUrl }: Day3EmailTemplateProps,
   language: "es-MX" | "en-US" | "pt-BR",
) {
   const day3TemplateSpanish = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Tercer y Último Día del 1er Congreso Internacional de Medicina Interna</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333333;
      text-align: center;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
    }
    .highlight {
      color: #ffffff;
      font-weight: bold;
      background-color: #3681d1;
      padding: 10px;
      border-radius: 4px;
      width: 80%;
      text-align: center;
      margin: 20px auto;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      display: block;
      margin: 0 auto 20px;
      width: 200px;
      height: auto;
      object-fit: cover;
    }
    .email-field {
      background-color: #eeeeee;
      padding: 10px;
      margin: 15px 0;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="Logo">
    </div>
    
    <h1>¡Bienvenidos al Tercer y Último Día!</h1>
    
    <p>Hola <strong>${attendeeName}</strong>,</p>
    
    <p>
      Queremos agradecerte por acompañarnos en este increíble viaje a lo largo del 1er Congreso Internacional de Medicina Interna. Tu participación ha hecho de este evento una experiencia memorable.
    </p>
    
    <p>
      Te recordamos que al finalizar el evento se te entregará tu <strong>certificado de asistencia</strong> como reconocimiento a tu compromiso y participación.
    </p>
    
    <p>
      Además, te anunciamos que tendremos la <strong>ceremonia de clausura</strong> hoy a las <strong>4:00 PM (hora México)</strong>, en la que contaremos con la presencia de destacadas personalidades del ACP. ¡No te lo pierdas!
    </p>

    <p>
      Al momento de ingresar, si te pide que escribas tu correo para iniciar sesión, por favor copia tu correo electrónico en el campo asignado.
      <br>
      Tu correo es:
    </p>
    
    <div class="email-field">
      ${attendeeEmail}
    </div>
    
    <div class="highlight">
      <span>¡Ingresa ahora con el enlace brindado para continuar disfrutando del congreso!</span>
    </div>
    
    <p>
      Para ingresar, haz clic en el botón a continuación:
    </p>
    
    <a href="${joinUrl}" class="button">Ingresar al Congreso</a>
    
    <p>
      Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
    </p>
    
    <p>${joinUrl}</p>
    
    <p>
      ¡Gracias por ser parte de esta experiencia transformadora y por acompañarnos hasta el final!
    </p>
    
    <p>
      Atentamente,<br>
      Comité Organizador<br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <p>Impulsado por</p>
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="Logo Virtualis Congress">
      <p>Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
    </div>
  </div>
</body>
</html>
`;

   const day3TemplateEnglish = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Third and Final Day of the 1st International Congress of Internal Medicine</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 600px;
      border: 1px solid #dddddd;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333333;
      text-align: center;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      font-size: 16px;
      color: white !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
    }
    .highlight {
      color: #ffffff;
      font-weight: bold;
      background-color: #3681d1;
      padding: 10px;
      border-radius: 4px;
      width: 80%;
      text-align: center;
      margin: 20px auto;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      padding: 2rem 0;
    }
    .logo {
      display: block;
      margin: 0 auto 20px;
      width: 200px;
      height: auto;
      object-fit: cover;
    }
    .email-field {
      background-color: #eeeeee;
      padding: 10px;
      margin: 15px 0;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="Logo">
    </div>
    
    <h1>Welcome to the Third and Final Day!</h1>
    
    <p>Hello <strong>${attendeeName}</strong>,</p>
    
    <p>
      We want to thank you for joining us on this incredible journey throughout the 1st International Congress of Internal Medicine. Your participation has made this event a truly memorable experience.
    </p>
    
    <p>
      Please note that at the end of the event you will receive your <strong>certificate of attendance</strong> as recognition for your commitment and participation.
    </p>
    
    <p>
      Additionally, we are excited to announce that the <strong>closing ceremony</strong> will be held today at <strong>4:00 PM (Mexico time)</strong>, featuring prominent ACP personalities. Don't miss it!
    </p>
    
    <p>
      When logging in, if you are prompted to enter your email address to sign in, please copy your email into the designated field.
      <br>
      Your email is:
    </p>
    
    <div class="email-field">
      ${attendeeEmail}
    </div>
    
    <div class="highlight">
      <span>Enter now using the provided link to continue enjoying the congress!</span>
    </div>
    
    <p>
      To join, please click on the button below:
    </p>
    
    <a href="${joinUrl}" class="button">Enter the Congress</a>
    
    <p>
      If the button does not work, please copy and paste the following link into your browser:
    </p>
    
    <p>${joinUrl}</p>
    
    <p>
      Thank you for being a part of this transformative experience and for staying with us until the very end!
    </p>
    
    <p>
      Sincerely,<br>
      Organizing Committee<br>
      <strong>ACP México Chapter</strong>
    </p>
    
    <div class="footer">
      <p>Powered by</p>
      <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="Virtualis Congress Logo">
      <p>This email was sent automatically. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
`;

   return language === "es-MX" ? day3TemplateSpanish : day3TemplateEnglish;
}

interface CongressFinalizationEmailTemplateProps {
   attendeeName: string;
   joinUrl: string;
}

export function getCongressFinalizationEmailTemplate(
   { attendeeName, joinUrl }: CongressFinalizationEmailTemplateProps,
   language: "es-MX" | "en-US" | "pt-BR",
) {
   const congressFinalizationTemplateSpanish = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>¡Gracias por hacer del congreso un éxito!</title>
  <style>
    /* Estilos generales */
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(to right, #eef6fc, #ffffff);
      font-family: Arial, sans-serif;
    }
    .wrapper {
      width: 100%;
      padding: 30px 0;
    }
    .container {
      background-color: #fff;
      margin: 0 auto;
      max-width: 600px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      border: 2px solid #cce4f7;
    }
    /* Encabezado */
    .header {
      background-color: #50a49d;
      padding: 20px;
      text-align: center;
      color: #fff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .header .logo {
      margin-bottom: 10px;
      width: 250px;
      height: auto;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    /* Contenido */
    .content {
      padding: 20px 30px;
      color: #333;
    }
    .content p {
      line-height: 1.6;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .content .highlight {
      color: #007BFF;
      font-weight: bold;
    }
    /* Sección de constancia */
    .certificate {
      background-color: #eef9ed;
      border: 2px dashed #28a745;
      padding: 20px;
      text-align: center;
      border-radius: 8px;
      margin: 20px 0;
    }
    .certificate p {
      font-weight: bold;
      font-size: 18px;
      color: #28a745;
      margin: 0;
    }
    /* Botón */
    .button {
      display: inline-block;
      padding: 12px 25px;
      font-size: 16px;
      color: #fff;
      background-color: #28a745;
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
      margin: 20px 0;
    }
    /* Pie de página */
    .footer {
      background-color: #f0f0f0;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
    .footer .logo {
      width: 300px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Encabezado -->
      <div class="header">
        <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="Logo ACP México Chapter">
        <h1>¡Gracias por hacer del congreso un éxito!</h1>
      </div>
      
      <!-- Contenido principal -->
      <div class="content">
        <p>Hola <strong>${attendeeName}</strong>,</p>
        <p>
          Te agradecemos de corazón por haber participado en el 1er Congreso Internacional de Medicina Interna. Tu energía, dedicación y entusiasmo han hecho de este evento una experiencia transformadora.
        </p>
        <p>
          Fue un privilegio contar con una asamblea tan distinguida de profesionales de la medicina, y esperamos que el congreso haya sido tan inspirador y enriquecedor para ti como lo fue para nosotros.
        </p>
        <div class="certificate">
          <p>¡Tu constancia de participación ya está disponible!</p>
        </div>
        <p>
          Puedes generar y descargar tu constancia directamente desde directamente desde nuestra plataforma <strong>Virtualis Congress</strong>, donde viviste toda la experiencia de tu congreso durante 3 días y más de 24 horas de aprendizaje!.
        </p>
        <p>
          Este certificado es un reflejo de tu compromiso con la excelencia en la medicina y reconoce tu valiosa contribución al congreso.
        </p>
        <a href="${joinUrl}" class="button">Generar mi Constancia</a>
        <p>Si el botón no funciona, copia y pega la siguiente URL en tu navegador:</p>
        <p class="highlight">${joinUrl}</p>
        <p>
          Una vez más, ¡muchas gracias por ser parte de esta experiencia transformadora y por contribuir al éxito de nuestro congreso! Esperamos poder contar contigo en futuras ediciones.
        </p>
        <p>Sinceramente,<br>
           Comité Organizador<br>
           <strong>ACP México Chapter</strong>
        </p>
      </div>
      
      <!-- Pie de página -->
      <div class="footer">
        <p>Impulsado por</p>
        <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="Logo Virtualis Congress">
        <p>Este correo fue enviado de forma automática. Por favor, no responda a este mensaje.</p>
      </div>
      
    </div>
  </div>
</body>
</html>
`;

   const congressFinalizationTemplateEnglish = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Thank You for Making the Congress a Success!</title>
  <style>
    /* General Styles */
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(to right, #eef6fc, #ffffff);
      font-family: Arial, sans-serif;
    }
    .wrapper {
      width: 100%;
      padding: 30px 0;
    }
    .container {
      background-color: #fff;
      margin: 0 auto;
      max-width: 600px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      border: 2px solid #cce4f7;
    }
    /* Header */
    .header {
      background-color: #50a49d;
      padding: 20px;
      text-align: center;
      color: #fff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .header .logo {
      margin-bottom: 10px;
      width: 250px;
      height: auto;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    /* Content */
    .content {
      padding: 20px 30px;
      color: #333;
    }
    .content p {
      line-height: 1.6;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .content .highlight {
      color: #007BFF;
      font-weight: bold;
    }
    /* Certificate Section */
    .certificate {
      background-color: #eef9ed;
      border: 2px dashed #28a745;
      padding: 20px;
      text-align: center;
      border-radius: 8px;
      margin: 20px 0;
    }
    .certificate p {
      font-weight: bold;
      font-size: 18px;
      color: #28a745;
      margin: 0;
    }
    /* Button */
    .button {
      display: inline-block;
      padding: 12px 25px;
      font-size: 16px;
      color: #fff;
      background-color: #28a745;
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
      margin: 20px 0;
    }
    /* Footer */
    .footer {
      background-color: #f0f0f0;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
    .footer .logo {
      width: 300px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="ACP México Chapter Logo">
        <h1>Thank You for Making the Congress a Success!</h1>
      </div>
      
      <!-- Main Content -->
      <div class="content">
        <p>Hello <strong>${attendeeName}</strong>,</p>
        <p>
          We wholeheartedly thank you for participating in the 1st International Congress of Internal Medicine. Your energy, dedication, and enthusiasm have made this event a transformative experience.
        </p>
        <p>
          It was a privilege to host such a distinguished gathering of medical professionals, and we hope the congress was as inspiring and enriching for you as it was for us.
        </p>
        <div class="certificate">
          <p>Your Certificate of Participation is Now Available!</p>
        </div>
        <p>
          You can generate and download your certificate directly from our <strong>Virtualis Congress</strong> platform, where you experienced the congress for 3 days and over 24 hours of learning!
        </p>
        <p>
          This certificate reflects your commitment to excellence in medicine and recognizes your invaluable contribution to the congress.
        </p>
        <a href="${joinUrl}" class="button">Generate My Certificate</a>
        <p>If the button doesn’t work, please copy and paste the following URL into your browser:</p>
        <p class="highlight">${joinUrl}</p>
        <p>
          Once again, thank you so much for being part of this transformative experience and for contributing to the success of our congress! We look forward to having you with us in future editions.
        </p>
        <p>Sincerely,<br>
           Organizing Committee<br>
           <strong>ACP México Chapter</strong>
        </p>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p>Powered by</p>
        <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="Virtualis Congress Logo">
        <p>This email was sent automatically. Please do not reply to this message.</p>
      </div>
      
    </div>
  </div>
</body>
</html>
`;

   return language === "es-MX" ? congressFinalizationTemplateSpanish : congressFinalizationTemplateEnglish;
}

interface CertificateGenerationReminderEmailTemplateProps {
   attendeeName: string;
   attendeeEmail: string;
   certificatesUrl: string;
}
export function getCertificateGenerationReminderEmailTemplate(
   language: "es-MX" | "en-US" | "pt-BR",
   { attendeeName, attendeeEmail, certificatesUrl }: CertificateGenerationReminderEmailTemplateProps,
) {
   const certificateGenerationReminderTemplateSpanish = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Recordatorio: Genera tu constancia de participación</title>
  <style>
    /* Estilos generales */
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(to right, #f0f8fc, #ffffff);
      font-family: Arial, sans-serif;
    }
    .wrapper {
      width: 100%;
      padding: 30px 0;
    }
    .container {
      background-color: #fff;
      margin: 0 auto;
      max-width: 600px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      border: 2px solid #cce4f7;
    }
    /* Encabezado */
    .header {
      background-color: #50a49d;
      padding: 20px;
      text-align: center;
      color: #fff;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
    }
    .header .logo {
      margin-bottom: 10px;
      width: 200px;
      height: auto;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    /* Contenido */
    .content {
      padding: 20px 30px;
      color: #333;
    }
    .content p {
      line-height: 1.6;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .content .highlight {
      background-color: #fffae6;
      border-left: 4px solid #ffc107;
      padding: 10px 15px;
      margin: 20px 0;
      border-radius: 4px;
      color: #856404;
      font-weight: bold;
    }
    /* Botón */
    .button {
      display: inline-block;
      padding: 12px 25px;
      font-size: 16px;
      color: #fff !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
      margin: 20px 0;
    }
    .email-field {
      background-color: #eeeeee;
      padding: 10px;
      margin: 15px 0;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    /* Pie de página */
    .footer {
      background-color: #f0f0f0;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
    .footer .logo {
      width: 120px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Encabezado -->
      <div class="header">
        <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="Logo ACP México Chapter">
        <h1>Recordatorio: Genera tu constancia</h1>
      </div>
      
      <!-- Contenido principal -->
      <div class="content">
        <p>Hola <strong>${attendeeName}</strong>,</p>
        <p>
          Notamos que aún no has generado tu <strong>constancia de participación</strong> del 1er Congreso Internacional de Medicina Interna. ¡No dejes pasar este reconocimiento a tu dedicación!
        </p>
        <div class="highlight">
          ¿Aún no has descargado tu constancia? Aquí puedes obtenerla con pocos clics.
        </div>
        <p>
          Ingresa a nuestra plataforma <strong>con tu correo electrónico</strong> y descarga tu certificado de asistencia, que refleja tu compromiso con la excelencia en la medicina.
        </p>

        <p>
         Al momento de ingresar, si te pide que escribas tu correo para iniciar sesión, por favor copia tu correo electrónico en el campo asignado.
         <br>
         Tu correo es:
       </p>
       <div class="email-field">
         ${attendeeEmail}
       </div>
       
        <a href="${certificatesUrl}" class="button">Generar mi Constancia</a>
        <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
        <p class="highlight">${certificatesUrl}</p>
        <p>
          Si ya descargaste tu constancia, ignora este mensaje. ¡Gracias por ser parte de nuestro congreso!
        </p>
      </div>
      
      <!-- Pie de página -->
      <div class="footer">
        <p>Impulsado por</p>
        <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="Logo Virtualis Congress">
        <p>Este correo fue enviado de forma automática. Por favor, no respondas a este mensaje.</p>
      </div>

    </div>
  </div>
</body>
</html>
`;

   const certificateGenerationReminderTemplateEnglish = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reminder: Generate Your Participation Certificate</title>
  <style>
    /* General Styles */
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(to right, #f0f8fc, #ffffff);
      font-family: Arial, sans-serif;
    }
    .wrapper {
      width: 100%;
      padding: 30px 0;
    }
    .container {
      background-color: #fff;
      margin: 0 auto;
      max-width: 600px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      border: 2px solid #cce4f7;
    }
    /* Header */
    .header {
      background-color: #50a49d;
      padding: 20px;
      text-align: center;
      color: #fff;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
    }
    .header .logo {
      margin-bottom: 10px;
      width: 200px;
      height: auto;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    /* Content */
    .content {
      padding: 20px 30px;
      color: #333;
    }
    .content p {
      line-height: 1.6;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .content .highlight {
      background-color: #fffae6;
      border-left: 4px solid #ffc107;
      padding: 10px 15px;
      margin: 20px 0;
      border-radius: 4px;
      color: #856404;
      font-weight: bold;
    }
    /* Email Field */
    .email-field {
      background-color: #eeeeee;
      padding: 10px;
      margin: 15px 0;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    /* Button */
    .button {
      display: inline-block;
      padding: 12px 25px;
      font-size: 16px;
      color: #fff !important;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
      margin: 20px 0;
    }
    /* Footer */
    .footer {
      background-color: #f0f0f0;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
    .footer .logo {
      width: 120px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png" alt="ACP México Chapter Logo">
        <h1>Reminder: Generate Your Certificate</h1>
      </div>
      
      <!-- Main Content -->
      <div class="content">
        <p>Hello <strong>${attendeeName}</strong>,</p>
        <p>
          We noticed you haven’t yet generated your <strong>participation certificate</strong> for the 1st International Congress of Internal Medicine. Don’t miss out on this recognition of your dedication!
        </p>
        <div class="highlight">
          Still haven’t downloaded your certificate? Get it in just a few clicks.
        </div>
        <p>
          Log in to our platform with your <strong>email address</strong> and download your attendance certificate, which reflects your commitment to excellence in medicine.
        </p>
        <p>
          When logging in, if prompted to enter your email to sign in, please copy your email in the designated field:<br>
        </p>
        <div class="email-field">
          ${attendeeEmail}
        </div>
        <a href="${certificatesUrl}" class="button">Generate My Certificate</a>
        <p>If the button doesn’t work, copy and paste this URL into your browser:</p>
        <p class="highlight">${certificatesUrl}</p>
        <p>
          If you have already downloaded your certificate, please ignore this message. Thank you for being part of our congress!
        </p>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p>Powered by</p>
        <img class="logo" src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1741919524/virtualis_congress_logo_qlmh6h.png" alt="Virtualis Congress Logo">
        <p>This email was sent automatically. Please do not reply to this message.</p>
      </div>

    </div>
  </div>
</body>
</html>
`;

   return language === "es-MX" ? certificateGenerationReminderTemplateSpanish : certificateGenerationReminderTemplateEnglish;
}
