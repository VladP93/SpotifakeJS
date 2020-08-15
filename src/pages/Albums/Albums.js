import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { map } from "lodash";
import { Link } from "react-router-dom";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./Albums.scss";

const db = firebase.firestore(firebase);

export default function Albums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((res) => {
        const arrayAlbums = [];
        map(res?.docs, (album) => {
          const data = album.data();
          data.id = album.id;
          arrayAlbums.push(data);
        });
        setAlbums(arrayAlbums);
      });
  }, []);

  return (
    <div className="albums">
      <h1>Lista de Álbumes</h1>
      <Grid>
        {map(albums, (album) => (
          <Grid.Column key={album.id} mobile={16} tablet={8} computer={5}>
            <Album album={album} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
}

function Album(props) {
  const { album } = props;
  const [imageURL, setimageURL] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref(`album/${album.banner}`)
      .getDownloadURL()
      .then((url) => {
        setimageURL(url);
      });
  }, [album.banner]);

  return (
    <Link to={`/album/${album.id}`}>
      <div className="albums__item">
        <div
          className="image"
          style={{ backgroundImage: `url('${imageURL}')` }}
        />
        <h3>{album.name}</h3>
      </div>
    </Link>
  );
}
