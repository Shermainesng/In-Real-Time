import React, { useReducer } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import Navigation from "./ui/Navbar";
// import Navigation from "./ui/NavMenu";
import Home from "./Home";
import Events from "./events/pages/Events";
import Auth from "./user/pages/Auth";
import Event from "./events/pages/Event";
import { AuthContext } from "./shared/context/auth-context";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import NewEventForm from "./events/pages/NewEvent";
import Vote from "./polls/pages/Vote";

import { useAuth } from "../src/shared/hooks/auth-hook";
import { initialState, reducer } from "./shared/context/reducer";
import { GlobalContextProvider } from "./shared/context/ContextProvider";
import More from "./user/pages/More";

function App() {
  const { token, login, logout, userId, userName } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/more" exact>
          <More />
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
        <Route path="/events/:eventId" exact>
          <Event />
        </Route>
        <Route path="/events/:pollId/vote" exact>
          <Vote />
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
        <Route path="/more" exact>
          <More />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Route path="/events/:eventId/vote" exact>
          <Vote />
        </Route>
        <Route path="/about" exact></Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <div className="App">
      <GlobalContextProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthContext.Provider
            value={{
              isLoggedIn: !!token,
              token: token,
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
      </GlobalContextProvider>
    </div>
  );
}

export default App;
