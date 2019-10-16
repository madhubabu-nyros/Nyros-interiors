import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, withRouter } from "react-router-dom";
import axios from 'axios';

class UserAccount extends Component {
  constructor (props) {
    super(props);
      this.state = {
        email_value: "",
        password_value: "",
        valid: true,
        email_error: "",
        pwd_error: "",
        e_valid:true,
        p_valid:true,
        rex: true,
        pwd_rex:true

      }
    this.saveDetails = this.saveDetails.bind(this);
  }
  // Save the all pages data with user deatails into database
  saveDetails(e) {
    e.preventDefault()
    if(localStorage) {
      var getStyleValues = localStorage.getItem('style_values') ? JSON.parse(localStorage.getItem('style_values')) : [];
      var getRoom_value = JSON.parse(localStorage.getItem('room_value'));
      var getGoal_value = JSON.parse(localStorage.getItem('goal_value'));
      var getFurniture_image = JSON.parse(localStorage.getItem('furniture_image'));

      var style_images = [];  
      for(var i=0;i<getStyleValues.length;i++) {
        var x = {
          image: getStyleValues[i].image,
          content: getStyleValues[i].content
        }
        style_images.push(x)
      }
      var goal_images = [];  
      for(var i=0;i<getGoal_value.length;i++) {
        var y = {
          content: getGoal_value[i]
        }
        goal_images.push(y)
      }
      var data = {
        user: {
          email: this.state.email_value,
          password: this.state.password_value,
          user_requirements_attributes: [{
              room_id: getRoom_value.id,
              furniture: getFurniture_image,
              user_requirement_styles_attributes: style_images,
              user_requirement_goals_attributes: goal_images,
            }]   
        }
      }
    
    }
    axios.post('http://10.90.90.71:3000/api/v1/users', data).then(res =>{
      localStorage.setItem('token', JSON.stringify(res));
      this.props.history.push('/success');
    }).catch(err => {
      this.setState({valid: false})
    });

    var re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if(this.state.email_value === "" || re.test(this.state.email_value) === false) {
      this.setState({e_valid: false,email_error: "Enter valid email"});
    } else {
      this.setState({e_valid: true});
    }
    var pwd = /^.{4,8}$/;
    if(this.state.password_value=== "") {
      this.setState({p_valid: false, pwd_error: "Can'nt blank", });
    } else if(pwd.test(this.state.password_value) === false) {
      this.setState({p_valid: false, pwd_error: "Minimum 6 Charactors" });
    } else {
      this.setState({p_valid: true})
    }
  }
  
  componentDidMount() {
    setTimeout(()=> {
      if(localStorage.token) {
        this.props.history.push('/success');
      }
    })
  }
  // Get the values from email field
  emailOnChange (e) {
    this.setState({email_value: e.target.value});
  }
  // Get the values from password field
  passwordOnChange (e) {
    this.setState({password_value: e.target.value});
  }  
  render() {
    return (
      <div>
        <nav className="navbar fixed-top navbar-light bg-light nav-home">
          <Link to="/"><img src="../assets/images/n-logo.png" className="logo" /></Link>
        </nav>
        <div className="room">
          <div className="col-md-12 room-img-2">
            <div className="room-design">Create an account</div>
            <div className="room-design-content">to save your project and select your Modsy design package</div>
            <div className="user-form">
              <form>
                <div className="user-email">ENTER YOUR EMAIL</div>
                <input placeholder="Email address" type="text" className="u-email" value={this.state.email_value} onChange={this.emailOnChange.bind(this)} />
                <span className= {this.state.e_valid ? "login-false-1" : "login-true-1"}>{this.state.email_error}</span>  
                <div className="user-email">SET A PASSWORD</div>
                <input placeholder="Set a password" type="password" className="u-email" value={this.state.password_value} onChange={this.passwordOnChange.bind(this)}/>
                <span className= {this.state.p_valid ? "login-false-1" : "login-true-1"}>{this.state.pwd_error}</span>  
                <div className="user-email">HOW DID YOU HEAR ABOUT MODSY? (OPTIONAL)</div>
                <input type="text" className="u-email"/>
                <button type="submit" className="goal-page-3 col-md-12"  onClick={(e) => this.saveDetails(e)}>Save Your Project</button>
              </form>
              <div className="account">Already have an account? <Link to = "/login">Log in here</Link></div>
            </div>  
          </div>
        </div>
      </div>
    );
  }
}
export default UserAccount;