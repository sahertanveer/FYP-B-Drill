import React, { Component } from 'react';
import {  BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    AssignmentAttemptionStatusDoughnutGraph, SessionsBubbleGraph,
    AssignmentHistoryRadarGraph, PerformanceLineGraph, MitrePerformanceVisitLineGraph
} from '../../actions/visualizationAction'
import { getlivesesssionslength, getmachineslength, getattackslength, getorganizationslength, getmanagerslength, getuserslength } from '../../actions/dashboardAuthAction'

import Card from '../common/cards/Card';
import CardHeader from '../common/cards/CardHeader';
import CardIcon from "../common/cards/CardIcon.js";
import CardFooter from "../common/cards/CardFooter.js";
import Icon from "@material-ui/core/Icon";
import Update from "@material-ui/icons/Update";

import RadarChart from '../chart/RadarChart'
import LineChart from '../chart/LineChart'
import BubbleChart from '../chart/BubbleChart'
import DoughnutChart from '../chart/DoughnutChart'
import VisitLineChart from '../chart/VisitLineChart'

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

class CandDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bigChartData: "data1",
            sessionsLength:0,
            machinesLength: 0,
            attacksLength: 0,
            organizationsLength: 0,
            managersLength: 0,
            candidatesLength: 0
        };

        this.props.AssignmentHistoryRadarGraph(this.props.authId)
        this.props.AssignmentAttemptionStatusDoughnutGraph(this.props.authId)
        this.props.SessionsBubbleGraph(this.props.authId)
        this.props.PerformanceLineGraph(this.props.authId)
        this.props.MitrePerformanceVisitLineGraph(this.props.authId)
        this.GetMachinesLength();
        this.GetAttacksLength();
        this.GetOrganizationsLength();
        this.GetManagersLength();
        this.GetUsersLength();
        this.GetSessionsLength();
    }
    async GetSessionsLength() {
        var sessionLength = await this.props.getlivesesssionslength();
        this.setState({ sessionsLength: sessionLength })
    }

    async GetMachinesLength() {
        var machinelength = await this.props.getmachineslength();
        this.setState({ machinesLength: machinelength })
    }
    async GetAttacksLength() {
        var attacklength = await this.props.getattackslength();
        this.setState({ attacksLength: attacklength })
    }
    async GetOrganizationsLength() {
        var orglength = await this.props.getorganizationslength();
        this.setState({ organizationsLength: orglength })
    }
    async GetManagersLength() {
        var managerlength = await this.props.getmanagerslength();
        this.setState({ managersLength: managerlength })
    }
    async GetUsersLength() {
        var userlength = await this.props.getuserslength();
        this.setState({ candidatesLength: userlength })
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
                            <p className="white-text" >
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
                            <Card>
                                <CardHeader color="warning" stats icon>
                                    <CardIcon color="warning">
                                        <Icon>network_check</Icon>
                                    </CardIcon>
                                    <br />
                                    <p>Ongoing Drills</p>
                                <h3>{this.state.sessionsLength}</h3>
                                </CardHeader>
                                <CardFooter >
                                    <div >
                                        Current Sessions
                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        <div className="col xs12 s12 m6 l3">
                            <Card>
                                <CardHeader color="danger" stats icon>
                                    <CardIcon color="danger">
                                        <Icon>desktop_windows</Icon>
                                    </CardIcon>
                                    <br />
                                    <p> Machines</p>
                                    <h3>{this.state.machinesLength}</h3>
                                </CardHeader>
                                <CardFooter >
                                    <div >
                                        Ubuntu + Windows
                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        <div className="col xs12 s12 m6 l3">
                            <Card>
                                <CardHeader color="primary" stats icon>
                                    <CardIcon color="primary">
                                        <Icon>adb</Icon>
                                    </CardIcon>
                                    <br />
                                    <p> Attacks</p>
                                    <h3>{this.state.attacksLength}</h3>
                                </CardHeader>
                                <CardFooter >
                                    <div >
                                        Campaigns + Scenarios
                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        <div className="col xs12 s12 m6 l3">
                            <Card>
                                <CardHeader color="rose" stats icon>
                                    <CardIcon color="rose">
                                        <Icon>sync</Icon>
                                    </CardIcon>
                                    <br />
                                    <p>Tactics</p>
                                    <h3>12</h3>
                                </CardHeader>
                                <CardFooter >
                                    <div >
                                        MITRE Based
                                                </div>
                                </CardFooter>
                            </Card>
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
                                    <h5 className="card-stats-number"> Assignments Status</h5>
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

                    <div className="row" style={{ overflowX: "hidden" }}>
                        <div className="col xs12 s12 m6 l3">
                            <Card>
                                <CardHeader color="success" stats icon>
                                    <CardIcon color="success">
                                        <Icon>content_copy</Icon>
                                    </CardIcon>
                                    <br />
                                    <p>Online Users</p>
                                    <h3>{this.props.onlineUsers !== null ? Object.keys(this.props.onlineUsers).length : 0 }</h3>
                                </CardHeader>
                                <CardFooter stats>
                                    <div >
                                        <Update />
                                        Just Updated
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        <div className="col xs12 s12 m6 l3">
                            <Card>
                                <CardHeader color="warning" stats icon>
                                    <CardIcon color="warning">
                                        <Icon>business</Icon>
                                    </CardIcon>
                                    <br />
                                    <p>Organizations</p>
                                    <h3>{this.state.organizationsLength}</h3>
                                </CardHeader>
                                <CardFooter stats>
                                    <div >
                                        <Update />
                                        Just Updated
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        <div className="col xs12 s12 m6 l3">
                            <Card>
                                <CardHeader color="info" stats icon>
                                    <CardIcon color="info">
                                        <Icon>people</Icon>
                                    </CardIcon>
                                    <br />
                                    <p>Managers</p>
                                    <h3>{this.state.managersLength}</h3>
                                </CardHeader>
                                <CardFooter stats>
                                    <div >
                                        <Update />
                                        Just Updated
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        <div className="col xs12 s12 m6 l3">
                            <Card>
                                <CardHeader color="danger" stats icon>
                                    <CardIcon color="danger">
                                        <Icon>people</Icon>
                                    </CardIcon>
                                    <br />
                                    <p>Candidates</p>
                                    <h3>{this.state.candidatesLength}</h3>
                                </CardHeader>
                                <CardFooter stats>
                                    <div >
                                        <Update />
                                        Just Updated
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>

                </div>

            </BrowserRouter>
        )
    }
}

