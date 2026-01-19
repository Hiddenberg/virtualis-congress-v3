import TutorialSlider, { type TutorialStep } from "./TutorialSlider";

const steps: TutorialStep[] = [
   {
      description:
         "Haz click o arrastra tu archivo de powerpoint en la sección de subir diapositiva",
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760219059/presentation-1_rinqu8.webp",
      notes: "Solo se aceptan archivos de powerpoint (.pptx o .ppt)",
   },
   {
      description: `Una vez que el archivo esté seleccionado haz click en el botón de "Subir diapositiva"`,
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760219058/presentation-2_z0ycwx.webp",
   },
   {
      description: `Espera a que el sistema procese el archivo`,
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760219058/presentation-3_u3xsok.webp",
      notes: "Este proceso puede tardar un poco, dependiendo del tamaño del archivo",
   },
   {
      description: `Una vez que el archivo sea procesado podrás ver tus diapositivas para confirmar que se procesaron correctamente, si estás satisfecho puedes hacer click en el botón "Guardar diapositiva"`,
      imageURL:
         "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760219059/presentation-4_r5cnxg.webp",
      notes: `Si quieres subir una diapositiva distinta, puedes hacer click en "Convertir otra presentación"`,
   },
];

export default function HowToUploadPresentationTutorial({
   onFinish,
}: {
   onFinish: () => void;
}) {
   return (
      <TutorialSlider
         title="Tutorial: Cómo subir tu presentación"
         steps={steps}
         onFinish={onFinish}
         lastButtonText="Subir mi diapositiva"
      />
   );
}
