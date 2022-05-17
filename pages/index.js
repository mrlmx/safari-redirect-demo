import { useState } from "react";

export default function Index() {
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState();

  const handleFetchUserList = () => {
    fetch("/api/user/list", {
      headers: { Authorization: `Bearer xxxxxxxxx` },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserList(data);
      })
      .catch((error) => {
        console.log("request error", error);
        setError("request error");
      });
  };

  return (
    <div>
      <button onClick={handleFetchUserList}>Fetch User List</button>
      {error && <div>{error}</div>}
      {userList.map((user) => (
        <li key={user.id}>
          {user.name}:{user.age}
        </li>
      ))}
    </div>
  );
}
