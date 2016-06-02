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
               <div className="col-md-5">
                  <div className="panel panel-default">
                     <div className="panel-body" style={{textAlign: 'center'}}><h2>Sneeze Count: {(()=>{
                        let list = store.getState().sneezeList;
                        if(list.length){
                           return list[0].count;
                        }
                        return 0;
                     })()}</h2></div>
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
               <div className="col-md-7">
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
      drawCharts(this.props.store);
   }
   componentDidUpdate(){
      drawCharts(this.props.store);
   }
};

const drawCharts = (store) => {
   drawSneezeTopFive(store);
   drawSneezeFrequency(store);
}

function drawSneezeFrequency(store) {
   let sneezeData = store.getState().sneezeList.reduce((freq, sn, i)=>{
      let snDate = new Date(Number(sn.time));
      let fDate = (snDate.getMonth()+1) + '/' + snDate.getDate();
      let fDateMillis = (new Date(fDate)).getTime();
      if(!freq[fDate]){
         freq[fDate] = {d: fDate, c: 0, millis: fDateMillis };
      }
      freq[fDate].c++;
      return freq;
   },{});
   sneezeData = Object.keys(sneezeData).map((k, i)=>{
      return [sneezeData[k].d,sneezeData[k].c,sneezeData[k].millis];
   })
   .sort((a,b)=> a[2] > b[2])
   .map(a => [a[0],a[1]]);
   let data = new google.visualization.DataTable();
   data.addColumn('string', 'Time');
   data.addColumn('number', 'Count');

   data.addRows(sneezeData);

   const options = {
      hAxis: { title: "Time" },
      vAxis: { title: "Count", gridLines: {
         count: 4
      }},
      curveType: 'function',
      legend: { position: 'none'},
      width: '100%',
      height: '100%',
      chartArea: {
         height: '70%',
         top: '6%'
      },

   };

   let chart = new google.visualization.LineChart(document.getElementById('sneeze_frequency'));

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
      legend: {position: 'none'},
      width: '100%',
      height: '100%',
      chartArea: {
         height: '70%',
         top: '8%'
      }
   };

   var chart = new google.visualization.ColumnChart(document.getElementById('sneeze_top_five'));

   chart.draw(data, options);
}

module.exports = SneezesDashboard;
