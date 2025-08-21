import { Card } from "./ui/card";
import { User, Calendar, FolderOpen, Heart } from "lucide-react";

export function UserCard({ userObj, onDelete }) {
  const user = userObj.user;
  const postedCount = userObj.postedProjects?.length || 0;
  const revivedCount = userObj.revivedProjects?.length || 0;

  return (
    <Card className="tombstone-card p-4 hover:scale-105 transition-transform duration-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
          <User className="w-5 h-5 text-[#34e0a1]" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white">{user.username}</h3>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <FolderOpen className="w-4 h-4 mx-auto mb-1 text-[#34e0a1]" />
          <p className="text-sm font-bold text-white">{postedCount}</p>
          <p className="text-xs text-slate-400">Posted</p>
        </div>
        <div className="text-center">
          <Heart className="w-4 h-4 mx-auto mb-1 text-[#fcdb32]" />
          <p className="text-sm font-bold text-white">{revivedCount}</p>
          <p className="text-xs text-slate-400">Revived</p>
        </div>
        <div className="text-center">
          <Calendar className="w-4 h-4 mx-auto mb-1 text-[#4ecdc4]" />
          <p className="text-sm font-bold text-white">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </p>
          <p className="text-xs text-slate-400">Joined</p>
        </div>
      </div>
    </Card>
  );
}