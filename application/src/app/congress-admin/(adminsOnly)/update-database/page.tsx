import CSVUploadForm from "@/components/congress-admin/update-database/CSVUploadForm";

export default function UpdateDatabasePage() {
   return (
      <div className="mx-auto max-w-screen-xl">
         <h1 className="font-bold text-3xl text-center">Update Database</h1>

         <CSVUploadForm />
      </div>
   );
}
