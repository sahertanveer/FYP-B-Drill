import React, { Component } from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getusers, checkuser} from '../../actions/managerAuthAction'
import { deleteCandidate } from '../../actions/deleteUserAction'
import { logout } from '../../actions/authAction'
import { setPage } from '../../actions/pageAction'
import { defaultAvatar } from '../../config/default';
import { BackendInstance } from '../../config/axiosInstance'
import { getProfileById } from '../../actions/profileAction'
import { sendNotification, getUserEmail } from '../../actions/notificationAction'

class CandidateList extends Component {
    constructor(props) {
        super(props);
        this.props.getusers(this.props.auth._id);
        this.notifyCandidate = this.notifyOrganization.bind(this);
        this.deleteCand = this.deleteCand.bind(this);
    }

    notifyOrganization = async (user_id) => {
        
        let result = await this.props.getUserEmail(user_id, "organization")
        if(result.msg==="success"){
            let notificationFields = {}
          notificationFields.sender = this.props.auth.email;
                  notificationFields.url = "userslist";
                  notificationFields.reciever_role = "organization";
                  notificationFields.message = "A candidate is removed from your organization.";
                  notificationFields.reciever_email = result.email;
                  notificationFields.notification_type = "Candidate";
          this.props.sendNotification(notificationFields)
        }
        
      }

    deleteCand = async (e) => {
        e.preventDefault();
        let result =  await this.props.deleteCandidate(e.currentTarget.value);
        this.props.getusers(this.props.auth._id);
        if(result.msg==="success"){
            this.notifyOrganization(this.props.auth.organization_id);
        }
    }

    setUserId(id, email) {
        // let cand_id = e.target.value
        this.props.history.push(`/assignattack?candId=${id}&candEmail=${email}`)
        this.props.setPage('assignattack')
    }

    getProfile(e, role) {
        this.props.getProfileById(e.currentTarget.value)
        this.props.setPage(`${this.props.auth.role}childuserprofile`) ;
        this.props.history.push(`/${this.props.auth.role}childuserprofile?userId=${e.currentTarget.value}&role=${role}`);
         
    }


    renderTableData() {
        // return this.state.candidates.map((candidate, index) => {
        if (this.props.user.usersFound)
            return this.props.user.users.map((candidate, index) => {
                const { _id, firstname, lastname, email, avatar } = candidate //destructuring
                return (
                    <tr key={_id}>
                        <td><img src={avatar?`${BackendInstance.defaults.baseURL}${avatar}`:defaultAvatar}
                                   alt=''
                                    className='round-img center' style={{ borderRadius: '50%', width: '40px', height:'40px', display:'block' }}
                                /></td>
                        <td>{firstname} {lastname}</td>
                        <td>{email}</td>
                        <td><button className="white-text btn btn-info"  onClick={(e) => { this.setUserId(_id, email) }}>Assign</button></td>
                        <td>
                            <button className="btn btn-info" value={_id} onClick={(e) => { this.getProfile(e, "candidate") }}>
                                Profile
                            </button>
                        </td>
                        <td>
                            <button className="btn btn-danger" value={_id}  onClick={(e) => {this.deleteCand(e)}}>
                                <i className=" tiny material-icons white-text"> delete</i>
                            </button>
                        </td>
                    </tr>
                )
            })
    }
    
    render() {
        return (
            <BrowserRouter>
                    <div className="container-fluid">

                        <div className="row">
                            <div className="col s12 m12 l12">
                                <div className="card animate fadeLeft">
                                    <div className="card-content uicards">
                                        <h5 className="card-stats-number white-text" style={{ fontFamily: "Princess Sofia" }}> Candidates</h5>
                                        <hr />
                                        <br />

                                        <table border="1" className="center">
                                            <thead className="center badge-light white-text">
                                                <tr>
                                                    <th>Avatar</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Assign Attack</th>
                                                    <th>Profile</th>
                                                    <th>Delete User</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderTableData()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </BrowserRouter>
        )
    }
}

CandidateList.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    checkuser: PropTypes.func.isRequired,
    getusers: PropTypes.func.isRequired,
    sendNotification: PropTypes.func.isRequired,
    getUserEmail: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user,
    auth: state.auth,
    page: state.page
})

export default withRouter((connect(mapStateToProps, { getProfileById, logout, deleteCandidate, setPage, getusers, checkuser, sendNotification, getUserEmail })(CandidateList)));