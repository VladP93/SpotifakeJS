import React, { useState, useEffect } from "react";
import { map } from "lodash";
import BannerHome from "../../components/BannerHome";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import firebase from "../../utils/Firebase";
import "firebase/firestore";

import "./Home.scss";

const db = firebase.firestore(firebase);

export default function Home() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    db.collection("artists")
      .get()
      .then((res) => {
        const arrayArtists = [];
        //lodash map
        map(res?.docs, (artist) => {
          const data = artist.data();
          data.id = artist.id;
          arrayArtists.push(data);
        });
        //JS normal map
        // res.docs.map((artist) => {
        //   console.log(artist.data());
        // });
        setArtists(arrayArtists);
      });
  }, []);

  return (
    <>
      <BannerHome />
      <div className="home">
        <BasicSliderItems
          title={"Últimos artistas"}
          data={artists}
          folderImage={"artist"}
          urlName={"artist"}
        />
        <h2>Ver más...</h2>
      </div>
    </>
  );
}
