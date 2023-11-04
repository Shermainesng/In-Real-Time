import React, { useState, useCallback } from "react";
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
import Events from "./events/pages/Events";
import NewPoll from "./polls/pages/NewPoll";
import Auth from "./user/pages/Auth";
import Event from "./events/pages/Event";
import { AuthContext } from "./shared/context/auth-context";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import NewEventForm from "./events/pages/NewEvent";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(false);
  const [userName, setUserName] = useState(null);

  const login = useCallback((userId, userName) => {
    // setToken(token);
    setIsLoggedIn(true);
    setUserId(userId);
    setUserName(userName);
  }, []);
  const logout = useCallback(() => {
    // setToken(null);
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/events/users/" exact>
          <Events />
        </Route>
        <Route path="/events" exact>
          <Events />
        </Route>
        <Route path="/events/new" exact>
          <NewEventForm />
        </Route>
        <Route path="/events/:eventId/polls" exact>
          <Event />
        </Route>
        <Route path="/polls/new" exact>
          <NewPoll />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthContext.Provider
          value={{
            isLoggedIn: isLoggedIn,
            // token: token,
            login: login,
            logout: logout,
            userName,
            userId,
          }}
        >
          <Router>
            <Navigation />
            <main>{routes}</main>
          </Router>
        </AuthContext.Provider>
      </LocalizationProvider>
    </div>
  );
}

export default App;
