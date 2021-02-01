// import logo from './logo.svg';
import React, {useEffect,useState} from 'react';
import '../App.css';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import { Redirect } from "react-router-dom";
import loginStatus from "./Login";



function Login_sso() {
  
  const [email,setEmail] = useState("");
  const [userPassword,setUserPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  useEffect(() => {
    Axios.post("http://localhost:3001/api/loginSSO").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].role);
      }
    });
  }, []);

const LogoutSSO=()=>{
  window.location.replace('http://localhost:3001/api/logout-sso').then((response) =>{
    setLoginStatus(false);
    window.location.replace('http://localhost:3000/login')
  })
};
  return (
    
    <div className="Login">
     <div className="form">
       <h1>Login SSO</h1>
       <button onClick={LogoutSSO}>Logout</button>
     </div>
    </div>
  );
}

export default Login_sso;
// export default render;
