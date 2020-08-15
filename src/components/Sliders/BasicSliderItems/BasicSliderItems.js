import React, { useState, useEffect } from "react";
import { map, size } from "lodash";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import firebase from "../../../utils/Firebase";
import "firebase/storage";

import "./BasicSliderItems.scss";

export default function BasicSliderItems(props) {
  const { title, data, folderImage, urlName } = props;
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    if (size(data) < 2 && size(data) !== 0) {
      setSlidesToShow(size(data));
    } else {
      setSlidesToShow(2);
    }
  }, [data]);

  const settings = {
    dots: false,
    infinity: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    centerMode: true,
    className: "basic-slider-items__list",
  };

  return (
    <div className="basic-slider-items">
      <h2>{title}</h2>
      <Slider {...settings}>
        {map(data, (item) => (
          <RenderItem
            key={item.id}
            item={item}
            folderImage={folderImage}
            urlName={urlName}
          />
        ))}
      </Slider>
    </div>
  );
}

function RenderItem(props) {
  const { item, folderImage, urlName } = props;
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref(`${folderImage}/${item.banner}`)
      .getDownloadURL()
      .then((url) => {
        setImageURL(url);
      });
  }, [item, folderImage]);

  return (
    <Link to={`/${urlName}/${item.id}`}>
      <div className="basic-slider-items__list-item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${imageURL}')` }}
        />
        <h3>{item.name}</h3>
      </div>
    </Link>
  );
}
