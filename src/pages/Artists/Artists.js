import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { map } from "lodash";
import { Link } from "react-router-dom";
import firebase from "../../utils/Firebase";
import "firebase/firestore";

import "./Artists.scss";

const db = firebase.firestore(firebase);

export default function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    db.collection("artists")
      .get()
      .then((res) => {
        const arrayArtists = [];
        map(res?.docs, (artist) => {
          const data = artist.data();
          data.id = artist.id;
          arrayArtists.push(data);
        });
        setArtists(arrayArtists);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="artists">
      <h1>Lista de artistas</h1>
      <Grid>
        {map(artists, (artist) => (
          <Grid.Column key={artist.id} mobile={16} tablet={8} computer={5}>
            <Artist artist={artist} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
}

function Artist(props) {
  const { artist } = props;
  const [bannerURL, setBannerURL] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref(`artist/${artist.banner}`)
      .getDownloadURL()
      .then((url) => {
        setBannerURL(url);
      });
  }, [artist.banner]);

  return (
    <Link to={`artist/${artist.id}`}>
      <div className="artists__item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${bannerURL}')` }}
        />
        <h3>{artist.name}</h3>
      </div>
    </Link>
  );
}
