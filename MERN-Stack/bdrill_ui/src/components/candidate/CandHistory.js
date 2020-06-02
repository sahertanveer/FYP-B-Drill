import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alertAction'
import { getallsessions, getsessionsdetail } from '../../actions/candidateAuthAction'
import Alert from '../../layout/Alert'
import moment from "moment";
import LineChart from '../chart/LineChart'
import {PerformanceLineGraph} from '../../actions/visualizationAction'
    

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
        overflow: 'scroll'
    }
};

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

class CandHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attack_session_id: false,
            open: false,
        }
        this.props.PerformanceLineGraph();

        this.props.getallsessions(this.props.auth._id);
        console.log(this.props.auth._id)
        this.renderSessionTableData = this.renderSessionTableData.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getSessionDetails = this.getSessionDetails.bind(this);
        this.renderSessionDetails = this.renderSessionDetails.bind(this)
    }

    handleOpen = () => {
        this.setState({ open: true })
    };

    handleClose = () => {
        this.setState({ open: false })
    };

    getSessionDetails(e) {
        console.log(e.currentTarget.value)
        this.setState({ open: true, attack_session_id: e.currentTarget.value }, () => console.log(this.state))
        this.props.getsessionsdetail(e.currentTarget.value)
    }

    renderSessionDetails() {
        console.log("savds")
        if (this.props.attack.evaluationDetailsFound) {
            // return this.props.attack.evaluationDetails.map((evalu, index) => {
            console.log(this.props.attack.evaluationDetails)
            const { session, evaluation } = this.props.attack.evaluationDetails
            let tactics = Object.keys(evaluation);
            console.log(session)
            return (
                <table className={styles.content} key={session._id}>
                    <center>
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
                    </center>
                    <br />
                    {tactics.map((tact) => {
                        return (
                            <center>
                                <tr> {tact}
                                    <table key={tactics} className="center">
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
                                    </table>
                                </tr>
                            </center>
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
                                            className={styles.modal}
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
        const { classes } = this.props;
        return (
            <BrowserRouter>
                <div className="container-fluid">

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
                    <Alert />
                    <div className="row" >
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
                                            <thead>
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
                </div>
            </BrowserRouter>
        )
    }
}

CandHistory.propTypes = {
    attack: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
    PerformanceLineGraph: PropTypes.func.isRequired,
    visualization: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    attack: state.attack,
    auth: state.auth,
    visualization: state.visualization,
})

export default withStyles(styles)(connect(mapStateToProps, { setAlert, getallsessions, getsessionsdetail, PerformanceLineGraph })(CandHistory))


