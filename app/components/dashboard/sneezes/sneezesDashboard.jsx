const React = require('react');
const { Component } = React;

let SneezeItem = require('./sneezeItem.jsx');
let StopWatch = require('./stopwatch.jsx');
let SneezeTopFive = require('./sneezeTopFive.jsx');
let SneezeFrequency = require('./sneezeFrequency.jsx');

class SneezesDashboard extends Component {
   render(){
      let {store} = this.props;
      return(
         <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
            <div className="row">
               <div className="col-sm-12">
                  <div class="page-header">
                    <h1>Sneezes <small>Stat tracking for Courtneys sneezes</small></h1>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="col-xs-5">
                  <div className="panel panel-default">
                     <div className="panel-body" style={{textAlign: 'center'}}><h2>Sneeze Count: {store.getState().sneezeList[0].count}</h2></div>
                  </div>
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h4>Recent</h4>
                     </div>
                     <div className="panel-body">
                        <table className="table table-striped table-hover">
                           <thead>
                              <tr>
                                 <th><h4>Date</h4></th>
                                 <th><h4>Reporter</h4></th>
                                 <th><h4>Count</h4></th>
                              </tr>
                           </thead>
                           <tbody>
                           {
                              store.getState().sneezeList.slice(0,20).map((sneeze) =>{
                                 return (
                                    <SneezeItem sneeze={sneeze} key={sneeze.id} />
                                 )
                              })
                           }
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
               <div className="col-xs-7">
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h3>Since last sneeze</h3>
                     </div>
                     <div className="panel-body">
                        <StopWatch store={store} />
                     </div>
                  </div>
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h4>Top 5 Reporters</h4>
                     </div>
                     <div className="panel-body">
                        <SneezeTopFive />
                     </div>
                  </div>
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h4>Daily Frequency</h4>
                     </div>
                     <div className="panel-body">
                        <SneezeFrequency />
                    </div>
                  </div>
               </div>
            </div>
         </div>
      )
   }
   componentDidMount(){
      let {store} = this.props;
      drawSneezeFrequency(store);
      drawSneezeTopFive(store);
   }
   componentDidUpdate(){
      let {store} = this.props;
      drawSneezeFrequency(store);
      drawSneezeTopFive(store);
   }
};


function drawSneezeFrequency(store) {
   let sneezeData = store.getState().sneezeList.reduce((freq, sn, i)=>{
      let snDate = new Date(Number(sn.time));
      let fDate = new Date((snDate.getMonth()+1) + '/' + snDate.getDate() +'/' + snDate.getFullYear());
      let fDateMillis = fDate.getTime().toString();
      if(!freq[fDateMillis]){
         freq[fDateMillis] = {d: fDateMillis, c: 0};
      }
      freq[fDateMillis].c++;
      return freq;
   },{});
   sneezeData = Object.keys(sneezeData).map((k, i)=>{
      return [new Date(Number(sneezeData[k].d)),sneezeData[k].c];
   });
   let data = new google.visualization.DataTable();
   data.addColumn('date', 'Time');
   data.addColumn('number', 'Count');

   data.addRows(sneezeData);

   var options = {
      hAxis: { title: "Time" },
      vAxis: { title: "Count"},
      curveType: 'function',
      legend: { position: 'none'}
   };

   var chart = new google.visualization.LineChart(document.getElementById('sneeze_frequency'));

   chart.draw(data, options);
}

function drawSneezeTopFive(store) {
   let sneezeData = store.getState().sneezeList.reduce((topFive, sn)=>{
      if(!topFive[sn.reporter]){
         topFive[sn.reporter] = 0;
      }
      topFive[sn.reporter]++;
      return topFive;
   },{});
   let colors = ['red','blue','green','purple','orange'];
   sneezeData = Object.keys(sneezeData).map((k, i)=>{
      return [k,sneezeData[k]];
   })
   .sort((a,b)=> a[1] < b[1])
   .slice(0,5)
   .map((a,i) => {
      a[2] = 'color:'+colors[i];
      return a;
   });
   sneezeData = sneezeData.slice(0,5);
   let data = new google.visualization.DataTable();
   data.addColumn('string', 'Username');
   data.addColumn('number', 'Count');
   data.addColumn({type:'string',role:'style'})

   data.addRows(sneezeData);


   var options = {
      hAxis: { title: "Usernames"},
      vAxis: { title: "Count"},
      legend: {position: 'none'}
   };

   var chart = new google.visualization.ColumnChart(document.getElementById('sneeze_top_five'));

   chart.draw(data, options);
}

module.exports = SneezesDashboard;
