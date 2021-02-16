// import logo from './logo.svg';
import Axios from 'axios';
import './App.css';
import React, {useEffect,useState} from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from "./controller/protected.route";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
function App() {
  return (
    <Router>
    <div className="App">
      {/* <Register/> */}
      <Switch>
        {/* <Route path="/" exact component={Register}/>  */}
        <Route exact path="/" component={Register} />
        <ProtectedRoute path="/dashboard" component={Dashboard}/>
        <Route path="/login" exact component={Login}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
