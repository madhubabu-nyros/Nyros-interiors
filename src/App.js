import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from "./components/Home"
import Room from "./components/Room"
import Goal from "./components/Goal"
import Furniture from "./components/Furniture"
import Style from "./components/Style"
import UserAccount from "./components/UserAccount"
import Login from "./components/Login"
import Success from "./components/Success"
import { Route, BrowserRouter } from "react-router-dom";
// Routes for all pages
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Home}/>
        <Route exact path="/project/room" component={Room}/>
        <Route exact path="/project/goal" component={Goal}/>
        <Route exact path="/project/furniture" component={Furniture}/>
        <Route exact path="/project/style" component={Style}/>
        <Route exact path="/project/account" component={UserAccount}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/success" component={Success}/>
      </div>
    </BrowserRouter>
  );
}

export default App;