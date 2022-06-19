import { useState } from "react";
import Link from "next/link";

export default function Index() {
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState();

  const handleFetchUserList = () => {
    setError(null);
    setUserList([]);
    fetch("/api/user/list", {
      headers: { Authorization: `Bearer xxxxxxxxx`, foo: "bar" },
    })
      .then((response) => {
        console.log("是否是重定向后的 response", response.redirected);
        return response.json();
      })
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
      <Link href="/hack">to hack solution page</Link>
      <br />
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
