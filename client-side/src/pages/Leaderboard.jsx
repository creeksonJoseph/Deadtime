import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/users";
import { useAuth } from "../contexts/AuthContext";

export function Leaderboard() {
  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    getLeaderboard(token).then(setUsers);
  }, [token]);

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 animate-fade-up">
      <h1 className="font-zasline text-3xl text-[#34e0a1] mb-8">Leaderboard</h1>
      <div className="glass rounded-2xl p-8 neon-glow">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 text-slate-300">#</th>
              <th className="py-2 px-4 text-slate-300">Username</th>
              <th className="py-2 px-4 text-slate-300">Revivals</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id || u.username}>
                <td className="py-2 px-4">{i + 1}</td>
                <td className="py-2 px-4">{u.username}</td>
                <td className="py-2 px-4">{u.revivalCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
