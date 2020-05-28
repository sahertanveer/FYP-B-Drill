import React, { Component } from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { logout } from '../../actions/candidateAuthAction'
import { logout } from '../../actions/authAction'
import { setPage } from '../../actions/pageAction'
import { BackendInstance } from '../../config/axiosInstance';

import moment from "moment";
//paths

class PendingAssignments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignments: null
        }

        BackendInstance({
            method: 'post',
            url: '/api/admin/getassignments',//'http://115.186.176.139:5000/api/attacksessions/startattacksession',

        })
            .then(response => {
                this.setState({ assignments: response.data.assignments })

            })
            .catch(err => alert(err + 'session cannot be initiated'));
    }


    render() {

        return (
            <BrowserRouter>
                <main>
                    <div className="container-fluid" >
                        <div className="row">
                            <div className="col s12 m12 l12">
                            <div className="card animate fadeLeft uicards">
                <div className="card-content">
                                    <h3 className="card-stats-number white-text" style={{ fontFamily: "Princess Sofia" }}> Assignments</h3>
                                    <hr />
                                    <br/>
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
                                                    <td><button className="btn btn-danger" > <i class="material-icons">delete</i></button></td>
                                                </tr>)
                                        }) : null}
                                    </table>
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
    logout: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    page: state.page
})

//export default withRouter(CandSession);
export default withRouter(connect(mapStateToProps, { logout, setPage })(PendingAssignments))


