import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    // mengambil daitta comments dari API
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomment`);
        const data = await res.json();

        // jika response nya berhasil
        if (res.ok) {
          setComments(data.comments); // simpan data comments di state   'setcomments'

          // jika jumlah posts yang diambil kurang dari 9, tombol "Show More" dinonaktifkan
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    // validasi, jika pengguna adalah 'Admin' jalankan fungsi ini
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser]);

  // fungsi event ketika tombol "Show More" diklik
  const handleShowMore = async () => {
    const startIndex = comments.length; // mengambil jumlah postingan

    try {
      // mengambil API "getcomments" dengan parameter "startIndex" (jumlah comments)
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();

      // jika response berhasil,
      if (res.ok) {
        // tambahkan postingan baru ke daftar dengan postingan yang sudah ada
        setComments((prev) => [...prev, ...data.comments]);

        // jika jumlah posts yang diambil kurang dari 9, tombol "Show More" dinonaktifkan
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // fungsi delete comments
  const handleDeleteComments = async () => {
    setShowModal(false); // default show modal false

    try {
      // mendapatkan API delete berdasarkan id comments
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      // jika response gagal, tampilkan message error
      if (!res.ok) {
        console.log(data.message);

        // jika tidak
      } else {
        setComments((prev) => {
          // delete comments dan update daftar comments seteleh delete behasil
          return prev.filter((user) => user._id !== commentIdToDelete);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full">
        {currentUser.isAdmin && comments.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Number of Likes</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>UserId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {comments.map((comment) => {
                return (
                  <Table.Body key={comment._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700  dark:bg-gray-800">
                      {/* creteadAt */}
                      <Table.Cell>
                        {new Date(comment.updatedAt).toLocaleDateString()}
                      </Table.Cell>

                      {/* content comment */}
                      <Table.Cell>{comment.content}</Table.Cell>

                      {/* number of likes comment*/}
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>

                      {/* postId comment */}
                      <Table.Cell>{comment.postId}</Table.Cell>

                      {/* userId comment */}
                      <Table.Cell>{comment.userId}</Table.Cell>

                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setCommentIdToDelete(comment._id);
                          }}
                          className="font-medium text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                );
              })}
            </Table>
            {showMore && (
              <button
                onClick={handleShowMore}
                className="w-full text-teal-500 self-center text-sm py-7"
              >
                Show More
              </button>
            )}
          </>
        ) : (
          <p>You have no comments yet!</p>
        )}

        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
        >
          <Modal.Header />

          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure want to delete this comments?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteComments}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
