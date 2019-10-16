import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
class Success extends Component {
  constructor (props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  // Clear all values in local storage for logout
  logout() {
    var token = JSON.parse(localStorage.getItem('token'));
    axios.put('http://10.90.90.71:3000/api/v1/authentication/'+token.data.id).then(res =>{
      console.log("Success")
      localStorage.clear();
      this.props.history.push('/');
    })
  }
  componentDidMount() {
    if(!localStorage.token) {
      setTimeout(()=> {
        this.props.history.push('/');
      })
    }
  }
  render() {  
    return (
      <div>
        <div className="login-page">
          <nav className="navbar fixed-top navbar-light bg-light nav-home">
          <img src="../assets/images/n-logo.png" className="logo" />
          <div className="logout" onClick={() => this.logout()}>Logout</div>
        </nav>
          <div className="col-md-12 success">
            <h1><span className="success-text-1">Success! Thanks for Your Interest</span><br/><span className="success-text-2">Our customer Support get back to you within 24 Hours</span></h1>
          </div>    
        </div>
      </div>
    );
  }
}
export default Success;