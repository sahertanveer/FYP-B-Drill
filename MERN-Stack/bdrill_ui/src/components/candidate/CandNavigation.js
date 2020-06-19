import React, { Fragment } from 'react'
import { BrowserRouter, Route as RouterLink, Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logout } from '../../actions/authAction'
import { setPage } from '../../actions/pageAction'
import { loadUser } from '../../actions/authAction'

import clsx from 'clsx';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles'
import {
  Icon, Drawer, AppBar, Toolbar, List, CssBaseline, Typography, Divider, IconButton, MenuItem, Menu, Badge,
  ListItem, ListItemIcon, ListItemText, InputBase
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircle from '@material-ui/icons/AccountCircle'

import CandDashboard from './CandDashboard'
import CandProfile from './CandProfile'
import CandSession from './CandSession'
import CandHistory from './CandHistory'
import SessionRoom from './SessionRoom'
import EditCreateProfile from '../profile/EditCreateProfile'
import ChangePassword from '../common/Password/ChangePassword'
import ChatBox from '../common/ChatBox'
import ChatLayout from '../chat/ChatLayout'
import { readNotification } from '../../actions/notificationAction';
import BDrill_logo from'../BDrill_logo.png'

const drawerWidth = 200;

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

const CandNavigation = ({ auth: { isAuthenticated, loading }, logout, setPage, loadUser, readNotification, page: { loadedPage }, notification }) => {
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
      history.push(`/cand${url}`);
      readNotification(id);
      setPage(`cand${url}`)
    }
    else{
    history.push(`/${url}`);
    readNotification(id);
    setPage(url)
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
            <MenuItem> <a href="/candprofile">Profile</a></MenuItem>
            <MenuItem><a href="/canddashboard">My account</a></MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        
        {/* </a> */}
      </li>
    </ul>
  );

  const notificationLink = (
    <ul>
      <li>
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
              const { sender, reciever_role, message, reciever_email, notification_type, url, notification_id, _id } = notif
            return <MenuItem id={_id} onClick={()=> notificationItemClick(url, notification_id)} > {`${notification_type} | ${message}`} </MenuItem> 
           })}
          </Menu>
      </li>
    </ul>
  );


  const guestLink = (
    <ul>
      <li>
        <a href='/candsignin' className="white-text"> <IconButton
          edge="end"
          color="inherit"
        >
          <ChevronRightIcon />
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


  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [ setMobileMoreAnchorEl] = React.useState(null);

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

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }
  // const menuId = 'primary-search-account-menu';
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
  //     <MenuItem onClick={handleMenuClose}>My account</MenuItem>
  //   </Menu>
  // );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  // const renderMobileMenu = (
  //   <Menu
  //     anchorEl={mobileMoreAnchorEl}
  //     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  //     id={mobileMenuId}
  //     keepMounted
  //     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  //     open={isMobileMenuOpen}
  //     onClose={handleMobileMenuClose}
  //   >
  //     <MenuItem>
  //       <IconButton aria-label="show 11 new notifications" color="inherit">
  //         <Badge badgeContent={11} color="secondary">
  //           <NotificationsIcon />
  //         </Badge>
  //       </IconButton>
  //       <p>Notifications</p>
  //     </MenuItem>
  //     <MenuItem onClick={handleProfileMenuOpen}>
  //       <IconButton
  //         aria-label="account of current user"
  //         aria-controls="primary-search-account-menu"
  //         aria-haspopup="true"
  //         color="inherit"
  //       >
  //         <AccountCircle />
  //       </IconButton>
  //       <p>Profile</p>
  //     </MenuItem>
  //   </Menu>
  // );
  // if(!isAuthenticated){
  //   return <Redirect to='/candsignin' />
  //  }

  return (

    <BrowserRouter>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          style={{ backgroundColor: ' #111111' }}   //#AF0303
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
            <div className={classes.sectionDesktop}>
            {!loading && (<Fragment>{isAuthenticated ? notificationLink : null}</Fragment>)}
              
              {/* <IconButton aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="primary">
                  <a href="/candchatlayout">
                    <MailIcon className="white-text" />
                  </a>
                </Badge>
              </IconButton> */}
            </div>
            {!loading && (<Fragment>{isAuthenticated ? authLink : guestLink}</Fragment>)}
            {/* <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}

                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div> */}
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
            <Link to="/canddashboard" className="navlinks">
              {['Dashboard'].map((text, index) => (
                // setComponent('aaa')
                <ListItem button onClick={() => { loadUser(); setPage("canddashboard") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">dashboard</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text}  />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders">
            <Link to="/candprofile" className="navlinks">
              {['Profile'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("candprofile") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">person</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} key={index} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders">
            <Link to="/candhistory" className="navlinks">
              {['History'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("candhistory") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">history</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders">
            <Link to="/candsession" className="navlinks">
              {['Session Room'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("candsession") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">computer</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders">
            <Link to="/candchatlayout" className="navlinks" >
              {['Messenger'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("candchatlayout") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">message</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
          <Divider />
          <List aria-label="main mailbox folders">
            <Link to="/candchangepassword" className="navlinks">
              {['Settings'].map((text, index) => (
                <ListItem button onClick={() => { loadUser(); setPage("candchangepassword") }}>
                  <ListItemIcon>{index === 0 ? <Icon className="white-text">settings_applications</Icon> : null}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </Link>
          </List>
        </Drawer>
        <main 
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })} // `container-fluid ${disability ? "disable-class": ""} `
        >
          {
            loadedPage === 'canddashboard' ? <CandDashboard /> :
              loadedPage === 'candprofile' ? <CandProfile /> :
                loadedPage === 'candhistory' ? <CandHistory /> :
                  loadedPage === 'candsession' ? <CandSession /> :
                    loadedPage === 'sessionroom' ? <SessionRoom /> :
                      loadedPage === 'editorcreateprofile' ? <EditCreateProfile /> :
                        loadedPage === 'candchatlayout' ? <ChatLayout /> :
                          loadedPage === 'candchangepassword' ? <ChangePassword /> :

                            <CandDashboard />
          }
        </main>

        {/* chat box */}
        <div className="chatbox" >
          <ChatBox />
        </div>

      </div>
    </BrowserRouter >
  );
}

CandNavigation.propTypes = {
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

export default connect(mapStateToProps, { logout, setPage, loadUser, readNotification })(CandNavigation)