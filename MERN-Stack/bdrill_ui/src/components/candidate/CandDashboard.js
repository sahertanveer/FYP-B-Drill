import React, { Component } from 'react';
import { withRouter, Route, BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {AssignmentAttemptionStatusDoughnutGraph, SessionsBubbleGraph,
AssignmentHistoryRadarGraph, PerformanceLineGraph, MitrePerformanceVisitLineGraph} from '../../actions/visualizationAction'
// import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
// import { Line, Bar } from "react-chartjs-2";
// import { chartExample1 } from "../chart/Chart.js";
// import classNames from "classnames";
// reactstrap components
// import {
//     Button,
//     ButtonGroup,
//     Card,
//     CardHeader,
//     CardBody,
//     CardTitle,
// } from "reactstrap";

import RadarChart from '../chart/RadarChart'
import LineChart from '../chart/LineChart'
import BubbleChart from '../chart/BubbleChart'
import DoughnutChart from '../chart/DoughnutChart'
import VisitLineChart from '../chart/VisitLineChart'

const BubbleChartOptions={
    scales: {
        xAxes:[
            {
        type: "time",
        distribution:'series',
        time:{
            tooltipFormat: 'YYYY-MM-DD HH:mm',
                    unit: 'day',
            displayFormats:{
                day: 'D-MMM-YY'
            }
        },
        scaleLabel:{
            display: true,
            labelString:
             'Third value shows time taken in minutes'
        }
    }
    ],
    yAxes:[
        {
            scaleLabel:{
                display: true,
                labelString: 'Score (Out of 100)'
            }
        }
    ]
}
}



const LineChartOptions={
    scales: {
        xAxes:[
            {
        type: "time",
        distribution:'series',
        time:{
            tooltipFormat: 'YYYY-MM-DD HH:mm',
                    unit: 'day',
            displayFormats:{
                day: 'D-MMM-YYYY'
            }
        },
        scaleLabel:{
            display: true,
            labelString:
             'Date'
        }
    }
    ],
    yAxes:[
        {
            scaleLabel:{
                display: true,
                labelString: 'Score (Out of 100)'
            }
        }
    ]
}
}

class CandDashboard extends Component {
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
                        <div className="col xs12 s12 m6 l9">
                            <h1 className="white-text">B-Drill</h1>
                            <p className="cyan-text" >
                                We give wings to your skills you decide where to fly...
                            </p>
                        </div>

                        <div className="col xs12 s12 m6 l3">
                        </div>
                    </div>

                    <hr />
                    <br />

                    <div className="row">
                        <div className="col xs12 s12 m6 l3">
                            <div className="card-action uicards">
                                <div className="row" >
                                    <div className="col xs12 s12 m6 l6 center" style={{ padding: '5px' }}>
                                        <i className=" large material-icons">network_check</i>
                                    </div>
                                    <div className="col xs12 s12 m6 l6 center" >
                                        <h4 className="white-text" >14</h4>
                                        <p> Connections</p>
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col xs12 s12 m6 l3">
                            <div className="card-action uicards ">
                                <div className="row" >
                                    <div className="col xs12 s12 m6 l6 center" style={{ padding: '5px' }}>
                                        <i className=" large material-icons">desktop_windows</i>
                                    </div>
                                    <div className="col xs12 s12 m6 l6 center" >
                                        <h4 className="white-text" >143</h4>
                                        <p> Machines </p>
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col xs12 s12 m6 l3">
                            <div className="card-action uicards">
                                <div className="row" >
                                    <div className="col xs12 s12 m6 l6 center" style={{ padding: '5px' }}>
                                        <i className=" large material-icons">adb</i>
                                    </div>
                                    <div className="col xs12 s12 m6 l6 center" >
                                        <h4 className="white-text" >50</h4>
                                        <p> Total Attacks </p>
                                        <small>Campaigns + Scenarios</small>
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col xs12 s12 m6 l3">
                            <div className="card-action uicards">
                                <div className="row" >
                                    <div className="col xs12 s12 m6 l6 center" style={{ padding: '5px' }}>
                                        <i className=" large material-icons">sync</i>
                                    </div>
                                    <div className="col xs12 s12 m6 l6 center" >
                                        <h4 className="white-text" >11</h4>
                                        <p> Tactics </p>
                                        <br />
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
                                    <RadarChart labelA="Assigned Scenarios" labelB="Assigned Campaigns"
                                     dataSetA={this.props.visualization.assignmentHistoryFound ? 
                                    this.props.visualization.assignmentHistoryData.scenarioArray : null}
                                     dataSetB={this.props.visualization.assignmentHistoryFound ? 
                                        this.props.visualization.assignmentHistoryData.campaignArray : null}/>
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
                                        <DoughnutChart labels={ ['Attempted & Passed','Attempted & Failed','Not Attempted']}
                                        dataSet = {this.props.visualization.assignmentAttemptedFound ? 
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
                                    label = {
                                        this.props.visualization.mitrePerformanceFound ? 
                                        this.props.visualization.mitrePerformanceData.label: null
                                    }
                                    dataSet = {this.props.visualization.mitrePerformanceFound ? 
                                        this.props.visualization.mitrePerformanceData.averageScore: null}
                                    
                                    />
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="row">
                            <div className="col s12 m12 l12">
                                <Card className="card-chart black">
                                    <CardHeader>
                                    <div className="row">
                                        <div className="col s6 m4 l4">
                                                <CardTitle tag="h2">Performance</CardTitle>
                                            </div>
                                            <div className="col s6 m8 l8">
                                                <ButtonGroup
                                                    className="btn-group-toggle float-right"
                                                    data-toggle="buttons"
                                                >
                                                    <Button
                                                        tag="label"
                                                        className={classNames("btn-simple", {
                                                            active: this.state.bigChartData === "data1"
                                                        })}
                                                        color="info"
                                                        id="0"
                                                        size="sm"
                                                        onClick={() => this.setBgChartData("data1")}
                                                    >
                                                        <input
                                                            defaultChecked
                                                            className="d-none"
                                                            name="options"
                                                            type="radio"
                                                        />
                                                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                            Accounts
                          </span>
                                                        <span className="d-block d-sm-none">
                                                            <i className="tim-icons icon-single-02" />
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        color="info"
                                                        id="1"
                                                        size="sm"
                                                        tag="label"
                                                        className={classNames("btn-simple", {
                                                            active: this.state.bigChartData === "data2"
                                                        })}
                                                        onClick={() => this.setBgChartData("data2")}
                                                    >
                                                        <input
                                                            className="d-none"
                                                            name="options"
                                                            type="radio"
                                                        />
                                                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                            Purchases
                          </span>
                                                        <span className="d-block d-sm-none">
                                                            <i className="tim-icons icon-gift-2" />
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        color="info"
                                                        id="2"
                                                        size="sm"
                                                        tag="label"
                                                        className={classNames("btn-simple", {
                                                            active: this.state.bigChartData === "data3"
                                                        })}
                                                        onClick={() => this.setBgChartData("data3")}
                                                    >
                                                        <input
                                                            className="d-none"
                                                            name="options"
                                                            type="radio"
                                                        />
                                                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                            Sessions
                          </span>
                                                        <span className="d-block d-sm-none">
                                                            <i className="tim-icons icon-tap-02" />
                                                        </span>
                                                    </Button>
                                                </ButtonGroup>
                                            </div>
                                            </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="chart-area">
                                            <Line
                                                data={chartExample1[this.state.bigChartData]}
                                                options={chartExample1.options}
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            </div> */}
                </div>

            </BrowserRouter>
        )
    }
}

CandDashboard.propTypes = {
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

export default connect(mapStateToProps, {AssignmentAttemptionStatusDoughnutGraph, AssignmentHistoryRadarGraph, 
    SessionsBubbleGraph, PerformanceLineGraph, MitrePerformanceVisitLineGraph})(CandDashboard)


