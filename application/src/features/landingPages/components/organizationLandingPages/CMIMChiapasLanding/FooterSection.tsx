export default function FooterSection() {
   return (
      <footer className="bg-gray-900 py-12 text-white">
         <div className="mx-auto px-4 container">
            <div className="gap-8 grid md:grid-cols-3">
               <div>
                  <h3 className="mb-4 font-bold text-xl">CMIM Chiapas</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                     Colegio de Medicina Interna Costa de Chiapas - Comprometidos con el conocimiento, guiados por la vocación en
                     medicina interna.
                  </p>
               </div>

               {/* <div>
                  <h3 className="mb-4 font-bold text-xl">Contacto</h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                     <p>📞 +52 (961) 992-0940</p>
                     <p>📧 info@congresocmim.mx</p>
                     <p>📍 Hotel Holiday Inn Tapachula</p>
                  </div>
               </div> */}

               <div>
                  <h3 className="mb-4 font-bold text-xl">Evento</h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                     <p>🗓️ 5 y 6 de Septiembre 2025</p>
                     <p>⏰ 8:00 - 15:00 hrs</p>
                     <p>🏥 30 años de experiencia</p>
                  </div>
               </div>
            </div>

            <div className="mt-8 pt-8 border-gray-700 border-t text-center">
               <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} XXIX Congreso Anual de Medicina Interna Costa de Chiapas. Todos los derechos
                  reservados.
               </p>
            </div>
         </div>
      </footer>
   );
}
