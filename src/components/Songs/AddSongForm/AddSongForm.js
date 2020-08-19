import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Icon, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { map } from "lodash";
import { toast } from "react-toastify";
import firebase from "../../../utils/Firebase";
import { v4 as uuidv4 } from "uuid";
import "firebase/firestore";
import "firebase/storage";

import "./AddSongForm.scss";

const db = firebase.firestore(firebase);

export default function AddSongForm(props) {
  const { setShowModal } = props;
  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState(initialValueForm);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((res) => {
        const albumArray = [];
        map(res?.docs, (album) => {
          const data = album.data();
          albumArray.push({ key: album.id, value: album.id, text: data.name });
        });
        setAlbums(albumArray);
      });
  }, []);

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setFile(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,
    onDrop,
  });

  const uploadSong = (fileName) => {
    const ref = firebase.storage().ref().child(`song/${fileName}`);
    return ref.put(file);
  };

  const onSubmit = () => {
    if (!formData.name || !formData.album) {
      toast.warning("El nombre de la canción y el álbum, son obligatorios.");
    } else if (!file) {
      toast.warning("Por favor, agregue una canción al formulario");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadSong(fileName)
        .then(() => {
          db.collection("songs")
            .add({
              name: formData.name,
              album: formData.album,
              fileName: fileName,
            })
            .then(() => {
              toast.success("Canción agregada correctamente.");
              resetForm();
              setIsLoading(false);
              setShowModal(false);
            })
            .catch((err) => {
              toast("Error: " + JSON.stringify(err));
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
    setAlbums([]);
  };

  return (
    <Form className="add-song-form" onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Nombre de la cación"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder="Asigna la cación a un álbum"
          search
          selection
          lazyLoad
          options={albums}
          onChange={(e, data) =>
            setFormData({ ...formData, album: data.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <div className="song-upload" {...getRootProps()}>
          <input {...getInputProps()} />
          <Icon name="cloud upload" className={file && "load"} />
          <div>
            <p>
              Arrastra tu canción o haz click <span>aquí</span>.
            </p>
            {file && (
              <p>
                Canción subida: <span>{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Subir cación
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: "",
    album: "",
  };
}
