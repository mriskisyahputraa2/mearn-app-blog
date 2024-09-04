import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashboardCom() {
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState([]);
  const [post, setPost] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUser, setLastMonthUser] = useState(0);
  const [lastMonthPost, setLastMonthPost] = useState(0);
  const [lastMonthComment, setLastMonthComment] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("api/user/getusers?limit=5");
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUser(data.lastMonthUser);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("api/post/getposts?limit=5");
        const data = await res.json();

        if (res.ok) {
          setPost(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPost(data.lastMonthPost);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch("api/comment/getcomment?limit=5");
        const data = await res.json();

        if (res.ok) {
          setComment(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComment(data.lastMonthComment);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);
  return (
    <>
      <div className="p-3 md:mx-auto">
        <div className="flex flex-wrap gap-4 justify-center">
          {/* total users */}
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-sm uppercase">Total Users</h3>
                <p className="text-2xl">{totalUsers}</p>
              </div>
              <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthUser}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>

          {/* total posts */}
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-sm uppercase">
                  {" "}
                  Total Posts
                </h3>
                <p className="text-2xl">{totalPosts}</p>
              </div>
              <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthPost}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>

          {/* total comments */}
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-sm uppercase">
                  Total Comments
                </h3>
                <p className="text-2xl">{totalComments}</p>
              </div>
              <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthComment}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </div>

        {/* menampilkan data users, posts & comments  */}
        <div className="">
          <div className="flex flex-col w-full md:w-auto shadow-sm p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recent users</h1>
              <Button outline gradientDuoTone="purpleToPink">
                <Link to={"/dashboard?tab=users"}>See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>
              {users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>

          <div className="flex flex-col w-full md:w-auto shadow-sm p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recent users</h1>
              <Button outline gradientDuoTone="purpleToPink">
                <Link to={"/dashboard?tab=users"}>See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>
              {users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
          <div className="flex flex-col w-full md:w-auto shadow-sm p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recent users</h1>
              <Button outline gradientDuoTone="purpleToPink">
                <Link to={"/dashboard?tab=users"}>See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>
              {users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}