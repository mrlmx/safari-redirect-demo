import { useState } from "react";
import Link from "next/link";

/**
 * 获取重定向的 URL
 */
const getRedirectURL = (url, options) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    const { headers = {} } = options;
    // set header
    Reflect.ownKeys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });
    xhr.send();
    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        console.log("xxx", this.responseURL, this.status, this.statusText);
        // 在这里判断 responseURL 是否 和 原始 URL 一致（this.responseURL 也有可能为空）
        if (this.responseURL && this.responseURL !== url) {
          // 如果不一致，则终止请求
          resolve(this.responseURL);
          // 终止请求之后，this.responseURL 的值会被置空，所以需要在最后调用。
          this.abort();
          return;
        }
        console.log("未发生重定向，responseUR 的值为：", this.responseUR);
        resolve();
      }
    };
    xhr.onerror = function (e) {
      console.log("请求失败", e);
      resolve();
    };
  });
};

/**
 * 发起请求
 */
const request = (url, options) => {
  return fetch(url, options).then(async (response) => {
    // 手动处理 HTTP 重定向时，type 的值为 "opaqueredirect"
    if (response.type === "opaqueredirect") {
      const redirectURL = await getRedirectURL(url, options);
      if (!redirectURL) {
        throw new Error("未获取到重定向 URL");
      }
      // 自动对重定向的 URL 发起请求
      return request(redirectURL, options);
    }
    return response.json();
  });
};

export default function Index() {
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState();

  const handleFetchUserListHack = () => {
    setError(null);
    setUserList([]);
    request("/api/user/list", {
      headers: { Authorization: `Bearer xxxxxxxxx`, foo: "bar" },
      redirect: "manual",
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
      <Link href="/">to index page</Link>
      <br />
      <button onClick={handleFetchUserListHack}>Fetch User List（Hack）</button>
      {error && <div>{error}</div>}
      {userList.map((user) => (
        <li key={user.id}>
          {user.name}:{user.age}
        </li>
      ))}
    </div>
  );
}
