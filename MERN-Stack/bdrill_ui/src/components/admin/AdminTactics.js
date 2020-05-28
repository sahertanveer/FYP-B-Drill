import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import BarChart from '../chart/BarChart'
import GetAllAttacks from './GetAllAttacks'
import GetAllMachines from './GetAllMachines'
import GetAllPlatforms from './GetAllPlatforms'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'black', //theme.palette.background.paper
    width: theme.breakpoints.up('sm')
  },
}));

export default function AdminTactics() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <div className="row">
        <div className="col s12 m12 l12">
          <h5 className=" white-text" style={{ fontFamily: "Princess Sofia" }}> Techniques</h5>
          <BarChart />
        </div>
      </div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          backgroundColor="black"
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="View Attacks" style={{ backgroundColor: 'grey', color: 'white' }} {...a11yProps(0)} />
          <Tab label="View Machines" style={{ backgroundColor: 'grey', color: 'white' }} {...a11yProps(1)} />
          <Tab label="View Platforms" style={{ backgroundColor: 'grey', color: 'white' }} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <GetAllAttacks />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <GetAllMachines />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <GetAllPlatforms />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}







// import React, { Component } from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { getallattacks, getallmachines, getallplatforms, deleteAttack, deleteMachine, deletePlatform } from '../../actions/adminAuthAction'
// import { logout } from '../../actions/authAction'
// import { setPage } from '../../actions/pageAction'
// import { setAlert } from '../../actions/alertAction'
// import Alert from '../../layout/Alert'
// import BarChart from '../chart/BarChart'

// class AdminTactics extends Component {
//   constructor(props) {
//     super(props);
//     this.state={
//       displayAlert:false
//     }
//     this.props.getallattacks();
//     this.props.getallmachines();
//     this.props.getallplatforms();
//     this.renderAttackTableData = this.renderAttackTableData.bind(this);
//     this.renderMachineTableData = this.renderMachineTableData.bind(this);
//     this.renderPlatformTableData = this.renderPlatformTableData.bind(this);
//     this.deleteattack = this.deleteattack.bind(this);
//     this.deletemachine = this.deletemachine.bind(this);
//     this.deleteplatform = this.deleteplatform.bind(this);
//   }

//   deleteattack (e){
//     e.preventDefault();
//     this.props.deleteAttack(e.currentTarget.value);
//     this.props.getallattacks();
//   }

//   deletemachine(e){
//     e.preventDefault();
//     this.props.deleteMachine(e.currentTarget.value);
//     this.props.getallmachines();
//   }

//   deleteplatform(e){
//     e.preventDefault();
//     this.props.deletePlatform(e.currentTarget.value);
//     this.props.getallplatforms();
//   }

// renderAttackTableData ()  {
//   if (this.props.attack.attacksFound)
//   return this.props.attack.attacks.map((attack, index) => {
//     const { _id, procedure_id, procedure_name, tactic_name, technique_name, category, platform } = attack //destructuring
//     return (
//       <tr key={procedure_id}>
//         <td>{procedure_id}</td>
//         <td>{procedure_name}</td>
//         <td>{tactic_name ? tactic_name: <center>--</center>}</td>
//         <td>{technique_name ? technique_name: <center>--</center> }</td>
//         <td>{category}</td>
//         <td>{platform}</td>
//         <td>
//           <a href={`/addorupdateattack?procedureId=${procedure_id}`} className="btn btn-primary white-text"> 
//             <i className=" tiny material-icons white-text"> edit</i> 
//           </a>
//           <button className="btn btn-danger" value={_id}  onClick={(e) => this.deleteattack(e)}>
//               <i className=" tiny material-icons white-text"> delete</i>
//             </button>
//         </td>
//       </tr>
//     )
//   })
//   }

//   renderMachineTableData ()  {
//     if(this.props.attack.machineFound)
//       return this.props.attack.machines.map((machine) => {
//         const { _id, platform, machine_name, architecture } = machine //destructuring
//         return (
//           <tr key={_id}>
//             <td>{platform}</td>
//             <td>{machine_name}</td>
//             <td>{architecture}</td>
//             <td>
//               <a href={`/addorupdatemachine?machine_name=${machine_name}`} className="btn btn-primary white-text"> 
//                 <i className=" tiny material-icons white-text"> edit</i> 
//               </a>
//               {/* {(e) =>  this.delete(e)} */}
//               <button className="btn btn-danger" value={_id} onClick={(e) => {this.deletemachine(e)}}>
//                   <i className=" tiny material-icons white-text"> delete</i>
//                 </button>
//             </td>
//           </tr>
//         )
//       })
//   }

