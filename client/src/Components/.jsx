import { useEffect, useState } from "react";

export default function Comment({ comment }) {
  const [user, setUser] = useState({});
  console.log(user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);

        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    console.log(getUser());
  }, [comment]);

  return (
    <>
      <div className="">
        <div className="">
          <img
            className="w-10 h-10 rounded-full bg-gray-200"
            src={user.profilePicture}
            alt={user.username}
          />
        </div>
        <div className="">
          <div className="">
            <span className="">
              {user ? `@${user.username}` : "anonymous user"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// 9 jam
