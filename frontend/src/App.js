import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import Navigation from "./ui/Navbar";
import Home from "./Home";
import Polls from "./polls/pages/Polls";
import NewPoll from "./polls/pages/NewPoll";
import Auth from "./user/pages/Auth";

function App() {
  // let routes;

  // routes = (
  //   <Routes>
  //     <Route path="/" exact element={<Home />} />
  //     <Route path="/about" element={<Home />} />
  //     <Route path="/polls" element={<Polls />} />
  //     <Route path="/polls/new" element={<NewPoll />} />
  //     <Route path="/auth" element={<Auth />} />
  //     <Redirect to="/" />
  //   </Routes>
  // );

  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/about" exact>
            <Home />
          </Route>
          <Route path="/polls" exact>
            <Polls />
          </Route>
          <Route path="/polls/new" exact>
            <NewPoll />
          </Route>
          <Route path="/auth" exact>
            <Auth />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>

      <main></main>
    </div>
  );
}

export default App;
