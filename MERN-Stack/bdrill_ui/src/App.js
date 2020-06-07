import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import './App.css'

//redux
import { Provider } from 'react-redux'
import store from './store';
import { loadUser } from './actions/authAction';
import setAuthToken from './utils/SetAuthToken';
import { setPage } from './actions/pageAction'

import Home from './components/Home'
import ForgotPassword from './components/common/Password/ForgotPassword';
import ResetPassword from './components/common/Password/ResetPassword';

//Admin Panel
import AdminSignin from './components/admin/AdminSignin'
import AdminNavigation from './components/admin/AdminNavigation'

//Organization Panel
import OrgRegistration from './components/organization/OrgRegistration'
import OrgSignin from './components/organization/OrgSignin'
import OrgNavigation from './components/organization/OrgNavigation'

//Manager Panel
import ManagerSignin from './components/manager/ManagerSignin'
import ManagerNavigation from './components/manager/ManagerNavigation';

//Candidate Panel
import CandSignin from './components/candidate/CandSignin'
import CandNavigation from './components/candidate/CandNavigation'

//Routing
import AdminPrivateRoute from './components/routing/AdminPrivateRoute'
import OrganizationPrivateRoute from './components/routing/OrganizationPrivateRoute'
import ManagerPrivateRoute from './components/routing/ManagerPrivateRoute'
import CandidatePrivateRoute from './components/routing/CandidatePrivateRoute'

//Profiling
import EditCreateProfile from './components/profile/EditCreateProfile'

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {

    store.dispatch(loadUser());
    
    store.dispatch(setPage((window.location.pathname).replace('/', '')))

    window.onpopstate = (e) => {
      store.dispatch(loadUser());
      store.dispatch(setPage((window.location.pathname).replace('/', '')))
    }


  }, []); //run an effect and clen it up for only once, alike didmount(), will run only once

  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* <Alert /> */}
        <Switch>

          {/* Admin */}
          <AdminPrivateRoute path="/adminsignin" component={AdminSignin} />
          <AdminPrivateRoute path="/admindashboard" component={AdminNavigation} />
          <AdminPrivateRoute path="/pendingassignments" component={AdminNavigation} />
          <AdminPrivateRoute path="/admintactics" component={AdminNavigation} />
          <AdminPrivateRoute path="/addorupdateattack" component={AdminNavigation} />
          <AdminPrivateRoute path="/addorupdatemachine" component={AdminNavigation} />
          <AdminPrivateRoute path="/addorupdateplatform" component={AdminNavigation} />
          <AdminPrivateRoute path="/addattacks" component={AdminNavigation} />
          <AdminPrivateRoute path="/getallusers" component={AdminNavigation} />
          <AdminPrivateRoute path="/getallusersprofiles" component={AdminNavigation} />
          <AdminPrivateRoute path="/chatlayout" component={AdminNavigation} />
          <AdminPrivateRoute path="/userprofile" component={AdminNavigation} />
          <AdminPrivateRoute path="/changepassword" component={AdminNavigation} />

          {/* Organization */}
          <Route path="/orgregistration" component={OrgRegistration} />
          <OrganizationPrivateRoute path="/orgsignin" component={OrgSignin} />
          <OrganizationPrivateRoute path="/orgdashboard" component={OrgNavigation} />
          <OrganizationPrivateRoute path="/addmanager" component={OrgNavigation} />
          <OrganizationPrivateRoute path="/userslist" component={OrgNavigation} />
          <OrganizationPrivateRoute path="/orgviewattack" component={OrgNavigation} />
          <OrganizationPrivateRoute path="/getusersprofiles" component={OrgNavigation} />
          <OrganizationPrivateRoute path="/orgchatlayout" component={OrgNavigation} />
          <OrganizationPrivateRoute path="/userprofile" component={OrgNavigation} />
          <OrganizationPrivateRoute path="/orgchangepassword" component={OrgNavigation} />

          {/* Manager */}
          
          <ManagerPrivateRoute path="/managersignin" component={ManagerSignin} />
          <ManagerPrivateRoute path="/managerdashboard" component={ManagerNavigation} />
          <ManagerPrivateRoute path="/managerprofile" component={ManagerNavigation} />
          <ManagerPrivateRoute path="/candidatelist" component={ManagerNavigation} />
          <ManagerPrivateRoute path="/addcandidate" component={ManagerNavigation} />
          <ManagerPrivateRoute path="/assignattack" component={ManagerNavigation} />
          <ManagerPrivateRoute path="/userprofile" component={ManagerNavigation} />
          <ManagerPrivateRoute path="/allotedassignments" component={ManagerSignin} />
          <ManagerPrivateRoute path="/managerprofile" component={ManagerNavigation} />
          <ManagerPrivateRoute path="/editcreateprofile" component={ManagerNavigation} />
          <ManagerPrivateRoute path="/getcandidatesprofiles" component={ManagerNavigation} />
          <ManagerPrivateRoute path="profileitems" component={ManagerNavigation} />
          <ManagerPrivateRoute path="/managerchatlayout" component={ManagerNavigation} />
          <ManagerPrivateRoute path="/mangerchangepassword" component={ManagerNavigation} />

          {/* Candidate */}
          <CandidatePrivateRoute path="/candprofile" component={CandNavigation} />
          <CandidatePrivateRoute path="/canddashboard" component={CandNavigation} />
          <CandidatePrivateRoute path="/candhistory" component={CandNavigation} />
          <CandidatePrivateRoute path="/candsession" component={CandNavigation} />
          <CandidatePrivateRoute path="/sessionroom" component={CandNavigation} />
          <CandidatePrivateRoute path="/editorcreateprofile" component={CandNavigation} />
          <CandidatePrivateRoute path="/candsignin" component={CandSignin} />
          <CandidatePrivateRoute path="/candchangepassword" component={CandNavigation} />
          <CandidatePrivateRoute path="/candchatlayout" component={CandNavigation} />

          <Route path="/editcreateprofile" component={EditCreateProfile} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/resetpassword" component={ResetPassword} />

          {store.dispatch(setPage(""))}
          <Route path="/" component={Home} />

        </Switch>
      </BrowserRouter>
    </Provider>
  )
}


export default App
