import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";

// menerima props postId dari halaman 'postPage'
export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState(""); // menyimpan nilai komentar yang ditulis oleh pengguna.
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]); // menyimpan daftar komentar yang terkait dengan postId.

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // validasi, komentar tidak boleh lebih dari 200 karakter
      if (comment.length > 200) {
        return;
      }

      // mengirim request create comment dengan JSON yang berisi content, postId, dan userId
      const res = await fetch("/api/comment/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      // ubah data, menjadi json
      const data = await res.json();

      // jika response berhasil
      if (res.ok) {
        setComment(""); // simpan komentar yang baru ditambahkan
        setCommentError(null); // hilangkan error
        setComments([data, ...comments]); // simpan daftar terbaru dari komentar yang sudah ditambahkan
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  // render untuk mengambil komentar
  useEffect(() => {
    // mengambil semua komentar untuk ditampilkan
    const getComments = async () => {
      try {
        // mengambil semua daftar komentar berdasarkan postId
        const res = await fetch(`/api/comment/getPostComments/${postId}`);

        // jika berhasil simpan data komentar di state "setComments" dan tampilkan
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }

        // reponse jika gagal
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  return (
    <>
      <div className="max-w-2xl mx-auto w-full p-3">
        {/* infor users login */}
        {currentUser ? (
          <div className="flex items-center gap-1 my-5 text-gray-500">
            <p>Signed in as: </p>
            <img
              className="h-5 w-5 object-cover rounded-full"
              src={currentUser.profilePicture}
              alt={currentUser.username}
            />
            <Link
              to={`/dashboard?tab=profile`}
              className="text- text-cyan-600 hover:underline"
            >
              @{currentUser.username}
            </Link>
          </div>
        ) : (
          // if not user login
          <div className="text-sm text-teal-500 my-5 flex gap-1">
            You must be signed in to comment.
            <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
              Sign In
            </Link>
          </div>
        )}

        {/* Form Comment */}
        {currentUser && (
          <form onSubmit={handleSubmit} className="">
            <Textarea
              placeholder="Add a comment..."
              rows="3"
              maxLength="200"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex justify-between items-center mt-5">
              <p className="text-gray-500 text-xs">
                {200 - comment.length} characters remaining
              </p>
              <Button outline gradientDuoTone="purpleToBlue" type="submit">
                Submit
              </Button>
            </div>
            {commentError && (
              <Alert color="failure" className="mt-5">
                {commentError}
              </Alert>
            )}
          </form>
        )}

        {/* menampilkan comments, jika tidak ada comments tampilkan pesan ini */}
        {comments.length === 0 ? (
          <p className="text-xs my-5">No comments yet!</p>
        ) : (
          <>
            {/* jika comments ada, tampilkan panjang comments */}
            <div className="text-sm my-5 flex items-center gap-1">
              <p>Comments</p>
              <div className="border border-gray-400 py-1 px-2 rounded-sm">
                <p>{comments.length}</p>
              </div>
            </div>
            {comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
