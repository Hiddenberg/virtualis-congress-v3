function ProgressBar({ total, progress }: { total: number; progress: number }) {
   const progressPercentage = Math.round((progress / total) * 100);

   return (
      <div className="my-2 w-full h-2 bg-gray-200 rounded-lg overflow-hidden">
         <div
            className="bg-black h-full transition-all duration-300 ease-in-out"
            style={{
               width: `${progressPercentage}%`,
            }}
         />
      </div>
   );
}

export default ProgressBar;
