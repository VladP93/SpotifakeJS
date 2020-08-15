import React, { useState, useEffect } from "react";
import firebase from "../../utils/Firebase";
import "firebase/storage";

import "./BannerHome.scss";

export default function BannerHome() {
  const [bannerURL, setBannerURL] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref("other/banner-home.jpg")
      .getDownloadURL()
      .then((url) => {
        setBannerURL(url);
      })
      .catch(() => {
        //No se puede obtener un banner
      });
  }, []);

  if (!bannerURL) {
    return null;
  }

  return (
    <div
      className="banner-home"
      style={{ backgroundImage: `url('${bannerURL}')` }}
    />
  );
}
