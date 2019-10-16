import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import axios from 'axios';

class Room extends Component {
  constructor (props) {
    var getValues = JSON.parse(localStorage.getItem('room_value'));
    super(props);
    this.state = {
        error: null,
        isLoaded: false,
        rooms: [],
        activeClass: null,
        activeImage: null,
        room_value: {
          id:null,
          image: "",
          content: ''  
        },
        getValues: getValues,
        btn: ""
        
    }
    this.ChangeClassName = this.ChangeClassName.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    fetch("http://10.90.90.71:3000/api/v1/rooms")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            rooms: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
      if(this.state.getValues !==null)  {
        this.setState({
          activeClass: "room_"+this.state.getValues.id,   
          activeImage: "love-img_"+this.state.getValues.id,
          ["room_"+this.state.getValues.id]: true,
          ["love-img_"+this.state.getValues.id]: true,
          room_value: {
              id: this.state.getValues.id,
              image: this.state.getValues.image,
              content: this.state.getValues.content 
            },
           btn: this.state.getValues.image   
        });

      } 
    window.onbeforeunload = function() {
      // localStorage.clear();
      localStorage.removeItem("room_value")
    }   
  }
  // Select and Unselect room values  
  ChangeClassName  = (r_id, f, e, c, id) => {
    if (this.state[r_id] !== undefined && this.state[r_id] && this.state[f]) {
      this.setState({
        activeClass: r_id,   
        activeImage: f,
        [r_id]: false,
        [f]: false,
        btn: ""
      });
      localStorage.removeItem("room_value")      
    } else {
      this.setState({
        activeClass: r_id,   
        activeImage: f,
        [r_id]: true,
        [f]: true,
        room_value: {
            id: id,
            image: e,
            content: c 
          },
        btn: e  
      });
    }
  };

  // Set room value in Local Storage
  setRoomValue() {
    if(this.state.room_value!== null) {
      localStorage.setItem('room_value', JSON.stringify(this.state.room_value));
    } else {
      localStorage.removeItem("room_value")   
    } 
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
  render() {
    console.log("activeClass",this.state.activeClass)
    const { error, isLoaded, rooms } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      var images = rooms.map(i => {
      return <div  className={this.state.activeClass === "room_"+i.id && this.state["room_"+i.id] ? 'col-md-4 room-images-2' : 'col-md-4 room-images'} id={"room_"+i.id} >
          <img value={i.image} onClick={() => this.ChangeClassName("room_"+i.id,"love-img_"+i.id, i.image, i.content, i.id)} key={i} src={'../assets/images/'+i.image+".png" } alt="" className="img-responsive" width="167px" height="115px" id={'img_'+i.id} /><div className="room-content" id={'content_'+i.id} onClick={() => this.ChangeClassName("room_"+i.id,"love-img_"+i.id, i.image, i.content, i.id)} >{i.content}</div>
          <div className={this.state.activeImage === "love-img_"+i.id && this.state["love-img_"+i.id] ? 'love-img-2 zoomIn animated faster' : 'love-img-1'}>
            <img src="/love.png" alt="" width="50px" height="50px" onClick={() => this.ChangeClassName("room_"+i.id,"love-img_"+i.id, i.image, i.content, i.id)} />
          </div>
      </div>
     });
    }
    if(localStorage.token){
      var log = <div className="logout" onClick={() => this.logout()}>Logout</div>
    } else {
      var log = <div className="logout"><Link to = "/login">Login</Link></div>
    }
    return (
      <div>
        <nav className="navbar fixed-top navbar-light bg-light nav-home">
          <Link to="/"><img src="../assets/images/n-logo.png" className="logo" /></Link>
          {log}
        </nav>
        <div className="room">
          <div className="col-md-12 room-img">
            <div className="room-design">Which room are you designing?</div>
            <div className="room-design-content">Designing multiple spaces? Pick the room you want to start with! We'll follow up with additional details once you purchase the multi-room package.</div>
              {images} 
            <Link to="/"><button className="home-page col-md-6">HOME</button></Link>
            <Link to="/project/goal"><button className={this.state.btn ? "goal-page col-md-6" : "goal-page-2 col-md-6"} onClick={() => this.setRoomValue()} disabled={!this.state.btn}>NEXT</button></Link>  
          </div>
        </div>
      </div>
    );
  }
}
export default Room;