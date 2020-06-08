import React, { Component } from 'react'
import { withRouter} from 'react-router-dom'
import {Line} from 'react-chartjs-2';
 
class LineChart extends Component {

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'bottom',
  }
    render() { 
      const data = {
        labels: this.props.xAxis_label,
        datasets: [
          {
            label: this.props.labelA,
            fill: true,
              backgroundColor: 'rgba(179,181,198,0.2)',
                borderColor: 'rgba(179,181,198,1)',
                pointBackgroundColor: 'rgba(179,181,198,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#fff',
            data: this.props.dataSetA,
            spanGaps:true
          },
          {
            label: this.props.labelB,
            fill: true,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor:  '#fff',
            pointHoverBorderColor: '#fff',
            data:this.props.dataSetB,
            spanGaps:true
          },
          // {
          //   label: 'Overall Performance',
          //   fill: false,
          //   lineTension: 0.1,
          //   backgroundColor: 'rgba(95,192,197,0.4)',
          //   borderColor: 'rgba(95,192,197,1)',
          //   pointBackgroundColor: 'rgba(95,192,197,1)',
          //   pointBorderColor: '#fff',
          //   pointHoverBackgroundColor:  '#fff',
          //   pointHoverBorderColor: 'rgba(95,192,197,1)',
          //   data: [75, 84, 69, 88, 72, 88, 79, 67, 78, 88, 84, 91]
          // }
         
        ]
      };
      return ( 
      <div className="center line">
        <Line data={data} options={this.props.options}/>
      </div>
       
      );
    }
    }
export default withRouter(LineChart);