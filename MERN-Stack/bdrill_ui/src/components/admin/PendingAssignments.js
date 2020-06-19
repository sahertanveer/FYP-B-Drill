import React, { Component } from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackendInstance } from '../../config/axiosInstance';
import { deleteAssignment } from '../../actions/managerAuthAction';
import { setAlert } from '../../actions/alertAction'
import Alert from '../../layout/Alert'

import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda } from "@syncfusion/ej2-react-schedule";
import moment from "moment";

//paths

class PendingAssignments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignments: null,
            schedules: [],
            from: Date.now(),
            to: "all"
        }

        this.deleteassignment = this.deleteassignment.bind(this);
        this.getAssignments = this.getAssignments.bind(this);
        this.getSchedule = this.getSchedule.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getAssignments();
        this.getSchedule();
    }

    getAssignments = () => {
        BackendInstance({
            method: 'post',
            url: '/api/admin/getassignments',//'http://115.186.176.139:5000/api/attacksessions/startattacksession',

        })
            .then(response => {
                this.setState({ assignments: response.data.assignments })

            })
            .catch(err => {
                const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => {  this.props.setAlert(err.response.data.msg, 'danger') })
        }
               
            });
    }

    deleteassignment = async (e) => {
        e.preventDefault();
        await this.props.deleteAssignment(e.currentTarget.value);
        this.getAssignments();
    }

    getSchedule = async () => {
        const config = {
            headers: {
                'Content-Type': ' application/json '
            }
        }

        const body = JSON.stringify({ from: this.state.from, to: this.state.to });

        BackendInstance.post('api/admin/getschedule', body, config)
            .then(response => {
                this.setState({ schedules: response.data.schedules })

            })
            .catch(err => {
                this.props.setAlert(err, 'danger')
        //         const errors = err.response.data.errors;
        // if (errors) {
        //     errors.forEach(error => {  this.props.setAlert(err.response.data.msg, 'danger') })
        // }
               
            });
    }
    

    onChange = e =>
        this.setState({ [e.target.name]: e.target.value });
    
        onSubmit = e => {
            e.preventDefault();
            this.getSchedule();
            
        };

    render() {

        return (
            <BrowserRouter>
                <main>
                    <div className="container-fluid" >
                        <div className="row">

                            <div className="col s12 m12 l12 cardGroup center">
                                <div className="card uicards">
                                    <div className="card-content">



                                        <h3 className="card-stats-number white-text" style={{ fontFamily: "Princess Sofia" }}>Schedule</h3>
                                        <form className="form" onSubmit={(e)=>this.onSubmit(e)}>
                                            <div className="row">
                                                <div className="col s3 m4 l4">
                                                    <input
                                                        type="date"
                                                        className="form-control white-text "
                                                        name="from"
                                                        placeholder="From"
                                                        defaultValue={moment(new Date()).format('YYYY-MM-DD')}
                                                        onChange={e => this.onChange(e)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col s3 m4 l4">
                                                    <h5 className="card-stats-number white-text" style={{ fontFamily: "Princess Sofia" }}>To</h5>
                                                </div>
                                                <div className="col s3 m4 l4">
                                                    <input
                                                        type="date"
                                                        className="form-control white-text "
                                                        name="to"
                                                        placeholder="To"
                                                        defaultValue={this.state.schedules && this.state.schedules.length>0 ? moment(this.state.schedules[this.state.schedules.length - 1].StartTime).format('YYYY-MM-DD'): null}
                                                        // defaultValue={profile && profile.dob ? moment(new Date(dob)).format('YYYY-MM-DD') : ""}
                                                        onChange={e => this.onChange(e)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col s12 m12 l12">
                                                    <button className="right btn btn-primary my-2" >Submit </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <Alert />
                                {this.state.schedules && this.state.schedules.length>0 ?
                                <ScheduleComponent currentView='Month' eventSettings={{dataSource: this.state.schedules}} >
                                    {/* eventSettings={{  }} */}

                                    <Inject services={[Day, Week, WorkWeek, Month, Agenda]}></Inject>
                                </ScheduleComponent>
    : null }
                            </div>
                            <div className="col s12 m12 l12">
                                <div className="card animate fadeLeft uicards">
                                    <div className="card-content">
                                        <h3 className="card-stats-number white-text" style={{ fontFamily: "Princess Sofia" }}> Assignments</h3>
                                        <hr />
                                        <br />
                                        <table className="center">
                                            <tr className="badge-light center">
                                                <th>Attack_ID</th>
                                                <th>Platform Name</th>
                                                <th>Category</th>
                                                <th>Subject</th>
                                                <th>Start Time</th>
                                                <th>End Time</th>
                                                <th>Delete</th>
                                            </tr>

                                            {this.state.assignments ? this.state.assignments.map((field, idx) => {
                                                return (
                                                    <tr className="  center">
                                                        <td>{field.procedure_id}</td>
                                                        <td>{field.platform}</td>
                                                        <td>{field.category}</td>
                                                        <td>{field.schedule.Subject}</td>
                                                        <td>{moment(new Date(field.schedule.StartTime)).format('D MMM YYYY , h:mm:ss:A')}</td>
                                                        <td>{moment(new Date(field.schedule.EndTime)).format('D MMM YYYY , h:mm:ss:A')}</td>
                                                        <td><button className="btn btn-danger" value={field._id} onClick={(e) => { this.deleteassignment(e) }} > <i class="material-icons">delete</i></button></td>
                                                    </tr>)
                                            }) :  null}
                                        </table>
                                        { this.state.assignments && !this.state.assignments.length>0 ? 
                                                <div className="center">No Pending Assignments.</div> : null
                                                }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </BrowserRouter>
        )
    }
}
PendingAssignments.propTypes = {
    deleteAssignment: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    page: state.page
})

//export default withRouter(CandSession);
export default withRouter(connect(mapStateToProps, { deleteAssignment, setAlert })(PendingAssignments))


