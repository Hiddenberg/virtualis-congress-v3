import Link from "next/link";

export default async function PresentationVideo({
   params,
}: {
   params: Promise<{ language: string }>;
}) {
   const { language } = await params;

   if (language !== "es-MX" && language !== "en-US" && language !== "pt-BR") {
      return null;
   }

   const mainTexts = {
      "es-MX":
         "Congreso Internacional de Medicina Interna: Conéctate con el futuro de la salud",
      "en-US": "Virtualis Congress: Connect with the future of health",
      "pt-BR":
         "Congreso Internacional de Medicina Interna: Conecte-se com o futuro da saúde",
   };

   const videoUrls = {
      "es-MX":
         "https://player.mux.com/uzvQqKYVJfYvQ5fGxMHTB7BqpHDlWWvHN5501YgUqfFE?primary-color=%23ffffff&secondary-color=%23000000&accent-color=%23fa50b5",
      "en-US":
         "https://player.mux.com/Lk3cjpAwbIj7syV01s5MlE8VI29db5zRjhFPVHAou6CM?primary-color=%23ffffff&secondary-color=%23000000&accent-color=%23fa50b5",
      "pt-BR":
         "https://player.mux.com/uoiBW00OZylCfozHWtRHbzTGGrvpu0101qzEe1azwAv9uQ?primary-color=%23ffffff&secondary-color=%23000000&accent-color=%23fa50b5",
   };

   const buttonTexts = {
      "es-MX": "Más información / Inscripción",
      "en-US": "More information / Registration",
      "pt-BR": "Mais informações / Inscrição",
   };

   return (
      <div className="mx-auto px-8 max-w-screen-xl">
         <h2 className="block md:mx-auto mb-10 px-4 w-full md:w-[40rem] font-bold text-[#A4A1B1] text-xl md:text-2xl text-center">
            {mainTexts[language]}
         </h2>

         <Link
            href="/registro"
            className="block bg-white mx-auto my-6 px-4 py-2 border rounded-full w-max text-black text-xl"
         >
            {buttonTexts[language]}
         </Link>

         <div className="block relative mb-6 rounded-xl w-full aspect-video overflow-hidden">
            <iframe
               src={videoUrls[language]}
               className="absolute inset-0 border-none w-full h-full"
               allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
               allowFullScreen={true}
            />
         </div>
      </div>
   );
}
