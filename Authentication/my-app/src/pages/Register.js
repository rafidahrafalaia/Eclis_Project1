// import logo from './logo.svg';
import React, {useState} from 'react';
import '../App.css';
import Axios from 'axios';
import {Link} from 'react-router-dom';

function Register() {

  const [email,setEmail] = useState("");
  const [userPassword,setUserPassword] = useState("");
  
  Axios.defaults.withCredentials = true;
  const submitUser=()=>{
    Axios.post('http://localhost:3001/api/register',{
      email:email,
      userPassword:userPassword}).then((response) => {
        console.log(response);
      });
  };

  return (
    <div className="Register">
     <div className="form">
       <h1>Register</h1>
       <input type="text" name="email" onChange={(e)=> {
         setEmail(e.target.value)
       }}>
       </input>
       <input type="password" name="password" onChange={(e)=> {
         setUserPassword(e.target.value)
       }}>
       </input>
       <button onClick={submitUser}>Submit</button>
     </div>
     Click <Link to='/login'>here</Link> to Login
    </div>
  );
}

export default Register;
