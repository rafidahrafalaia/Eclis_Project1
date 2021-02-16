import React, {useEffect,useState} from 'react';
import '../App.css';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import { Redirect } from "react-router-dom";

Axios.defaults.withCredentials = true;
class Auth {
    constructor() {
      this.authenticated = false;
      this.authenticatedSSO = false;
    }
  
    login(cb) {
      this.authenticated = true;
      cb();
  }
    loginSSO(cb) {
      this.authenticatedSSO = true;
      cb();
    }
  
    logout(cb) {
      this.authenticated = false;
      cb();
    }
  
    isAuthenticated() {   
      return this.authenticated;
    }
    

    isAuthenticatedSSO() {   
      return this.authenticatedSSO;
    }
    

  }
  
  export default new Auth();
  