import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import { Radar } from 'react-chartjs-2';

class RadarChartManager extends Component {
    render() {

        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: this.props.labelA,
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: this.props.dataSetA
                },
                {
                    label: this.props.labelB,
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: this.props.dataSetB
                }
            ]
        };

        return (
            <div>
                <Radar data={data} />
            </div>


        );
    }
}
export default withRouter(RadarChartManager);