import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { size, map } from "lodash";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./SongsSlider.scss";

const db = firebase.firestore(firebase);

export default function SongsSlider(props) {
  const { title, data, playerSong } = props;
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    if (size(data) < 3 && size(data) !== 0) {
      setSlidesToShow(size(data));
    } else {
      setSlidesToShow(3);
    }
  }, [data]);

  const sliderSettings = {
    dots: false,
    infinity: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    centerMode: true,
    className: "songs-slider__list",
  };

  return (
    <div className="songs-slider">
      <h2>{title}</h2>
      <Slider {...sliderSettings}>
        {map(data, (item) => (
          <Song key={item.id} item={item} playerSong={playerSong} />
        ))}
      </Slider>
    </div>
  );
}

function Song(props) {
  const { item, playerSong } = props;
  const [banner, setBanner] = useState(null);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    db.collection("albums")
      .doc(item.album)
      .get()
      .then((res) => {
        const albumTemp = res.data();
        albumTemp.id = res.id;
        setAlbum(albumTemp);
        getImage(albumTemp);
      });
  }, [item]);

  const getImage = (album) => {
    firebase
      .storage()
      .ref(`album/${album.banner}`)
      .getDownloadURL()
      .then((url) => {
        setBanner(url);
      });
  };

  const onPlay = () => {
    playerSong(banner, item.name, item.fileName);
  };

  return (
    <div className="songs-slider__list-song">
      <div
        className="avatar"
        style={{ backgroundImage: `url('${banner}')` }}
        onClick={onPlay}
      >
        <Icon name="play circle outline" />
      </div>
      <Link to={`/album/${album?.id}`}>
        <h3>{item.name}</h3>
      </Link>
    </div>
  );
}
