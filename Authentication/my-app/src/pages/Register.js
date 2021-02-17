// import logo from './logo.svg';
import React, {useState} from 'react';
import '../App.css';
import Axios from 'axios';
import {Link} from 'react-router-dom';

function Register() {

  const [email,setEmail] = useState("");
  const [userPassword,setUserPassword] = useState("");
  const [userPassword2,setUserPassword2] = useState("");
  
  Axios.defaults.withCredentials = true;
  const submitUser=()=>{
    Axios.post('http://localhost:3001/api/register',{
      email:email,
      userPassword:userPassword,
      userPassword2:userPassword2}).then((response) => {
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
       <input type="password" name="password2" onChange={(e)=> {
         setUserPassword2(e.target.value)
       }}>
       </input>
       <button onClick={submitUser}>Submit</button>
     </div>
     Click <Link to='/login'>here</Link> to Login
    </div>
  );
}

export default Register;
