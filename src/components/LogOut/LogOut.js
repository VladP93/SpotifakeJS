import React from "react";
import { Button } from "semantic-ui-react";
import firebase from "../../utils/Firebase";
import "firebase/auth";

import "./LogOut.scss";

export default function LogOut(props) {
  const { setShowModal } = props;

  const logout = () => {
    firebase.auth().signOut();
  };
  const cancel = () => {
    setShowModal(false);
  };
  return (
    <div className="log-out">
      <p>¿Está seguro que desea cerrar sesión?</p>
      <Button className="accept" onClick={logout}>
        Si
      </Button>
      <Button className="cancel" onClick={cancel}>
        No
      </Button>
    </div>
  );
}
