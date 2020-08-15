import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import BannerArtist from "../../components/Artists/BannerArtist";
import firebase from "../../utils/Firebase";
import "firebase/firestore";

import "./Artist.scss";

const db = firebase.firestore(firebase);

function Artist(props) {
  const { match } = props;
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    db.collection("artists")
      .doc(match?.params?.id)
      .get()
      .then((res) => {
        setArtist(res.data());
      });
  }, [match.params.id]);

  return (
    <div>
      {artist && <BannerArtist artist={artist} />}
      <h2>Más info...</h2>
    </div>
  );
}

export default withRouter(Artist);
