import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import PrivetUser from "./components/PrivetUser.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Search from "./pages/Search.jsx";
import Message from "./pages/Message";
import UserPosts from "./components/UserPosts.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Notifications from "./pages/Notifications.jsx";
import BookmarksPost from "./components/BookmarksPost.jsx";
import DisplaySinglePost from "./pages/DisplaySinglePost.jsx";
import EditePost from "./pages/EditePost.jsx";
import FriendRequsts from "./pages/FriendRequsts.jsx";
import Chat from "./components/Chat.jsx";
import StartMessage from "./components/StartMessage.jsx";
import UserFriend from "./components/UserFrind.jsx";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivetUser />}>
            <Route path="/" element={<Home />} />
            <Route path="/single/:postId" element={<DisplaySinglePost />} />

            <Route path="/profile/:userId" element={<Profile />}>
              <Route path="posts" element={<UserPosts />} />
              <Route path="bookmarks" element={<BookmarksPost />} />
              <Route path="friend" element={<UserFriend />} />
            </Route>

            <Route path="/edit-profile/:userId" element={<EditProfile />} />
            <Route path="/friend-requests" element={<FriendRequsts/>}/>
            <Route path="/create" element={<CreatePost />} />
            <Route path="/search" element={<Search />} />
            <Route path="/edit-post/:postId" element={<EditePost />} />
            <Route path="/messages" element={<Message />}>
            <Route path={''} element={<StartMessage/>}/>
                <Route path="chat/:userId" element={<Chat />}/>
            </Route>
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
