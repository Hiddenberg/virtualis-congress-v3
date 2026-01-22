import { Eye, Heart, Share2 } from "lucide-react";

export default function ViewsAndLikesSection() {
   return (
      <div className="flex justify-between items-center mb-4">
         <div className="flex items-center space-x-4">
            <button type="button" className="text-gray-600 hover:text-gray-800">
               <Share2 className="w-5 h-5" />
            </button>
            <div className="flex items-center">
               <Heart className="mr-1 w-5 h-5 text-red-500" />
               <span className="text-gray-600 text-sm">83</span>
            </div>
            <div className="flex items-center">
               <Eye className="mr-1 w-5 h-5 text-gray-500" />
               <span className="text-gray-600 text-sm">657</span>
            </div>
         </div>
      </div>
   );
}
