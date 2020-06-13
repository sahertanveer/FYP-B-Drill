import React, { Component } from 'react'
import { BrowserRouter, Redirect, withRouter } from 'react-router-dom'
import { BackendInstance } from '../../config/axiosInstance';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getscenariosfromtactic } from '../../actions/adminAuthAction'
import { addAssignment } from '../../actions/managerAuthAction'
import { setAlert } from '../../actions/alertAction'
import { sendNotification } from '../../actions/notificationAction'
import Alert from '../../layout/Alert'
import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda } from "@syncfusion/ej2-react-schedule";
import { setPage } from '../../actions/pageAction';
import queryString from 'query-string'

const initialState = {
  showMenuTactic: false,
  showMenuCategory: false,
  showMenuPlatform: false,
  showList: false,
  procedure_id: false,
  tacticName: "Select Tactic",
  tacticSelected: false,
  platformSelected: false,
  machineSelected: false,
  category: "Select Category",
  platform: "Select Platform",
  machine: "Select Machine",
  checkedCheckbox: null,
  machinesAvailable: false,
  machines: [],
  schedules: [],
  showSchedule: false,
  actualScheduleLength: -1,
  detectChange: false,
  scheduleReady: false
}

class Assign_Attack extends Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(this.props.location.search)
    
    
    this.state = {
    ...initialState,
    platforms: [],
    candidateId: values.candId,
    candidateEmail: values.candEmail,
    }
      //dropdown
      
      // schedule :{
      //   dataSource:[]
      // }
    // }



    // try {
    BackendInstance({
      method: 'post',
      url: '/api/attackinventory/getallplatforms',
    }).then(res => {

      if (Object.keys(res.data.platforms).length !== 0) {
        this.setState({ platforms: res.data.platforms })

      }
    }).catch(err => {
      const errors = err.response.data.errors;


      if (errors) {

        errors.forEach(error => { (this.props.setAlert(error.msg, 'danger')) })
      }
    })