CandDashboard.propTypes = {
    visualization: PropTypes.object.isRequired,
    AssignmentAttemptionStatusDoughnutGraph: PropTypes.func.isRequired,
    AssignmentHistoryRadarGraph: PropTypes.func.isRequired,
    SessionsBubbleGraph: PropTypes.func.isRequired,
    PerformanceLineGraph: PropTypes.func.isRequired,
    MitrePerformanceVisitLineGraph: PropTypes.func.isRequired,
    getmachineslength: PropTypes.func.isRequired,
    getattackslength: PropTypes.func.isRequired,
    getorganizationslength: PropTypes.func.isRequired,
    getmanagerslength: PropTypes.func.isRequired,
    getuserslength: PropTypes.func.isRequired,
    getlivesesssionslength: PropTypes.func.isRequired,
    auth_id: PropTypes.string.isRequired,
    onlineUsers: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    visualization: state.visualization,
    page: state.page,
    authId:state.auth._id,
    onlineUsers: state.chat.usersObj
})

export default connect(mapStateToProps, {
    AssignmentAttemptionStatusDoughnutGraph, AssignmentHistoryRadarGraph,
    SessionsBubbleGraph, PerformanceLineGraph, MitrePerformanceVisitLineGraph,
    getlivesesssionslength, getmachineslength, getattackslength, getorganizationslength, 
    getmanagerslength, getuserslength
})(CandDashboard)


