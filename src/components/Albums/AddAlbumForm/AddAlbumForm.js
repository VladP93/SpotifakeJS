import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Image, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { map } from "lodash";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import NoImage from "../../../assets/png/no-image.png";
import "./AddAlbumForm.scss";

const db = firebase.firestore(firebase);

export default function AddAlbumForm(props) {
  const { setShowModal } = props;
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState(initialValueForm());
  const [albumImage, setAlbumImage] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    db.collection("artists")
      .get()
      .then((res) => {
        const arrayArtists = [];
        map(res?.docs, (artist) => {
          const data = artist.data();
          arrayArtists.push({
            key: artist.id,
            value: artist.id,
            text: data.name,
          });
        });
        setArtists(arrayArtists);
      });
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setAlbumImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = (fileName) => {
    const ref = firebase.storage().ref().child(`album/${fileName}`);

    return ref.put(file);
  };

  const onSubmit = () => {
    if (!formData.name || !formData.artist) {
      toast.warning("El nombre del álbum y el artista son obligatorios");
    } else if (!file) {
      toast.warning("Por favor, agregue una imagen al álbum");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadImage(fileName)
        .then(() => {
          db.collection("albums")
            .add({
              name: formData.name,
              artist: formData.artist,
              banner: fileName,
            })
            .then((res) => {
              toast.success("Álbum creado exitosamente.");
              resetForm();
              setIsLoading(false);
              setShowModal(false);
            })
            .catch((err) => {
              toast.error("Error: " + JSON.stringify(err));
              setIsLoading(false);
            });
        })
        .catch((err) => {
          toast.error("Error: " + JSON.stringify(err));
          setIsLoading(false);
        });
    }
  };

  const resetForm = () => {
    setFormData(initialValueForm);
    setFile(null);
    setAlbumImage(null);
  };

  return (
    <Form className="add-album-form" onSubmit={onSubmit}>
      <Form.Group>
        <Form.Field className="album-avatar" width={5}>
          <div
            {...getRootProps()}
            className="avatar"
            style={{ backgroundImage: `url('${albumImage}')` }}
          />
          <input {...getInputProps()} />
          {!albumImage && <Image src={NoImage} />}
        </Form.Field>
        <Form.Field className="album-inputs" width={11}>
          <Input
            placeholder="Nombre del álbum"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Dropdown
            placeholder="El álbum pertenece..."
            search
            fluid
            selection
            options={artists}
            lazyLoad
            onChange={(e, data) =>
              setFormData({ ...formData, artist: data.value })
            }
          />
        </Form.Field>
      </Form.Group>
      <Button type="submit" loading={isLoading}>
        Crear Álbum
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: "",
    artist: "",
  };
}
