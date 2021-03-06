import React, { Fragment } from 'react';
import { BrowserRouter, Route as RouterLink, Link, useHistory  } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/authAction'
import { setPage } from '../../actions/pageAction'
import { loadUser } from '../../actions/authAction'

import clsx from 'clsx';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import {
  Icon, Drawer, AppBar, Toolbar, List, CssBaseline, Typography, Divider, IconButton, Badge, MenuItem, Menu,
  ListItem, ListItemIcon, ListItemText
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircle from '@material-ui/icons/AccountCircle';

import ManagerDashboard from './ManagerDashboard'
import AllotedAssignments from './AllotedAssignments'
import ManagerProfile from './ManagerProfile'
import AssignAttack from './AssignAttack'
import AddCandidate from './AddCandidate'
import CandidateList from './CandidateList'
import EditCreateProfile from '../profile/EditCreateProfile'
import GetCandidatesProfiles from './GetCandidatesProfiles'
import UserProfile from '../profiles/UserProfile'
import ChatBox from '../common/ChatBox';
import ChatLayout from '../chat/ChatLayout';
import ChangePassword from '../common/Password/ChangePassword';
import { readNotification } from '../../actions/notificationAction';
import BDrill_logo from'../BDrill_logo.png'

const drawerWidth = 220;

const useStyles = makeStyles(theme => ({

  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  grow: {
    flexGrow: 1,
  },
  logo: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 35,
    marginRight: 20,
    width: '20%',
    height: '45px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(5),
      display: 'flex-box',
      width: 'auto',
      height: '45px',
    },
  },
  title: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'flex-box',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.05),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 15,
    width: '30%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(15),
      width: 'auto',
      maxWidth: '30%',
    },
  },
  searchIcon: {
    width: theme.spacing(50),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    marginLeft: '5%'
  },
  inputRoot: {
    color: 'inherit',
    marginLeft: '30%',
    marginRight: '5%',

  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 220,
      '&:focus': {
        width: 100,
      },
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    backgroundColor: '#1fa398',
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    backgroundColor: '#1fa398',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    backgroundColor: '#1fa398',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1fa398',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(10),
  },
}));

