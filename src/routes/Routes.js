import React from "react";
import { Switch, Route } from "react-router-dom";

//Pages
import Home from "../pages/Home";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/artists" exact>
        <h2>Artistas</h2>
      </Route>
      <Route path="/settings" exact>
        <h2>Configuración...</h2>
      </Route>
    </Switch>
  );
}
