import React, { Component, memo, useState } from 'react'
import { useSpring, a } from 'react-spring'
import { BrowserRouter, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getorganizations, getmanagers, getusers } from '../../actions/adminAuthAction'
import { deleteOrganization, deleteManager, deleteCandidate } from '../../actions/deleteUserAction'
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

class GetAllUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organization_id: false,
      manager_id: false
    }
    this.props.getorganizations();
    this.getOrganizationUsers = this.getOrganizationUsers.bind(this)
    this.getManagerUsers = this.getManagerUsers.bind(this)
    this.getProfile = this.getProfile.bind(this)

  }

  getOrganizationUsers(e) {
    this.setState({ organization_id: e.target.value })
    this.props.getmanagers(e.target.value)
  }

  getManagerUsers(e) {
    this.setState({ manager_id: e.target.value })
    this.props.getusers(e.target.value)
  }

  deleteOrg(e) {
    e.preventDefault();
    this.props.deleteOrganization(e.currentTarget.value);
    this.props.getorganizations();
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
    this.props.setPage(`${this.props.authRole}childuserprofile`) ;
    this.props.history.push(`/${this.props.authRole}childuserprofile?userId=${e.currentTarget.value}&role=${role}`);
     
}


  renderCandidates() {
    if (this.props.user.usersFound)
      return this.props.user.users.map((user, index) => {
        const { _id, firstname, lastname, email, avatar } = user //destructuring
        return (
          <div className="row " key={_id}>
            <div className="col s12 m1 l1 offet-s1 offst-m1 offset-l1 ">
              <img src={avatar ? `${BackendInstance.defaults.baseURL}${avatar}` : defaultAvatar}
                alt=''
                className='round-img center' style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'block' }}
              />
            </div>
            <div className="col s12 m3 l3 center">
              <p>{firstname}{lastname}</p>
            </div>
            <div className="col s12 m4 l4 center">
              <p>{email}</p>
            </div>
            <div className="col s12 m2 l2 ">
              <button className="btn btn-info" value={_id} onClick={(e) => {  this.getProfile(e, "candidate") }}>
                Profile
              </button>
            </div>
            <div className="col s12 m1 l1 ">
              <button className="btn btn-danger" value={_id} onClick={(e) => { this.deleteCand(e)}}>
                <i className=" tiny material-icons  "> delete</i>
              </button>
            </div>
          </div>

        )
      })
  }

  renderManagers() {
    // return this.state.candidates.map((candidate, index) => {
    if (this.props.user.managersFound)
      return this.props.user.managers.map((manager, index) => {
        const { _id, firstname, lastname, email, avatar } = manager //destructuring
        return (
          <div className="row " key={_id}>
            <div className="col s12 m1 l1 ">
              <button className="btn btn-info" value={_id} onClick={e => this.getManagerUsers(e)}>+
              </button>
            </div>
            <div className="col s12 m2 l2 center">
              <img src={avatar ? `${BackendInstance.defaults.baseURL}${avatar}` : defaultAvatar}
                alt=''
                className='round-img center' style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'block' }}
              />
            </div>
            <div className="col s12 m3 l3 ">
              <p>{firstname} {lastname}</p>
            </div>
            <div className="col s12 m3 l3 ">
              <p>{email}</p>
            </div>
            <div className="col s12 m2 l2 ">
              <button className="btn btn-info" value={_id} onClick={(e) => { this.getProfile(e, "manager")}}>
                Profile
              </button>
            </div>
            <div className="col s12 m1 l1 ">
              <button className="btn btn-danger" value={_id} onClick={(e) => { this.deleteMan(e)}}>
                <i className=" tiny material-icons"> delete</i>
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


  renderTableData() {
    // return this.state.candidates.map((candidate, index) => {
    if (this.props.user.organizationFound)
      return this.props.user.org.map((organization, index) => {
        const { _id, username, organizationname, email, avatar } = organization //destructuring
        return (
          <div className="row " key={_id}>
            <div className="col s12 m1 l1 center">
              <button className="btn btn-info" value={_id} onClick={e => this.getOrganizationUsers(e)}>+</button>
            </div>
            <div className="col s12 m1 l1 center">
              <img src={avatar ? `${BackendInstance.defaults.baseURL}${avatar}` : defaultAvatar}
                alt=''
                className='round-img center' style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'block' }}
              />
            </div>
            <div className="col s12 m3 l3 center">
              <p>{organizationname}</p>
            </div>
            <div className="col s12 m2 l2 center">
              <p>{username}</p>
            </div>
            <div className="col s12 m3 l3 center">
              <p>{email}</p>
            </div>
            <div className="col s12 m2 l2 center">
              <button className="btn btn-danger" value={_id} onClick={(e) => { this.deleteOrg(e) }}>
                <i className=" tiny material-icons  "> delete</i>
              </button>
            </div>
            <div className="col s12 m12 l12">
              {this.state.organization_id === _id ?
                <Tree name="managers" defaultOpen >
                  <div className="row center badge-light   ">
                    <div className="col s12 m1 l1 offset-m1 offset-l1  ">
                      <h6>Avatar</h6>
                    </div>
                    <div className="col s12 m3 l3 center">
                      <h6>Name</h6>
                    </div>
                    <div className="col s12 m4 l4 center">
                      <h6>Email</h6>
                    </div>
                    <div className="col s12 m2 l2 center">
                      <h6>Profile</h6>
                    </div>
                    <div className="col s12 m1 l1 ">
                      <h6>Delete</h6>
                    </div>
                  </div>
                  {this.renderManagers()}
                </Tree>
                : null}
            </div>
          </div>
        )
      })
  }
  render() {

    return (
      <BrowserRouter>
        <div className="container-fluid">
          <div className="row">
            <div className="col s12 m12 l12">
              <div className="card animate fadeLeft uicards">
                <div className="card-content">
                  <h5 className="card-stats-number" style={{ fontFamily: "Princess Sofia" }}> Users</h5>
                  <hr />
                  <br />

                  <div className="row center badge-light ">
                    <div className="col s12 m1 l1 offset-m1 offset-l1  ">
                      <h6>Avatar</h6>
                    </div>
                    <div className="col s12 m3 l3 center">
                      <h6>Organization</h6>
                    </div>
                    <div className="col s12 m2 l2 center">
                      <h6>User Name</h6>
                    </div>
                    <div className="col s12 m3 l3 center">
                      <h6>Email</h6>
                    </div>
                    <div className="col s12 m2 l2 center">
                      <h6>Delete</h6>
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

GetAllUsers.propTypes = {
  // deleteAccount: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  getProfileById: PropTypes.func.isRequired,
  getorganizations: PropTypes.func.isRequired,
  getmanagers: PropTypes.func.isRequired,
  getusers: PropTypes.func.isRequired,
  authRole: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user,
  authRole: state.auth.role,
  page: state.page
})

export default withRouter(connect(mapStateToProps, { getProfileById, setPage, getorganizations, getmanagers, getusers, deleteOrganization, deleteManager, deleteCandidate })(GetAllUsers));
