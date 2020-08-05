import React from "react";
import firebase from "./utils/firebase";
import "firebase/auth";

function App() {
  console.log("Hola mundo");

  firebase.auth().onAuthStateChanged((currentUser) => {
    console.log(currentUser ? "Loggeado" : "No Loggeado");
  });
  return (
    <div>
      <h1>Electron + React</h1>
    </div>
  );
}

export default App;
