import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import firebase from "./utils/firebase";
import "firebase/auth";
import Auth from "./pages/Auth";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  firebase.auth().onAuthStateChanged((currentUser) => {
    if (!currentUser?.emailVerified) {
      firebase.auth().signOut();
      setUser(null);
    } else {
      setUser(currentUser);
    }

    setIsLoading(false);
  });

  if (isLoading) {
    return null;
  }

  // return !user ? <Auth /> : <UserLogged />;
  return (
    <>
      {!user ? <Auth /> : <UserLogged />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover={false}
      />
    </>
  );
}

function UserLogged() {
  const logout = () => {
    firebase.auth().signOut();
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <h1>Usuario Loggeado</h1>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}

export default App;
