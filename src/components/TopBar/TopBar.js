import React, { useState } from "react";
import { Icon, Image } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import BasicModal from "../Modal/BasicModal";
import LogOut from "../LogOut";
import UserImage from "../../assets/png/user.png";

import "./TopBar.scss";

function TopBar(props) {
  const { user, history } = props;
  const [showModal, setShowModal] = useState(false);

  const logout = () => {
    setShowModal(true);
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar__left">
          <Icon name="angle left" onClick={goBack} />
        </div>
        <div className="top-bar__right">
          <Link to="/settings">
            <Image src={UserImage} />
            {user.displayName}
          </Link>
          <Icon name="power off" onClick={logout} />
        </div>
      </div>
      <BasicModal
        show={showModal}
        setShow={setShowModal}
        title={"Cerrar Sesión"}
      >
        <LogOut setShowModal={setShowModal} />
      </BasicModal>
    </>
  );
}

export default withRouter(TopBar);
