import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import errors from "../../utils/Errors";

import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function UserPassword(props) {
  const { setShowModal, setTitleModal, setContentModal } = props;

  const onEdit = () => {
    setTitleModal("Actualizar contraseña");
    setContentModal(<ChangePasswordForm setShowModal={setShowModal} />);
    setShowModal(true);
  };

  return (
    <div className="user-password">
      <h3>
        Contraseña: <span className="pass">*** *** *** ***</span>
      </h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangePasswordForm(props) {
  const { setShowModal } = props;
  const [formData, setFormData] = useState({
    currentPass: "",
    newPass: "",
    repeatNewPass: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    if (!formData.currentPass || !formData.newPass || !formData.repeatNewPass) {
      toast.warning("Los campos no pueden estar vacíos");
    } else if (formData.currentPass === formData.newPass) {
      toast.warning("La nueva contraseña no puede ser igual a la actual");
    } else if (!(formData.newPass === formData.repeatNewPass)) {
      toast.warning("Por favor, repetir correctamente la nueva contraseña");
    } else if (formData.newPass.length < 6) {
      toast.warning("La contraseña debe tener como mínimo 6 caracteres");
    } else {
      setIsLoading(true);
      reauthenticate(formData.currentPass)
        .then(() => {
          const currentUser = firebase.auth().currentUser;
          currentUser
            .updatePassword(formData.newPass)
            .then(() => {
              toast.success("Contraseña actualizada");
              firebase.auth().signOut();
            })
            .catch((err) => {
              errors(err);
            });
        })
        .catch((err) => {
          errors(err);
        })
        .finally(() => {
          setIsLoading(false);
          setShowModal(false);
        });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Contraseña actual"
          type={showOldPassword ? "text" : "password"}
          icon={
            <Icon
              name={showOldPassword ? "eye slash outline" : "eye"}
              link
              onClick={() => setShowOldPassword(!showOldPassword)}
            />
          }
          onChange={(e) =>
            setFormData({ ...formData, currentPass: e.target.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Nueva contraseña"
          type={showNewPassword ? "text" : "password"}
          icon={
            <Icon
              name={showNewPassword ? "eye slash outline" : "eye"}
              link
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          }
          onChange={(e) =>
            setFormData({ ...formData, newPass: e.target.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Repetir nueva contraseña"
          type={showNewPassword ? "text" : "password"}
          icon={
            <Icon
              name={showNewPassword ? "eye slash outline" : "eye"}
              link
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          }
          onChange={(e) =>
            setFormData({ ...formData, repeatNewPass: e.target.value })
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar contraseña
      </Button>
    </Form>
  );
}
