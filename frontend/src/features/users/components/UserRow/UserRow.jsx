// UserRow.jsx
import {
  ChevronRight,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import "./UserRow.scss";

function UserRow({
  user,
  onSelect,
}) {
  const RoleIcon =
    user.role === "GERANT"
      ? ShieldCheck
      : UserRound;

  return (
    <button
      type="button"
      className={
        user.active
          ? "UserRow"
          : "UserRow UserRow--inactive"
      }
      onClick={() => onSelect(user)}
    >
      <div className="UserRow-identity">
        <div className="UserRow-avatar">
          {user.fullName
            ?.trim()
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <strong>
            {user.fullName}
          </strong>

          <span>
            {user.email || "Aucun email"}
          </span>
        </div>
      </div>

      <div className="UserRow-role">
        <RoleIcon
          size={17}
          aria-hidden="true"
        />

        <span>{user.role}</span>
      </div>

      <span
        className={
          user.active
            ? "UserRow-status UserRow-status--active"
            : "UserRow-status UserRow-status--inactive"
        }
      >
        {user.active
          ? "Actif"
          : "Inactif"}
      </span>

      <ChevronRight
        className="UserRow-arrow"
        size={18}
        aria-hidden="true"
      />
    </button>
  );
}

export default UserRow;