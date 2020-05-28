import React, { Component } from 'react'
import { BrowserRouter 
} from 'react-router-dom'
import { Bar} from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {tacticsBarGraph} from '../../actions/visualizationAction'



class BarChart extends Component {
  constructor(props) {
    super(props);
    this.props.tacticsBarGraph();
  }
  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'bottom',
  }

  
    render() { 
      return ( 
        <div className=" center bar" style={{width: '90%'}}>
          {this.props.visualization.tacticsFound ?
          <Bar
            data={
              {
        labels: ['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 'Defense Evasion', 'Credential Access', 'Discovery','Lateral Movement', 'Collection', 'Command and Control', 'Exfiltration', 'Impact'],
        datasets: [
          {
            label: 'Tactics',
            data: this.props.visualization.tactics,//[65, 29, 66, 56, 55, 50, 98, 65, 45, 59, 72],
            backgroundColor:[
                'rgb(107,142,35)', 
                'rgb(139,0,139)', 
                'rgb(199,21,133)', 
                'rgb(188,143,143)', 
                'rgb(178,34,34)', 
                'rgb(255,160,122)', 
                'rgb(32,178,170)', 
                'rgb(160,82,45)',
                'rgb(199,21,122)', 
                'rgb(139,59,139)',
                'rgb(255,140,122)',
                'rgb(225,110,152)',   
            ],
            borderColor:[
              'rgb(107,142,35)', 
              'rgb(139,0,139)', 
              'rgb(199,21,133)', 
              'rgb(188,143,143)', 
              'rgb(178,34,34)', 
              'rgb(255,160,122)', 
              'rgb(32,178,170)', 
              'rgb(160,82,45)',
              'rgb(199,21,122)', 
              'rgb(139,59,139)',
              'rgb(255,140,122)', 
              'rgb(215,180,162)', 
              ]
          }
        ]
      }
            }
            options={{
              maintainAspectRatio: false
            }}
          />
        : ""}
        </div>
      );
    }
  }

  BarChart.propTypes = {

    tacticsBarGraph: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    visualization: state.visualization,
    page: state.page
})

export default (connect(mapStateToProps, {tacticsBarGraph})(BarChart))