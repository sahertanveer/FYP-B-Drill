import React, { Component } from 'react'
import { withRouter} from 'react-router-dom'
import { Bubble} from 'react-chartjs-2';





// const options={
//   scales: {
//     xAxes:[
//         {
//     type: "time",
//     time:{
//       format:'DD MMM YYYY',
//         // parser: 'YYYY-MM-DD HH:mm',
//         tooltipFormat: 'll HH:mm',
//         // unit: 'day',
//         // unitStepSize: 1,
//         // displayFormats:{
//         //     day: 'MM/DD/YYYY'
//         // }
//     },
//     display:true,
//     scaleLabel:{
//         display: true,
//         labelString: 'Date'
//     }
// }
// ],
// }
// }


// [{x:new Date(),y:2,r:1.9}, 
//   {x:new Date(),y:15,r:5}, 
//   {x:new Date(),y:9,r:2},
//   {x:new Date(),y:20,r:6},
//   {x:new Date(),y:12,r:5}, 
//   {x:new Date(),y:29,r:2},
//   {x:new Date(),y:36,r:8},
//   {x:new Date(),y:1,r:5}, 
//   {x:new Date(),y:10,r:1}, 
//   {x:new Date(),y:15,r:2}, 
//   {x:new Date(),y:12,r:5},
//   {x:new Date(),y:45,r:4},
//   {x:new Date(),y:27,r:3}, 
//   {x:new Date(),y:40,r:5},
//   {x:new Date(),y:36,r:8},
//   {x:new Date(),y:9,r:5},
//   {x:new Date(),y:6,r:4},
//   {x:new Date(),y:44,r:3}, 
//   {x:new Date(),y:10,r:7}, 
//   {x:new Date(),y:0,r:5},
  
// ]
class BubbleChart extends Component {
  constructor(props) {
    super(props)
  }
  
    render() { 
      const options = this.props.options
      const data = {
        labels: ['Session', 'Time Taken'],
        datasets: [
          {
            label: 'Sessions',
            data:this.props.dataSet,
            backgroundColor:[
                'rgb(207,142,35)', 
                'rgb(139,139,139)', 
                'rgb(199,21,133)', 
                'rgb(188,143,143)', 
                'rgb(178,34,34)', 
                'rgb(32,178,170)', 
                'rgb(160,82,45)',
                'rgb(107,142,35)', 
                'rgb(139,0,139)', 
                'rgb(18,13,103)', 
                'rgb(178,34,34)', 
                'rgb(255,160,122)', 
                'rgb(32,178,0)', 
                'rgb(255,1,5)',
                'rgb(139,7,45)',
                'rgb(32,1,10)', 
                'rgb(207,142,35)',
                'rgb(177, 39, 182)',
                'rgb(45, 235, 209)',
                'rgb(252, 153, 175)'
            ],
            borderColor:[
              'rgb(207,142,35)', 
                'rgb(139,139,139)', 
                'rgb(199,21,133)', 
                'rgb(188,143,143)', 
                'rgb(178,34,34)', 
                'rgb(32,178,170)', 
                'rgb(160,82,45)',
                'rgb(107,142,35)', 
                'rgb(139,0,139)', 
                'rgb(18,13,103)', 
                'rgb(178,34,34)', 
                'rgb(255,160,122)', 
                'rgb(32,178,0)', 
                'rgb(255,1,5)',
                'rgb(139,7,45)',
                'rgb(32,1,10)',
              ]
          }
        ]
      };

      

      return ( 
          <div className="bubble" style={{ position: 'relative', width: '2122 rem'}}>
            <div style={{ height: '30%' }}>
              <Bubble data={data} options={options} />                               
            </div>  
          </div> 
      );
    }
    }
export default withRouter(BubbleChart);