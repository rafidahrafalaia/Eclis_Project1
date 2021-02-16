// import logo from './logo.svg';
import React, {useEffect,useState} from 'react';
import '../App.css';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import { Redirect } from "react-router-dom";
import loginStatus from "./Login";
import auth from '../controller/auth';
import { useHistory } from "react-router-dom";


function Dashboard() {
  
  Axios.defaults.withCredentials = true;
  const [email,setEmail] = useState("");
  const [userPassword,setUserPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  let history = useHistory();
  // useEffect(() => {
  //   Axios.post("http://localhost:3001/api/loginSSO").then((response) => {
  //     if (response.data.loggedIn === true) {
  //       setLoginStatus(response.data.user[0].role);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   Axios.get("http://localhost:3001/api/loginUser").then((response) => {
  //     if (response.data.loggedIn === true) {
  //       setLoginStatus(response.data.session);
  //     }else
  //     window.location.replace('http://localhost:3000/login')
  //   });
  // }, []);
  const LogoutSSO=()=>{
    Axios.delete('http://localhost:3001/api/logout', { } , { withCredentials: true }).then((response)=>{ 
        
    
  });
    window.location.replace('http://localhost:3001/api/logout-sso').then((response) =>{
      setLoginStatus(false);
      window.location.replace('http://localhost:3000/login')
    })
    auth.logout(() => {
      history.push("/login");
    });
  };

  const Logout=()=>{
    Axios.delete('http://localhost:3001/api/logout', { } , { withCredentials: true }).then((response)=>{ 
        
    
      });console.log("test");
      auth.logout(() => {
        history.push("/login");
      });
  };
  return (
    
    <div className="Login">
     <div className="form">
       <h1>You Are Logged In</h1> 
       <div>
        {auth.authenticatedSSO
        ? 
         <button onClick={LogoutSSO} >Logout SSO</button>
         : 
        <button onClick={Logout} >Logout</button>
          } 
        </div>
       {/* <button onClick={LogoutSSO}>Logout</button> */}
     </div>
    </div>
  );
}

export default Dashboard;
// export default render;