//   renderPlatformTableData ()  {
//   if(this.props.attack.platformFound)
//       return this.props.attack.platforms.map((platform) => {
//         const { _id, platform_family, platform_name } = platform //destructuring
//         return (
//           <tr key={_id}>
//             <td>{platform_family}</td>
//             <td>{platform_name}</td>
//             <td>
//               {/* <a href={`/addorupdateplatform?platform_name=${platform_name}`} className="btn btn-primary white-text"> 
//                 <i className=" tiny material-icons white-text"> edit</i> 
//               </a> */}
//               <button className="btn btn-danger" value={_id} onClick={(e) => {this.deleteplatform(e)}}>
//                   <i className=" tiny material-icons white-text"> delete</i>
//                 </button>
//             </td>
//           </tr>
//         )
//       })
//   }

//   render() {
//     return (
//       <BrowserRouter>
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col s12 m12 l12">
//                 <h5 className=" white-text" style={{ fontFamily: "Princess Sofia" }}> Techniques</h5>
//                   <BarChart />
//               </div>
//             </div>

//             <Alert />

//             <div className="row">
//               <div className="col s12 m12 l12">
//                 <div className="card animate fadeLeft uicards">
//                   <div className="card-content">
//                     <div className="row">
//                       <div className="col s6 m6 l6">
//                         <h5 className="card-stats-number"> Attacks</h5>
//                       </div>
//                       <div className="col s6 m6 l6">
//                         <p className=" right btn btn-light">
//                           <a href="/addorupdateattack" className=" white-text"> 
//                             <i className=" small material-icons center">add_circle</i>  Add Attack
//                           </a>
//                         </p>
//                       </div>
//                     </div>
//                     <hr />
//                     <div>
//                     <table border="1" className="center">
//                       <thead>
//                         <tr>
//                         <th>Procedure Id</th>
//                           <th>Procedure Name</th>
//                           <th>Tactic Name</th>
//                           <th>Technique Name</th>
//                           <th>Category</th>
//                           <th>Platform</th>
//                           <th>Delete</th>
//                         </tr>
//                       </thead>
//                       <tbody>

//                         {this.renderAttackTableData()}

//                       </tbody>
//                     </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col s12 m12 l12">
//                 <div className="card animate fadeLeft uicards">
//                   <div className="card-content">
//                     <div className="row">
//                       <div className="col s6 m6 l6">
//                         <h5 className="card-stats-number"> Machines</h5>
//                       </div>
//                       <div className="col s6 m6 l6">
//                         <p className=" right btn btn-light ">
//                           <a href="/addorupdatemachine" className=" white-text"> 
//                             <i className=" small material-icons center">add_circle</i>  Add Machine
//                           </a>
//                         </p>
//                       </div>
//                     </div>
//                     <hr />
//                     <div>
//                     <table border="1" className="center">
//                       <thead>
//                         <tr>
//                           <th>Platform</th>
//                           <th>Machine Name</th>
//                           <th>Architecture</th>
//                           <th>Edit/Delete</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {this.renderMachineTableData()}
//                       </tbody>
//                     </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col s12 m12 l12">
//                 <div className="card animate fadeLeft uicards">
//                   <div className="card-content ">
//                     <div className="row">
//                       <div className="col s6 m6 l6">
//                         <h5 className="card-stats-number "> Platforms</h5>
//                       </div>
//                       <div className="col s6 m6 l6">
//                         <p className=" right btn btn-light">
//                           <a href="/addorupdateplatform" className=" white-text" > 
//                             <i className=" small material-icons center">add_circle</i>  Add Platform
//                           </a>
//                         </p>
//                       </div>
//                     </div>
//                     <hr />
//                     <div>
//                     <table border="1" className="center">
//                       <thead>
//                         <tr>
//                           <th>Platform Family</th>
//                           <th>Platform Name</th>
//                           <th>Edit/Delete</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {this.renderPlatformTableData()}
//                       </tbody>
//                     </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//           </div>
//       </BrowserRouter>
//     )
//   }
// }

// AdminTactics.propTypes = {
//   deleteAttack:PropTypes.func.isRequired,
//   deleteMachine:PropTypes.func.isRequired,
//   deletePlatform:PropTypes.func.isRequired,
//   logout: PropTypes.func.isRequired,
//   setPage: PropTypes.func.isRequired,
//   getallattacks: PropTypes.func.isRequired,
//   getallmachines: PropTypes.func.isRequired,
//   getallplatforms: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   attack: PropTypes.object.isRequired,
//   page: PropTypes.object.isRequired,
//   setAlert: PropTypes.func.isRequired
// }

// const mapStateToProps = state => ({
//   attack: state.attack,
//   auth: state.auth,
//   page: state.page
// })

// export default (connect(mapStateToProps, { 
//   logout, setAlert, deleteAttack,deleteMachine, deletePlatform, setPage, getallattacks, getallmachines, getallplatforms 
// })(AdminTactics))