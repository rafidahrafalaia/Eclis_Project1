// import logo from './logo.svg';
import Axios from 'axios';
import './App.css';
import React, {useEffect,useState} from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import LoginSSO from './pages/LoginSSO';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
function App() {
  const [loginStatus, setLoginStatus] = useState("");
  
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/api/getUser").then((response) => {
      if (response.data.session) {
        setLoginStatus(response.data.session);
        window.location.replace('http://localhost:3001/api/login-sso');
        // setLoginStatus(response.data.user[0].role);
      }
    });
  },
  Axios.get("http://localhost:3001/api/loginUser").then((response) => {
    if (response.data.session) {
        setLoginStatus(response.data.session.role);
    }
  }), []);
  // const [userName,setUserName] = useState("");
  // const [userPassword,setUserPassword] = useState("");
  // const submitUser=()=>{
  //   Axios.post('http://localhost:3001/api/insert',{
  //     userName:userName,
  //     userPassword:userPassword}).then(()=>{
  //     alert("succesfull insert");
  //     });
  // };

  return (
    <Router>
    <div className="App">
      {/* <Register/> */}
      <Switch>
        <Route path="/" exact component={Register}/>
        <Route path="/login-sso" exact component={LoginSSO}/>
        <Route path="/login" exact component={Login}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
