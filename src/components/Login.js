import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter, Link } from "react-router-dom";
import axios from 'axios';
class Login extends Component {
  constructor (props) {
    super(props);
      this.state = {
        email_value: "",
        password_value: "",
        error:"",
        valid: true,
      }
    this.login = this.login.bind(this);
  }
  //For User authentication
  login(e) {
    e.preventDefault()
    var loginParams = {
      email: this.state.email_value,
      password: this.state.password_value
    }

    axios.post('http://10.90.90.71:3000/api/v1/authentication', loginParams).then(res =>{
      localStorage.setItem('token', JSON.stringify(res));
      this.props.history.push('/');
    }).catch(err => {
        this.setState({
          error: "Error: Invalid Username/password.",
          valid: false
        });
      });
  }
  // Get the email value from emial input field  
  emailOnChange (e) {
    this.setState({email_value: e.target.value});
  }
  // Get the password value from password input field
  passwordOnChange (e) {
    this.setState({password_value: e.target.value});
  } 
  componentDidMount() {
    if(localStorage.token) {
      setTimeout(()=> {
        this.props.history.push('/');
      })
    }
  }
  render() {
    return (
      <div>
        <div className="login-page">
          <div className="login-img">
            <img src="../assets/images/n-logo.png" className="login-logo" />
          </div>  
          <div className="col-md-12 room-img-2">
            <div className="room-design">Welcome Back!</div>
            <div className="room-design-content">Enter your account credentials to view your space</div>
            <div className="login-body">
              <form>
                <div className="input-container">
                  <label>Email Address</label>
                  <input type="text" className="login-input" onChange={this.emailOnChange.bind(this)}/>
                </div> 
                <div className="input-container"> 
                  <label>Password</label>
                  <input  type="password" className="login-input" value={this.state.passward_value} onChange={this.passwordOnChange.bind(this)}/>
                </div>
                <div className= {this.state.valid ? "login-false" : "login-true"}>{this.state.error}</div>  
                <button type="submit" className="login-btn col-md-12" onClick={(e) => this.login(e)}>Log In</button>
              </form>
            </div>  
          </div>
        </div>
      </div>
    );
  }
}
export default Login;