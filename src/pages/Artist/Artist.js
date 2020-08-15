import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { map } from "lodash";
import BannerArtist from "../../components/Artists/BannerArtist";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import firebase from "../../utils/Firebase";
import "firebase/firestore";

import "./Artist.scss";

const db = firebase.firestore(firebase);

function Artist(props) {
  const { match } = props;
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    db.collection("artists")
      .doc(match?.params?.id)
      .get()
      .then((res) => {
        const data = res.data();
        data.id = res.id;
        setArtist(data);
      });
  }, [match.params.id]);

  useEffect(() => {
    if (artist) {
      db.collection("albums")
        .where("artist", "==", artist.id)
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
    }
  }, [artist]);

  return (
    <div>
      {artist && <BannerArtist artist={artist} />}
      <div className="artist__content">
        <BasicSliderItems
          title="Álbumes"
          data={albums}
          folderImage="album"
          urlName="/album/"
        />
      </div>
    </div>
  );
}

export default withRouter(Artist);
