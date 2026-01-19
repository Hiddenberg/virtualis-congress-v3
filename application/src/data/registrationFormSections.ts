import validator from "validator";

function isValidEmail(email: DynamicFormInput["value"]) {
   if (typeof email !== "string") {
      return false;
   }

   return validator.isEmail(email);
}

function isValidPhone(phone: DynamicFormInput["value"]) {
   if (typeof phone !== "string") {
      return false;
   }

   return validator.isMobilePhone(phone);
}

export const registrationFormSections: FormSection[] = [
   {
      title: "ACP ID",
      questions: [
         {
            name: "acpID",
            type: "text",
            required: false,
            label: "ACP ID",
            value: "",
         },
      ],
   },
   {
      title: "Afiliados",
      questions: [
         {
            name: "isCMIMAffiliated",
            type: "boolean",
            required: true,
            label: "¿Estás afiliado al Colegio De Medicina Interna De Mexico o a la Sociedad Mexicana de Nutrición y Endocrinología?",
            value: null,
         },
      ],
   },
   {
      title: "Datos Personales",
      questions: [
         {
            name: "name",
            label: "Nombre completo",
            type: "text",
            required: true,
            value: "",
         },
         {
            name: "email",
            label: "Correo electrónico",
            type: "email",
            required: true,
            validation: isValidEmail,
            validationErrorMessage: "Ingrese un correo electrónico válido",
            value: "",
         },
         {
            name: "phone",
            label: "Número de teléfono",
            type: "phone",
            required: false,
            validation: isValidPhone,
            validationErrorMessage: "Ingrese un número de teléfono válido",
            value: "",
         },
         {
            name: "age",
            label: "Edad",
            type: "number",
            required: true,
            value: 0,
         },
      ],
   },
   {
      title: "Datos demográficos",
      questions: [
         {
            name: "sex",
            type: "select",
            required: true,
            label: "sexo",
            value: "",
            options: ["Masculino", "Femenino", "Otro"],
         },
         {
            name: "country",
            type: "select",
            required: true,
            label: "País",
            value: "",
            options: [
               "Argentina",
               "Bolivia",
               "Brasil",
               "Chile",
               "Colombia",
               "Costa Rica",
               "Cuba",
               "Ecuador",
               "El Salvador",
               "Estados Unidos",
               "Guatemala",
               "Guyana",
               "Haití",
               "Honduras",
               "Jamaica",
               "México",
               "Nicaragua",
               "Panamá",
               "Paraguay",
               "Perú",
               "República Dominicana",
               "Surinam",
               "Trinidad y Tobago",
               "Uruguay",
               "Venezuela",
               "Canadá",
               "Belice",
               "Bahamas",
               "Barbados",
               "San Vicente y las Granadinas",
               "Santa Lucía",
               "San Cristóbal y Nieves",
               "Dominica",
               "Antigua y Barbuda",
               "Granada",
               "Otro",
            ],
         },
         {
            name: "city",
            type: "text",
            required: true,
            label: "Ciudad",
            value: "",
         },
      ],
   },
   {
      title: "Datos profesionales",
      questions: [
         {
            label: "Grado de estudios",
            type: "select",
            name: "studiesGrade",
            required: true,
            options: [
               "Estudiante",
               "Residente",
               "Estudiante/Residente sin credencial",
               "Médico general",
               "Médico especialista",
               "Médico en transición escolar",
            ],
            value: "",
         },
         {
            label: "Institución a la que pertenece",
            type: "select",
            name: "institution",
            required: true,
            options: [
               "Universidad Pública",
               "Universidad Privada",
               "Institución de salud pública",
               "Práctica Privada",
            ],
            value: "",
         },
         {
            label: "¿Tiene contacto con médicos en formación?",
            type: "select",
            name: "contactWithStudents",
            required: true,
            options: [
               "Estudiantes de pregrado",
               "Residentes",
               "Estudiantes de posgrado como maestría",
               "Estudiantes de doctorado",
               "Estudiantes de alta especialidad médica",
               "Ninguno",
            ],
            value: "",
         },
      ],
   },
   {
      title: "Feedback",
      questions: [
         {
            label: "¿Por qué medio se enteró del curso?",
            type: "select",
            name: "howDidYouHearAboutTheCourse",
            required: true,
            value: "",
            options: [
               "Invitación",
               "Hospital",
               "Colegio",
               "Redes sociales",
               "Whatsapp",
               "Otro",
            ],
         },
         {
            label: "¿Si no eres miembro te gustaría ser miembro del ACP?",
            type: "boolean",
            name: "wantToBeACPMember",
            required: true,
            value: null,
         },
         {
            label: "¿Te gustaría recibir notificaciones de los eventos del ACP México Chapter?",
            type: "boolean",
            name: "wantToReceiveNotifications",
            required: true,
            value: null,
         },
         {
            label: "¿Por qué medio te gustaría recibir las notificaciones?",
            type: "select",
            name: "notificationsPreference",
            required: false,
            value: "",
            options: ["Email", "Whatsapp", "Ninguno"],
         },
      ],
   },
];
