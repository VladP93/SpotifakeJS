import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { map } from "lodash";
import BannerArtist from "../../components/Artists/BannerArtist";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import SongsSlider from "../../components/Sliders/SongsSlider";
import firebase from "../../utils/Firebase";
import "firebase/firestore";

import "./Artist.scss";

const db = firebase.firestore(firebase);

function Artist(props) {
  const { match, playerSong } = props;
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

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

  useEffect(() => {
    const arraySong = [];

    (async () => {
      await Promise.all(
        map(albums, async (album) => {
          await db
            .collection("songs")
            .where("album", "==", album.id)
            .get()
            .then((res) => {
              map(res?.docs, (song) => {
                const data = song.data();
                data.id = song.id;
                arraySong.push(data);
              });
            });
        })
      );
      setSongs(arraySong);
    })();
  }, [albums]);

  return (
    <div>
      {artist && <BannerArtist artist={artist} />}
      <div className="artist__content">
        <BasicSliderItems
          title="Álbumes"
          data={albums}
          folderImage="album"
          urlName="album"
        />
        <SongsSlider title="Canciones" data={songs} playerSong={playerSong} />
      </div>
    </div>
  );
}

export default withRouter(Artist);
