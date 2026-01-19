/* eslint-disable @next/next/no-img-element */
"use client";

import {
   ArrowLeftIcon,
   CheckCircleIcon,
   GraduationCapIcon,
   StethoscopeIcon,
   UploadIcon,
   UserIcon,
   UsersIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { getACPDiabetesCheckoutLinkAction } from "@/features/organizationPayments/serverActions/organizationPaymentActions";
import { validateACPIDAction } from "../../serverActions/ACPDiabetesAttendantActions";
import { createAttendantAdditionalDataAction } from "../../serverActions/attendantAdditionalDataActions";
import { uploadAttendantCredentialFileAction } from "../../serverActions/attendatCredentialFileActions";
import type { ACPDiabetesAdditionalAttendantData } from "../../types/ACPDiabetesAdditionalAttendantDataTypes";

function BackButton({ onClick }: { onClick: () => void }) {
   return (
      <Button
         onClick={onClick}
         variant="outline"
         className="hover:!bg-gray-50 !px-3 sm:!px-4 !py-1.5 sm:!py-2 !border-gray-300 !text-gray-600 hover:!text-gray-800 !text-sm sm:!text-base"
      >
         <ArrowLeftIcon className="w-3 sm:w-4 h-3 sm:h-4" />
         Volver
      </Button>
   );
}

function IsACPMemberForm({
   setFormStage,
}: {
   setFormStage: (stage: FormStage) => void;
}) {
   return (
      <div className="mx-auto px-2 sm:px-4 max-w-2xl">
         {/* Header Card */}
         <div className="bg-white shadow-lg mb-4 sm:mb-6 md:mb-8 p-4 sm:p-6 md:p-8 border border-gray-100 rounded-xl sm:rounded-2xl">
            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
               <div className="flex justify-center items-center bg-blue-50 mx-auto mb-3 sm:mb-4 rounded-full w-14 sm:w-16 h-14 sm:h-16">
                  <UsersIcon className="w-7 sm:w-8 h-7 sm:h-8 text-blue-600" />
               </div>
               <h1 className="mb-2 px-2 font-bold text-gray-900 text-xl sm:text-2xl">
                  Información de Afiliación
               </h1>
               <p className="px-2 text-gray-600 text-sm sm:text-base">
                  ¿Estás afiliado al ACP?
               </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
               <div className="gap-3 sm:gap-4 grid grid-cols-1 md:grid-cols-2">
                  <button
                     onClick={() => setFormStage("validate_acp_id")}
                     className="group bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg p-4 sm:p-5 md:p-6 border-2 border-blue-200 hover:border-blue-400 rounded-lg sm:rounded-xl transition-all duration-200"
                  >
                     <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex flex-shrink-0 justify-center items-center bg-blue-100 group-hover:bg-blue-200 rounded-full w-10 sm:w-12 h-10 sm:h-12 transition-colors">
                           <CheckCircleIcon className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                           <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                              Sí, estoy afiliado
                           </h3>
                           <p className="mt-1 text-gray-600 text-xs sm:text-sm">
                              Verificar ACP ID
                           </p>
                        </div>
                     </div>
                  </button>

                  <button
                     onClick={() => setFormStage("select_no_affiliated_role")}
                     className="group bg-gradient-to-br from-gray-50 to-slate-50 hover:shadow-lg p-4 sm:p-5 md:p-6 border-2 border-gray-200 hover:border-gray-400 rounded-lg sm:rounded-xl transition-all duration-200"
                  >
                     <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex flex-shrink-0 justify-center items-center bg-gray-100 group-hover:bg-gray-200 rounded-full w-10 sm:w-12 h-10 sm:h-12 transition-colors">
                           <UserIcon className="w-5 sm:w-6 h-5 sm:h-6 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                           <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                              No estoy afiliado
                           </h3>
                           <p className="mt-1 text-gray-600 text-xs sm:text-sm">
                              Continuar como profesional independiente
                           </p>
                        </div>
                     </div>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

function ValidateACPIDForm({
   setFormStage,
   acpID,
   setACPID,
}: {
   setFormStage: (stage: FormStage) => void;
   acpID: string | null;
   setACPID: (acpID: string | null) => void;
}) {
   const [isSubmitting, startTransition] = useTransition();
   const [error, setError] = useState<string | null>(null);

   const handleValidateACPID = () => {
      startTransition(async () => {
         if (!acpID || acpID.trim() === "") {
            setError("Por favor ingresa tu número de afiliación ACP");
            return;
         }
         setError(null);

         const validateACPIDResponse = await validateACPIDAction({
            acpID: acpID.trim(),
         });
         if (!validateACPIDResponse.success) {
            setError(validateACPIDResponse.errorMessage);
            return;
         }

         // if ACP ID is NOT valid set form stage to upload_acp_screenshot
         if (validateACPIDResponse.data.isValid === false) {
            setFormStage("upload_acp_screenshot");
            return;
         }

         // if ACP ID is valid set form stage to select_acp_affiliated_role
         setFormStage("select_acp_affiliated_role");
         return;
      });
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setACPID(e.target.value);
      if (error) setError(null); // Clear error when user starts typing
   };

   return (
      <div className="mx-auto px-2 sm:px-4 max-w-2xl">
         <div className="bg-white shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 rounded-xl sm:rounded-2xl">
            <div className="mb-4 sm:mb-6">
               <BackButton onClick={() => setFormStage("is_acp_member")} />
            </div>

            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
               <div className="flex justify-center items-center bg-green-50 mx-auto mb-3 sm:mb-4 rounded-full w-14 sm:w-16 h-14 sm:h-16">
                  <CheckCircleIcon className="w-7 sm:w-8 h-7 sm:h-8 text-green-600" />
               </div>
               <h1 className="mb-2 px-2 font-bold text-gray-900 text-xl sm:text-2xl">
                  Verificación de Afiliación ACP
               </h1>
               <p className="px-2 text-gray-600 text-xs sm:text-sm">
                  Ingresa tu número de afiliación para verificar tu membresía en
                  la ACP
               </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
               <div className="space-y-2">
                  <label
                     htmlFor="acp-id"
                     className="block font-medium text-gray-700 text-xs sm:text-sm"
                  >
                     Número de Afiliación ACP{" "}
                     <span className="text-red-500">*</span>
                  </label>
                  <input
                     id="acp-id"
                     type="text"
                     value={acpID ?? ""}
                     onChange={handleInputChange}
                     placeholder="ACP ID"
                     className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm sm:text-base transition-all duration-200"
                     disabled={isSubmitting}
                  />
                  {error && (
                     <p className="flex items-center gap-2 text-red-600 text-xs sm:text-sm">
                        <span className="text-red-500">⚠</span>
                        {error}
                     </p>
                  )}
               </div>

               <Button
                  onClick={handleValidateACPID}
                  loading={isSubmitting}
                  disabled={!acpID?.trim()}
                  className="!px-4 sm:!px-6 !py-2.5 sm:!py-3 w-full !font-semibold !text-sm sm:!text-base"
                  variant="primary"
               >
                  {isSubmitting ? "Verificando..." : "Verificar Afiliación"}
               </Button>

               <div className="text-center">
                  <p className="px-2 text-gray-500 text-xs">
                     ¿No recuerdas tu número de afiliación?
                     <a
                        href="mailto:soporte@acp.org"
                        className="ml-1 text-blue-600 hover:text-blue-800 underline"
                     >
                        Contacta al soporte de ACP
                     </a>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}

function UploadACPIDScreenshotForm({
   setFormStage,
}: {
   setFormStage: (stage: FormStage) => void;
}) {
   const [isSubmitting, startTransition] = useTransition();
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [dragActive, setDragActive] = useState(false);

   const handleUploadACPIScreenshot = () => {
      startTransition(async () => {
         if (!selectedFile) {
            toast.error(
               "Por favor sube una imagen de tu certificado de afiliación",
            );
            return;
         }

         const uploadACPIScreenshotResponse =
            await uploadAttendantCredentialFileAction({
               fileType: "ACP Certificate",
               file: selectedFile,
            });

         if (!uploadACPIScreenshotResponse.success) {
            toast.error(uploadACPIScreenshotResponse.errorMessage);
            return;
         }

         setFormStage("select_acp_affiliated_role");
         return;
      });
   };

   const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
         setDragActive(true);
      } else if (e.type === "dragleave") {
         setDragActive(false);
      }
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         setSelectedFile(e.dataTransfer.files[0]);
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         setSelectedFile(e.target.files[0]);
      }
   };

   const steps = [
      {
         icon: "🌐",
         text: "Ingresa a tu cuenta ACP en el enlace de abajo",
      },
      {
         icon: "🪪",
         text: "Toma una captura donde aparezca tu nombre y número de afiliación ACP",
      },
      {
         icon: "📤",
         text: "Sube la imagen de tu certificado aquí",
      },
   ];

   const exampleScreenshotURL =
      "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1760831914/Screen_Shot_2025-10-18_at_17.48.34_p.m._qeueoy.webp";
   const acpURL = "https://www.acponline.org/myacp";

   return (
      <div className="mx-auto px-2 sm:px-4 max-w-2xl">
         <div className="bg-white shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 rounded-xl sm:rounded-2xl">
            <div className="mb-4 sm:mb-6">
               <BackButton onClick={() => setFormStage("validate_acp_id")} />
            </div>

            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
               <div className="flex justify-center items-center bg-amber-50 mx-auto mb-3 sm:mb-4 rounded-full w-14 sm:w-16 h-14 sm:h-16">
                  <UploadIcon className="w-7 sm:w-8 h-7 sm:h-8 text-amber-600" />
               </div>
               <h1 className="mb-2 px-2 font-bold text-gray-900 text-xl sm:text-2xl">
                  Confirmación de Afiliación
               </h1>
               <p className="px-2 text-gray-600 text-xs sm:text-sm">
                  Tu <strong>ACP ID</strong> no aparece en nuestra base de
                  datos.
               </p>
               <p className="px-2 text-gray-600 text-xs sm:text-sm">
                  Por favor sube una captura donde aparezca tu nombre y ACP ID.
               </p>
            </div>

            {/* Step by step instructions */}
            <div className="bg-blue-50 mb-4 sm:mb-6 md:mb-8 p-4 sm:p-6 rounded-lg sm:rounded-xl">
               <h3 className="flex items-center gap-2 mb-3 sm:mb-4 font-semibold text-blue-900 text-sm sm:text-base">
                  <span className="text-blue-600">📋</span>
                  Cómo obtener la captura:
               </h3>
               <div className="space-y-1.5 sm:space-y-2">
                  {steps.map((step, index) => (
                     <div
                        key={index}
                        className="flex items-start gap-2 sm:gap-3"
                     >
                        <span className="flex-shrink-0 mt-0.5 text-base sm:text-lg">
                           {step.icon}
                        </span>
                        <span className="text-blue-800 text-xs sm:text-sm">
                           {step.text}
                        </span>
                     </div>
                  ))}
               </div>

               <p className="mt-3 sm:mt-4 text-blue-700 text-xs">
                  <strong>Ejemplo:</strong>
               </p>
               <div className="bg-white mt-3 sm:mt-4 p-2 sm:p-3 border border-blue-200 rounded-lg">
                  <img
                     src={exampleScreenshotURL}
                     alt="Ejemplo de captura"
                     className="rounded-lg w-full h-auto"
                  />
               </div>
               <div className="bg-white mt-3 sm:mt-4 p-2 sm:p-3 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-xs break-words">
                     <strong>URL de tu cuenta ACP:</strong>{" "}
                     <a
                        href={acpURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                     >
                        {acpURL}
                     </a>
                  </p>
               </div>
            </div>

            {/* File upload area */}
            <div className="space-y-3 sm:space-y-4">
               <div
                  className={`relative border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center transition-all duration-200 ${
                     dragActive
                        ? "border-blue-400 bg-blue-50"
                        : selectedFile
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
               >
                  <input
                     type="file"
                     accept="image/*,.pdf"
                     onChange={handleFileChange}
                     className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                     id="file-upload"
                  />

                  <div className="space-y-3 sm:space-y-4">
                     {selectedFile ? (
                        <>
                           <div className="flex justify-center items-center bg-green-100 mx-auto rounded-full w-10 sm:w-12 h-10 sm:h-12">
                              <CheckCircleIcon className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                           </div>
                           <div>
                              <p className="font-medium text-green-800 text-sm sm:text-base break-words">
                                 {selectedFile.name}
                              </p>
                              <p className="text-green-600 text-xs sm:text-sm">
                                 {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                 MB
                              </p>
                           </div>
                        </>
                     ) : (
                        <>
                           <div className="flex justify-center items-center bg-gray-100 mx-auto rounded-full w-10 sm:w-12 h-10 sm:h-12">
                              <UploadIcon className="w-5 sm:w-6 h-5 sm:h-6 text-gray-600" />
                           </div>
                           <div>
                              <p className="px-2 font-medium text-gray-900 text-sm sm:text-base">
                                 Arrastra tu captura aquí o haz clic para
                                 seleccionar la imagen
                              </p>
                              <p className="mt-1 text-gray-500 text-xs sm:text-sm">
                                 PNG, JPG, PDF hasta 10MB
                              </p>
                           </div>
                        </>
                     )}
                  </div>
               </div>

               <Button
                  disabled={!selectedFile}
                  onClick={handleUploadACPIScreenshot}
                  loading={isSubmitting}
                  className="!px-4 sm:!px-6 !py-2.5 sm:!py-3 w-full !font-semibold !text-sm sm:!text-base"
                  variant="primary"
               >
                  {isSubmitting ? "Subiendo captura..." : "Subir captura"}
               </Button>
            </div>
         </div>
      </div>
   );
}

function SelectACPAffiliatedRoleForm({
   setFormStage,
   acpID,
}: {
   setFormStage: (stage: FormStage) => void;
   acpID: string | null;
}) {
   const [isSubmitting, startTransition] = useTransition();
   const [selectedRole, setSelectedRole] = useState<
      "student" | "doctor" | null
   >(null);

   const handleGetAffiliatedRolePrice = () => {
      startTransition(async () => {
         if (!selectedRole) {
            toast.error("Por favor selecciona tu rol médico");
            return;
         }

         // Save the attendant data with the selected role and ACP ID
         const attendantDataResponse =
            await createAttendantAdditionalDataAction<ACPDiabetesAdditionalAttendantData>(
               {
                  additionalData: {
                     acpID: acpID ?? undefined,
                     isACPMember: true,
                     medicalRole: selectedRole,
                  },
               },
            );

         if (!attendantDataResponse.success) {
            toast.error(attendantDataResponse.errorMessage);
            return;
         }

         toast.success("Datos guardados correctamente");

         // If the attendant is a student change the stage to ask for the student proof
         if (selectedRole === "student") {
            setFormStage("upload_student_proof");
            return;
         }

         // if the attendant is a doctor get the checkout link for the doctor role
         if (selectedRole === "doctor") {
            const checkoutLinkResponse = await getACPDiabetesCheckoutLinkAction(
               {
                  priceMXN: 500,
                  description: "Precio con membresía ACP",
               },
            );

            if (!checkoutLinkResponse.success) {
               toast.error(checkoutLinkResponse.errorMessage);
               return;
            }

            // redirect to payment page
            window.location.href = checkoutLinkResponse.data.checkoutLink;
            return;
         }

         toast.error("Error al obtener el enlace de pago (code: unreachable)");
         return;
      });
   };

   const roles = [
      {
         id: "student" as const,
         title: "Estudiante / Residente (requiere verificación)",
         description: "Estudiante de medicina o médico en formación",
         icon: GraduationCapIcon,
         color: "blue",
      },
      {
         id: "doctor" as const,
         title: "Médico",
         description: "Médico general o especialista certificado",
         icon: StethoscopeIcon,
         color: "green",
      },
   ];

   return (
      <div className="mx-auto px-2 sm:px-4 max-w-2xl">
         <div className="bg-white shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 rounded-xl sm:rounded-2xl">
            <div className="mb-4 sm:mb-6">
               <BackButton onClick={() => setFormStage("validate_acp_id")} />
            </div>

            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
               <div className="flex justify-center items-center bg-green-50 mx-auto mb-3 sm:mb-4 rounded-full w-14 sm:w-16 h-14 sm:h-16">
                  <CheckCircleIcon className="w-7 sm:w-8 h-7 sm:h-8 text-green-600" />
               </div>
               <h1 className="mb-2 px-2 font-bold text-gray-900 text-xl sm:text-2xl">
                  ¡Verificación Exitosa!
               </h1>
               <p className="px-2 text-gray-600 text-xs sm:text-sm">
                  Tu número ACP{" "}
                  <span className="font-semibold text-green-600">{acpID}</span>{" "}
                  ha sido verificado correctamente. Por favor selecciona tu rol
                  médico para continuar.
               </p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
               {roles.map((role) => {
                  const IconComponent = role.icon;
                  const isSelected = selectedRole === role.id;

                  return (
                     <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`group w-full p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                           isSelected
                              ? "border-green-400 bg-green-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white"
                        }`}
                     >
                        <div className="flex items-center gap-3 sm:gap-4">
                           <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                 isSelected
                                    ? "bg-green-100"
                                    : "bg-gray-100 group-hover:bg-gray-200"
                              } transition-colors`}
                           >
                              <IconComponent
                                 className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                    isSelected
                                       ? "text-green-600"
                                       : "text-gray-600"
                                 }`}
                              />
                           </div>
                           <div className="flex-1 min-w-0 text-left">
                              <h3
                                 className={`font-semibold text-sm sm:text-base md:text-lg ${
                                    isSelected
                                       ? "text-green-900"
                                       : "text-gray-900"
                                 }`}
                              >
                                 {role.title}
                              </h3>
                              <p
                                 className={`text-xs sm:text-sm mt-1 ${
                                    isSelected
                                       ? "text-green-700"
                                       : "text-gray-600"
                                 }`}
                              >
                                 {role.description}
                              </p>
                           </div>
                           <div
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                 isSelected
                                    ? "border-green-400 bg-green-400"
                                    : "border-gray-300"
                              }`}
                           >
                              {isSelected && (
                                 <div className="bg-white rounded-full w-1.5 sm:w-2 h-1.5 sm:h-2" />
                              )}
                           </div>
                        </div>
                     </button>
                  );
               })}
            </div>

            <Button
               disabled={!selectedRole}
               loading={isSubmitting}
               onClick={handleGetAffiliatedRolePrice}
               className="!px-4 sm:!px-6 !py-2.5 sm:!py-3 w-full !font-semibold !text-sm sm:!text-base"
               variant="primary"
            >
               {isSubmitting ? "Procesando..." : "Continuar"}
            </Button>

            <div className="mt-3 sm:mt-4 text-center">
               <p className="px-2 text-gray-500 text-xs">
                  Los precios pueden variar según tu rol médico y membresía ACP
               </p>
            </div>
         </div>
      </div>
   );
}

