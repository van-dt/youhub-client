import { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Contact from "./components/Contact";
import Create from "./components/Create";
import Explore from "./components/Explore";
import Home from "./components/Home";
import Library from "./components/Library";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Subscriptions from "./components/Subscriptions";
import TopBar from "./components/TopBar";
import { NavContext } from "./contexts/NavContext";
import { useRouter } from "./hooks/useRouter";

import "./styles/App.scss";

function App() {
  // state
  const [display, setDisplay] = useState<boolean>(true);

  // context
  const { action } = useContext(NavContext);
  // location
  const router = useRouter();

  // effect
  useEffect(() => {
    // console.log(router.location.pathname);
    if (router.location.pathname === "/login") {
      setDisplay(false);
    } else {
      setDisplay(true);
    }
  }, [router.location.pathname]);

  return (
    <div className="container">
      {display && <Navbar />}
      <div className={`App ${action} ${display ? "" : "full"}`}>
        {display && <TopBar />}
        <Routes>
          <Route path="/explore" element={<Explore />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/library" element={<Library />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
