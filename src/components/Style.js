import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter, Link } from "react-router-dom";
import axios from 'axios';

class Style extends Component {
  constructor (props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      styles: [],
      b_none: false,
      style_values: getStyleValues,
      input_box: false,
      value: '',
      values:{},
      val:{},
      ids: getStyleIds,
      btn: "",
    }
    // Get the all local storage values
    var getStyleValues = localStorage.getItem('style_values') ? JSON.parse(localStorage.getItem('style_values')) : [];
    var getRoom_value = JSON.parse(localStorage.getItem('room_value'));
    var getGoal_value = JSON.parse(localStorage.getItem('goal_value'));
    var getFurniture_image = JSON.parse(localStorage.getItem('furniture_image'));
    var getStyleIds = localStorage.getItem('style_ids') ? JSON.parse(localStorage.getItem('style_ids')) : [];
    
    this.changeBorderColor = this.changeBorderColor.bind(this);
    this.changeBorder = this.changeBorder.bind(this);
    this.setStyleValue = this.setStyleValue.bind(this);
    this.save_value = this.save_value.bind(this);
    this.setOtherValue = this.setOtherValue.bind(this);
    this.logout = this.logout.bind(this);
  }
  
  // Select and Unselect Style values 
  changeBorderColor  = (s_id, id, image, content, text) => {
    if (this.state[s_id] != undefined && this.state[s_id]) {
      this.setState({
        [s_id]: false,
        input_box: false,
      });
    var array = [...this.state.style_values];  
    for(var i=0;i<array.length;i++) {
      
      if(array[i].id === id) {
        var index = i;
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({style_values: array});
        } 
      }
    }
    var arr = [...this.state.ids];
       index = arr.indexOf(id)
      if (index !== -1) {
        arr.splice(index, 1);
        this.setState({ids: arr});
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
    } else {
      if(content !== "OTHER") {
        this.setState({
          [s_id]: true,
          b_none: false,
          values: {
            id:id,
            image: image,
            content: content
          },
          ids:this.state.ids.concat(id)
        });
        setTimeout(()=> {
          this.setState({
              style_values: this.state.style_values.concat(this.state.values),
            });
         }) 
      } else {
        this.setState({
          [s_id]: true,
          b_none: false,
          input_box: true,
          ids:this.state.ids.concat(id)
        });
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
    }

  };
  // Unsselect all styles
  changeBorder = () => {
        this.setState({
        b_none: !this.state.b_none,
        style_values: []
      });
        
      var styles =  this.state.styles;
      styles.map((item, index)=> {
        this.setState({
          ['style_'+item.id]: false,
          btn: ""
        });
      })

    localStorage.removeItem("style_values")
  }
  // Set other value in local storage
  setOtherValue() {
    this.setState({
      style_values: this.state.style_values.concat(this.state.values),
    },()=>localStorage.setItem('style_values', JSON.stringify(this.state.style_values)))
    if(this.state.style_values !== []) {
      console.log("style_values", this.state.style_values)
    }
  }
  // Set Style values in local storage 
  setStyleValue() {
    if(this.state.style_6== false) {
      var getStyleValues = localStorage.getItem('style_values') ? JSON.parse(localStorage.getItem('style_values')) : [];
      for(var i=0;i<getStyleValues.length;i++) {
        if(getStyleValues[i].id === 6) {
          var x = i;
          localStorage.removeItem(getStyleValues[x]); 
        }
      }  
    }
     
    this.state.styles.map((item, index)=> {
      if(item.content=="OTHER" && this.state.value !== "") {
        this.setState({
          values: {
            id:item.id,
            image: item.image,
            content: this.state.value
          }  
        },() => this.setOtherValue()  
        ) 
      }
    })    
    setTimeout(()=> {
      if(this.state.style_values!== []) {
        localStorage.setItem('style_values', JSON.stringify(this.state.style_values));
      }
    })
    setTimeout(()=> {
      if(this.state.ids!== []) {
        localStorage.setItem('style_ids', JSON.stringify(this.state.ids));
      }
    })

    // if user is login, save the values into database, other wise redirect to create account page
    if(localStorage.token) {
      this.save_value()
    } else {
      setTimeout(()=> {
        if(this.state.ids!== []) {
          localStorage.setItem('style_ids', JSON.stringify(this.state.ids));
        }
        this.props.history.push('/project/account');
      })
    }
  }
  // get the value from other input field.
  handleOnChange (e) {
    console.log('handle change called');
    this.setState({value: e.target.value});
  }
  componentDidMount() {
    fetch("http://10.90.90.71:3000/api/v1/styles")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            styles: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    var getStyleValues = localStorage.style_values ? JSON.parse(localStorage.style_values) : []; 
    if(localStorage.style_values) {
       for(var i=0; i<getStyleValues.length;i++) { 
        this.setState({
          ["style_"+getStyleValues[i].id]: true,
        });
       }   
    }

    if(localStorage.style_ids) {
      var getStyleIds = localStorage.style_ids ? JSON.parse(localStorage.style_ids) : []; 
        if(getStyleIds.length == 0) {
          this.setState({
             btn: "",
           });
        } else {
          this.setState({
             btn: "enable",
           });
        }
     } 

    window.onbeforeunload = function() {
      localStorage.removeItem("style_values")
      localStorage.removeItem("style_ids")
    }  
  }
  // Save the values into database  
  save_value() {
   setTimeout(()=> { 
    var getStyleValues = JSON.parse(localStorage.getItem('style_values'));
    var getRoom_value = JSON.parse(localStorage.getItem('room_value'));
    var getGoal_value = JSON.parse(localStorage.getItem('goal_value'));
    var getFurniture_image = JSON.parse(localStorage.getItem('furniture_image'));
    var token = JSON.parse(localStorage.getItem('token'));

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
    console.log("goal_images",goal_images)
    var data = {
      user_requirement: {
        user_id: token.data.id, 
        room_id: getRoom_value.id,
        furniture: getFurniture_image,
        user_requirement_styles_attributes: style_images,
        user_requirement_goals_attributes: goal_images,
        
      }
    }
    fetch('http://10.90.90.71:3000/api/v1/user_requirements', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
      }).then(res => {
          return res;
      }).catch(err => err);
     
      setTimeout(()=> {
        this.props.history.push('/success');
      })
    })
  }
  // clear all local storage values for logout
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
    console.log("ids", this.state.ids)
    const { error, isLoaded, styles } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      var images = styles.map(i => {
      return <div className= {this.state["style_"+i.id] ? 'col-md-4 room-images-2' : 'col-md-4 room-images'}><img key={i} src={'../assets/images/'+i.image+".png" } alt="" className="img-responsive" width="167px" height="115px" id={'img_'+i.id} onClick={() => this.changeBorderColor("style_"+i.id, i.id, i.image, i.content, this.state.value)} /><div className="room-content" id={'content_s'+i.id} onClick={() => this.changeBorderColor("style_"+i.id, i.id, i.image, i.content, this.state.value)}>{i.content}</div>
        <div className={this.state["style_"+i.id] ? 'love-img-2 zoomIn animated faster' : 'love-img-1'}>
          <img src="/love.png" alt="" width="50px" height="50px" onClick={() => this.changeBorderColor("style_"+i.id, i.id, i.image, i.content, this.state.value)}/>
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
            <div className="room-design">Which design styles are you drawn to?</div>
            <div className="goal-design-content col-md-9">Understanding your style helps us select pieces you’ll love.</div>
            <div className="goal-design-content-1 col-md-9">Select all that apply</div>
            {images}
            <div className={this.state.input_box ? "other-center" :"other-center-1"} >
              <div className="other-text">Enter other design styles below:</div>            
              <input type="text" className="other-input" value={this.state.value} onChange={this.handleOnChange.bind(this)}/>
            </div>
            <div className={this.state.b_none ? 'col-md-12 goal-design-3' : 'col-md-12 goal-design-2'} onClick={() => this.changeBorder()}><div className="goal-content">
              <div className="goal-content-type">I'm not sure about my style</div>
              </div></div>
            <div>
              <Link to="/project/furniture"><button className="home-page col-md-6">BACK</button></Link>
              <button className={this.state.btn ? "goal-page col-md-6" : "goal-page-2 col-md-6"} onClick={() => this.setStyleValue()} disabled={!this.state.btn}>NEXT</button>  
            </div>  
          </div>
        </div>
      </div>
    );
  }
}
export default Style;