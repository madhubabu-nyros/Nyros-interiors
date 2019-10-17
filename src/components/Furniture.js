import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import axios from 'axios';

class Furniture extends Component {
	constructor (props, context) {
    var getFurnitureValue = JSON.parse(localStorage.getItem('furniture_value'));
    super(props, context)
    this.state = {
      value: 0,
      getFurnitureValue: getFurnitureValue
    }
    this.handleChange = this.handleChange.bind(this);
    this.setFurnitureValue = this.setFurnitureValue.bind(this);
    this.logout = this.logout.bind(this);
  }
  // change value for slider
  handleChange = value => {
    this.setState({
      value: value
    })
  };
  // Set Furniture value in local storage.
  setFurnitureValue() {
    if(this.state.value!== null) {
      localStorage.setItem('furniture_value', JSON.stringify(this.state.value));
    } 
    if(this.state.value===0) {
      localStorage.setItem('furniture_image', JSON.stringify("I'm designing the whole room"));
    } else if (this.state.value===1) {
      localStorage.setItem('furniture_image', JSON.stringify("I'm designing around a few pieces I already own"))
    } else {
      localStorage.setItem('furniture_image', JSON.stringify("I want to put the finishing touches on my room"))
    }
  }
  componentDidMount() {
    this.setState({
      value: this.state.getFurnitureValue
    })
    window.onbeforeunload = function() {
      localStorage.clear();
    }
  }
  //Clear local storage values for logout
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
	render() {
    const { value } = this.state
    if(value===0) {
      var furniture = <div className="centered"><img src="../assets/images/10.png" width="344px" height="223px" /></div>
    } else if(value===1) {
      furniture = <div className="centered"><img src="../assets/images/11.png" width="344px" height="223px" /></div>
    } else {
      furniture = <div className="centered"><img src="../assets/images/12.png" width="344px" height="223px" /></div>
    }
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
        <div className="room">
          <div className="col-md-12 room-img">
            <div className="room-design">How finished is your space?</div>
            <div className="goal-design-content col-md-9">Whether your room is completely empty or you're just looking for those last pieces to bring your space together, we can help!</div>
            {furniture}
            <div className="centered">
  				    <Slider
                min={0}
                max={2}
                value={value}
                tooltip={false}
                onChange={this.handleChange}
              />
            </div>
            <div className="furniture-design">
              <div>
                <div className="range-left">|</div>
                <div className="furniture-1">Starting from scratch</div>
                <div className="furniture-content">I'm designing the whole room</div>
              </div>
              <div>
                <div className="range-center">|</div>
                <div className="furniture-1">Somewhere in between</div>
                <div className="furniture-content">I'm designing around a few<br/>pieces I already own</div>
              </div>
              <div>
                <div className="range-right">|</div>
                <div className="furniture-1">Mostly furnished</div>
                <div className="furniture-content">I want to put the finishing<br/>touches on my room</div>
              </div>
            </div>
            <div className="g-btns">
              <Link to="/project/goal"><div className="goal-buttons col-md-6">Back</div></Link> 
              <Link to="/project/style"><div className="goal-page col-md-6" onClick={() => this.setFurnitureValue()}>Next</div></Link> 
            </div>  
          </div>  
        </div> 
      </div>
    );
	}
}
export default Furniture;