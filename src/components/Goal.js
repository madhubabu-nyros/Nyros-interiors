import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter, Link, Redirect } from "react-router-dom";
import axios from 'axios';

class Goal extends Component {
  constructor (props) {
    var getGoalIds = localStorage.getItem('ids') ? JSON.parse(localStorage.getItem('ids')) : [];
    var getGoalContent = localStorage.getItem('goal_value') ? JSON.parse(localStorage.getItem('goal_value')) : [];
    super(props);
    this.state = {
        error: null,
        isLoaded: false,
        goals: [],
        goal_value:getGoalContent,
        ids:getGoalIds,
        btn: "",
        value: '',
        text_box: false 
    }
    this.changeClassBorder = this.changeClassBorder.bind(this);
    this.setGoalValue = this.setGoalValue.bind(this);
    this.logout = this.logout.bind(this);
  }
  // Select and Unselect goal values 
  changeClassBorder = (g_id, id, content, text) => {
    if (this.state[g_id] !== undefined && this.state[g_id]) {
      this.setState({
        [g_id]: false,
      });
      if(content === "Other") { 
          this.setState({
          text_box: false,
          btn: "enable",
        });
        if (x !== -1) {
          var ar = [...this.state.goal_value];  
          var x = ar.indexOf(text)
          ar.splice(x, 1);
          this.setState({goal_value: ar});
        }
      }
      setTimeout(()=> {
        if(this.state.ids.length == 0) {
          this.setState({
             btn: "",
           });
        } else {
          this.setState({
             btn: "enable",
           });
        }
      })
      var array = [...this.state.goal_value];
      var index = array.indexOf(content)
      // var x = array.indexOf(text)
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({goal_value: array});
      }
      // if (x !== -1) {
      //   array.splice(x, 1);
      //   this.setState({goal_value: array});
      // } 
      var arr = [...this.state.ids];
       index = arr.indexOf(id)
      if (index !== -1) {
        arr.splice(index, 1);
        this.setState({ids: arr});
      } 
    } else {
      if(content !== "Other") {
        this.setState({
          [g_id]: true,
          goal_value:this.state.goal_value.concat(content),
          ids:this.state.ids.concat(id),
          // btn: "g_id"
        });
      } else {
        this.setState({
            [g_id]: true,
            ids:this.state.ids.concat(id),
            text_box: true
          });
        
      }
      setTimeout(()=> {
      if(this.state.ids.length == 0 ) {
        this.setState({
           btn: "",
         });
      } else {
        this.setState({
          btn: "enable",
        });
      }
    })

    }
  };
  // onchange other's input value
  handleChange (e) {
    this.setState({value: e.target.value});
  }
  // Set Goal values in Local storage.
  setGoalValue() {
    if(this.state.goal_6 === false) {
      var getGoalContent = localStorage.getItem('goal_value') ? JSON.parse(localStorage.getItem('goal_value')) : [];
      var index = getGoalContent.indexOf(this.state.value)
      localStorage.removeItem(getGoalContent[index]);
    }
    if(this.state.value !== "") {
      let goal_value = this.state.goal_value.concat(this.state.value)
      this.setState({
        goal_value:goal_value,
      });
    }
    setTimeout(()=> {
      if(this.state.goal_value!== null) {
        localStorage.setItem('goal_value', JSON.stringify(this.state.goal_value));
        localStorage.setItem('ids', JSON.stringify(this.state.ids));
      }
    })
    setTimeout(()=> {
      this.props.history.push('/project/furniture');
    })
  }
  componentDidMount() {
    fetch("http://10.90.90.71:3000/api/v1/goals")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            goals: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
      if(localStorage.ids){
        this.setState({
          ids: JSON.parse(localStorage.ids)
        })
      }
      var ids = localStorage.ids ? JSON.parse(localStorage.ids) : [];
     if(ids && ids !==undefined && ids.length > 0) {
      for(var i=0; i<ids.length;i++) {
        this.setState({
          ["goal_"+ids[i]]: true,
        })
      }
    } 
    if(this.state.ids.length == 0 ) {
        this.setState({
          btn: "",
        });
      } else {
        this.setState({
          btn: "enable",
        });
      }
    window.onbeforeunload = function() {
      // localStorage.clear();
      localStorage.removeItem("goal_value")
    } 
  }
  // clear all local storage values for logout
  logout() {
    if(localStorage.token) {
      var token = JSON.parse(localStorage.getItem('token'));
      axios.put('http://10.90.90.71:3000/api/v1/authentication/'+token.data.id).then(res =>{
        localStorage.clear();
        this.props.history.push('/');
      })
    }  
  }

  render() {
    const { error, isLoaded, goals } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      var goal = goals.map((i,index) => {
      return <div key={index} className= {this.state["goal_"+i.id] ? "col-md-4 goal-design-1" : "col-md-4 goal-design"} onClick={() => this.changeClassBorder("goal_"+i.id, i.id, i.content, this.state.value)}><div className="goal-content"><div className="goal-content-type">{i.content}</div></div></div>
     });
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
            <div className="room-design">Why do you want to redesign your space?</div>
            <div className="goal-design-content col-md-9">No project is too big or too small! We’re here to help you create a space you love.</div>
            <div className="goal-design-content-1 col-md-9">Select all that apply</div>
            {goal}
            <div className={this.state.text_box ? "other-center" :"other-center-1"} >
              <div className="other-text">Tell us more about your redesign reason:</div>            
              <input type="text" className="other-input" value={this.state.value} onChange={this.handleChange.bind(this)}/>
            </div>
            <div className="g-btns">
              <Link to="/project/room"><div className="goal-buttons col-md-6">Back</div></Link> 
              <button className={this.state.btn ? "goal-page col-md-6" : "goal-page-2 col-md-6"} onClick={() => this.setGoalValue()} disabled={!this.state.btn}>NEXT</button> 
            </div>  
          </div>  
        </div> 
      </div>
    );
  }
}
export default Goal;