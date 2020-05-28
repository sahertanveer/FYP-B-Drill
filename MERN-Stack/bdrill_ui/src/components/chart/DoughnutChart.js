import React, {Component} from 'react';
import { withRouter} from 'react-router-dom'
import {Doughnut} from 'react-chartjs-2';



class DoughnutChart extends Component {

  render() {

	const data = {
		labels: this.props.labels,
		datasets: [{
			data: this.props.dataSet,
			fill: false,
			backgroundColor: ['#70cad1', '#b08ea2', '#BBB6DF']
			// backgroundColor: [
			// 	'rgba(95,192,197,0.7)',
			// 	'rgba(179,181,198,0.7)',
			// 	'rgba(255,99,132,0.7)',
			// ],
			// borderColor: [
			// 	'rgba(95,192,197,1)',
			// 	'rgba(179,181,198,1)',
			// 	'rgba(255,99,132,1)',
			// ],
			// pointBackgroundColor: [
			// 	'rgba(95,192,197,1)',
			// 	'rgba(179,181,198,1)',
			// 	'rgba(255,99,132,1)',
			// ],
			// pointBorderColor: '#fff',
			// pointHoverBackgroundColor: '#fff',
			// pointHoverBorderColor: [
			// 	'rgba(95,192,197,1)',
			// 	'rgba(179,181,198,1)',
			// 	'rgba(255,99,132,1)',
			// ],
	
		}]
	};

    return (
      <div>
        <Doughnut data={data} />
      </div>
    );
  }
};
export default withRouter(DoughnutChart);