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

export default function OrgViewAttacks() {
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
