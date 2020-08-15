import React, { useState, useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { withRouter, Link } from "react-router-dom";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./Album.scss";

const db = firebase.firestore(firebase);

function Album(props) {
  const { match } = props;
  const [album, setAlbum] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    db.collection("albums")
      .doc(match.params.id)
      .get()
      .then((res) => {
        setAlbum(res.data());
      });
  }, [match.params.id]);

  useEffect(() => {
    if (album) {
      firebase
        .storage()
        .ref(`album/${album?.banner}`)
        .getDownloadURL()
        .then((url) => {
          setImageURL(url);
        });
    }
  }, [album]);

  useEffect(() => {
    if (album) {
      db.collection("artists")
        .doc(album?.artist)
        .get()
        .then((res) => {
          const data = res.data();
          data.id = res.id;
          setArtist(data);
        });
    }
  }, [album]);

  if (!album || !artist) {
    return <Loader active>Cargando</Loader>;
  }

  return (
    <div className="album">
      <div className="album__header">
        <HeaderAlbum album={album} imageURL={imageURL} artist={artist} />
      </div>
      <div className="album__songs">
        <p>Lista de canciones</p>
      </div>
    </div>
  );
}

export default withRouter(Album);

function HeaderAlbum(props) {
  const { album, imageURL, artist } = props;

  return (
    <>
      <div
        className="image"
        style={{ backgroundImage: `url('${imageURL}')` }}
      />
      <div className="info">
        <h1>{album.name}</h1>
        <p>
          De{" "}
          <Link to={`/artist/${artist.id}`}>
            <span>{artist.name}</span>
          </Link>
        </p>
      </div>
    </>
  );
}
