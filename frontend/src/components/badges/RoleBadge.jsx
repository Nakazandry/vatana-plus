import { FiShield, FiUser } from "react-icons/fi";

function RoleBadge({ role }) {
  const isAdmin = role === "admin";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
        isAdmin ? "bg-slate-100 text-slate-800" : "bg-blue-50 text-blue-700"
      }`}
    >
      {isAdmin ? <FiShield /> : <FiUser />}
      {isAdmin ? "Coach/Admin" : "Sportif"}
    </span>
  );
}

export default RoleBadge;
