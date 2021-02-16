import React,{useEffect,useState} from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";
import Axios from 'axios';
import {Link} from 'react-router-dom';
import { useHistory } from "react-router-dom";

Axios.defaults.withCredentials = true;
  
export function ProtectedRoute({
  // isAuth:isAuth,
  component: Component,
  ...rest
}) {
  const state = {
  products: [],
  loading: true
}
  let history = useHistory();
  const [loginStatus, setLoginStatus] = useState(state);

  useEffect(() => {
    // const login=()=>{
    Axios.get("http://localhost:3001/api/loginUser").then((response) => {
      if (response.data.loggedIn === true) {
        console.log("its true login")
        const data=response.data.loggedIn
        // setLoginStatus(true);
        setLoginStatus({
          loading: false,
          data,
        }); 
        if(response.data.sessionSSO){
          auth.loginSSO(() => {
            history.push("/dashboard");
        });
        }
        // else{
          auth.login(() => {
            history.push("/dashboard");
          });  
        // }
        console.log("login",loginStatus)
      }
      else {
        console.log("its false login")
      // setLoginStatus(false);
        const data=false;
        setLoginStatus({
        loading: false,
        data,
      });
      console.log("login",loginStatus)
      }
  });
  }, 
  []);
  return (
  <Route
    {...rest}
    render={props => {
      // console.log(login)
      const { data, loading } = loginStatus;
      // console.log(datasso,"test")
      if(loading) return "loading..."
      else{
      if (data) {
        console.log("test",auth.isAuthenticated)
        return <Component {...props} />;
      }
       else{
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                from: props.location
              }
            }}
          />
        );
      }
    }
    }}
  />
);
}