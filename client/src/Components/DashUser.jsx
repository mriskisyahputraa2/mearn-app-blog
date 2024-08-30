import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    // mengambil data users dari API
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();

        // jika response nya berhasil
        if (res.ok) {
          setUsers(data.users); // simpan data users di state 'setUsers'

          // jika jumlah posts yang diambil kurang dari 9, tombol "Show More" dinonaktifkan
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    // validasi, jika pengguna adalah 'Admin' jalankan fungsi ini
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  // fungsi event ketika tombol "Show More" diklik
  const handleShowMore = async () => {
    const startIndex = users.length; // mengambil jumlah postingan

    try {
      // mengambil API "getusers" dengan parameter "startIndex" (jumlah users)
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();

      // jika response berhasil,
      if (res.ok) {
        // tambahkan postingan baru ke daftar dengan postingan yang sudah ada
        setUsers((prev) => [...prev, ...data.users]);

        // jika jumlah posts yang diambil kurang dari 9, tombol "Show More" dinonaktifkan
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // fungsi delete users
  const handleDeleteUser = async () => {
    setShowModal(false); // default show modal false

    try {
      // mendapatkan API delete berdasarkan id users
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      // jika response gagal, tampilkan message error
      if (!res.ok) {
        console.log(data.message);

        // jika tidak
      } else {
        setUsers((prev) => {
          // delete users dan update daftar users seteleh delete behasil
          return prev.filter((user) => user._id !== userIdToDelete);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full">
        {currentUser.isAdmin && users.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {users.map((user) => {
                return (
                  <Table.Body key={user._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700  dark:bg-gray-800">
                      {/* creteadAt */}
                      <Table.Cell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Table.Cell>

                      {/* profilePicture */}
                      <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover bg-gray-500"
                        />
                      </Table.Cell>

                      {/* username */}
                      <Table.Cell>{user.username}</Table.Cell>

                      {/* admin or users */}
                      <Table.Cell>
                        {user.isAdmin ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </Table.Cell>

                      {/* email */}
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
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
          <p>You have no users yet!</p>
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
                Are you sure want to delete this user?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteUser}>
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
