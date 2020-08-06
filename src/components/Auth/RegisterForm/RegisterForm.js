import React, { useState } from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validations";
import firebase from "../../../utils/firebase";
import "firebase/auth";

import "./RegisterForm.scss";

export default function RegisterForm(props) {
  const { setSelectedForm } = props;
  const [formData, setFormData] = useState(defaultValueForm());
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e, type) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = () => {
    setFormError({});
    let errors = {};
    let formOk = true;

    if (!validateEmail(formData.email)) {
      errors.email = true;
      formOk = false;
    }
    if (formData.password.length < 6) {
      errors.password = true;
      formOk = false;
    }
    if (!formData.username) {
      errors.username = true;
      formOk = false;
    }

    setFormError(errors);

    if (formOk) {
      setIsLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          toast.success(`Usuario ${formData.username} creado existosamente.`);
          changeUserName();
          sendVerificationEmail();
        })
        .catch((err) => {
          toast.error("Error al crear la cuenta:" + JSON.stringify(err));
        })
        .finally(() => {
          setIsLoading(false);
          setSelectedForm(null);
        });
    }
  };

  const changeUserName = () => {
    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: formData.username,
      })
      .catch((err) => {
        toast.error(
          "Error al asignar nombre de usuario: " + JSON.stringify(err)
        );
      });
  };

  const sendVerificationEmail = () => {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        toast.success("Se ha enviado un email de verificación.");
      })
      .catch((err) => {
        toast.error(
          `Error al mandar el correo de verificación: ${JSON.stringify(err)}`
        );
      });
  };

  const handlerShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-form">
      <h1>Empieza a escuchar con una cuenta de Spotifake gratuita</h1>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placeholder="Correo electrónico"
            icon="mail outline"
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">
              Por favor, introduce un correo electrónico válido.
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            icon={
              showPassword ? (
                <Icon
                  name="eye slash outline"
                  link
                  onClick={handlerShowPassword}
                />
              ) : (
                <Icon name="eye" link onClick={handlerShowPassword} />
              )
            }
            error={formError.password}
          />
          {formError.password && (
            <span className="error-text">
              Por favor, introduce una contraseña mayor a 5 caracteres.
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type="text"
            name="username"
            placeholder="Nickname"
            icon="user circle outline"
            error={formError.username}
          />
          {formError.username && (
            <span className="error-text">
              Por favor, introduce un nombre de usuario.
            </span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          Continuar
        </Button>
      </Form>
      <div className="register-form__options">
        <p onClick={() => setSelectedForm(null)}>Volver</p>
        <p>
          ¿Ya tiene Spotifake?{" "}
          <span onClick={() => setSelectedForm("login")}>Iniciar Sesión</span>
        </p>
      </div>
    </div>
  );
}

function defaultValueForm() {
  return {
    email: "",
    password: "",
    username: "",
  };
}
