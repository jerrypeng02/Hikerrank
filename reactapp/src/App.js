import React from 'react';
import './App.css';
import {Route, Switch, BrowserRouter as Router} from "react-router-dom";
import Login from "./component/Login/Login";
import Signup from "./component/Signup/Signup";
import Home from "./component/Home/Home";
import history from "./component/history";
import Profile from "./component/NewProfile/Profile";
import Trail from "./component/Trail/Trail";
import Event from "./component/Event/Event";
import About from "./component/About/About";
import Notification from "./component/Notification/Notification"
import Test from "./Test"
import TestMap from "./TestMap"
import ChatPage from "./component/Chat/ChatPage";

function App() {
  return (
    <div className="App">
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/profile/:id" component={Profile} />
                <Route path="/trail/:id" component={Trail} />
                <Route path="/event/:id" component={Event} />
                <Route path="/test" component={Test} />
                <Route path="/notification" component={Notification} />
                <Route path="/testmap" component={TestMap} />
                <Route path="/chat/:chatID" component={ChatPage} />
                <Route path="/about" component={About} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
