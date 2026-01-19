interface ACPAdditionalData {
   acpId: string;
   age: number;
   city: string;
   contactWithStudents:
      | "Estudiantes de pregrado"
      | "Residentes"
      | "Estudiantes de posgrado como maestría"
      | "Estudiantes de doctorado"
      | "Estudiantes de alta especialidad médica"
      | "Ninguno";
   country: string;
   howDidYouHearAboutTheCourse:
      | "Invitación"
      | "Hospital"
      | "Colegio"
      | "Redes sociales"
      | "Whatsapp"
      | "Otro";
   institution:
      | "Universidad Pública"
      | "Universidad Privada"
      | "Institución de salud pública"
      | "Práctica Privada";
   isCMIMAffiliated: boolean;
   notificationsPreference: "Email" | "Whatsapp" | "Ninguno";
   sex: "Masculino" | "Femenino" | "Otro";
   studiesGrade:
      | "Estudiante"
      | "Residente"
      | "Médico general"
      | "Médico especialista";
   wantToBeACPMember: boolean;
   wantToReceiveNotifications: boolean;
}
