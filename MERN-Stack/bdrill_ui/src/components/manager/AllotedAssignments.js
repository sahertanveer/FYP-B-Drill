import React, { Component } from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackendInstance } from '../../config/axiosInstance';
import { deleteAssignment } from '../../actions/managerAuthAction'
import moment from "moment";
//paths

class AllotedAssignments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignments: null
        }

        this.deleteassignment = this.deleteassignment.bind(this);
        this.getAssignments = this.getAssignments.bind(this);
        this.getAssignments()
       
    }

    getAssignments = () => {
        console.log("qwer")
         BackendInstance({
            method: 'post',
            url: '/api/managers/getassignments',//'http://115.186.176.139:5000/api/attacksessions/startattacksession',
            data: {
                manager_id: this.props.auth._id//'5db080230b62e76104bdd4bd'
            }
        })
            .then(response => {
                this.setState({ assignments: response.data.assignments })

            })
            .catch(err => alert(err + 'session cannot be initiated'));
    }

    deleteassignment= async (e) => {
        e.preventDefault();
        await this.props.deleteAssignment(e.currentTarget.value);
        this.getAssignments();
    }

    render() {

        return (
            <BrowserRouter>
                <div className="container-fluid" >
                    <div className="card animate fadeLeft uicards">
                        <div className="card-content ">
                            <h5 className="card-stats-number white-text" style={{ fontFamily: "Princess Sofia" }}>Session Assignments</h5>
                            <hr />
                            <br />
                        <table >
                            <tr className="center badge-light white-text">
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
                                    <tr className="white-text center">
                                        <td>{field.procedure_id}</td>
                                        <td>{field.platform}</td>
                                        <td>{field.category}</td>
                                        <td>{field.schedule.Subject}</td>
                                        <td>{moment(new Date(field.schedule.StartTime)).format('D MMM YYYY , h:mm:ss:A')}</td>
                                        <td>{moment(new Date(field.schedule.EndTime)).format('D MMM YYYY , h:mm:ss:A')}</td>
                                        <td><button className="btn btn-danger" value={field._id} onClick={(e) => { this.deleteassignment(e) }}> <i className="material-icons">delete</i></button></td>
                                    </tr>)
                            }) : null}
                        </table>
                    </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}
AllotedAssignments.propTypes = {
    deleteAssignment: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

//export default withRouter(CandSession);
export default withRouter(connect(mapStateToProps, { deleteAssignment })(AllotedAssignments))


