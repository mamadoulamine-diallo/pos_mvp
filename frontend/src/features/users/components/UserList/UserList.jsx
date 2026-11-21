// UserList.jsx
import UserRow from "../UserRow";

import "./UserList.scss";

function UserList({
  users,
  onSelect,
}) {
  return (
    <section className="UserList">
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}

export default UserList;