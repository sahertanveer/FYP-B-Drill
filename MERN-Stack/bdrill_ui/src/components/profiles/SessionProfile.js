import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import RadarChart from '../chart/RadarChart'
import LineChart from '../chart/LineChart'
import BubbleChart from '../chart/BubbleChart'
import DoughnutChart from '../chart/DoughnutChart'
import VisitLineChart from '../chart/VisitLineChart'

import {
    AssignmentAttemptionStatusDoughnutGraph, SessionsBubbleGraph,
    AssignmentHistoryRadarGraph, PerformanceLineGraph, MitrePerformanceVisitLineGraph
} from '../../actions/visualizationAction'

const BubbleChartOptions = {
    scales: {
        xAxes: [
            {
                type: "time",
                distribution: 'series',
                time: {
                    tooltipFormat: 'YYYY-MM-DD HH:mm',
                    unit: 'day',
                    displayFormats: {
                        day: 'D-MMM-YY'
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString:
                        'Third value shows time taken in minutes'
                }
            }
        ],
        yAxes: [
            {
                scaleLabel: {
                    display: true,
                    labelString: 'Score (Out of 100)'
                }
            }
        ]
    }
}



const LineChartOptions = {
    scales: {
        xAxes: [
            {
                type: "time",
                distribution: 'series',
                time: {
                    tooltipFormat: 'YYYY-MM-DD HH:mm',
                    unit: 'day',
                    displayFormats: {
                        day: 'D-MMM-YYYY'
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString:
                        'Date'
                }
            }
        ],
        yAxes: [
            {
                scaleLabel: {
                    display: true,
                    labelString: 'Score (Out of 100)'
                }
            }
        ]
    }
}

class SessionProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bigChartData: "data1"
        };

        this.props.AssignmentHistoryRadarGraph()
        this.props.AssignmentAttemptionStatusDoughnutGraph()
        this.props.SessionsBubbleGraph()
        this.props.PerformanceLineGraph()
        this.props.MitrePerformanceVisitLineGraph()

    }
    setBgChartData = name => {
        this.setState({
            bigChartData: name
        });
    };
    render() {

        return (
            <BrowserRouter>
                <div className="container-fluid">

                    <div className="row">
                        <div className="col s12 m6 l6">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content">
                                    <h5 className="card-stats-number"> Assignments </h5>
                                    <hr />
                                    <br />
                                    <RadarChart labelA="Assigned Scenarios" labelB="Assigned Campaigns"
                                        dataSetA={this.props.visualization.assignmentHistoryFound ?
                                            this.props.visualization.assignmentHistoryData.scenarioArray : null}
                                        dataSetB={this.props.visualization.assignmentHistoryFound ?
                                            this.props.visualization.assignmentHistoryData.campaignArray : null} />
                                    <br />
                                </div>
                            </div>
                        </div>

                        <div className="col s12 m6 l6">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content">
                                    <h5 className="card-stats-number"> Sessions </h5>
                                    {/* sessions detail
                                        x-axes Score
                                        y-axes 24 hrs start time
                                        r-  time taken to complete attack*/}
                                    <hr />
                                    <br />
                                    <BubbleChart dataSet={this.props.visualization.sessionsFound ?
                                        this.props.visualization.sessionsData : null}
                                        options={BubbleChartOptions}
                                    />
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12 m12 l12">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content">
                                    <h5 className="card-stats-number"> Performance </h5>
                                    <hr />
                                    <div className="row">
                                        <div className="col s12 m12 l8 offset-l2">
                                            <br />
                                            <LineChart
                                                xAxis_label={this.props.visualization.performanceFound ?
                                                    this.props.visualization.performanceData.label : null}
                                                labelA="Scenario Performance"
                                                dataSetA={this.props.visualization.performanceFound ?
                                                    this.props.visualization.performanceData.ScenarioPerformance : null}
                                                labelB="Campaign Performance"
                                                dataSetB={this.props.visualization.performanceFound ?
                                                    this.props.visualization.performanceData.CampaignPerformance : null}
                                                options={LineChartOptions}
                                            />
                                            <br />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12 m6 l6">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content">
                                    <h5 className="card-stats-number"> Assignments </h5>
                                    <hr />
                                    <br />
                                    <DoughnutChart labels={['Attempted & Passed', 'Attempted & Failed', 'Not Attempted']}
                                        dataSet={this.props.visualization.assignmentAttemptedFound ?
                                            [this.props.visualization.assignmentAttemptedData.passedAssignments,
                                            this.props.visualization.assignmentAttemptedData.failedAssignments,
                                            this.props.visualization.assignmentAttemptedData.unAttempted] : null}
                                    />
                                    <br />
                                </div>
                            </div>
                        </div>

                        <div className="col s12 m6 l6">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content">
                                    <h5 className="card-stats-number">MITRE Based Performance</h5>
                                    {/* mitre detail
                                        x-axes Tactics
                                        y-axes Average Score*/}
                                    <hr />
                                    <br />
                                    <VisitLineChart
                                        xAxislabel="MITRE Tactics Based Performance"
                                        label={
                                            this.props.visualization.mitrePerformanceFound ?
                                                this.props.visualization.mitrePerformanceData.label : null
                                        }
                                        dataSet={this.props.visualization.mitrePerformanceFound ?
                                            this.props.visualization.mitrePerformanceData.averageScore : null}

                                    />
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 m12 l12">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content">
                                    <div className="row">
                                        <div className="col s12 m12 l12">
                                            <h5 className="card-stats-number"> Session History</h5>
                                        </div>
                                    </div>
                                    <hr />
                                    <div>
                                        <table border="1" className="center">
                                            <thead >
                                                <tr>
                                                    <th>Session Id</th>
                                                    <th>Start Time</th>
                                                    <th>End Time</th>
                                                    <th>Category</th>
                                                    <th>Score</th>
                                                    <th>Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* {this.renderSessionTableData()} */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </BrowserRouter>
        )
    }
}

SessionProfile.propTypes = {
    visualization: PropTypes.object.isRequired,
    AssignmentAttemptionStatusRadarDoughnutGraph: PropTypes.func.isRequired,
    AssignmentHistoryGraph: PropTypes.func.isRequired,
    SessionsBubbleGraph: PropTypes.func.isRequired,
    PerformanceLineGraph: PropTypes.func.isRequired,
    MitrePerformanceVisitLineGraph: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    visualization: state.visualization,
    page: state.page
})

export default connect(mapStateToProps, {
    AssignmentAttemptionStatusDoughnutGraph, AssignmentHistoryRadarGraph,
    SessionsBubbleGraph, PerformanceLineGraph, MitrePerformanceVisitLineGraph
})(SessionProfile)


