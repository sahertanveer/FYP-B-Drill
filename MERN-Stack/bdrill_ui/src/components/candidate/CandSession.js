import React, { Component } from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { logout } from '../../actions/candidateAuthAction'
import { logout } from '../../actions/authAction'
import { setPage } from '../../actions/pageAction'
import { BackendInstance } from '../../config/axiosInstance';
import Loader from 'react-loader-spinner'
import { setAlert } from '../../actions/alertAction'
import { sendNotification, getUserEmail } from '../../actions/notificationAction'
import Alert from '../../layout/Alert'

import moment from "moment";
//paths

class CandSession extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignments: null,
            loading: true,
            procedure_id: false,
            assignment_id: false,
            platform: null,
            category: null,
            end_time: null,
            machine_name: null,
            tactic_name: null
        }

        try {
            BackendInstance({
                method: 'post',
                url: '/api/attacksessions/checkattacksession',//'http://115.186.176.139:5000/api/attacksessions/startattacksession',
                data: {
                    user_id: this.props.auth._id
                }
            })
                .then(response => {
                    if (response.data.attackSessions.length === 0) {
                        this.setState({ loading: false })
                        this.props.setAlert('You dont have any running sessions!', "success");
                    }
                    else {
                        this.props.setAlert('You have a session already running, Taking you there in a moment!', "warning");
                        // (async () =>  await new Promise(r => setTimeout(r, 2000)))();
                        setTimeout(function () {
                            this.props.history.push(`/sessionroom`)
                            this.props.setPage('sessionroom')
                        }.bind(this), 3000)

                    }

                })
                .catch(err => this.props.setAlert(err + ' Error ocurred while checking in_progress sessions!', "danger"));

        }
        catch (err) { this.props.setAlert(err + ' session cannot be initiated!', "danger") };


        BackendInstance({
            method: 'post',
            url: '/api/users/getassignments',//'http://115.186.176.139:5000/api/attacksessions/startattacksession',
            data: {
                candidate_id: this.props.auth._id//'5db080230b62e76104bdd4bd'
            }
        })
            .then(response => {
                this.setState({ assignments: response.data.assignments })

            })
            .catch(err => this.props.setAlert(err + ' Error', "danger"));
    }

    CheckAssignmentStatus = (e) => {


        this.setState({ loading: true, assignment_id: e.target.value })

        BackendInstance({
            method: 'post',
            url: '/api/users/checkassignmentstatus',//'http://115.186.176.139:5000/api/attacksessions/startattacksession',
            data: {
                _id: e.target.value//'5db080230b62e76104bdd4bd'
            }
        })
            .then(response => {
                if (response.data.assignment_validation) {
                    this.setState({
                        assignment_id: response.data.assignment._id,
                        platform: response.data.assignment.platform,
                        category: response.data.assignment.category,
                        end_time: response.data.assignment.end_time,
                        machine_name: response.data.assignment.schedule.machine_name,
                        tactic_name: response.data.assignment.tactic_name,
                        procedure_id : response.data.assignment.procedure_id
                    })
                    this.props.setAlert('Session Validated sucessfully', "success");
                    this.StartSession()
                }
            })
            .catch(err => {
                this.setState({ loading: false })
                this.props.setAlert(err + ' session cannot be initiated', "danger")
            });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async StartSession() {
        try {
            const response = await BackendInstance({
                method: 'post',
                url: '/api/attacksessions/startattacksession',//'http://115.186.176.139:5000/api/attacksessions/startattacksession',
                data: {
                    user_id: this.props.auth._id,//'5db080230b62e76104bdd4bd'
                    assignment_id: this.state.assignment_id
                }
            })

            if (response.data.result === "success") {

                //Initiating Attack request
                this.attack_session_id = response.data.attack_session_id;
                BackendInstance(
                    {
                        method: 'post',
                        url: '/api/attacksessions/attackrequest',
                        data: {
                            attack_session_id: response.data.attack_session_id,
                            user_id: this.props.auth._id,
                            assignment_id: this.state.assignment_id,
                            platform: this.state.platform,
                            category: this.state.category,
                            end_time: this.state.end_time,
                            machine_name: this.state.machine_name,
                            tactic_name: this.state.tactic_name,
                            procedure_id: this.state.procedure_id,
                            token: this.props.auth.token
                        }
                    }
                ).then(async (r) => {
                    // alert(response.data)
                    this.props.setAlert('Starting Session, just a moment', "success");
                    this.notifyManager(this.props.auth.manager_id);
                    await new Promise(r => setTimeout(r, 2000));
                    this.props.history.push(`/sessionroom`)
                    this.props.setPage('sessionroom')
                })
                    .catch(async (err) => {
                        this.props.setAlert(err + '. Session cannot be initiated', "danger")
                         await BackendInstance({
                            method: 'post',
                            url: '/api/attacksessions/deletesession',//'http://115.186.176.139:5000/api/attacksessions/startattacksession',
                            data: {//'5db080230b62e76104bdd4bd'
                                attack_session_id: response.data.attack_session_id
                            }
                        })
                        this.props.setAlert('session deleted successfully', "success")
                        this.setState({ loading: false })
                        // .then(()=> this.props.setAlert('session deleted successfully', "succes") ).catch(err => {
                        //     this.props.setAlert(err + ' session could not be deleted', "danger") });


                    });




            }
        }
        catch (err) { this.props.setAlert(err + ' session cannot be initiated', "danger") };


    }

    notifyManager = async (user_id) => {
        
        let result = await this.props.getUserEmail(user_id, "manager")
        if(result.msg==="success"){
            let notificationFields = {}
          notificationFields.sender = this.props.auth.email;
                  notificationFields.url = "allotedassignments";
                  notificationFields.reciever_role = "manager";
                  notificationFields.message = `${this.props.auth.email} has started his assignment session.`;
                  notificationFields.reciever_email = result.email;
                  notificationFields.notification_type = "Assignment";
          this.props.sendNotification(notificationFields)
        }
        
      }


    render() {

        return (
            <BrowserRouter>
                <div className="container-fluid uicards" >
                    <div className="card animate fadeLeft ">
                        <div className="card-content grey darken-4 white-text">
                            <div className="row">
                                <div className="col s12 m12 l12">
                                    <h3 className="card-stats-number white-text" style={{ fontFamily: "Princess Sofia" }}> Assignments</h3>
                                    <hr />
                                </div>
                            </div>


                            <Alert />
                            {this.state.loading ? (
                                <div className="white-text center">
                                    <Loader color="#00BFFF" height={100} width={100} timeout={0} /> <br></br>
                                    Checking Assignment status
                                </div>) :
                                <div className="card card-body uicards">

                                    <table className="white-text center ">
                                        <thead className="badge-light">
                                            <tr>
                                            <th>Attack_ID</th>
                                            <th>Platform Name</th>
                                            <th>Category</th>
                                            <th>Subject</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Status</th>
                                            </tr>
                                        </thead>
                                        {console.log(this.state.assignments)}
                                        {this.state.assignments ? this.state.assignments.map((field, idx) => {
                                            if (field.pending)
                                            return (
                                                <tbody key={`${field.procedure_id}-${idx}`} className="white-text center">
                                                    <tr>
                                                        <td>{field.procedure_id}</td>
                                                        <td>{field.platform}</td>
                                                        <td>{field.category}</td>
                                                        <td>{field.schedule.Subject}</td>
                                                        <td>{moment(new Date(field.schedule.StartTime)).format('D MMM YYYY , h:mm:ss:A')}</td>
                                                        <td>{moment(new Date(field.schedule.EndTime)).format('D MMM YYYY , h:mm:ss:A')}</td>
                                                        <td><button onClick={e => this.CheckAssignmentStatus(e)} value={field._id} disabled={moment().isAfter(moment(new Date(field.schedule.StartTime))) && moment().isBefore(moment(new Date(field.schedule.EndTime))) ? false : true} className="btn btn-danger">Start Session</button></td>
                                                    </tr>
                                                </tbody>)
                                                else
                                                return null
                                        
                                        }) : null}
                                    </table>
                                                { this.state.assignments && !this.state.assignments.length>0 ? 
                                                <div className="center">No Pending Assignments.</div> : null
                                                }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}
CandSession.propTypes = {
    logout: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    sendNotification: PropTypes.func.isRequired,
    getUserEmail: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    page: state.page
})

//export default withRouter(CandSession);
export default withRouter(connect(mapStateToProps, { logout, setPage, setAlert, sendNotification, getUserEmail })(CandSession))


