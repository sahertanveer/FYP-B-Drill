import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card from '../common/cards/Card';
import CardHeader from '../common/cards/CardHeader';
import CardIcon from "../common/cards/CardIcon.js";
import CardFooter from "../common/cards/CardFooter.js";
import Icon from "@material-ui/core/Icon";
import Update from "@material-ui/icons/Update";
import { getlivesesssionslength, getmachineslength, getattackslength, getorganizationslength, getmanagerslength, getuserslength } from '../../actions/dashboardAuthAction'
import BarChart from '../chart/BarChart';
import RadarChart from '../chart/RadarChart';
import DoughnutChart from '../chart/DoughnutChart';
import {
  ManagerAssignmentAttemptionStatusDoughnutGraph, ManagerAssignmentHistoryRadarGraph
} from '../../actions/visualizationAction'

class ManagerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionsLength:0,
      machinesLength: 0,
      attacksLength: 0,
      organizationsLength: 0,
      managersLength: 0,
      candidatesLength: 0
    }
    this.props.ManagerAssignmentHistoryRadarGraph(this.props.authId);
    this.props.ManagerAssignmentAttemptionStatusDoughnutGraph(this.props.authId);
    this.GetMachinesLength();
    this.GetAttacksLength();
    this.GetOrganizationsLength();
    this.GetManagersLength();
    this.GetUsersLength();
    this.GetSessionsLength();
}
async GetSessionsLength() {
  var sessionLength = await this.props.getlivesesssionslength();
  this.setState({ sessionsLength: sessionLength })
}
  async GetMachinesLength() {
    var machinelength = await this.props.getmachineslength();
    this.setState({ machinesLength: machinelength })
  }
  async GetAttacksLength() {
    var attacklength = await this.props.getattackslength();
    this.setState({ attacksLength: attacklength })
  }
  async GetOrganizationsLength() {
    var orglength = await this.props.getorganizationslength();
    this.setState({ organizationsLength: orglength })
  }
  async GetManagersLength() {
    var managerlength = await this.props.getmanagerslength();
    this.setState({ managersLength: managerlength })
  }
  async GetUsersLength() {
    var userlength = await this.props.getuserslength();
    this.setState({ candidatesLength: userlength })
  }

  render() {
    return (

      <BrowserRouter>
        <div className="container-fluid">
          <div className="row">
            <div className="col xs12 s12 m6 l9">
              <h1 className="white-text">B-Drill</h1>
              <p className="white-text" >
                We give wings to your skills you decide where to fly...
                </p>
            </div>

            <div className="col xs12 s12 m6 l3">
            </div>
          </div>

          <hr />
          <br />

          <div className="row">
            <div className="col xs12 s12 m6 l3">
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>network_check</Icon>
                  </CardIcon>
                  <br />
                  <p>Ongoing Drills</p>
                  <h3>{this.state.sessionsLength}</h3>
                </CardHeader>
                <CardFooter >
                  <div >
                    Current Sessions
                    </div>
                </CardFooter>
              </Card>
            </div>

            <div className="col xs12 s12 m6 l3">
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <Icon>desktop_windows</Icon>
                  </CardIcon>
                  <br />
                  <p> Machines</p>
                  <h3>{this.state.machinesLength}</h3>
                </CardHeader>
                <CardFooter >
                  <div >
                    Ubuntu + Windows
                    </div>
                </CardFooter>
              </Card>
            </div>

            <div className="col xs12 s12 m6 l3">
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Icon>adb</Icon>
                  </CardIcon>
                  <br />
                  <p> Attacks</p>
                  <h3>{this.state.attacksLength}</h3>
                </CardHeader>
                <CardFooter >
                  <div >
                    Campaigns + Scenarios
                    </div>
                </CardFooter>
              </Card>
            </div>

            <div className="col xs12 s12 m6 l3">
              <Card>
                <CardHeader color="rose" stats icon>
                  <CardIcon color="rose">
                    <Icon>sync</Icon>
                  </CardIcon>
                  <br />
                  <p>Tactics</p>
                  <h3>12</h3>
                </CardHeader>
                <CardFooter >
                  <div >
                    MITRE Based
                    </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="row ">
            <div className="col s12 m12 l12">
              <div className="card animate fadeLeft uicards">
                <div className="card-content">
                  <a href="/admintactics"><h5 className=" card-stats-number white-text"> Tactics</h5></a>
                  <hr />
                  <br />
                  <div className="row">
                    <div className="col s12 m12 l11 offset-l1">
                      <BarChart />
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
                  <h5 className="card-stats-number"> Candidates Assignments Status </h5>
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

          <div className="row" style={{ overflowX: "hidden" }}>
            <div className="col xs12 s12 m6 l3">
              <Card>
                <CardHeader color="success" stats icon>
                  <CardIcon color="success">
                    <Icon>content_copy</Icon>
                  </CardIcon>
                  <br />
                  <p>Online Users</p>
                  <h3>{this.props.onlineUsers !== null ? Object.keys(this.props.onlineUsers).length : 0 }</h3>
                  </CardHeader>
                <CardFooter stats>
                  <div >
                    <Update />
                      Just Updated
                    </div>
                </CardFooter>
              </Card>
            </div>

            <div className="col xs12 s12 m6 l3">
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>business</Icon>
                  </CardIcon>
                  <br />
                  <p>Organizations</p>
                  <h3>{this.state.organizationsLength}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div >
                    <Update />
                      Just Updated
                    </div>
                </CardFooter>
              </Card>
            </div>

            <div className="col xs12 s12 m6 l3">
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    <Icon>people</Icon>
                  </CardIcon>
                  <br />
                  <p>Managers</p>
                  <h3>{this.state.managersLength}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div >
                    <Update />
                      Just Updated
                    </div>
                </CardFooter>
              </Card>
            </div>

            <div className="col xs12 s12 m6 l3">
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <Icon>people</Icon>
                  </CardIcon>
                  <br />
                  <p>Candidates</p>
                  <h3>{this.state.candidatesLength}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div >
                    <Update />
                      Just Updated
                    </div>
                </CardFooter>
              </Card>
            </div>
          </div>



        </div>

      </BrowserRouter>
    )
  }
}
ManagerDashboard.propTypes = {
  visualization: PropTypes.object.isRequired,
  getmachineslength: PropTypes.func.isRequired,
  getattackslength: PropTypes.func.isRequired,
  getorganizationslength: PropTypes.func.isRequired,
  getmanagerslength: PropTypes.func.isRequired,
  ManagerAssignmentAttemptionStatusDoughnutGraph: PropTypes.func.isRequired,
  ManagerAssignmentHistoryRadarGraph: PropTypes.func.isRequired,
  getuserslength: PropTypes.func.isRequired,
  getlivesesssionslength: PropTypes.func.isRequired,
  authId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  onlineUsers: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  visualization: state.visualization,
  user: state.user,
  authId: state.auth._id,
  onlineUsers: state.chat.usersObj,
  page: state.page
})
export default (connect(mapStateToProps, {ManagerAssignmentHistoryRadarGraph, ManagerAssignmentAttemptionStatusDoughnutGraph, getlivesesssionslength,
   getmachineslength, getattackslength, getorganizationslength, getmanagerslength, 
   getuserslength })(ManagerDashboard));
