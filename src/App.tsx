import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Contact from "./components/Contact";
import Create from "./components/Create";
import Explore from "./components/Explore";
import ExtraNav from "./components/ExtraNav";
import Home from "./components/Home";
import Library from "./components/Library";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Subscriptions from "./components/Subscriptions";
import TopBar from "./components/TopBar";
import Watch from "./components/Watch";
import { ExtraNavContext } from "./contexts/ExtraNavContext";
import { NavContext } from "./contexts/NavContext";
import { useLogin } from "./contexts/UserContext";
import { useRefreshTokenMutation } from "./generated/graphql";
/* import { useLogin } from "./contexts/UserContext";
import { useCheckAuth } from "./hooks/useCheckAuth"; */
import { useRouter } from "./hooks/useRouter";
import "./styles/App.scss";

function App() {
  // state
  const [display, setDisplay] = useState<string>("");

  // context
  const { action } = useContext(NavContext);
  const { Eaction, toggleExtraNav } = useContext(ExtraNavContext);
  const { setState: setUserContext } = useLogin();

  // location
  const router = useRouter();

  // check authentication
  const [refreshTokenMutation] = useRefreshTokenMutation();

  const verifyUser = useCallback(async () => {
    const response = await refreshTokenMutation();
    const token = response.data?.refreshToken.token as string | undefined;
    setUserContext(function (preValues) {
      return {
        ...preValues,
        token,
      };
    });
    setTimeout(verifyUser, 10 * 60 * 1000);
  }, [setUserContext, refreshTokenMutation]);

  useLayoutEffect(() => {
    verifyUser();
  }, [verifyUser]);
  // sync login
  const syncLogin = useCallback((event) => {
    if (event.key === "login") {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncLogin);
    return () => {
      window.removeEventListener("storage", syncLogin);
    };
  }, [syncLogin]);

  // sync logout
  const syncLogout = useCallback((event) => {
    if (event.key === "logout") {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [syncLogout]);

  // effect
  useEffect(() => {
    // console.log(router.location.pathname);
    if (router.location.pathname === "/login") {
      setDisplay("full");
    } else if (router.location.pathname.includes("/watch")) {
      setDisplay("watch");
    } else {
      setDisplay("");
    }
  }, [router.location.pathname]);

  return (
    <div className="container">
      <ToastContainer />
      <div
        className={`over-layer ${Eaction}`}
        onClick={() => toggleExtraNav()}
      ></div>
      <ExtraNav />
      {display === "" && <Navbar />}
      <div className={`App ${action} ${display}`}>
        {(display === "" || display === "watch") && <TopBar type={display} />}
        <Routes>
          <Route path="/explore" element={<Explore />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/library" element={<Library />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/watch/:slug" element={<Watch />} />
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;