function SelectNoAffiliatedRoleForm({
   setFormStage,
}: {
   setFormStage: (stage: FormStage) => void;
}) {
   const [selectedRole, setSelectedRole] = useState<
      "nurse" | "student" | "doctor" | null
   >(null);
   const [isSubmitting, startTransition] = useTransition();

   const handleGetNonAffiliatedRolePrice = async () => {
      startTransition(async () => {
         if (!selectedRole) {
            toast.error("Por favor selecciona tu rol médico");
            return;
         }

         // Save the attendant data with the selected role and no ACP ID
         const attendantDataResponse =
            await createAttendantAdditionalDataAction<ACPDiabetesAdditionalAttendantData>(
               {
                  additionalData: {
                     isACPMember: false,
                     medicalRole: selectedRole,
                  },
               },
            );

         if (!attendantDataResponse.success) {
            toast.error(attendantDataResponse.errorMessage);
            return;
         }

         toast.success("Datos guardados correctamente");
         // TODO: Add action to get non affiliated role checkout link
         if (selectedRole === "doctor") {
            const checkoutLinkResponse = await getACPDiabetesCheckoutLinkAction(
               {
                  priceMXN: 700,
                  description: "Precio sin membresía ACP",
               },
            );

            if (!checkoutLinkResponse.success) {
               toast.error(checkoutLinkResponse.errorMessage);
               return;
            }

            window.location.href = checkoutLinkResponse.data.checkoutLink;
            return;
         }

         if (selectedRole === "student" || selectedRole === "nurse") {
            const studentRoleCheckoutLinkResponse =
               await getACPDiabetesCheckoutLinkAction({
                  priceMXN: 400,
                  description:
                     "Precio estudiante/residente o enfermero/enfermera sin membresía ACP",
               });

            if (!studentRoleCheckoutLinkResponse.success) {
               toast.error(studentRoleCheckoutLinkResponse.errorMessage);
               return;
            }

            window.location.href =
               studentRoleCheckoutLinkResponse.data.checkoutLink;
            return;
         }

         toast.error("Error al obtener el enlace de pago (code: unreachable)");
         return;
      });
   };

   const roles = [
      {
         id: "nurse" as const,
         title: "Enfermero / Enfermera",
         description: "Profesional de enfermería certificado",
         icon: UsersIcon,
         color: "purple",
      },
      {
         id: "student" as const,
         title: "Estudiante / Residente",
         description: "Estudiante de medicina o médico en formación",
         icon: GraduationCapIcon,
         color: "blue",
      },
      {
         id: "doctor" as const,
         title: "Médico",
         description: "Médico general o especialista certificado",
         icon: StethoscopeIcon,
         color: "green",
      },
   ];

   return (
      <div className="mx-auto px-2 sm:px-4 max-w-2xl">
         <div className="bg-white shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 rounded-xl sm:rounded-2xl">
            <div className="mb-4 sm:mb-6">
               <BackButton onClick={() => setFormStage("is_acp_member")} />
            </div>

            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
               <div className="flex justify-center items-center bg-purple-50 mx-auto mb-3 sm:mb-4 rounded-full w-14 sm:w-16 h-14 sm:h-16">
                  <UserIcon className="w-7 sm:w-8 h-7 sm:h-8 text-purple-600" />
               </div>
               <h1 className="mb-2 px-2 font-bold text-gray-900 text-xl sm:text-2xl">
                  Información Profesional
               </h1>
               <p className="px-2 text-gray-600 text-xs sm:text-sm">
                  Selecciona tu rol médico para continuar con el proceso de
                  registro
               </p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
               {roles.map((role) => {
                  const IconComponent = role.icon;
                  const isSelected = selectedRole === role.id;

                  return (
                     <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`group w-full p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                           isSelected
                              ? "border-purple-400 bg-purple-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white"
                        }`}
                     >
                        <div className="flex items-center gap-3 sm:gap-4">
                           <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                 isSelected
                                    ? "bg-purple-100"
                                    : "bg-gray-100 group-hover:bg-gray-200"
                              } transition-colors`}
                           >
                              <IconComponent
                                 className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                    isSelected
                                       ? "text-purple-600"
                                       : "text-gray-600"
                                 }`}
                              />
                           </div>
                           <div className="flex-1 min-w-0 text-left">
                              <h3
                                 className={`font-semibold text-sm sm:text-base md:text-lg ${
                                    isSelected
                                       ? "text-purple-900"
                                       : "text-gray-900"
                                 }`}
                              >
                                 {role.title}
                              </h3>
                              <p
                                 className={`text-xs sm:text-sm mt-1 ${
                                    isSelected
                                       ? "text-purple-700"
                                       : "text-gray-600"
                                 }`}
                              >
                                 {role.description}
                              </p>
                           </div>
                           <div
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                 isSelected
                                    ? "border-purple-400 bg-purple-400"
                                    : "border-gray-300"
                              }`}
                           >
                              {isSelected && (
                                 <div className="bg-white rounded-full w-1.5 sm:w-2 h-1.5 sm:h-2" />
                              )}
                           </div>
                        </div>
                     </button>
                  );
               })}
            </div>

            <Button
               onClick={handleGetNonAffiliatedRolePrice}
               loading={isSubmitting}
               disabled={!selectedRole}
               className="!px-4 sm:!px-6 !py-2.5 sm:!py-3 w-full !font-semibold !text-sm sm:!text-base"
               variant="primary"
            >
               {isSubmitting ? "Procesando..." : "Continuar"}
            </Button>

            <div className="mt-3 sm:mt-4 text-center">
               <p className="px-2 text-gray-500 text-xs">
                  Continuarás al proceso de pago después de seleccionar tu rol
               </p>
            </div>
         </div>
      </div>
   );
}

function UploadStudentProofForm({
   setFormStage,
}: {
   setFormStage: (stage: FormStage) => void;
}) {
   const [isSubmitting, startTransition] = useTransition();
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [dragActive, setDragActive] = useState(false);

   const handleUploadACPIScreenshot = () => {
      startTransition(async () => {
         if (!selectedFile) {
            toast.error(
               "Por favor sube una imagen de tu comprobante de estudiante o residente",
            );
            return;
         }

         const uploadACPIScreenshotResponse =
            await uploadAttendantCredentialFileAction({
               fileType: "Comprobante Estudiante / Residente",
               file: selectedFile,
            });

         if (!uploadACPIScreenshotResponse.success) {
            toast.error(uploadACPIScreenshotResponse.errorMessage);
            return;
         }

         // Get the checkout link for the student role
         const checkoutLinkResponse = await getACPDiabetesCheckoutLinkAction({
            priceMXN: 0,
            description: "Precio estudiante / residente afiliado al ACP",
         });

         if (!checkoutLinkResponse.success) {
            toast.error(checkoutLinkResponse.errorMessage);
            return;
         }

         // redirect to payment page
         window.location.href = checkoutLinkResponse.data.checkoutLink;
         return;
      });
   };

   const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
         setDragActive(true);
      } else if (e.type === "dragleave") {
         setDragActive(false);
      }
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         setSelectedFile(e.dataTransfer.files[0]);
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         setSelectedFile(e.target.files[0]);
      }
   };

   return (
      <div className="mx-auto px-2 sm:px-4 max-w-2xl">
         <div className="bg-white shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 rounded-xl sm:rounded-2xl">
            <div className="mb-4 sm:mb-6">
               <BackButton
                  onClick={() => setFormStage("select_acp_affiliated_role")}
               />
            </div>

            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
               <div className="flex justify-center items-center bg-amber-50 mx-auto mb-3 sm:mb-4 rounded-full w-14 sm:w-16 h-14 sm:h-16">
                  <UploadIcon className="w-7 sm:w-8 h-7 sm:h-8 text-amber-600" />
               </div>
               <h1 className="mb-2 px-2 font-bold text-gray-900 text-xl sm:text-2xl">
                  Subir comprobante
               </h1>
               <p className="px-2 text-gray-600 text-xs sm:text-sm">
                  Por favor sube tu comprobante de estudiante o residente, este
                  será verificado.
               </p>
            </div>

            {/* File upload area */}
            <div className="space-y-3 sm:space-y-4">
               <div
                  className={`relative border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center transition-all duration-200 ${
                     dragActive
                        ? "border-blue-400 bg-blue-50"
                        : selectedFile
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
               >
                  <input
                     type="file"
                     accept="image/*,.pdf"
                     onChange={handleFileChange}
                     className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                     id="file-upload"
                  />

                  <div className="space-y-3 sm:space-y-4">
                     {selectedFile ? (
                        <>
                           <div className="flex justify-center items-center bg-green-100 mx-auto rounded-full w-10 sm:w-12 h-10 sm:h-12">
                              <CheckCircleIcon className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                           </div>
                           <div>
                              <p className="font-medium text-green-800 text-sm sm:text-base break-words">
                                 {selectedFile.name}
                              </p>
                              <p className="text-green-600 text-xs sm:text-sm">
                                 {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                 MB
                              </p>
                           </div>
                        </>
                     ) : (
                        <>
                           <div className="flex justify-center items-center bg-gray-100 mx-auto rounded-full w-10 sm:w-12 h-10 sm:h-12">
                              <UploadIcon className="w-5 sm:w-6 h-5 sm:h-6 text-gray-600" />
                           </div>
                           <div>
                              <p className="px-2 font-medium text-gray-900 text-sm sm:text-base">
                                 Arrastra tu certificado aquí o haz clic para
                                 seleccionar
                              </p>
                              <p className="mt-1 text-gray-500 text-xs sm:text-sm">
                                 PNG, JPG, PDF hasta 10MB
                              </p>
                           </div>
                        </>
                     )}
                  </div>
               </div>

               <Button
                  disabled={!selectedFile}
                  onClick={handleUploadACPIScreenshot}
                  loading={isSubmitting}
                  className="!px-4 sm:!px-6 !py-2.5 sm:!py-3 w-full !font-semibold !text-sm sm:!text-base"
                  variant="primary"
               >
                  {isSubmitting
                     ? "Subiendo comprobante..."
                     : "Subir comprobante"}
               </Button>
            </div>
         </div>
      </div>
   );
}
type FormStage =
   | "is_acp_member"
   | "validate_acp_id"
   | "upload_acp_screenshot"
   | "select_acp_affiliated_role"
   | "select_no_affiliated_role"
   | "upload_student_proof";
export default function ACPDiabetesDataForm() {
   const [formStage, setFormStage] = useState<FormStage>("is_acp_member");
   const [acpID, setACPID] = useState<string | null>(null);

   const formStagesMap: Record<FormStage, React.ReactNode> = {
      is_acp_member: <IsACPMemberForm setFormStage={setFormStage} />,
      validate_acp_id: (
         <ValidateACPIDForm
            setFormStage={setFormStage}
            acpID={acpID}
            setACPID={setACPID}
         />
      ),
      upload_acp_screenshot: (
         <UploadACPIDScreenshotForm setFormStage={setFormStage} />
      ),
      select_acp_affiliated_role: (
         <SelectACPAffiliatedRoleForm
            setFormStage={setFormStage}
            acpID={acpID}
         />
      ),
      upload_student_proof: (
         <UploadStudentProofForm setFormStage={setFormStage} />
      ),
      select_no_affiliated_role: (
         <SelectNoAffiliatedRoleForm setFormStage={setFormStage} />
      ),
   };

   const formStageComponent = formStagesMap[formStage];

   if (!formStageComponent) {
      return (
         <div>
            <h1>Error no form stage found for {formStage}</h1>
         </div>
      );
   }

   return formStageComponent;
}
