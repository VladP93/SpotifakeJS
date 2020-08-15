import React, { useState, useEffect } from "react";
import { Grid, Progress, Icon, Input, Image } from "semantic-ui-react";
import ReactPlayer from "react-player";

import "./Player.scss";

export default function Player(props) {
  const { songData } = props;
  const [playedSeconds, setPlayedSeconds] = useState(25);
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [playing, setPlaying] = useState(false);
  const [volumen, setVolumen] = useState(0.8);
  const [song, setSong] = useState(null);

  useEffect(() => {
    if (songData?.url) {
      setSong(songData.url);
      onStart();
    }
  }, [songData]);

  const onStart = () => {
    setPlaying(true);
  };

  const onPause = () => {
    setPlaying(false);
  };

  const onProgress = (data) => {
    setPlayedSeconds(data.playedSeconds);
    setTotalSeconds(data.loadedSeconds);
  };

  return (
    <div className="player">
      <Grid>
        <Grid.Column width={4} className="left">
          <Image src={songData?.image} />
          {songData?.name}
        </Grid.Column>
        <Grid.Column width={8} className="center">
          <div className="controls">
            {playing ? (
              <Icon onClick={onPause} name="pause circle outline" />
            ) : (
              <Icon onClick={onStart} name="play circle outline" />
            )}
          </div>
          <Progress
            progress="value"
            value={playedSeconds}
            total={totalSeconds}
            size="tiny"
          />
        </Grid.Column>
        <Grid.Column width={4} className="right">
          <Input
            type="range"
            label={<Icon name="volume up" />}
            min={0}
            max={1}
            step={0.01}
            name="volumen"
            onChange={(e, data) => setVolumen(Number(data.value))}
            value={volumen}
          />
        </Grid.Column>
      </Grid>
      <ReactPlayer
        className="react-player"
        url={song}
        playing={playing}
        height={0}
        width={0}
        volume={volumen}
        onProgress={(e) => onProgress(e)}
      />
    </div>
  );
}
