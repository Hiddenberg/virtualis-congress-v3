// export function getPlatformRegistrationConfirmationTemplate ({
//    userName,
//    platformLink,
//    courseTitle,
//    email,
// }: {
//    userName: string
//    platformLink: string
//    email: string,
//    courseTitle: string
// }) {
//    const template = `<!DOCTYPE html>
// <html lang="es">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>¡Bienvenido a Virtualis Courses!</title>
//     <style>
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }

//         body {
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
//             line-height: 1.6;
//             color: #44403c;
//             background-color: #fafaf9;
//         }

//         .email-container {
//             max-width: 600px;
//             margin: 0 auto;
//             background-color: #ffffff;
//             box-shadow: 0 10px 25px rgba(68, 64, 60, 0.1);
//             border-radius: 16px;
//             overflow: hidden;
//         }

//         .email-header {
//             background: linear-gradient(135deg, #44403c 0%, #57534e 100%);
//             padding: 40px 30px;
//             text-align: center;
//         }

//         .brand-title {
//             color: #fbbf24;
//             font-size: 28px;
//             font-weight: 700;
//             margin-bottom: 8px;
//             letter-spacing: -0.5px;
//         }

//         .header-subtitle {
//             color: #f5f5f4;
//             font-weight: 500;
//             font-size: 16px;
//             opacity: 0.9;
//             margin-bottom: 0;
//         }

//         .email-content {
//             padding: 50px 40px;
//         }

//         .welcome-title {
//             font-size: 32px;
//             font-weight: 700;
//             color: #44403c;
//             margin-bottom: 16px;
//             text-align: center;
//             letter-spacing: -0.5px;
//         }

//         .user-name {
//             color: #92400e;
//             font-weight: 800;
//         }

//         .welcome-subtitle {
//             font-size: 18px;
//             color: #78716c;
//             margin-bottom: 32px;
//             text-align: center;
//             line-height: 1.7;
//             font-weight: 500;
//         }

//         .confirmation-container {
//             background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
//             border-radius: 16px;
//             padding: 32px 24px;
//             margin-bottom: 40px;
//             text-align: center;
//             border: 2px solid #10b981;
//         }

//         .success-icon {
//             font-size: 48px;
//             color: #059669;
//             margin-bottom: 16px;
//             display: block;
//         }

//         .confirmation-title {
//             font-size: 20px;
//             font-weight: 700;
//             color: #064e3b;
//             margin-bottom: 12px;
//         }

//         .confirmation-text {
//             font-size: 16px;
//             color: #065f46;
//             font-weight: 500;
//             line-height: 1.6;
//         }

//         .email-info {
//             background: linear-gradient(135deg, #fef3c7 0%, #f5f5f4 100%);
//             border-left: 4px solid #f59e0b;
//             padding: 20px;
//             margin-bottom: 32px;
//             border-radius: 0 12px 12px 0;
//             border: 1px solid #fbbf24;
//         }

//         .email-info-title {
//             font-size: 16px;
//             font-weight: 700;
//             color: #92400e;
//             margin-bottom: 8px;
//         }

//         .user-email {
//             font-weight: 700;
//             color: #44403c;
//             background-color: #fbbf24;
//             padding: 2px 6px;
//             border-radius: 4px;
//         }

//         .action-section {
//             text-align: center;
//             margin: 40px 0;
//         }

//         .cta-button {
//             display: inline-block;
//             background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
//             color: #451a03;
//             padding: 16px 32px;
//             border-radius: 12px;
//             text-decoration: none;
//             font-weight: 700;
//             font-size: 16px;
//             box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
//             transition: all 0.3s ease;
//             border: 2px solid #d97706;
//         }

//         .cta-button:hover {
//             background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
//             box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
//             transform: translateY(-2px);
//         }

//         .getting-started {
//             background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
//             border-radius: 16px;
//             padding: 32px 24px;
//             margin-bottom: 32px;
//             border: 1px solid #e2e8f0;
//         }

//         .getting-started-title {
//             font-size: 20px;
//             font-weight: 700;
//             color: #44403c;
//             margin-bottom: 20px;
//             text-align: center;
//         }

//         .feature-list {
//             list-style: none;
//             padding: 0;
//         }

//         .feature-item {
//             display: flex;
//             align-items: center;
//             margin-bottom: 16px;
//             font-size: 14px;
//             color: #57534e;
//             font-weight: 500;
//         }

//         .feature-icon {
//             color: #10b981;
//             font-size: 18px;
//             margin-right: 12px;
//             font-weight: 700;
//         }

//         .email-footer {
//             background: linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%);
//             padding: 40px 30px;
//             text-align: center;
//             border-top: 2px solid #d6d3d1;
//         }

//         .footer-text {
//             font-size: 14px;
//             color: #78716c;
//             margin-bottom: 8px;
//             font-weight: 500;
//         }

