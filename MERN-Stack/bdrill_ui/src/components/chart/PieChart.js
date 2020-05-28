import React, { Component } from 'react'
import { withRouter} from 'react-router-dom'
import {Pie} from 'react-chartjs-2';

const data = {
  labels:['Assigned', 'Attemted', 'Passed', 'Failed' ],
  datasets: [{
    data:[20, 20, 12, 8],
    backgroundColor: [
      'rgb(139,139,139)','rgb(188,143,143)',  'rgb(0, 191, 255)', 'rgb(110, 110, 212)'
    ],
    hoverBackgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56'
    ]
  }]
};

const options = {
  maintainAspectRatio: false,
  responsive: false,
  legend: {
    position: 'left',
    labels: {
      boxWidth: 8
    }
  }
}
  
class PieChart extends Component {
  
  constructor(props) {
    super(props)
  }
    render() { 
      return ( 
         <div style={{ position: 'relative'}}>
        <Pie data={data} height={160} width={200} options={options}/>
      </div>      
      );
    }
    }
export default withRouter(PieChart);