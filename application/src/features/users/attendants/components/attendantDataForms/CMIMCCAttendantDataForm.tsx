"use client";

import {
   AlertCircle,
   DollarSign,
   FileText,
   GraduationCap,
   Heart,
   Info,
   LucideIcon,
   Monitor,
   Stethoscope,
   Upload,
   User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import HelpButton from "@/features/userSupport/components/HelpButton";
import { uploadAttendantCredentialFileAction } from "../../serverActions/attendatCredentialFileActions";
import { submitCMIMCCAttendantDataAction } from "../../serverActions/CMIMCCAttendantActions";

export type CMIMCCMedicalRoleType =
   | "specialist"
   | "general"
   | "health_professional"
   | "student/resident";

export interface MedicalRole {
   id: CMIMCCMedicalRoleType;
   title: string;
   price: string;
   priceAmount: number;
   icon: LucideIcon;
   color: string;
   bgColor: string;
   textColor: string;
   requiresVerification: boolean;
   description: string;
}

export default function CMIMCCAttendantDataForm() {
   const [selectedRole, setSelectedRole] =
      useState<CMIMCCMedicalRoleType>("specialist");
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [dragActive, setDragActive] = useState(false);
   const [isSubmitting, startTransition] = useTransition();

   const medicalRoles: MedicalRole[] = [
      {
         id: "specialist",
         title: "Especialista / Subespecialista",
         price: "$2,000 MXN",
         priceAmount: 2000,
         icon: Stethoscope,
         color: "from-blue-500 to-blue-600",
         bgColor: "bg-blue-50",
         textColor: "text-blue-600",
         requiresVerification: false,
         description:
            "Médicos certificados en especialidades o subespecialidades",
      },
      {
         id: "general",
         title: "Médico General",
         price: "$1,500 MXN",
         priceAmount: 1500,
         icon: Heart,
         color: "from-green-500 to-green-600",
         bgColor: "bg-green-50",
         textColor: "text-green-600",
         requiresVerification: true,
         description: "Médicos generales titulados y en ejercicio",
      },
      {
         id: "health_professional",
         title: "Profesional de la Salud",
         price: "$1,000 MXN",
         priceAmount: 1000,
         icon: User,
         color: "from-purple-500 to-purple-600",
         bgColor: "bg-purple-50",
         textColor: "text-purple-600",
         requiresVerification: true,
         description:
            "Enfermeros, nutriólogos, psicólogos, y otros profesionales",
      },
      {
         id: "student/resident",
         title: "Estudiante / Residente",
         price: "$700 MXN",
         priceAmount: 700,
         icon: GraduationCap,
         color: "from-orange-500 to-orange-600",
         bgColor: "bg-orange-50",
         textColor: "text-orange-600",
         requiresVerification: true,
         description: "Estudiantes de medicina y médicos residentes",
      },
   ];

   const router = useRouter();

   const selectedRoleData = medicalRoles.find(
      (role) => role.id === selectedRole,
   );

   const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         setSelectedFile(file);
      }
   };

   const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(false);
      const file = event.dataTransfer.files?.[0];
      if (file) {
         setSelectedFile(file);
      }
   };

   const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(true);
   };

   const handleDragLeave = () => {
      setDragActive(false);
   };

   const removeFile = () => {
      setSelectedFile(null);
   };

   const handleSubmitt = () => {
      startTransition(async () => {
         if (!selectedRoleData) {
            toast.error("No se ha seleccionado una categoría profesional");
            return;
         }

         if (selectedRoleData?.requiresVerification) {
            if (!selectedFile) {
               return;
            }

            toast.loading("Subiendo archivo...");
            const response = await uploadAttendantCredentialFileAction({
               fileType: `Comprobante ${selectedRoleData.title}`,
               file: selectedFile,
            });

            if (!response.success) {
               toast.error(response.errorMessage);
               return;
            }
            toast.dismiss();
            toast.success("Archivo subido correctamente");
         }

         const attendantData = await submitCMIMCCAttendantDataAction({
            medicalRole: selectedRoleData.id,
         });

         if (!attendantData.success) {
            toast.error(attendantData.errorMessage);
            return;
         }

         toast.success("Datos guardados correctamente");
         router.push("/payment");
      });
   };

   return (
      <div className="space-y-4 sm:space-y-6 md:space-y-8 mx-auto p-3 sm:p-4 md:p-6 max-w-4xl">
         {/* Header */}
         <div className="text-center">
            <h1 className="mb-2 sm:mb-3 md:mb-4 font-bold text-gray-800 text-2xl sm:text-3xl px-2">
               Información de Registro
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed px-2">
               Selecciona tu categoría profesional para tu registro al congreso
            </p>
         </div>

         {/* Pricing Information Banner */}
         <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-6 border border-blue-200 rounded-xl sm:rounded-2xl">
            <div className="flex items-start gap-3 sm:gap-4">
               <div className="flex flex-shrink-0 justify-center items-center bg-blue-100 rounded-full w-10 h-10 sm:w-12 sm:h-12">
                  <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
               </div>
               <div className="flex-1 min-w-0">
                  <h3 className="mb-2 sm:mb-3 font-bold text-gray-800 text-lg sm:text-xl">
                     Información sobre Precios
                  </h3>
                  <div className="gap-4 sm:gap-6 grid md:grid-cols-2">
                     <div>
                        <h4 className="flex items-center gap-2 mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                           <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                           Modalidad Presencial
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                           Los precios mostrados abajo corresponden a la{" "}
                           <strong>asistencia presencial</strong> al congreso en
                           el Hotel Holiday Inn Tapachula.
                        </p>
                     </div>
                     <div>
                        <h4 className="flex items-center gap-2 mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                           <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600 flex-shrink-0" />
                           Modalidad Virtual
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                           Si eliges asistencia <strong>virtual</strong>, el
                           precio será de <strong>$1,500 MXN</strong> para todas
                           las categorías profesionales.
                        </p>
                     </div>
                  </div>
                  <div className="bg-blue-100 mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg">
                     <p className="text-blue-800 text-xs sm:text-sm">
                        💡 <strong>Nota:</strong> Podrás elegir entre modalidad
                        presencial o virtual en la página de pago.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex justify-center pb-2 sm:pb-4">
            <HelpButton />
         </div>

         {/* Medical Role Selection */}
         <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
               <h2 className="flex items-center gap-2 sm:gap-3 font-bold text-gray-800 text-xl sm:text-2xl">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                  Categoría Profesional
               </h2>
               <div className="font-medium text-gray-500 text-xs sm:text-sm">
                  Precios para modalidad presencial
               </div>
            </div>

            <div className="gap-3 sm:gap-4 grid md:grid-cols-2">
               {medicalRoles.map((role) => {
                  const IconComponent = role.icon;
                  const isSelected = selectedRole === role.id;

                  return (
                     <div
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`relative cursor-pointer rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 transition-all duration-300 hover:shadow-lg ${
                           isSelected
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                     >
                        {/* Verification Badge */}
                        {role.requiresVerification && (
                           <div className="-top-1 -right-1 sm:-top-2 sm:-right-2 absolute bg-amber-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold text-white text-xs">
                              Requiere verificación
                           </div>
                        )}

                        <div className="flex items-start gap-3 sm:gap-4">
                           <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${role.color} rounded-full flex items-center justify-center flex-shrink-0`}
                           >
                              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                           </div>

                           <div className="flex-1 min-w-0">
                              <h3 className="mb-1 font-bold text-gray-900 text-sm sm:text-base">
                                 {role.title}
                              </h3>
                              <p className="mb-2 sm:mb-3 text-gray-600 text-xs sm:text-sm">
                                 {role.description}
                              </p>
                              {/* <div className="space-y-1">
                                 <div className="font-bold text-gray-900 text-2xl">
                                    {role.price}
                                 </div>
                                 <div className="text-gray-500 text-xs">
                                    Modalidad presencial
                                 </div>
                              </div> */}
                           </div>
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                           <div className="top-2 right-2 sm:top-4 sm:right-4 absolute">
                              <div className="flex justify-center items-center bg-blue-500 rounded-full w-5 h-5 sm:w-6 sm:h-6">
                                 <div className="bg-white rounded-full w-1.5 h-1.5 sm:w-2 sm:h-2" />
                              </div>
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Document Upload Section */}
         {selectedRoleData?.requiresVerification && (
            <div className="space-y-4 sm:space-y-6">
               <div className="bg-amber-50 p-4 sm:p-6 border border-amber-200 rounded-lg sm:rounded-xl">
                  <div className="flex items-start gap-2 sm:gap-3">
                     <AlertCircle className="flex-shrink-0 mt-0.5 w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                     <div className="min-w-0 flex-1">
                        <h3 className="mb-2 font-semibold text-amber-800 text-sm sm:text-base">
                           Verificación Requerida
                        </h3>
                        <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                           Para acceder a la tarifa de{" "}
                           <strong>{selectedRoleData.title}</strong>, necesitas
                           subir un documento que confirme tu estatus
                           profesional o académico.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="space-y-3 sm:space-y-4">
                  <h3 className="flex items-center gap-2 sm:gap-3 font-bold text-gray-800 text-lg sm:text-xl">
                     <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                     Subir Documento de Verificación
                  </h3>

                  {/* Accepted Documents Info */}
                  <div className="bg-blue-50 p-3 sm:p-4 border border-blue-200 rounded-lg sm:rounded-xl">
                     <h4 className="mb-2 font-semibold text-blue-800 text-sm sm:text-base">
                        Documentos Aceptados:
                     </h4>
                     <ul className="space-y-1 text-blue-700 text-xs sm:text-sm">
                        {selectedRole === "health_professional" && (
                           <>
                              <li>• Cédula profesional</li>
                              <li>• Título universitario</li>
                              <li>• Constancia laboral actual</li>
                           </>
                        )}
                        {selectedRole === "student/resident" && (
                           <>
                              <li>• Credencial de estudiante vigente</li>
                              <li>• Constancia de estudios</li>
                              <li>• Carta de residencia médica</li>
                           </>
                        )}
                     </ul>
                  </div>

                  {/* File Upload Area */}
                  <div
                     onDrop={handleDrop}
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                     className={`border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center transition-all duration-300 ${
                        dragActive
                           ? "border-blue-500 bg-blue-50"
                           : selectedFile
                             ? "border-green-500 bg-green-50"
                             : "border-gray-300 bg-gray-50 hover:border-gray-400"
                     }`}
                  >
                     {selectedFile ? (
                        <div className="space-y-3 sm:space-y-4">
                           <div className="flex justify-center items-center bg-green-100 mx-auto rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                              <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
                           </div>
                           <div>
                              <p className="font-semibold text-green-800 text-sm sm:text-base break-words">
                                 {selectedFile.name}
                              </p>
                              <p className="text-green-600 text-xs sm:text-sm">
                                 {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                 MB
                              </p>
                           </div>
                           <button
                              onClick={removeFile}
                              className="text-red-600 hover:text-red-800 text-xs sm:text-sm underline"
                           >
                              Remover archivo
                           </button>
                        </div>
                     ) : (
                        <div className="space-y-3 sm:space-y-4">
                           <div className="flex justify-center items-center bg-gray-200 mx-auto rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                              <Upload className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-500" />
                           </div>
                           <div>
                              <p className="mb-2 font-semibold text-gray-700 text-base sm:text-lg px-2">
                                 Arrastra tu archivo aquí o haz clic para
                                 seleccionar
                              </p>
                              <p className="text-gray-500 text-xs sm:text-sm px-2">
                                 Formatos aceptados: PDF, JPG, PNG (máx. 5MB)
                              </p>
                           </div>
                           <input
                              type="file"
                              onChange={handleFileSelected}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              id="file-upload"
                           />
                           <label
                              htmlFor="file-upload"
                              className="inline-block bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-white text-sm sm:text-base transition-colors cursor-pointer"
                           >
                              Seleccionar Archivo
                           </label>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* Summary and Continue */}
         {selectedRole && (
            <div className="bg-white shadow-lg p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl">
               <h3 className="mb-3 sm:mb-4 font-bold text-gray-800 text-lg sm:text-xl">
                  Resumen de Registro
               </h3>

               <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center gap-2">
                     <div className="min-w-0 flex-1">
                        <p className="text-gray-600 text-xs sm:text-sm">
                           Categoría seleccionada:
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                           {selectedRoleData?.title}
                        </p>
                     </div>
                  </div>

                  {/* <div className="bg-gray-50 p-4 rounded-xl">
                     <h4 className="mb-2 font-semibold text-gray-800">Precios según modalidad:</h4>
                     <div className="gap-4 grid grid-cols-2 text-sm">
                        <div className="flex justify-between">
                           <span className="text-gray-600">Presencial:</span>
                           <span className="font-semibold text-gray-900">{selectedRoleData?.price}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-gray-600">Virtual:</span>
                           <span className="font-semibold text-gray-900">$1,500 MXN</span>
                        </div>
                     </div>
                  </div> */}
               </div>

               {/* {selectedRoleData?.requiresVerification && (
                  <div className="mb-6">
                     <p className="text-gray-600 text-sm">
                        Estado de verificación: {' '}
                        <span className={uploadedFile ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>
                           {uploadedFile ? 'Documento subido' : 'Pendiente de documento'}
                        </span>
                     </p>
                  </div>
               )} */}

               <Button
                  disabled={
                     selectedRoleData?.requiresVerification && !selectedFile
                  }
                  loading={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 hover:from-blue-700 disabled:from-gray-400 to-blue-700 hover:to-blue-800 disabled:to-gray-500 shadow-lg hover:shadow-xl px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl !w-full font-bold text-white disabled:text-white text-base sm:text-lg transition-all duration-300 disabled:cursor-not-allowed transform"
                  onClick={handleSubmitt}
               >
                  {selectedRoleData?.requiresVerification && !selectedFile
                     ? "Sube tu documento para continuar"
                     : isSubmitting
                       ? "Subiendo..."
                       : "Continuar al Pago"}
               </Button>
            </div>
         )}
      </div>
   );
}