//         .footer-link {
//             color: #92400e;
//             text-decoration: none;
//             font-weight: 700;
//         }

//         .footer-link:hover {
//             text-decoration: underline;
//             color: #451a03;
//         }

//         .course-name {
//             font-weight: 700;
//             color: #92400e;
//         }

//         @media (max-width: 640px) {
//             .email-container {
//                 margin: 20px;
//                 border-radius: 12px;
//             }

//             .email-content {
//                 padding: 30px 24px;
//             }

//             .welcome-title {
//                 font-size: 28px;
//             }

//             .confirmation-container,
//             .getting-started {
//                 padding: 24px 20px;
//             }

//             .cta-button {
//                 padding: 14px 28px;
//                 font-size: 15px;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="email-container">
//         <!-- Header -->
//         <div class="email-header">
//             <h1 class="brand-title">Virtualis Courses</h1>
//             <p class="header-subtitle">Tu plataforma de aprendizaje profesional</p>
//         </div>

//         <!-- Main Content -->
//         <div class="email-content">
//             <h1 class="welcome-title">¡Bienvenido, <span class="user-name">${userName}</span>!</h1>
//             <p class="welcome-subtitle">
//                 Te has registrado exitosamente al
//                 <br>
//                 <span class="course-name">${courseTitle}</span>.
//                 <br>
//                 Estamos emocionados de tenerte en nuestra comunidad de aprendizaje.
//             </p>

//             <!-- Confirmation Section -->
//             <div class="confirmation-container">
//                 <span class="success-icon">✅</span>
//                 <h2 class="confirmation-title">¡Registro completado!</h2>
//                 <p class="confirmation-text">
//                     Tu cuenta ha sido verificada y está lista para usar.
//                     Ya puedes comenzar a explorar todos nuestros cursos y herramientas educativas.
//                 </p>
//             </div>

//             <!-- Email Info -->
//             <div class="email-info">
//                 <div class="email-info-title">Información de tu cuenta:</div>
//                 <p style="color: #57534e; font-weight: 500; font-size: 14px;">
//                     Tu cuenta está registrada con el correo: <span class="user-email">${email}</span>
//                 </p>
//             </div>

//             <!-- Call to Action -->
//             <div class="action-section">
//                 <a href="${platformLink}" class="cta-button">
//                     Acceder a la plataforma →
//                 </a>
//             </div>

//             <!-- Getting Started -->
//             <div class="getting-started">
//                 <h3 class="getting-started-title">¿Qué puedes hacer ahora?</h3>
//                 <ul class="feature-list">
//                     <li class="feature-item">
//                         <span class="feature-icon">📚</span>
//                         Explora nuestra biblioteca de cursos y materiales educativos
//                     </li>
//                     <li class="feature-item">
//                         <span class="feature-icon">👨‍🏫</span>
//                         Conéctate con profesores y administradores
//                     </li>
//                     <li class="feature-item">
//                         <span class="feature-icon">📊</span>
//                         Accede a métricas de rendimiento y progreso
//                     </li>
//                 </ul>
//             </div>
//         </div>

//         <!-- Footer -->
//         <div class="email-footer">
//             <p class="footer-text">
//                 Este correo fue enviado desde
//                 <a href="${platformLink}" class="footer-link">Virtualis Courses</a>
//             </p>
//             <p class="footer-text" style="margin-top: 20px; font-style: italic; color: #a8a29e;">
//                 Este es un correo automático. Por favor no respondas a este mensaje.
//             </p>
//         </div>
//     </div>
// </body>
// </html>
// `;

//    return template;
// }

// export function getOTPCodeTemplate ({
//    otpCode,
//    userEmail,
// }: {
//    otpCode: string
//    userEmail: string
// }) {
//    const template = `<!DOCTYPE html>
// <html lang="es">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Código de verificación - Virtualis Courses</title>
//     <style>
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }

//         body {
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
//             line-height: 1.6;
//             color: #44403c;
//             background-color: #fafaf9;
//         }

//         .email-container {
//             max-width: 600px;
//             margin: 0 auto;
//             background-color: #ffffff;
//             box-shadow: 0 10px 25px rgba(68, 64, 60, 0.1);
//             border-radius: 16px;
//             overflow: hidden;
//         }

//         .email-header {
//             background: linear-gradient(135deg, #44403c 0%, #57534e 100%);
//             padding: 40px 30px;
//             text-align: center;
//         }

//         .brand-title {
//             color: #fbbf24;
//             font-size: 28px;
//             font-weight: 700;
//             margin-bottom: 8px;
//             letter-spacing: -0.5px;
//         }

//         .header-subtitle {
//             color: #f5f5f4;
//             font-weight: 500;
//             font-size: 16px;
//             opacity: 0.9;
//             margin-bottom: 0;
//         }

//         .email-content {
//             padding: 50px 40px;
//         }