const ManagerNavigation = ({ auth: { isAuthenticated, loading }, logout, loadUser, readNotification, setPage, page: { loadedPage }, notification  }) => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setnotificationAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setnotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setnotificationAnchorEl(null);
  };

  const notificationItemClick = (url, id) => {

    handleNotificationClose()
    if(url === "chatlayout"){
      history.push(`/manager${url}`);
      readNotification(id);
      setPage(`manager${url}`)
    }
    else if(url==="" || !url){
      readNotification(id);
    }
    else{
    history.push(`/${url}`);
    readNotification(id);
    setPage(url.split("?")[0])
  }
    // setPage(url, id);
  };
  

  const authLink = (
    <ul>
      <li>
        {/* <a onClick={logout} href='#!' /> */}
        {/* <a href='/candsignin' className="white-text"> */}
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          color="inherit"
        >
          <AccountCircle />
          </IconButton>
          <Menu
            className="navbar dropdown right"
            /* style = {{top:'-20%', left:'87%'}} */
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem><a href="/managerdashboard">My account</a></MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
       
        {/* </a> */}
      </li>
    </ul>
  );

  const notificationLink = (
    <ul>
      <li>
        {/* <a onClick={logout} href='#!' /> */}
        {/* <a href='/candsignin' className="white-text"> */}
        {/* <IconButton aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={notification && notification.notifications ? notification.notifications.length : 0} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
        <IconButton
         aria-label="notifications"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleNotificationClick}
          color="inherit"
        >
          <Badge badgeContent={notification && notification.notifications ? notification.notifications.length : 0} color="primary">
                  <NotificationsIcon />
                </Badge>
          </IconButton>
          <Menu
            className="navbar dropdown right"
            /* style = {{top:'-20%', left:'87%'}} */
            id="long-menu"
            anchorEl={notificationAnchorEl}
            keepMounted
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{style:{
              maxHeight: 48 * 4.5,
            }}}
          >
           { notification && notification.notifications.map(notif =>{
              const { message, notification_type, url, notification_id, _id } = notif
            return <MenuItem id={_id} onClick={()=> notificationItemClick(url, notification_id)} > {`${notification_type} | ${message}`} </MenuItem> 
           })}
            {/* <MenuItem> <a href="/candprofile">Profile</a></MenuItem>
            <MenuItem><a href="/canddashboard">My account</a></MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem> */}
          </Menu>
        
        {/* </a> */}
      </li>
    </ul>
  );

  
  const guestLink = (
    <ul>
      <li>
        <a href='/managersignin' className="white-text"> <IconButton
          edge="end"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        </a>
      </li>
    </ul>
  );

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  function ListItemLink(props) {
    const { icon, primary, to } = props;

    const renderLink = React.useMemo(
      () =>
        React.forwardRef((itemProps, ref) => (
          <RouterLink to={to} {...itemProps} innerRef={ref} />
        )),
      [to],
    );

    return (
      <li>
        <ListItem button component={renderLink}>
          {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    );
  }

  ListItemLink.propTypes = {
    icon: PropTypes.element,
    primary: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  };

  // const [ setMobileMoreAnchorEl] = React.useState(null);

  // const isMenuOpen = Boolean(anchorEl);
  // const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // function handleProfileMenuOpen(event) {
  //   setAnchorEl(event.currentTarget);
  // }

  // function handleMobileMenuClose() {
  //   setMobileMoreAnchorEl(null);
  // }

  // function handleMenuClose() {
  //   setAnchorEl(null);
  //   handleMobileMenuClose();
  // }

  // function handleMobileMenuOpen(event) {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // }
  // const menuId = 'primary-search-account-menu';
  // const mobileMenuId = 'primary-search-account-menu-mobile';

  return (

    <BrowserRouter>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          style={{ backgroundColor: '#111111' }}   //#AF0303
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <img src={BDrill_logo} alt="B-Drill" className={classes.logo}/>
            <Typography variant="h4" noWrap>
              B-Drill
          </Typography>
            {/* <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div> */}
            <div className={classes.grow} />
            {/* <div className={classes.sectionDesktop}> */}
            {!loading && (<Fragment>{isAuthenticated ? notificationLink : null}</Fragment>)}
     
            {/* </div> */}
            {!loading && (<Fragment>{isAuthenticated ? authLink : guestLink}</Fragment>)}
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
          open={open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose} className="white-text">
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List aria-label="main mailbox folders">
            <Link to="/managerdashboard" className="navlinks">
              {['Dashboard'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("managerdashboard") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">dashboard</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders">
            <Link to="/managerprofile" className="navlinks" >
              {['Profile'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("managerprofile") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">person</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders">
            <Link to="/getcandidatesprofiles" className="navlinks">
              {['User Profiles'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("getcandidatesprofiles") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">people</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders" >
            <Link to="/assignattack" className="navlinks">
              {['Assign Attack'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("assignattack") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">category</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders" >
            <Link to="/candidatelist" className="navlinks">
              {['Candidates'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("candidatelist") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">visibility</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders" >
            <Link to="/allotedassignments" className="navlinks">
              {['Alloted Assignments'].map((text, index) => (
                // setComponent('candsession')
                <ListItem button onClick={() => { loadUser(); setPage("allotedassignments") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">computer</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders" >
            <Link to="/addcandidate" className="navlinks">
              {['Add Candidate'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("addcandidate") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">add</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders">
            <Link to="/managerchatlayout" className="navlinks" >
              {['Messenger'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("managerchatlayout") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">message</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders">
            <Link to="/managerchangepassword" className="navlinks">
              {['Settings'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("managerchangepassword") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">settings_applications</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
        </Drawer>
        <main //id="disability"
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          {
            loadedPage === 'managerdashboard' ? <ManagerDashboard /> :
              loadedPage === 'managerprofile' ? <ManagerProfile /> :
                loadedPage === 'assignattack' ? <AssignAttack /> :
                  loadedPage === 'candidatelist' ? <CandidateList /> :
                    loadedPage === 'allotedassignments' ? <AllotedAssignments /> :
                      loadedPage === 'addcandidate' ? <AddCandidate /> :
                        loadedPage === 'managerchilduserprofile' ? <UserProfile /> :
                          loadedPage === 'editcreateprofile' ? <EditCreateProfile /> :
                            loadedPage === 'getcandidatesprofiles' ? <GetCandidatesProfiles /> :
                              loadedPage === 'managerchatlayout' ? <ChatLayout /> :
                                loadedPage === 'managerchangepassword' ? <ChangePassword /> :
                                  <ManagerDashboard />
          }
        </main>
        <div className="chatbox" >
          <ChatBox />
        </div>

      </div>
    </BrowserRouter>
  );
}

ManagerNavigation.propTypes = {
  logout: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  readNotification: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  page: state.page,
  notification: state.notification
})

export default connect(mapStateToProps, { logout, setPage, loadUser, readNotification })(ManagerNavigation)