//   if(values.candId)
    // this.setState({candidateId:values.candId})



    // {
    //   dataSource: [{
    //     EndTime: new Date(2020, 1, 25, 6, 30),
    //     StartTime: new Date(2020, 1, 25, 2, 30),
    //     Subject: "Session",
    //     IsBlock: true,
    //     RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10'
    //   },
    //   {
    //     EndTime: new Date(2020, 1, 25, 8, 30),
    //     StartTime: new Date(2020, 1, 25, 7, 30),
    //     IsBlock: true,

    //   }]
    // }
    //dropdown
    this.selectTactic = this.selectTactic.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.selectPlatform = this.selectPlatform.bind(this);
    this.selectMachine = this.selectMachine.bind(this);

    this.showMenuTactic = this.showMenuTactic.bind(this);
    this.showMenuCategory = this.showMenuCategory.bind(this);
    this.showMenuPlatform = this.showMenuPlatform.bind(this);
    this.showMenuMachine = this.showMenuMachine.bind(this);
    this.getMachines = this.getMachines.bind(this)
    this.getSchedule = this.getSchedule.bind(this)

    this.closeMenuTactic = this.closeMenuTactic.bind(this);
    this.closeMenuCategory = this.closeMenuCategory.bind(this);
    this.closeMenuPlatform = this.closeMenuPlatform.bind(this);
    this.closeMenuMachine = this.closeMenuMachine.bind(this)

    this.checkAlert = this.checkAlert.bind(this);

    this.showList = this.showList.bind(this);
    this.closeList = this.closeList.bind(this);

    this.checkFilter = this.checkFilter.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.Assign = this.Assign.bind(this)
    this.notifyCandidate = this.notifyCandidate.bind(this)


  }
  //  componentWillReceiveProps = ()=> async dispatch => {
  //   if (this.state.platformSelected) {
  //     try {
  //       const res = await BackendInstance({
  //         method: 'post',
  //         url: '/api/managers/getMachines',
  //         data: {
  //           platform: this.state.platform//'5db080230b62e76104bdd4bd'
  //         }
  //       })

  //       if (Object.keys(res.data).length !== 0) {

  //         this.setState({ machinesAvailable: true })
  //       }
  //       else {
  //         this.setState({ machinesAvailable: false })
  //       }




  //     } catch (err) {
  //       const errors = err.response.data.errors;


  //       if (errors) {

  //         errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
  //       }

  //       this.setState({ machinesAvailable: false })
  //     }

  //   }

  // }
  //dropdown
  notifyCandidate(){
    let notificationFields = {}
    notificationFields.sender = this.props.auth.email;
			notificationFields.url = "candsession";
			notificationFields.reciever_role = "candidate";
			notificationFields.message = "You have a new assignment";
			notificationFields.reciever_email = this.state.candidateEmail;
			notificationFields.notification_type = "Assignment";
    this.props.sendNotification(notificationFields)
  }

  showMenuTactic(event) {
    event.preventDefault();

    this.setState({ showMenuTactic: true }, () => {
      document.addEventListener('click', this.closeMenuTactic);
    });
  }

  showMenuCategory(event) {
    event.preventDefault();

    this.setState({ showMenuCategory: true }, () => {
      document.addEventListener('click', this.closeMenuCategory);
    });
  }

  showMenuPlatform(event) {
    event.preventDefault();

    this.setState({ showMenuPlatform: true }, () => {
      document.addEventListener('click', this.closeMenuPlatform);
    });


  }

  showMenuMachine(event) {
    event.preventDefault();

    this.setState({ showMenuMachine: true }, () => {
      document.addEventListener('click', this.closeMenuMachine);
    });
  }
  closeMenuMachine() {
    this.setState({ showMenuMachine: false }, () => {
      document.removeEventListener('click', this.closeMenuMachine);
    });
  }
  closeMenuTactic() {
    this.setState({ showMenuTactic: false }, () => {
      document.removeEventListener('click', this.closeMenuTactic);
    });
  }

  closeMenuCategory() {
    this.setState({ showMenuCategory: false }, () => {
      document.removeEventListener('click', this.closeMenuCategory);
    });
  }

  closeMenuPlatform() {
    this.setState({ showMenuPlatform: false }, () => {
      document.removeEventListener('click', this.closeMenuPlatform);
    });
  }

  showList(event) {
    event.preventDefault();

    this.setState({ showList: true }, () => {
      document.addEventListener('click', this.closeList);
    });
  }

  closeList() {
    this.setState({ showList: false }, () => {
      document.removeEventListener('click', this.closeList);
    });


  }

  selectTactic(event) {
    event.preventDefault();
    this.setState({ tacticName: event.target.innerText, tacticSelected: true }, this.checkFilter)
    this.checkFilter()

  }

  selectCategory(event) {
    event.preventDefault();
    this.setState({ category: event.target.innerText }, this.checkFilter())
    // this.checkFilter()

  }

  selectPlatform(event) {
    event.preventDefault();
    this.setState({ platform: event.target.innerText, platformSelected: true }, () => { this.checkFilter(); this.getMachines(); })


  }

  selectMachine(event) {
    event.preventDefault();
    this.setState({ machine: event.target.innerText, machineSelected: true }, () => this.getSchedule())//, this.somethng Else)

  }


  async getMachines() {
    try {
      const res = await BackendInstance({
        method: 'post',
        url: '/api/managers/getmachines',
        data: {
          platform: this.state.platform//'5db080230b62e76104bdd4bd'
        }
      })

      if (Object.keys(res.data).length !== 0) {
        this.setState({ machinesAvailable: true, machines: res.data.machines }, () => { console.log(this.state) })
      }
      else {
        this.setState({ machinesAvailable: false })
      }




    } catch (err) {
      const errors = err.response.data.errors;


      if (errors) {

        errors.forEach(error => { (this.props.setAlert(error.msg, 'danger')) })
      }

      this.setState({ machinesAvailable: false })
    }
  }

  async getSchedule() {
    try {
      const res = await BackendInstance({
        method: 'post',
        url: '/api/managers/getschedule',
        data: {
          machine_name: this.state.machine//'5db080230b62e76104bdd4bd'
        }
      })

      if (Object.keys(res.data).length !== 0) {
        // this.setState({ machinesAvailable: true, machines: res.data.machines }, () => { console.log(this.state) })
        this.setState({ showSchedule: false, ready: false, detectChange: false }, () => this.setState({ schedules: res.data.schedules, actualScheduleLength: res.data.schedules.length, showSchedule: true }, () => { console.log(this.state.schedules); this.setState(this.state) }))
        // this.setState({schedules: res.data.schedules} , ()=>    {console.log(this.state.schedules)}) 



      }
      else {
        // this.setState({ machinesAvailable: false })
      }




    } catch (err) {
      const errors = err.response.data.errors;


      if (errors) {

        errors.forEach(error => { (this.props.setAlert(error.msg, 'danger')) })
      }
    }
  }


  componentDidUpdate() {
    if (this.state.detectChange) { //&& !this.state.scheduleReady
      if (this.state.actualScheduleLength === this.state.schedules.length) {
        // TODO
        this.setState({ scheduleReady: false, detectChange: false })


      }
      else if (this.state.actualScheduleLength + 1 === this.state.schedules.length) {
        this.setState({ scheduleReady: true, detectChange: false }) 
      }
      else {
        //alert: set only one schedule
        this.setState({ scheduleReady: false, detectChange: false })

      }
    }
    else
      console.log("Donot set State")
    // else
    //   this.setState({ detectChange: true })
  }

  onAnyChange() {
    this.setState({ detectChange: true })
  }

  getCalendar() {
    // popupClose ={() => this.onAnyChange()} onClick={() => this.onAnyChange()}
    return this.state.showSchedule ? <ScheduleComponent actionComplete={() => this.onAnyChange()} currentView='Month' eventSettings={{ dataSource: this.state.schedules }}>
      {/* <ViewsDirective>
                    <ViewDirective option='Day'/>
                    <ViewDirective option='Week'/>
                    <ViewDirective option='WorkWeek'/>
                    <ViewDirective option='Month'/>
                </ViewsDirective> */}
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]}></Inject>
    </ScheduleComponent> : null
  }
  checkFilter() {
    if(this.state.category === "Scenario"){
    if (this.state.tacticSelected && this.state.platformSelected) {
      this.props.getscenariosfromtactic(this.state.category, this.state.tacticName, this.state.platform)
    }
  }
  else
  if (this.state.platformSelected && this.state.category === "Campaign") {
    this.props.getscenariosfromtactic(this.state.category,null, this.state.platform)
  }
  }

  handleChange(e) {
    if (this.state.checkedCheckbox !== null)
      document.getElementById(this.state.checkedCheckbox).checked = false;
    this.setState({ procedure_id: e.target.value, checkedCheckbox: e.target.id });


  }

  Assign() {
    if (this.state.category === "Scenario") {
      if (this.state.scheduleReady && this.state.tacticSelected && this.state.platformSelected && this.state.machineSelected && this.state.procedure_id) {
        //console.log(this.state.schedules[this.state.schedules.length -1])

        this.props.addAssignment(this.state.schedules[this.state.schedules.length - 1], this.state.candidateId, this.props.auth._id, this.state.procedure_id, this.state.platform, this.state.machine, this.state.category, this.state.tacticName)
        //  this.props.addAssignment(this.props.user.candidate._id, this.props.auth._id, this.state.procedure_id, this.state.platform)
        setTimeout(this.checkAlert, 2000);
      }
    }
    else
      if (this.state.scheduleReady && this.state.platformSelected && this.state.machineSelected && this.state.procedure_id) {
        //console.log(this.state.schedules[this.state.schedules.length -1])

        this.props.addAssignment(this.state.schedules[this.state.schedules.length - 1], this.state.candidateId, this.props.auth._id, this.state.procedure_id, this.state.platform, this.state.machine, this.state.category, "None")
        //  this.props.addAssignment(this.props.user.candidate._id, this.props.auth._id, this.state.procedure_id, this.state.platform)
        setTimeout(this.checkAlert, 2000);
      }

  }
  checkAlert() {
    if (this.props.attack.attacksFound && this.props.attack.assignedSuccess) {
      this.props.setAlert('Attack Assigned to candidate successfully', 'primary') //light
      // this.setState({ procedure_id: "" });
      this.notifyCandidate();
      this.setState(prevState =>{
        return{
          ...initialState,
          platforms:  prevState.platforms,
          candidateId:prevState.candidateId,
          candidateEmail:prevState.Email,
          
        }
      }) ;
      this.props.history.push(`/candidatelist`)
      this.props.setPage('candidatelist')

      

    }
    else
      this.props.setAlert(' Attack not assigned', 'danger')
  }

  renderTableData() {

    if (this.props.attack.attacksFound)
      return this.props.attack.attacks.map((attack, index) => {
        // let ref= React.createRef()
        const { procedure_id, procedure_name, technique_name } = attack //destructuring
        return (
          <tr key={procedure_id}>
            <td>
              <input style={{ opacity: 1, pointerEvents: "auto" }} id={procedure_id} value={procedure_id} onChange={(e) => { this.handleChange(e) }} className="black-text" type="checkbox" /> </td>
            <td>{procedure_id}</td>
            <td>{procedure_name}</td>
            {this.state.category === "Scenario" ? <td>{technique_name}</td> : null}

          </tr>
        )
      })
  }

  render() {
    
    if (!this.state.candidateId) {
      this.props.setPage('candidatelist')
      return <Redirect to='/candidatelist' />

    }

    return (
      <BrowserRouter>
        <main>
          <div className="container-fluid">



            <div className="row">
              <div className="col s12 m12 l12">
                <h6 className="white-text">Alotting Attack To: {this.state.candidateEmail}</h6>
                <hr></hr>
              </div>
            </div>

            <div className="row">
              <div className="col s10 m8 l6 offset-l3 offset-m2 offset-s1">

                <div className="card-action grey darken-4 ">
                  <div className="left-align white-text">
                    <div className="cardGroup center">
                      <br />

                      <button className="btn cyan white-text center " onClick={this.showMenuCategory}>
                        {this.state.category} <i className="tiny material-icons">arrow_drop_down</i>
                      </button>

                      {
                        this.state.showMenuCategory
                          ? (
                            <div className="menu" ref={(element) => {
                              this.dropdownMenu = element;
                            }}>
                              <ul>
                                <div className="collection black-text">
                                  <li className="collection-item black-text" onClick={this.selectCategory}>Scenario</li>
                                  <li className="collection-item black-text" onClick={this.selectCategory}>Campaign</li>
                                </div>
                              </ul>
                            </div>
                          )
                          : (
                            null
                          )
                      }
                      <br />
                      <br />

                      <button className="btn cyan white-text center " onClick={this.showMenuPlatform}>
                        {this.state.platform} <i className="tiny material-icons">arrow_drop_down</i>
                      </button>

                      {
                        this.state.showMenuPlatform
                          ? (
                            <div className="menu" ref={(element) => {
                              this.dropdownMenu = element;
                            }}>

                              <ul className="collection black-text">
                                {this.state.platforms && this.state.platforms.length !== 0 ?
                                  this.state.platforms.map((field, idx) => {
                                    return (
                                      <li className="collection-item black-text " onClick={this.selectPlatform}>{field.platform_name}</li>
                                    )
                                  })
                                  : null}
                                {/* <li className="collection-item black-text " onClick={this.selectPlatform}>windows_10_1511</li>
                              <li className="collection-item black-text " onClick={this.selectPlatform}>ubuntu_16.0.4</li> */}

                              </ul>

                            </div>
                          )
                          : (
                            null
                          )
                      }
                      <br />
                      <br />

                      {this.state.category === "Scenario" ?
                        <button className="btn cyan white-text center " onClick={this.showMenuTactic}>
                          {this.state.tacticName} <i className="tiny material-icons">arrow_drop_down</i>
                        </button>
                        : null}

                      {
                        this.state.category === "Scenario" && this.state.showMenuTactic
                          ? (
                            <div className="menu" ref={(element) => {
                              this.dropdownMenu = element;
                            }}>
                              <ul>
                                <div className="collection black-text">
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Initial_Access</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Execution</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Persistence</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Privilege_Escalation</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Defense_Evasion</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Credential_Access</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Discovery</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Lateral_Movement</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Collection</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Command_and_Control</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Exfiltration</li>
                                  <li className="collection-item black-text" onClick={this.selectTactic}>Exfiltration</li>
                                  <li onClick={this.selectTactic}>Impact</li>
                                </div>
                              </ul>
                            </div>
                          )
                          : (
                            null
                          )
                      }
                      <br />
                      <br />


                      {this.state.machinesAvailable ?
                        <button className="btn cyan white-text center " onClick={this.showMenuMachine}>
                          {this.state.machine} <i className="tiny material-icons">arrow_drop_down</i>
                        </button>
                        : ""
                      }
                      {this.state.showMenuMachine && this.state.machines
                        ? (
                          <div className="menu" ref={(element) => {
                            this.dropdownMenu = element;
                          }}>
                            <ul className="collection black-text">
                              {this.state.machines.map((field, idx) => {
                                return (
                                  // <div className="">
                                  <li className="collection-item black-text" onClick={this.selectMachine}>{field.machine_name}</li>
                                  // </div>
                                )
                              })
                              }
                            </ul>
                          </div>
                        )
                        : (
                          null
                        )
                      }
                      <br />
                      <br />

                      <div className="row">
                        {/* <div className="col s4 m4 l4">
                          <p>Selected Scenario: </p>
                        </div> */}
                        {/* <div className="col s8 m8 l7"> */}
                        <div className="input-field center">
                          <input style={{ backgroundColor: "#d1d1d1" }} className="main-search-input-field center validate black-text" placeholder="Selected Scenario" type="text" disabled value={!this.state.procedure_id ? "Selected Procedure" : this.state.procedure_id} id="selectedScenario" />
                          {/* </div> */}
                        </div>
                      </div>
                      <br />
                      <br />



                      {/* <ScheduleComponent currentView='Month' eventSettings={{dataSource:this.state.schedules}}> */}
                      {/* <ViewsDirective>
                    <ViewDirective option='Day'/>
                    <ViewDirective option='Week'/>
                    <ViewDirective option='WorkWeek'/>
                    <ViewDirective option='Month'/>
                </ViewsDirective> */}
                      {/* <Inject services={[Day, Week, WorkWeek, Month, Agenda]}></Inject> */}
                      {/* </ScheduleComponent>  */}



                      {/* <ScheduleComponent onClick={this.check} currentView='Month' eventSettings={this.state.schedule}>
                        <Inject services={[Day, Week, WorkWeek, Month, Agenda]}></Inject>
                      </ScheduleComponent> */}
                      {this.state.category === "Scenario" ?
                        <button className=" btn cyan" disabled={!this.state.scheduleReady || !this.state.tacticSelected || !this.state.platformSelected || !this.state.machineSelected || !this.state.procedure_id} onClick={this.Assign}>Assign</button>
                        : this.state.category === "Campaign" ?
                          <button className=" btn cyan" disabled={!this.state.scheduleReady || !this.state.platformSelected || !this.state.machineSelected} onClick={this.Assign}>Assign</button>
                          : <button className=" btn cyan" disabled>Assign</button>
                      }
                      <br />
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            </div>

            <Alert />

            <div className="row">
              <div className="col s12 m12 l12 cardGroup center">
                {this.getCalendar()}
              </div>
            </div>

            {/* {this.state.category !== "Campaign" ? */}

              <div className="row">
                <div className="col s12 m12 l12 grey darken-4">
                  <ul className="collection with-header animate fadeLeft grey darken-4">
                    <li className="collection-header grey darken-4">
                      <h5 className="task-card-title mb-3 white-text">Category:</h5>
                    <p className="task-card-date white-text">{this.state.category === "Campaign" ? "Campaigns": "Scenarios"}</p>
                    </li>
                    <li className="collection-item dismissable black-text grey darken-1">

                      <table border="1" className="center">
                        <thead>
                          <tr>
                            <th>Select</th>
                    <th>{this.state.category === "Campaign"? "Campaign Id" :"Procedure Id"}</th>
                            <th>{this.state.category === "Campaign"? "Campaign Name" :"Procedure Name"}</th>
                            {this.state.category === "Scenario" ? <th>Technique Name</th> : null}
                          </tr>
                        </thead>
                        <tbody>
                          {this.renderTableData()}
                        </tbody>
                      </table>

                      {/* <ul>
                  <li className="collection-item dismissable grey darken-1">
                    <label htmlFor="task4">
                      <input className="black-text" type="checkbox" id="task4" />
                      <span className="width-100 black-text" >Scenario: 4</span>
                      <a href="#ee" className="secondary-content">
                        <span className="ultra-small">0.0.0.0</span> </a>
                      <br />
                      <span className="task-cat black-text">
                        Name:
                              <br />
                        VM:
                            </span>
                    </label>*/}
                    </li>
                  </ul>
                </div>
              </div>
              {/* : null} */}
          </div>
        </main>
      </BrowserRouter >
    );
  }
}
Assign_Attack.propTypes = {
  getscenariosfromtactic: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  addAssignment: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  attack: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  attack: state.attack,
  auth: state.auth
})

export default withRouter(connect(mapStateToProps, { getscenariosfromtactic, addAssignment, setAlert, setPage, sendNotification })(Assign_Attack));
//  export default withRouter(Assign_Attack)