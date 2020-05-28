import React, { Component } from 'react'
import { withRouter} from 'react-router-dom'
import {Bar} from 'react-chartjs-2';





class VisitLineChart extends Component {
//   displayName: 'RandomizedDataLineExample',

constructor(props) {
  super(props)
}

// componentWillMount(){
//     this.setState(initialState);
// }
componentDidMount(){

//     var _this = this;

//     setInterval(function(){
//         var oldDataSet = _this.state.datasets[0];
//         var newData = [];

//         for(var x=0; x< _this.state.labels.length; x++){
//             newData.push(Math.floor(Math.random() * 100));
//         }

//         var newDataSet = {
//             ...oldDataSet
//         };

//         newDataSet.data = newData;

//         var newState = {
//             ...initialState,
//             datasets: [newDataSet]
//         };

//         _this.setState(newState);
//     }, 5000);
}

  render() {

    const data = {
      labels: this.props.label,
       datasets: [
        {
          label: this.props.xAxislabel,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(95,192,197,0.4)',
          borderColor: 'rgba(95,192,197,1)',
          pointBackgroundColor: 'rgba(95,192,197,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor:  '#fff',
          pointHoverBorderColor: 'rgba(95,192,197,1)',
          data: this.props.dataSet
        }
      ]
    }
    return (
      <div>
        <Bar data={data} />
      </div>
    );
  }
};


export default withRouter(VisitLineChart);