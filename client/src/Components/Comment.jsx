import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({}); // state untuk menyimpan data users
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    // mendapatkan data user berdasarka userId
    const getUser = async () => {
      try {
        // mengambil data user berdasarkan comment userId
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();

        // validasi jika response berhasil
        if (res.ok) {
          setUser(data);
        }

        // jika ada kesalahan
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  // fungsi edit komentar ketika aktif
  const handleEdit = async () => {
    setIsEditing(true);
    setEditedContent(comment.content); // update content comment
  };

  // fungsi simpan data komentar
  const handleSave = async () => {
    try {
      // mengirim API edit komentar berdasarkan id comment
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent, // komentar yang berhasil diedit disimpan dalam "content"
        }),
      });

      // jika response berhasil, update comment nya
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="flex p-4 border-b dark:border-gray-600 text-sm">
        <div className="flex-shrink-0 mr-3">
          <img
            className="w-10 h-10 rounded-full bg-gray-200"
            src={user.profilePicture}
            alt={user.username}
          />
        </div>
        <div className="flex-1 ">
          <div className="flex items-center mb-1">
            <span className="font-bold mr-1 text-xs truncate">
              {user.username ? `@${user.username}` : "anonymous user"}
            </span>
            <span className="text-gray-500 text-xs">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>

          {/* form edit comment */}
          {isEditing ? (
            <>
              <Textarea
                className="mb-2"
                onChange={(e) => setEditedContent(e.target.value)}
                value={editedContent}
              />
              <div className="flex justify-end gap-2 text-xs ">
                <Button
                  onClick={handleSave}
                  type="button"
                  size="sm"
                  gradientDuoTone="purpleToBlue"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  gradientDuoTone="purpleToBlue"
                  outline
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* content */}
              <p className="text-gray-500 pb-2">{comment.content}</p>
              {/* button icons like */}
              <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                <button
                  type="button"
                  onClick={() => onLike(comment._id)}
                  className={`text-gray-400 hover:text-blue-500 ${
                    currentUser && comment.likes.includes(currentUser._id)
                      ? "text-blue-500"
                      : ""
                  }`}
                >
                  <FaThumbsUp className="text-sm" />
                </button>
                <p className="text-gray-400">
                  {comment.numberOfLikes > 0 &&
                    comment.numberOfLikes +
                      " " +
                      (comment.numberOfLikes === 1 ? "like" : "likes")}
                </p>

                {currentUser &&
                  (currentUser._id === comment.userId ||
                    currentUser.isAdmin) && (
                    <>
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(comment._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
