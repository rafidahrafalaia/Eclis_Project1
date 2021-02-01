// import logo from './logo.svg';
import React, {useEffect,useState} from 'react';
import '../App.css';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import { Redirect } from "react-router-dom";
// redirect = () => {
//   window.location.href = 'http://localhost:3001/api/login-sso';
//   // maybe can add spinner while loading
//   return null;
// }
function Register() {

  // let state = { redirect: null };
  const [email,setEmail] = useState("");
  const [userPassword,setUserPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  
  Axios.defaults.withCredentials = true;

  const loginUser=()=>{
    Axios.post('http://localhost:3001/api/loginUser',{
      email:email,
      userPassword:userPassword}).then((response)=>{ 
        console.log(response);
        if (response.data.message) {
        setLoginStatus(response.data.message);
        } 
        else {
        setLoginStatus(response.data.session.email);
        }
      });
  };

  // useEffect(() => {
  //   Axios.get("http://localhost:3001/api/loginUser").then((response) => {
  //     if (response.data.loggedIn === true) {
  //       setLoginStatus(response.data.user[0].role);
  //     }
  //   });
  // }, []);

  // if (loginStatus) {
  //   // window.location.replace('http://localhost:3001/api/login-sso') // return <Redirect to='http://localhost:3001/api/login-sso'  />
  //   // fetch("http://localhost:3001/api/login-sso")
  // }else{
  //   window.location.replace('http://localhost:3001/api/login-sso').then((response)=>{
  //     if (response.data.loggedIn === true) {
  //       window.location.replace('http://localhost:3000/login')
  //       setLoginStatus(response.data.user[0].role);
  //     }
  //   });
  // }

  //sso-login
  const loginSSO=()=>{
  if (loginStatus) {
  }else{
    window.location.replace('http://localhost:3001/api/login-sso')
    // .then((response)=>{
    //   if (response.data.loggedIn === true) {
    //     window.location.replace('http://localhost:3000/login')
    //     setLoginStatus(response.data.user[0].role);
    //   }
    // });
  }
 }

  return (
    
    <div className="Login">
     <div className="form">
       <h1>Login</h1>
       <input type="text" name="email" onChange={(e)=> {
         setEmail(e.target.value)
       }}>
       </input>
       <input type="password" name="password" onChange={(e)=> {
         setUserPassword(e.target.value)
       }}>
       </input>
       <button onClick={loginUser}>Submit</button>
       <br></br>
       <button onClick={loginSSO}>Login SSO UI</button>
       <p>{loginStatus}</p>
     </div>
     Click <Link to='/'>here</Link> to Register
    </div>
  );
}

export default Register;
// export default render;
