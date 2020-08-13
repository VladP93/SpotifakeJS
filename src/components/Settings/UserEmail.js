import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import errors from "../../utils/Errors";

import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function UserEmail(props) {
  const { user, setShowModal, setTitleModal, setContentModal } = props;

  const onEdit = () => {
    setTitleModal("Actualizar Email");
    setContentModal(
      <ChangeEmailForm user={user} setShowModal={setShowModal} />
    );
    setShowModal(true);
  };

  return (
    <div className="user-email">
      <h3>
        Email: <span className="email">{user.email}</span>
      </h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangeEmailForm(props) {
  const { user, setShowModal } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    if (!formData.email) {
      toast.info("El email no se ha modificado");
      setShowModal(false);
    } else {
      setIsLoading(true);
      reauthenticate(formData.password)
        .then(() => {
          const currentUser = firebase.auth().currentUser;

          currentUser
            .updateEmail(formData.email)
            .then(() => {
              toast.success("Email actualizado");
              currentUser.sendEmailVerification().then(() => {
                firebase.auth().signOut();
              });
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

  const handlerShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          type="text"
          defaultValue={user.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Contraseña"
          type={!showPassword ? "password" : "text"}
          icon={
            !showPassword ? (
              <Icon name="eye" link onClick={handlerShowPassword} />
            ) : (
              <Icon
                name="eye slash outline"
                link
                onClick={handlerShowPassword}
              />
            )
          }
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar email
      </Button>
    </Form>
  );
}
