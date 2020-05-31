import React, { Component, memo, useState, Fragment } from 'react'
import { useSpring, a } from 'react-spring'
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getorganizations, getmanagers, getusers } from '../../actions/adminAuthAction'
import { deleteOrganization, deleteManager, deleteCandidate } from '../../actions/deleteUserAction'
import { useMeasure, usePrevious } from '../common/helpers'
import { Frame, Title, Content, toggle } from '../common/styles'
import * as Icons from '../common/icons'
import { defaultAvatar } from '../../config/default';
import { BackendInstance } from '../../config/axiosInstance';


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
    this.props.getorganizations(this.props.auth._id);
    this.getOrganizationUsers = this.getOrganizationUsers.bind(this)
    this.getManagerUsers = this.getManagerUsers.bind(this)

  }

  getOrganizationUsers(e) {
    console.log(e.target.value)
    this.setState({ organization_id: e.target.value }, () => console.log(this.state))
    this.props.getmanagers(e.target.value)
  }

  getManagerUsers(e) {
    console.log(e.target.value)
    this.setState({ manager_id: e.target.value })
    this.props.getusers(e.target.value)
  }

  deleteOrg(e) {
    e.preventDefault();
    console.log(e.currentTarget.value)
    this.props.deleteOrganization(e.currentTarget.value);
    this.props.getorganizations();
  }

  deleteMan(e) {
    e.preventDefault();
    console.log(e.currentTarget.value)
    this.props.deleteManager(e.currentTarget.value);
    this.props.getmanagers();
  }

  deleteCand(e) {
    e.preventDefault();
    console.log(e.currentTarget.value)
    this.props.deleteCandidate(e.currentTarget.value);
    this.props.getusers();
  }


  renderCandidates() {
    if (this.props.user.usersFound)
      return this.props.user.users.map((user, index) => {
        const { _id, firstname, lastname, email, avatar } = user //destructuring
        return (
          <div className="row center" key={_id}>
            <div className="col s2 m2 l2 offet-s1 offst-m1 offset-l1 center">

                              
                                <img src={avatar?`${BackendInstance.defaults.baseURL}${avatar}`:defaultAvatar}
                                   alt=''
                                    className='round-img center' style={{ borderRadius: '50%', width: '40px', height:'40px', display:'block' }}
                                />

            </div>
            <div className="col s2 m2 l2">
              <p>{firstname}</p>
            </div>
            <div className="col s2 m2 l2">
              <p>{lastname}</p>
            </div>
            <div className="col s3 m3 l3">
              <p>{email}</p>
            </div>
            <div className="col s1 m1 l1">
              <button className="btn btn-danger" value={_id} onClick={(e) => { this.deleteCand(e) }}>
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
            <div className="col s1 m1 l1 ">
              <button className="btn btn-primary" value={_id} onClick={e => this.getManagerUsers(e)}>+
                          </button>
            </div>
            <div className="col s3 m3 l3 center">
            <img src={avatar?`${BackendInstance.defaults.baseURL}${avatar}`:defaultAvatar}
                                   alt=''
                                    className='round-img center' style={{ borderRadius: '50%', width: '40px', height:'40px', display:'block' }}
                                />
            </div>
            <div className="col s2 m2 l2 ">
              <p>{firstname}</p>
            </div>
            <div className="col s2 m2 l2 ">
              <p>{lastname}</p>
            </div>
            <div className="col s3 m3 l3 ">
              <p>{email}</p>
            </div>
            <div className="col s1 m1 l1 ">
              <button className="btn btn-danger" value={_id} onClick={(e) => { this.deleteMan(e) }}>
                <i className=" tiny material-icons  "> delete</i>
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
            <div className="col s1 m1 l1 center">
              <button className="btn btn-primary" value={_id} onClick={e => this.getOrganizationUsers(e)}>+</button>
            </div>
            <div className="col s3 m3 l3 center">
            <img src={avatar?`${BackendInstance.defaults.baseURL}${avatar}`:defaultAvatar}
                                   alt=''
                                    className='round-img center' style={{ borderRadius: '50%', width: '40px', height:'40px', display:'block' }}
                                />
            </div>
            <div className="col s2 m2 l2 center">
              <p>{organizationname}</p>
            </div>
            <div className="col s2 m2 l2 center">
              <p>{username}</p>
            </div>
            <div className="col s3 m3 l3 center">
              <p>{email}</p>
            </div>
            <div className="col s1 m1 l1 center">
              <button className="btn btn-danger" value={_id} onClick={(e) => { this.deleteOrg(e) }}>
                <i className=" tiny material-icons  "> delete</i>
              </button>
            </div>
            <div className="col s12 m12 l12">
              {console.log(this.state.organization_id),
                console.log(this.state.organization_id === _id)
              }
              {this.state.organization_id === _id ?
                <Tree name="managers" defaultOpen >
                  <div className="row center badge-light   ">
                    <div className="col s2 m2 l2 offset-s1 offset-m1 offset-l1  ">
                      <h6>Avatar</h6>
                    </div>
                    <div className="col s2 m2 l2">
                      <h6>First Name</h6>
                    </div>
                    <div className="col s2 m2 l2">
                      <h6>Last Name</h6>
                    </div>
                    <div className="col s3 m3 l3">
                      <h6>Email</h6>
                    </div>
                    <div className="col s2 m2 l2">
                      <h6>Delete User</h6>
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
                    <div className="col s3 m3 l3 offset-s1 offset-m1 offset-l1  ">
                      <h6>Avatar</h6>
                    </div>
                    <div className="col s2 m2 l2 center">
                      <h6>Organization</h6>
                    </div>
                    <div className="col s2 m2 l2 center">
                      <h6>User Name</h6>
                    </div>
                    <div className="col s3 m3 l3 center">
                      <h6>Email</h6>
                    </div>
                    <div className="col s1 m1 l1 center">
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
  getorganizations: PropTypes.func.isRequired,
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

export default (connect(mapStateToProps, { getorganizations, getmanagers, getusers, deleteOrganization, deleteManager, deleteCandidate })(GetAllUsers));