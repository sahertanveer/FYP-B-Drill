import React, { Component } from 'react'
import { BrowserRouter, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import moment from "moment";
import Dialog from '@material-ui/core/Dialog';

import { getallsessions, getsessionsdetail } from '../../actions/candidateAuthAction'
import RadarChart from '../chart/RadarChart'
import LineChart from '../chart/LineChart'
import BubbleChart from '../chart/BubbleChart'
import DoughnutChart from '../chart/DoughnutChart'
import VisitLineChart from '../chart/VisitLineChart'

import {
    AssignmentAttemptionStatusDoughnutGraph, SessionsBubbleGraph,
    AssignmentHistoryRadarGraph, PerformanceLineGraph, MitrePerformanceVisitLineGraph,
    ManagerAssignmentAttemptionStatusDoughnutGraph, ManagerAssignmentHistoryRadarGraph
} from '../../actions/visualizationAction'

const styles = {
    modal: {
        position: 'absolute',
        overflow: 'hidden',
        top: '10%',
        left: '10%',
        display: 'block'
    },
    paper: {
        backgroundColor: 'black',
        border: '2px solid #fff',
        minHeight: '80vh',
        maxHeight: '80vh',
        // boxShadow: theme.shadows[5],
        // padding: theme.spacing(2, 4, 3),
    },
    content: {
        padding: 12,
        minHeight: '80vh',
        maxHeight: '80vh',
        overflow: 'scroll',
    }
};

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
        const values = queryString.parse(window.location.search)
        this.state = {
            bigChartData: "data1",
            userId: values.userId,
            role: values.role
        };

        this.renderSessionTableData = this.renderSessionTableData.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getSessionDetails = this.getSessionDetails.bind(this);
        this.renderSessionDetails = this.renderSessionDetails.bind(this)

        if( values.role === "candidate"){
        this.props.getallsessions(values.userId);
        this.props.AssignmentHistoryRadarGraph(values.userId)
        this.props.AssignmentAttemptionStatusDoughnutGraph(values.userId)
        this.props.SessionsBubbleGraph(values.userId)
        this.props.PerformanceLineGraph(values.userId)
        this.props.MitrePerformanceVisitLineGraph(values.userId)
    }
    else if(values.role === "manager"){
        this.props.ManagerAssignmentAttemptionStatusDoughnutGraph(values.userId);
        this.props.ManagerAssignmentHistoryRadarGraph(values.userId)
    }

    }

    handleOpen = () => {
        this.setState({ open: true })
    };

    handleClose = () => {
        this.setState({ open: false })
    };


    setBgChartData = name => {
        this.setState({
            bigChartData: name
        });
    };

    getSessionDetails(e) {
        this.setState({ open: true, attack_session_id: e.currentTarget.value })
        this.props.getsessionsdetail(e.currentTarget.value)
    }

    renderSessionDetails() {
        if (this.props.attack.evaluationDetailsFound) {
            // return this.props.attack.evaluationDetails.map((evalu, index) => {
            const { session, evaluation } = this.props.attack.evaluationDetails
            let tactics = Object.keys(evaluation);
            return (
                <table className={styles.content} key={session._id}>
                    <div className="center">
                        <tbody>
                        <tr>
                            <th className="modaltext">Id:</th>
                            <td> {session._id}</td>
                        </tr>

                        <tr>
                            <th className="modaltext">Category:</th>
                            <td> {session.assignment && session.assignment.category}</td>
                        </tr>

                        <tr>
                            <th className="modaltext">Platform:</th>
                            <td> {session.assignment && session.assignment.platform}</td>
                        </tr>

                        <tr>
                            <th className="modaltext">Time Efficiency:</th>
                            <td> {`${session.saved_time_percent} %`}</td>
                        </tr>

                        <tr>
                            <th className="modaltext">Status:</th>
                            <td> {session.incomplete_attack_error ? 
                            "Attack was not properly executed by our system due to some error" : 
                            "Successful Attack Execution by system."}</td>
                        </tr>
                        
                        <tr>
                            <th className="modaltext">Alloted Start Time:</th>
                            <td> {session.assignment && session.assignment.schedule && session.assignment.schedule.StartTime ?
                                moment(new Date(session.assignment.schedule.StartTime)).format('D MMM YYYY , h:mm:ss:A') : "Not available"   
                        }</td>
                        </tr>

                        <tr>
                            <th className="modaltext">Alloted End Time:</th>
                            <td> {session.assignment && session.assignment.schedule && session.assignment.schedule.EndTime ?
                                moment(new Date(session.assignment.schedule.EndTime)).format('D MMM YYYY , h:mm:ss:A') : "Not available"   
                        }</td>
                        </tr>

                        <tr>
                            <th className="modaltext">Session started at:</th>
                            <td>{moment(new Date(session.start_time)).format('D MMM YYYY , h:mm:ss:A')}</td>
                        </tr>

                        <tr>
                            <th className="modaltext">Session ended at:</th>
                            <td>{moment(new Date(session.end_time)).format('D MMM YYYY , h:mm:ss:A')}</td>
                        </tr>
                        </tbody>
                    </div>
                    <br />
                    {tactics.map((tact, i) => {
                        return (
                            <div className="center" key={`${tact}-${i}`}>
                                <tr>{tact}
                                    <table key={tactics} className="center">
                                    <tbody>
                                        <tr className="modaltext">
                                            <th>Total Score</th>
                                            <th>Obtained Score</th>
                                            <th>Number of tries</th>
                                            <th>Aggregated Sore</th>
                                        </tr>
                                        <tr>
                                            <td> {evaluation[tact].total_score}</td>
                                            <td> {evaluation[tact].obtained_score}</td>
                                            <td> {evaluation[tact].try_count}</td>
                                            <td> {evaluation[tact].score_aggregate}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </tr>
                            </div>
                        )
                    })}
                </table>
            )
            // })
        }
    };

    renderSessionTableData() {
        if (this.props.attack.sessionsFound) {
            return this.props.attack.sessions.map((session, index) => {
                const { _id, start_time, end_time, assignment, result, incomplete_attack_error } = session //destructuring
                return (
                    <tr key={_id}>
                        <td>{_id}</td>
                        <td>{moment(new Date(start_time)).format('D MMM YYYY , h:mm:ss:A')}</td>
                        <td>{moment(new Date(end_time)).format('D MMM YYYY , h:mm:ss:A')}</td>
                        <td>{assignment && assignment.category}</td>
                        <td>{incomplete_attack_error? "Faulty Session" :`${result.toFixed(2)} %`}</td>
                        <td>
                            <div>
                                <button type="button" className="btn success" value={_id} onClick={(e) => this.getSessionDetails(e)}>
                                    <i className="fas fa-eye" />
                                </button>
                                <center>
                                    {this.state.open ?
                                        <Dialog
                                            open={this.state.open}
                                            // className={styles.modal}
                                            onClose={this.handleClose}
                                            style={{ margin: '4%', maxHeight: '80vh', minHeight: '80vh', width: '100%' }}
                                        >
                                            <div className={styles.paper}>
                                                <div className="card animate fadeLeft">
                                                    <div className="card-content" style={{ color: "black" }}>
                                                        <h5 id="simple-modal-title" style={{ fontFamily: "Princess Sofia" }}>Session Details</h5>
                                                        <hr />
                                                        <br />
                                                        <div id="simple-modal-description">
                                                            {this.renderSessionDetails()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Dialog>
                                        : ""
                                    }
                                </center>
                            </div>
                        </td>
                    </tr>
                )
            })
        }
    }

    render() {

        return (
            <BrowserRouter>
                <div className="container-fluid">

                {this.state.role === "candidate" ?
                    <>    
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
                                                {this.renderSessionTableData()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                    : this.state.role === "manager" ?
                    <>
                    <div className="row">
                        <div className="col s12 m6 l6">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content">
                                    <h5 className="card-stats-number"> Assignments </h5>
                                    <hr />
                                    <br />
                                    <RadarChart labelA="Assigned Scenarios" labelB="Assigned Campaigns"
                                        dataSetA={this.props.visualization.managerAssignmentHistoryFound ?
                                            this.props.visualization.managerAssignmentHistoryData.scenarioArray : null}
                                        dataSetB={this.props.visualization.managerAssignmentHistoryFound ?
                                            this.props.visualization.managerAssignmentHistoryData.campaignArray : null} />
                                    <br />
                                </div>
                            </div>
                        </div>

                        <div className="col s12 m6 l6">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content">
                                    <h5 className="card-stats-number"> Candidates Assignments Status  </h5>
                                    <hr />
                                    <br />
                                    <DoughnutChart labels={['Attempted & Passed', 'Attempted & Failed', 'Not Attempted']}
                                        dataSet={this.props.visualization.managerAssignmentAttemptedFound ?
                                            [this.props.visualization.managerAssignmentAttemptedData.passedAssignments,
                                            this.props.visualization.managerAssignmentAttemptedData.failedAssignments,
                                            this.props.visualization.managerAssignmentAttemptedData.unAttempted] : null}
                                    />
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                    : null

                                        }
                </div>

            </BrowserRouter>
        )
    }
}

SessionProfile.propTypes = {
    visualization: PropTypes.object.isRequired,
    attack: PropTypes.object.isRequired,
    AssignmentAttemptionStatusDoughnutGraph: PropTypes.func.isRequired,
    AssignmentHistoryRadarGraph: PropTypes.func.isRequired,
    SessionsBubbleGraph: PropTypes.func.isRequired,
    PerformanceLineGraph: PropTypes.func.isRequired,
    MitrePerformanceVisitLineGraph: PropTypes.func.isRequired,
    ManagerAssignmentAttemptionStatusDoughnutGraph: PropTypes.func.isRequired,
    ManagerAssignmentHistoryRadarGraph: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    visualization: state.visualization,
    page: state.page,
    attack: state.attack
})

export default withRouter(connect(mapStateToProps, {
    getallsessions, getsessionsdetail,
    AssignmentAttemptionStatusDoughnutGraph, AssignmentHistoryRadarGraph,
    SessionsBubbleGraph, PerformanceLineGraph, MitrePerformanceVisitLineGraph,
    ManagerAssignmentHistoryRadarGraph, ManagerAssignmentAttemptionStatusDoughnutGraph,
})(SessionProfile))


