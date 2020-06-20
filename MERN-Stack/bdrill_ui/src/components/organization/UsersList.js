import React, { Component, memo, useState } from 'react'
import { useSpring, a } from 'react-spring'
import { BrowserRouter, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getmanagers, getusers } from '../../actions/organizationAuthAction'
import { deleteManager, deleteCandidate } from '../../actions/deleteUserAction'
import { useMeasure, usePrevious } from '../common/helpers'
import { Frame, Title, Content, toggle } from '../common/styles'
import * as Icons from '../common/icons'
import { defaultAvatar } from '../../config/default';
import { BackendInstance } from '../../config/axiosInstance';
import { setPage } from '../../actions/pageAction'
import { getProfileById } from '../../actions/profileAction'



const Tree = memo(({ children, name, style, defaultOpen = false }) => {
    const [isOpen, setOpen] = useState(defaultOpen)
    const previous = usePrevious(isOpen)
    const [bind, { height: viewHeight }] = useMeasure()
    const { height, opacity, transform } = useSpring({
        from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { height: isOpen ? viewHeight : 0, opacity: isOpen ? 1 : 0, transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` }
    })
    const Icon = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`]
    return (
        <Frame>
            <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
            <Title style={style}>{name}</Title>
            <Content style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
                <a.div style={{ transform }} {...bind} children={children} />
            </Content>
        </Frame>
    )
})

class UsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manager_id: false,
            search: ""
        }
        this.props.getmanagers(this.props.auth._id);
        this.getManagerUsers = this.getManagerUsers.bind(this)
        this.getProfile = this.getProfile.bind(this)

    }
    getManagerUsers(e) {
        this.setState({ manager_id: e.target.value })
        this.props.getusers(e.target.value)
    }

    deleteMan(e) {
        e.preventDefault();
        this.props.deleteManager(e.currentTarget.value);
        this.props.getmanagers();
      }
    
      deleteCand(e) {
        e.preventDefault();
        this.props.deleteCandidate(e.currentTarget.value);
        this.props.getusers();
      }

      getProfile(e, role) {
        this.props.getProfileById(e.currentTarget.value)
        this.props.setPage(`${this.props.auth.role}childuserprofile`) ;
        this.props.history.push(`/${this.props.auth.role}childuserprofile?userId=${e.currentTarget.value}&role=${role}`);
         
    }

    renderCandidates() {
        if (this.props.user.usersFound)
            return this.props.user.users.map((user, index) => {
                const { _id, firstname, lastname, email, avatar } = user //destructuring
                return (
                    <div className="row center" key={_id}>
                        <div className="col s12 m1 l1 offst-m1 offset-l1 center">
                        <img src={avatar?`${BackendInstance.defaults.baseURL}${avatar}`:defaultAvatar}
                                   alt=''
                                    className='round-img center' style={{ borderRadius: '50%', width: '40px', height:'40px', display:'block' }}
                                />
                        </div>
                        <div className="col s12 m3 l3 center">
                            <p>{firstname} {lastname}</p>
                        </div>
                        <div className="col s12 m3 l3 center">
                            <p>{email}</p>
                        </div>
                        <div className="col s12 m2 l2 center">
                            <button className="btn btn-info" value={_id}  onClick={(e) => {this.getProfile(e, "candidate") }}>
                                Profile
                            </button>
                        </div>
                        <div className="col s12 m2 l2 center">
                            <button className="btn btn-danger" value={_id}  onClick={(e) => {this.deleteCand(e)}}>
                                <i className=" tiny material-icons white-text"> delete</i>
                            </button>
                        </div>
                    </div>

                )
            })
    }

    onChange = (e) => {
        this.setState({ search: e.target.value })
      }
      

    renderTableData() {
        // return this.state.candidates.map((candidate, index) => {
        if (this.props.user.managersFound){

    const { search } = this.state;
      var FilterAttacks = [];
      var searchFilter = search.toLowerCase()
      FilterAttacks =  this.props.user.managers.filter(manager => {
        return Object.keys(manager).some(key =>
            manager[key] ? manager[key].toLowerCase().includes(searchFilter) : null
        );
      })

            return FilterAttacks.map((manager, index) => {
                const { _id, firstname, lastname, email, avatar } = manager //destructuring
                return (
                    <div className="row " key={_id}>
                        <div className="col s12 m1 l1 center">
                            <button className="btn btn-info" value={_id} onClick={e => this.getManagerUsers(e)}>+
                            </button>
                        </div>
                        <div className="col s12 m1 l1 center">
                        <img src={avatar?`${BackendInstance.defaults.baseURL}${avatar}`:defaultAvatar}
                                   alt=''
                                    className='round-img center' style={{ borderRadius: '50%', width: '40px', height:'40px', display:'block' }}
                                />
                        </div>
                        <div className="col s12 m3 l3 center">
                            <p>{firstname} {lastname}</p>
                        </div>
                        <div className="col s12 m3 l3 center">
                            <p>{email}</p>
                        </div>
                        <div className="col s12 m2 l2 center">
                            <button className="btn btn-info" value={_id}  onClick={(e) => {this.getProfile(e, "manager")}}>
                                Profile
                            </button>
                        </div>
                        <div className="col s12 m2 l2 center">
                            <button className="btn btn-danger" value={_id}  onClick={(e) => {this.deleteMan(e)}}>
                                <i className=" tiny material-icons white-text"> delete</i>
                            </button>
                        </div>

                            {this.state.manager_id === _id ?
                                <div className="col s12 m12 l12 left">
                                    <Tree name="candidates" defaultOpen >
                                        {this.renderCandidates()}
                                    </Tree>
                                </div>
                            : null}
                    </div>
                )
            })
        }
    }
    render() {

        return (
            <BrowserRouter>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col s12 m12 l12">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content white-text">
                                <div className="row">
                    <div className="col s6 m6 l7">
                                    <h5 className="card-stats-number white-text" style={{ fontFamily: "Princess Sofia" }}> Users</h5>
                                    </div>
                    <div className="col s1 m1 l1 offset-l1 offset-m1 offset-s1">
                      <div className="search right" style={{ marginTop: '20%' }}>
                        <i className="fas fa-search"></i>
                      </div>
                    </div>
                    <div className="col s4 m4 l3">
                      <input
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        value={this.state.search}
                        onChange={(e) => this.onChange(e)}
                      />
                    </div>
                  </div>
                                    <hr />
                                    <br />

                                    <div className="row center badge-light white-text ">
                                        <div className="col s12 m1 l1 offset-m1 offset-l1 white-text">
                                            <h6>Avatar</h6>
                                        </div>
                                        <div className="col s12 m3 l3">
                                            <h6>Name</h6>
                                        </div>
                                        <div className="col s12 m3 l3">
                                            <h6>Email</h6>
                                        </div>
                                        <div className="col s12 m2 l2">
                                            <h6>Profile</h6>
                                        </div>
                                        <div className="col s12 m2 l2">
                                            <h6>Delete User</h6>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col s12 m12 l12">
                                            {this.renderTableData()}
                                        </div>
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

UsersList.propTypes = {
    setPage: PropTypes.func.isRequired,
    getProfileById: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    getmanagers: PropTypes.func.isRequired,
    getusers: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user,
    auth: state.auth,
    page: state.page
})

export default withRouter(connect(mapStateToProps, {getProfileById, setPage, deleteManager, deleteCandidate, getmanagers, getusers })(UsersList));
