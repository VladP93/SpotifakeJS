import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "../../routes/Routes";
import MenuLeft from "../../components/MenuLeft";
import TopBar from "../../components/TopBar";
import Player from "../../components/Player";

import "./LoggedLayout.scss";

export default function LoggedLayout(props) {
  const { user, setReloadApp } = props;
  const [songData, setSongData] = useState(null);

  const playerSong = (albumImage, songName, songURL) => {
    setSongData({
      url: songURL,
      image: albumImage,
      name: songName,
    });
  };

  const imagetst = "https://img.youtube.com/vi/2s-Kz8S4dYw/0.jpg";
  const urltst =
    "https://firebasestorage.googleapis.com/v0/b/spotifakejs.appspot.com/o/song%2FHall%20of%20the%20Mountain%20King.mp3?alt=media&token=13e31f1c-4458-44d3-9843-d9b689f9f97f";
  const nametst = "In the hall of the mountain king";

  if (false) {
    playerSong(imagetst, urltst, nametst);
  }

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
            <Routes user={user} setReloadApp={setReloadApp} />
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
