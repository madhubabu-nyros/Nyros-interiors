import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import axios from 'axios';

class Home extends Component {
  constructor (props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.nextRoomPage = this.nextRoomPage.bind(this);
  }
  // Clear all local storage values for logout
  logout() {
    if(localStorage.token) {
      var token = JSON.parse(localStorage.getItem('token'));
      axios.put('http://10.90.90.71:3000/api/v1/authentication/'+token.data.id).then(res =>{
        console.log("Success")
        localStorage.clear();
        this.props.history.push('/');
      })
    }  
  }
  // Redirect to room page
  nextRoomPage() {
    var x;
    if(localStorage) {
      if(localStorage.token) {
        x = JSON.parse(localStorage.getItem('token'));
      }
        localStorage.clear();
      if(x !== undefined) {     
        setTimeout(()=> {
          localStorage.setItem('token', JSON.stringify(x));
        })
      }  
    }
    this.props.history.push('/project/room');
  }
  render() {
    if(localStorage.token){
      var log = <div className="logout" onClick={() => this.logout()}>Logout</div>
    } else {
      var log = <div className="logout"><Link to = "/login">Login</Link></div>
    }
    return (
      <div className="start-home">
        <nav className="navbar fixed-top navbar-light bg-light nav-home">
          <Link to="/"><img src="../assets/images/n-logo.png" className="logo" /></Link>
          {log}
        </nav>
        <div className="home">
          <div className="container">
            <div className="container-left-home">          
              <h1 className="home-title">Designs You Don’t<br/>Have To Imagine</h1>
              <p className="home-description">See your exact room, expertly<br/>designed in 3D with actual pieces of<br/>furniture from well-known retailers that<br/>you can buy on the spot.</p>
              <Link to="/project/room"><button className="btn-start" onClick={() => this.nextRoomPage()}>Start Your Project<i className="fa fa-arrow-right arrow"></i></button></Link>
            </div>  
          </div>  
        </div> 
      </div>
    );
  }
}
export default Home;