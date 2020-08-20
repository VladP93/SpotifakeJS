import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "../../routes/Routes";
import MenuLeft from "../../components/MenuLeft";
import TopBar from "../../components/TopBar";
import Player from "../../components/Player";
import firebase from "../../utils/Firebase";
import "firebase/storage";

import "./LoggedLayout.scss";

export default function LoggedLayout(props) {
  const { user, setReloadApp } = props;
  const [songData, setSongData] = useState(null);

  const playerSong = (albumImage, songName, songURL) => {
    firebase
      .storage()
      .ref(`song/${songURL}`)
      .getDownloadURL()
      .then((url) => {
        setSongData({
          url,
          image: albumImage,
          name: songName,
        });
      });
  };

  return (
    <Router>
      <Grid className="logged-layout">
        <Grid.Row>
          <Grid.Column width={3}>
            {/* <button onClick={() => playerSong(imagetst, nametst, urltst)}>
              Start
            </button> */}
            <MenuLeft user={user} />
          </Grid.Column>
          <Grid.Column className="content" width={13}>
            <TopBar user={user} />
            <Routes
              user={user}
              setReloadApp={setReloadApp}
              playerSong={playerSong}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Player songData={songData} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Router>
  );
}
