import TutorialSlider, { TutorialStep } from "./TutorialSlider";

const steps: TutorialStep[] = [
   {
      description:
         "Si es la primera vez que ingresas debes permitir el acceso a tu cámara y micrófono cuando se te solicite y activar tu audio",
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760223431/1_tehfoc.webp",
   },
   {
      description:
         "Activa tu camara y microfono, asegurate de que tu video y audio esten activos",
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760223430/2_x3dnh2.webp",
      notes: "Si tienes multiples microfonos o camaras puedes seleccionar el que deseas usar",
   },
   {
      description: `En la parte de abajo aparecerá la diapositiva que subiste anteriormente`,
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760223431/3_t0yafe.webp",
      notes: "Si quieres resaltar algo en la diapositiva, puedes hacerlo con el botón 'Dibujar'",
   },
   {
      description:
         "Una vez que estés listo(a) para grabar, puedes comenzar a grabar",
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760223429/4_srgxgk.webp",
   },
   {
      description:
         "Cuando termines de grabar, puedes detener la grabación con el botón de 'Detener grabación', tu video comenzará a procesarse, esto puede tardar unos segundos",
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760223429/5_ijcgun.webp",
   },
   {
      description:
         "Una vez que el video sea procesado, podrás revisar tu grabación en la parte de abajo, si estás satisfecho puedes hacer click en el botón 'Guardar video'",
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760223428/6_i9ridt.webp",
      notes: `Si quires volver a grabar, puedes hacerlo con el botón "Volver a grabar"`,
   },
   {
      description:
         "Una vez que hayas guardado tu grabación se subirá automáticamente a la plataforma y podrás cerrar la página",
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760223428/7_cxzdjl.webp",
   },
];

export default function HowToRecordTutorial({
   onFinish,
}: {
   onFinish: () => void;
}) {
   return (
      <TutorialSlider
         title="Tutorial: Cómo grabar tu presentación"
         steps={steps}
         onFinish={onFinish}
         lastButtonText="Comenzar a grabar"
      />
   );
}
