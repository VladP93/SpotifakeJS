import React, { useState, useCallback } from "react";
import { Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import NoAvatar from "../../assets/png/user.png";

import firebase from "../../utils/Firebase";
import "firebase/storage";
import "firebase/auth";

export default function UpdateAvatar(props) {
  const { user, setReloadApp } = props;

  const [avatarURL, setAvatarURL] = useState(user.photoURL);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setAvatarURL(URL.createObjectURL(file));
    uploadImage(file).then(() => {
      updateUserAvatar();
    });
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = (file) => {
    const ref = firebase.storage().ref().child(`avatar/${user.uid}`);
    return ref.put(file);
  };

  const updateUserAvatar = () => {
    toast.success("Actualizando avatar...");
    firebase
      .storage()
      .ref(`avatar/${user.uid}`)
      .getDownloadURL()
      .then(async (res) => {
        await firebase.auth().currentUser.updateProfile({ photoURL: res });
        setReloadApp((prevState) => !prevState);
      })
      .catch((err) => {
        toast.error("Error al actualizar avatar: " + JSON.stringify(err));
      });
  };

  return (
    <div className="user-avatar" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Image src={NoAvatar} />
      ) : (
        <Image src={avatarURL ? avatarURL : NoAvatar} />
      )}
    </div>
  );
}
