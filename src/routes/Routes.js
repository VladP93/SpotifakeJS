import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Pages
import Home from "../pages/Home";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/artist" exact>
          <h2>Artistas</h2>
        </Route>
        <Route path="/settings" exact>
          <h2>Configuración...</h2>
        </Route>
      </Switch>
    </Router>
  );
}
