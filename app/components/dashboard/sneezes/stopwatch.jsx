const React = require('react');
const { Component } = React;

class StopWatch extends Component {
   constructor(props){
      super(props);
      this.state = {
         secondsElapsed: 0
      }
   }
   render(){
      let ftime = formattedSeconds(this.state.secondsElapsed);
      return (
         <div>
            <div className="row">
               <div className="col-sm-3">
                  <h4><i>Days</i></h4>
               </div>
               <div className="col-sm-3">
                  <h4><i>Hours</i></h4>
               </div>
               <div className="col-sm-3">
                  <h4><i>Minutes</i></h4>
               </div>
               <div className="col-sm-3">
                  <h4><i>Seconds</i></h4>
               </div>
            </div>
            <div className="row">
               <div className="col-sm-3">
                  <h4>{ftime.days}</h4>
               </div>
               <div className="col-sm-3">
                  <h4>{ftime.hours}</h4>
               </div>
               <div className="col-sm-3">
                  <h4>{ftime.mins}</h4>
               </div>
               <div className="col-sm-3">
                  <h4>{ftime.secs}</h4>
               </div>
            </div>
         </div>
      )
   }
   componentDidMount(){
      const {store} = this.props;
      let lastSneeze = Math.floor(Number(store.getState().sneezeList[0].time)/1000);
      let getDiff = () => {
         let curTime = Math.floor((new Date().getTime())/1000);
         return curTime - lastSneeze;
      }
      var diff = getDiff();
      this.setState({secondsElapsed:diff});
      setInterval( () => {
         return this.setState({
            secondsElapsed: this.state.secondsElapsed + 1
         });
      }, 1000);
   }
}

const formattedSeconds = (sec) => {
   let days = Math.floor(sec/86400);
   let hours = ('0' + Math.floor(sec/3600) % 24).slice(-2);
   let mins = ('0' + Math.floor(sec/60) % 60).slice(-2);
   let secs = ('0' + sec % 60).slice(-2);
   return {days, hours, mins, secs};
}

module.exports = StopWatch;
