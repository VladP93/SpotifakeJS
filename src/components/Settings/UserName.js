import React, { useState } from "react";
import { Form, Input, Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function UserName(props) {
  const {
    user,
    setShowModal,
    setTitleModal,
    setContentModal,
    setReloadApp,
  } = props;

  const onEdit = () => {
    setTitleModal("Actualizar Nombre");
    setContentModal(
      <ChangeDisplayNameForm
        setShowModal={setShowModal}
        displayName={user.displayName}
        setReloadApp={setReloadApp}
      />
    );
    setShowModal(true);
  };

  return (
    <div className="user-name">
      <h2>{user.displayName}</h2>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangeDisplayNameForm(props) {
  const { displayName, setShowModal, setReloadApp } = props;
  const [formData, setFormData] = useState({ displayName: displayName });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    if (!formData.displayName || formData.displayName === displayName) {
      toast.info("El nombre de usuario no ha cambiado.");
      setShowModal(false);
    } else {
      setIsLoading(true);
      firebase
        .auth()
        .currentUser.updateProfile({ displayName: formData.displayName })
        .then((res) => {
          toast.success("Nombre de usuario actualizado correctamente");
        })
        .catch((err) => {
          toast.error(
            "Error al actualizar nombre de usuario: " + JSON.stringify(err)
          );
        })
        .finally(() => {
          setIsLoading(false);
          setShowModal(false);
          setReloadApp((prevState) => !prevState);
        });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          defaultValue={displayName}
          onChange={(e) => setFormData({ displayName: e.target.value })}
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar nombre
      </Button>
    </Form>
  );
}
