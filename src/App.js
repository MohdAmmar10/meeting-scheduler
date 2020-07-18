import React from 'react';
import './App.css';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';

import "react-datepicker/dist/react-datepicker.css";
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({
    adate: null,
    fulldate: new Date(),
    displayform: 'false',
    displaybutton: false,
    stime: '10:00',
    op:'',
    etime: '11:30',
    data:[]
  });
  }
  componentDidMount() {

    let separator='/';
    let newDate = new Date();
    this.setState({fulldate:newDate})
    let curdate=`${newDate.getDate()}${separator}${newDate.getMonth() + 1<10?`0${newDate.getMonth() + 1}`:`${newDate.getMonth() + 1}`}${separator}${newDate.getFullYear()}`.toString();
    this.setState({ adate:curdate})    
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = 'http://fathomless-shelf-5846.herokuapp.com/api/schedule?date='+curdate; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then((response) => response.json())
      .then(data => this.setState({ data }));
      

  }
    left() {
      let separator='/';
      let newDate = new Date(this.state.fulldate);
      newDate.setDate(this.state.fulldate.getDate() - 1);
      this.setState({fulldate:newDate}) 
      let prev=`${newDate.getDate()}${separator}${newDate.getMonth() + 1<10?`0${newDate.getMonth() + 1}`:`${newDate.getMonth() + 1}`}${separator}${newDate.getFullYear()}`.toString();

      this.setState({adate: prev})
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = 'http://fathomless-shelf-5846.herokuapp.com/api/schedule?date='+prev; // site that doesn’t send Access-Control-*
      fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
        .then((response) => response.json())
        .then(data => this.setState({ data }));
        this.renderProducts()
    }
    right() {
      let separator='/';
      let newDate = new Date(this.state.fulldate);
      newDate.setDate(this.state.fulldate.getDate() + 1);
      this.setState({fulldate:newDate}) 
      let next =`${newDate.getDate()}${separator}${newDate.getMonth() + 1<10?`0${newDate.getMonth() + 1}`:`${newDate.getMonth() + 1}`}${separator}${newDate.getFullYear()}`.toString();

      this.setState({adate: next})
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = 'http://fathomless-shelf-5846.herokuapp.com/api/schedule?date='+next; // site that doesn’t send Access-Control-*
      fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
        .then((response) => response.json())
        .then(data => this.setState({ data }));
        this.renderProducts()
    }
  renderProducts() {
    this.state.data.sort((a, b) => a.start_time > b.start_time)  



    return this.state.data.map(d => 
        (
            
              <div className="meeting_sch">
                <strong className="meeting_schTime">
                  {(parseInt(d.start_time) % 12||12)}{d.start_time.substring(d.start_time.length - 3, d.start_time.length)} {(parseInt(d.start_time)>=12?'PM':'AM')}<span> - </span>   
                  {(parseInt(d.end_time) % 12||12)}{d.end_time.substring(d.end_time.length - 3, d.end_time.length)} {(parseInt(d.end_time)>=12?'PM':'AM')}
                </strong>
                <div className="meeting_schDetails">
                  Meeting with {d.participants.map(p=>
                  <span>{p}, </span> )
                  }<span>for </span>
                  {d.description}
                </div>
              </div>
            
        )
    )
}
submitFunc=(event) => {
  event.preventDefault();
  if ((parseInt(this.state.stime.substring(0,2))===parseInt(this.state.etime.substring(0,2)))&&(parseInt(this.state.stime.substring(3,5))>=parseInt(this.state.etime.substring(3,5)))){  
    this.setState({op:"Enter Start and End time correctly"})
  }else if(parseInt(this.state.stime.substring(0,2))>parseInt(this.state.etime.substring(0,2))){ 
    this.setState({op:"Enter Start and End time correctly"})
  }
  else{
    let separator='/';
    let newDate = new Date(this.state.fulldate);
    newDate.setDate(this.state.fulldate.getDate());
    let prev=`${newDate.getDate()}${separator}${newDate.getMonth() + 1<10?`0${newDate.getMonth() + 1}`:`${newDate.getMonth() + 1}`}${separator}${newDate.getFullYear()}`.toString();
    var flag=0;
    this.setState({adate: prev})
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = 'http://fathomless-shelf-5846.herokuapp.com/api/schedule?date='+prev; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then((response) => response.json())
      .then(data => this.setState({ data }));
  
    let sarray = this.state.data.map(c => c.start_time.substring(0,c.start_time.length-3))
    let earray = this.state.data.map(c => c.end_time.substring(0,c.end_time.length-3))
    var sarr = sarray.map(Number)
    var earr = earray.map(Number)

    var i
    var sd=parseInt(this.state.stime.substring(0,2))
    var ed=parseInt(this.state.etime.substring(0,2))
    for(i=0;i<sarr.length;i++){
      if((sd>=sarr[i]&&sd<earr[i])||(ed>sarr[i]&&sd<=earr[i])){
        flag=1
        break
      }
    }
    if (flag===0){
      this.setState({op:"Slot Available",displaybutton:true})
      
    }
    else{
      this.setState({op:"Slot not Available"})
    }
  }

}
handleChange = date => {
  this.setState({
    fulldate: date,displaybutton:false
  });
};
handleTextChange(event) {
}
onChangeS = stime =>{ this.setState({ stime,displaybutton:false })};
onChangeE = etime =>{ this.setState({ etime,displaybutton:false })};

  render(){
    if(this.state.displayform!=="true"){
    return(
       <div className="App">
          <div className="app__header">
            <button onClick={() =>this.left()}><p><i className="arrow left"></i></p></button>
            <h1 className="app__headerDate">{this.state.fulldate.toDateString()}</h1>
            <button onClick={() =>this.right()}><p><i className="arrow right"></i></p></button>
          </div>
          {this.renderProducts()}
        <div className="app__buttonClass">
          <button className="app__button" onClick={() =>this.setState({displayform:"true"})}>Add Meeting</button>
        </div>
       </div>
    
    );  
    }else if(this.state.displayform==="true"){
      return(
        <form onSubmit={this.submitFunc}>
          <div className="form">
            <div className="form__dp">
              <div className="dl">Meeting Date</div>
              <DatePicker
              selected={this.state.fulldate<new Date()?this.state.fulldate=new Date():this.state.fulldate}
              onChange={this.handleChange}
              isClearable='true'
              dateFormat='dd/MM/yyyy'
              minDate={new Date()}
              />
            </div>
            <div className="form__tp">
            <div className="form__tp1">
              <div className="ltp1">Start Date</div>
              <TimePicker
              onChange={this.onChangeS}
              value={this.state.stime}
              />
            </div>
            <div className="form__tp2">
            <div className="ltp1">End Date</div>
              <TimePicker
              onChange={this.onChangeE}
              value={this.state.etime}
              />
            </div>
            </div>
            <div className="form__desc">
              <div className="desc">Description</div>
              <input type="textarea" 
              name="textValue"
              className="form__descTa"
              onChange={this.handleTextChange}
              />
            </div>
            <div className="form__output>">
              <center><h3>{this.state.op}</h3></center>
            </div>
          </div>
            <div className="form__buttonClass">
                <input type="submit" className="form__button" value="Check Slot"/>
                {this.state.displaybutton?<button onClick={() =>{this.setState({displayform:"false"});alert("Slot Booked Sucessfully")}} className="bookbtn">Book Slot</button>:null}
            </div>
      </form>
      
      );
    }
  }
}

export default App;