//         .message-title {
//             font-size: 28px;
//             font-weight: 700;
//             color: #44403c;
//             margin-bottom: 20px;
//             text-align: center;
//             letter-spacing: -0.5px;
//         }

//         .description {
//             font-size: 16px;
//             color: #78716c;
//             margin-bottom: 40px;
//             text-align: center;
//             line-height: 1.7;
//             font-weight: 500;
//         }

//         .otp-container {
//             background: linear-gradient(135deg, #fef3c7 0%, #f5f5f4 100%);
//             border-radius: 16px;
//             padding: 32px 24px;
//             margin-bottom: 40px;
//             text-align: center;
//             border: 2px solid #fbbf24;
//         }

//         .otp-title {
//             font-size: 20px;
//             font-weight: 700;
//             color: #451a03;
//             margin-bottom: 20px;
//         }

//         .otp-code {
//             font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
//             font-size: 36px;
//             font-weight: 800;
//             letter-spacing: 6px;
//             color: #92400e;
//             background: linear-gradient(135deg, #ffffff 0%, #fef9e7 100%);
//             padding: 20px 32px;
//             border-radius: 12px;
//             border: 2px solid #f59e0b;
//             display: inline-block;
//             margin: 12px 0 20px;
//             box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
//         }

//         .otp-info {
//             font-size: 14px;
//             color: #a8a29e;
//             margin-top: 12px;
//             font-weight: 600;
//         }

//         .security-notice {
//             background: linear-gradient(135deg, #fef3c7 0%, #f5f5f4 100%);
//             border-left: 4px solid #f59e0b;
//             padding: 20px;
//             margin-bottom: 32px;
//             border-radius: 0 12px 12px 0;
//             border: 1px solid #fbbf24;
//         }

//         .security-title {
//             font-size: 16px;
//             font-weight: 700;
//             color: #92400e;
//             margin-bottom: 12px;
//         }

//         .security-text {
//             font-size: 14px;
//             color: #57534e;
//             font-weight: 500;
//             line-height: 1.6;
//         }

//         .email-account {
//             font-weight: 700;
//             color: #44403c;
//             background-color: #fbbf24;
//             padding: 2px 6px;
//             border-radius: 4px;
//         }

//         .email-footer {
//             background: linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%);
//             padding: 40px 30px;
//             text-align: center;
//             border-top: 2px solid #d6d3d1;
//         }

//         .footer-text {
//             font-size: 14px;
//             color: #78716c;
//             margin-bottom: 8px;
//             font-weight: 500;
//         }

//         .footer-link {
//             color: #92400e;
//             text-decoration: none;
//             font-weight: 700;
//         }

//         .footer-link:hover {
//             text-decoration: underline;
//             color: #451a03;
//         }

//         .platform-name {
//             font-weight: 700;
//             color: #92400e;
//         }
//     </style>
// </head>
// <body>
//     <div class="email-container">
//         <!-- Header -->
//         <div class="email-header">
//             <h1 class="brand-title">Virtualis Courses</h1>
//             <p class="header-subtitle">Tu plataforma de aprendizaje profesional</p>
//         </div>

//         <!-- Main Content -->
//         <div class="email-content">
//             <h1 class="message-title">Código de verificación</h1>
//             <p class="description">
//                 Has solicitado un código de verificación para acceder a tu cuenta de <span class="platform-name">Virtualis Courses</span>. Utiliza el siguiente código para completar el proceso de verificación.
//             </p>

//             <!-- OTP Code Section -->
//             <div class="otp-container">
//                 <h2 class="otp-title">Tu código de verificación</h2>
//                 <div class="otp-code">${otpCode}</div>
//                 <p class="otp-info">Este código expirará en 15 minutos.</p>
//             </div>

//             <p class="description">
//                 Si no solicitaste este código, por favor ignora este correo o contacta a nuestro equipo de soporte.
//             </p>

//             <!-- Security Notice -->
//             <div class="security-notice">
//                 <div class="security-title">Información de seguridad:</div>
//                 <p class="security-text">
//                     Este código fue solicitado para la cuenta <span class="email-account">${userEmail}</span>.
//                     Nunca compartas este código con nadie, incluyendo personal de <span class="platform-name">Virtualis Courses</span>.
//                 </p>
//             </div>
//         </div>

//         <!-- Footer -->
//         <div class="email-footer">
//             <p class="footer-text">
//                 Este correo fue enviado desde
//                 <a href="#" class="footer-link">Virtualis Courses</a>
//             </p>
//             <p class="footer-text">
//                 Si no reconoces esta actividad, por favor cambia tu contraseña inmediatamente.
//             </p>
//             <p class="footer-text" style="margin-top: 20px; font-style: italic; color: #a8a29e;">
//                 Este es un correo automático. Por favor no respondas a este mensaje.
//             </p>
//         </div>
//     </div>
// </body>
// </html>
// `;

//    return template;
// }
