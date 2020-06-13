import React, { Component } from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import { logout } from '../../actions/authAction'
import { setPage } from '../../actions/pageAction'
import { sendNotification, getUserEmail } from '../../actions/notificationAction'
import { BackendInstance } from '../../config/axiosInstance';
import Loader from 'react-loader-spinner'
import { setAlert } from '../../actions/alertAction'
import moment from "moment";
import Alert from '../../layout/Alert'
import Axios from 'axios';

const styleObj = {

    marginTop: "20%"
}
const classes = withStyles({
    root: {
        minWidth: 175,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

const muiTheme = createMuiTheme({
    overrides: {
        MuiStepIcon: {
            root: {
                color: '#6b6b6b', // or 'rgba(0, 0, 0, 1)'
                '&$active': {
                    color: '#1fa398',
                },
                '&$completed': {
                    color: '#1fa398',
                },
            },
        },

        MuiStepLabel: {
            label: {
                color: 'white',
                '&$active': {
                    color: 'white'
                },
            },
            
            '&$completed': {
                color: 'white',
            },
        },
    }
});

const useStyles = withStyles((theme) => ({
    root: {
        width: '100%',
        color: '#fff',
        display: 'flex',
    },
   
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));
//   const classes = useStyles();
const bull = <span className={classes.bullet}>•</span>;

class SessionRoom extends Component {

    constructor(props) {
        super(props)
        this.state = {
            inputs: [],
            para: [],
            length: '',
            seconds: 0,
            attack_session_id: null,
            assignment_id: null,
            loading: true,
            start: true,
            end_time: null,
            remaining_time: null,
            session_start_time: null,
            start_time: null,
            isPlaying: true,
            activeStep: 0,
            steps: ['a', 'b', 'c'],
            machine: null
        };
        this.questions = []
        BackendInstance(
            {
                method: 'post',
                url: '/api/attacksessions/checkandgetattacksession',
                data: {
                    user_id: this.props.auth._id
                }
            }
        )
            .then(response => {
                if (response.data.result === "success") {

                    var startTime = moment(new Date());
                    var endTime = moment(new Date(response.data.end_time))
                    var diffTime = moment.duration(endTime.diff(startTime));
                    this.reset = diffTime
                    this.setState({
                        loading: false,
                        attack_session_id: response.data.attack_session_id,
                        assignment_id: response.data.assignment_id,
                        end_time: response.data.end_time,
                        start_time: response.data.start_time,
                        remaining_time: diffTime,
                        session_start_time: response.data.session_start_time,
                        steps: response.data.tactics,
                        machine: response.data.machine_name
                    })
                }
                else {
                    this.props.history.push(`/candsession`)
                    this.props.setPage('candsession')
                }
            })
            .catch(err => {

                this.props.setAlert(err.response.data.msg, 'danger')
                this.props.history.push(`/candsession`)
                this.props.setPage('candsession')

            });
    }

    async getTactics() {
        await BackendInstance(
            {
                method: 'post',
                url: '/api/attacksessions/getattacksessiontactics',
                data: {
                    attack_session_id: this.state.attack_session_id
                }
            }
        )
            .then(response => {
                this.setState({ steps: response.data.tactics })
                if (response.data.tactics.length > 0)
                    this.props.setAlert(response.data.msg, 'success')
            })
            .catch(err => {
                this.props.setAlert(err.response.data.msg, 'danger')
            })
    }




    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1
        }));
        if (this.state.seconds >= 10) {
            this.appendInput();
            if (this.state.steps.length < 1) {
                this.getTactics();
            }
            this.setState(prevState => ({
                seconds: 0
            }));

        }

    }

    componentDidMount() {
        if (this.state.attack_session_id !== null)
            this.appendInput();
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    appendInput = () => {

        BackendInstance(
            {
                method: 'post',
                url: '/api/attacksessions/checknewquestions',
                data: {
                    attack_session_id: this.state.attack_session_id
                }
            }
        )
            .then(response => {
                if (response.data.result === "success") {
                    this.questions = response.data.questions;
                    let questionsLength = this.questions.length;
                    var inputFileds = []
                    var paragraphs = []
                    for (var i = 0; i < questionsLength; i++) {
                        inputFileds.push(React.createRef());
                        paragraphs.push(React.createRef());

                    }
                    this.setState(prevState => ({
                        inputs: prevState.inputs.concat(inputFileds),
                        para: prevState.para.concat(paragraphs),
                        length: questionsLength
                    }));
                    clearInterval(this.interval);
                }
                else
                    console.log("No new Questions.")
            })
            .catch(this.props.setAlert("No Questions available right now! wait a moment", "warning"));

    }

    showFields = () => {

        let children = []

        for (let i = 0; i < this.state.length; i++) {
            children.push(<p className="white-text" key={`id-para-${i}`} ref={this.state.para[i]}>{i + 1}: {this.questions[i]}</p>); //{this.eval_dict.S_05_1089_2.questions[i]}</p>
            children.push(<textarea className="white-text" key={`id-text-${i}`} ref={this.state.inputs[i]}></textarea>)
            if (i === this.state.length - 1)
                children.push(<center key={`id-center-${i}`}>
                    <button key={`id-button-${i}`} onClick={(e) => this.saveAnswers(e)} className="btn btn-success aligh-center white-text">Submit</button></center>
                )
        }

        return (children);

    }

    saveAnswers(event) {

        event.preventDefault();
        let children = []

        for (let i = 0; i < this.state.length; i++) {
            children.push(this.state.inputs[i].current.value)
            // children.push(this.refs[this.state.inputs[i]].value)
        }

        BackendInstance(
            {
                method: 'post',
                url: '/api/attacksessions/saveuseranswers',
                data: {
                    user_answers: children,
                    attack_session_id: this.state.attack_session_id, //'5db2d18298626859a007f8c4'
                    user_id: this.props.auth._id
                }
            }
        ).then(response => {
            if (response.data.result === "success") {
                this.setState(prevState => ({
                    inputs: [],
                    para: [],
                    length: ''

                }));
                this.interval = setInterval(() => this.tick(), 1000);
                this.appendInput();
                this.setState((prevState) => ({ activeStep: prevState.activeStep + 1 }))

            }
        })
            .catch(err => { console.log(err) })



    }
    async endSession() {
        try {
            await BackendInstance({
                method: 'post',
                url: '/api/attacksessions/endsession',//'http://115.186.176.139:5000/api/attacksessions/startattacksession',
                data: {
                    attack_session_id: this.state.attack_session_id,
                    assignment_id: this.state.assignment_id,
                    alloted_start_time: this.state.start_time,
                    alloted_end_time: this.state.end_time,
                    actual_start_time: this.state.session_start_time,
                    actual_end_time: moment(Date.now())
                }
            })

             await Axios({
                method: 'post',
                url: 'https://58.65.201.134:8082/post_command',//'http://115.186.176.139:5000/api/attacksessions/startattacksession',
                data: {
                    command: "end_session",
                    user_id: this.props.auth._id,
                    machine_name: this.state.machine,
                    token: this.props.auth.token
                }
            })
            this.props.setAlert('session ended successfully', "success");
            this.notifyManager(this.props.auth.manager_id);
            this.props.history.push(`/candsession`);
            this.props.setPage('candsession');
        }

        catch (err) { this.props.setAlert(err + ' Session could not be ended!', "danger") };



    }

    
    notifyManager = async (user_id) => {
        
        let result = await this.props.getUserEmail(user_id, "manager")
        if(result.msg==="success"){
            let notificationFields = {}
          notificationFields.sender = this.props.auth.email;
                  notificationFields.url = `managerchilduserprofile?userId=${this.props.auth._id}&role=candidate`;
                  notificationFields.reciever_role = "manager";
                  notificationFields.message = `${this.props.auth.email} has ended his session.`;
                  notificationFields.reciever_email = result.email;
                  notificationFields.notification_type = "Assignment";
          this.props.sendNotification(notificationFields)
        }
        
      }



    renderTime = (value) => {
        var dur = moment.duration(value, 'seconds')

        // var start = moment(new Date);
        // var end =  moment(new Date(this.state.end_time))
        // var diff =  moment.duration(end.diff(start));


        if (value === 0) {

            return <div className="timer">Too lale...</div>;
        }
        return (
            <div className="timer">
                {/* <div className="text">Remaining</div> */}
                <h5 className="value">{dur.get('d') < 10 ? `0${dur.get('d')}` : dur.get('d')} <small>: days</small></h5>
                <h5 className="value">{dur.get('h') < 10 ? `0${dur.get('h')}` : dur.get('h')} <small>: hours</small></h5>
                <h5 className="value">{dur.get('m') < 10 ? `0${dur.get('m')}` : dur.get('m')} <small>: minute</small></h5>
                <h5 className="value">{dur.get('s') < 10 ? `0${dur.get('s')}` : dur.get('s')} <small>: seconds</small></h5>

            </div>
        );
    };

    renderStepper = () => {
        return (
            <div className={useStyles.root}>
            <MuiThemeProvider theme={muiTheme}> 
                <Stepper activeStep={this.state.activeStep} style={{backgroundColor:'#111111', color:'white'}}>
                    {this.state.steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label}  {...stepProps} >
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </MuiThemeProvider>
            </div>
        )
    }


    renderTimer = () => {
        return (
            <div className="center">
                <br></br>
                <h5 className="task-card-title mb-3" style={{ fontFamily: "Princess Sofia" }}>
                    Remaining Time
                </h5>
                <CountdownCircleTimer
                    size={250}
                    onComplete={() => {
                        this.endSession();
                        return [false]// [true, 0]; // repeat animation in 1.5 seconds
                    }}
                    isPlaying={this.state.isPlaying}
                    durationSeconds={this.state.remaining_time.asSeconds()}
                    // parseInt( moment.duration(moment(new Date(this.state.end_time)).diff(moment(new Date))).get("s"))
                    colors={[["#1ddce2", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
                    renderTime={(value) => this.renderTime(value)}
                />

            </div>

        )
    }

    render() {
        return (
            <BrowserRouter>
                {this.state.loading ? (
                    <center><div style={styleObj}> <Loader color="#00BFFF" height={100} width={100} timeout={0} /> </div></center>) : (
                        <div className="container-fluid">
                            <div className="row">
                                <div className=" col s12 m12 l12">

                                    <aside className="card animate fadeLeft uicards">
                                        <div className="card-content">
                                            {/* <div className="postergrad badge-light">
                                                <h5 className="task-card-title white-text center" style={{ fontFamily: "Princess Sofia" }}>Read Carefully</h5>
                                            </div> */}
                                            <div className="row ">
                                                <div className="col s12 m12 l12">
                                                    <h5 style={{ fontFamily: "Princess Sofia" }}>Constraints</h5>
                                                    <hr />
                                                    <CardContent>
                                                        <Typography >
                                                            {bull} Machine will not be available after session is ended or session time expires.
                                                            </Typography>
                                                        <br></br>
                                                        <Typography >
                                                            {bull} At a time single scenario can be answered and answer cannot be changed once submitted.
                                                            </Typography>
                                                        <br></br>
                                                        <Typography >
                                                            {bull} Once a scenario is submitted, it will not be displayed again.
                                                            </Typography>
                                                        <br></br>
                                                        <Typography >
                                                            {bull} You cannot skip a scenario, if you want to move to another scenario, you have to submit it empty.
                                                            </Typography>
                                                        <br></br>
                                                        <Typography>
                                                            {bull} Answers for a scenario is considered (for evaluation or  marking) once it is submitted.
                                                            </Typography>
                                                    </CardContent>
                                                </div>
                                            </div>
                                        </div>
                                    </aside>

                                    <aside className=" card animate fadeLeft uicards" style={{padding:'10px'}}>
                                        <div className="card-content badge-light">
                                            <h5 className="task-card-title mb-3 white-text center">The Clock is Ticking!!!</h5>
                                        </div>
                                        <div className="row">
                                            <div className="col s12 m12 l4">
                                                <br/>
                                                <Card className={classes.root}>
                                                    <CardContent className="uicards1">
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            Actual Starting time:
                                                            </Typography>
                                                        <Typography variant="h5" component="h2">
                                                            {bull} {moment(new Date(this.state.start_time)).format('D MMM YYYY , h:mm:ss:A')}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                                <br/>
                                                <Card className={classes.root}>
                                                    <CardContent className="uicards2">
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            Actual Ending time:
                                                            </Typography>
                                                        <Typography variant="h5" component="h2">
                                                            {bull} {moment(new Date(this.state.end_time)).format('D MMM YYYY , h:mm:ss:A')}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                                <br/>
                                                <Card className={classes.root}>
                                                    <CardContent className="uicards3">
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            Session Started At:
                                                            </Typography>
                                                        <Typography variant="h5" component="h2">
                                                            {bull} {moment(new Date(this.state.session_start_time)).format('D MMM YYYY , h:mm:ss:A')}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <div className="col s12 m12 l4">
                                                {this.renderTimer()}
                                            </div>

                                            <div className="col s12 m12 l4">
                                                <br/>
                                                <Card className={classes.root}>
                                                    <CardContent className="grey darken-3 white-text">
                                                        <h5 className="task-card-title mb-3" style={{ fontFamily: "Princess Sofia" }}>
                                                            End your current session
                                                        </h5>

                                                        <br></br>
                                                        <Typography className={classes.title} color="white" gutterBottom>
                                                            {bull} End your session if you have solved all attacks.
                                                            <center>or</center>
                                                            {bull} You don't want to continue anymore.
                                                            <br></br>
                                                            <br></br>
                                                            {bull} Remember! you will loose marks if all scenarios are not attempted.
                                                        </Typography>
                                                        <br></br>
                                                        <center> <button className="btn btn-light" onClick={() => this.endSession()}>End Session</button> {/*onClick={this.stopTimer.bind(this)}*/}
                                                        </center>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                        {this.state.steps.length === 1 ?
                                            <div className="row">
                                                <div className="col s5 m5 l5"> </div>
                                                <div className="col s2 m2 l2">
                                                    {this.renderStepper()}
                                                </div>
                                                <div className="col s5 m5 l5"> </div>
                                            </div>
                                            :
                                            <div className="uicards1">
                                                {this.renderStepper()}
                                            </div>
                                        }
                                        <div>
                                            {this.state.activeStep === this.state.steps.length ? (
                                                <div>
                                                    <Typography className={useStyles.instructions}>
                                                        <center>{this.state.steps.length === 0 ? "Wait for scenarios to load." : "All scenarios completed - you're done with your session."}</center>
                                                    </Typography>
                                                </div>
                                            ) : (
                                                    <div>
                                                        <br/>
                                                        <center>
                                                            <Typography className={classes.title} color="white" gutterBottom>
                                                                {`Ongoing Tactic : ${this.state.steps[this.state.activeStep]}`}
                                                            </Typography>
                                                        </center>
                                                        <div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </aside>

                                    <aside className="card animate fadeLeft uicards">
                                        <div className="card-content">
                                            <div className="row">
                                                <div className="col s12 m8 l8">
                                                    <CardContent>
                                                        <h5 className="task-card-title mb-3" style={{ fontFamily: "Princess Sofia" }}>Guidelines</h5>
                                                        <hr />
                                                        <br />
                                                        <Typography>
                                                            {bull} Please read carefully each question as there will be some restrictions (e.g Case sensitivity)
                                                        </Typography>

                                                        <Typography>
                                                            {bull} You can access the machine by clicking on the Web Console Image
                                                        </Typography>

                                                        <Typography>
                                                            {bull} You can get track of attack execution by the stepper below the timer.
                                                        </Typography>

                                                    </CardContent>
                                                    <CardContent>
                                                        <h5 className="task-card-title mb-3" style={{ fontFamily: "Princess Sofia" }}>Marking Criteria</h5>
                                                        <hr />
                                                        <br />
                                                        <Typography>
                                                            {bull} 75% weightage of question answers.
                                                        </Typography>

                                                        <Typography>
                                                            {bull} 25% weightage of how much time you saved
                                                        </Typography>

                                                        <Typography>
                                                            {bull} if your session duration exceeds 75% of the alloted time, you time weightage will be marked 0
                                                        </Typography>

                                                        <Typography>
                                                            {bull} If a scenario is repeated (that you hve solved previously), marks will be deducted according try count.
                                                        </Typography>

                                                    </CardContent>
                                                </div>
                                                <div className="col s12 m4 l4">
                                                    <br />
                                                    <br />
                                                    <br />
                                                    <Card className={classes.root}>
                                                        <CardContent className="uicards_card5">
                                                            <br />
                                                            <br />
                                                            <Typography variant="h5" component="h5" style={{ fontFamily: "Princess Sofia" }}>
                                                                <center>Web Console</center>
                                                            </Typography>
                                                            <div className="screen center">
                                                                <br />
                                                                <a href={this.state.machine !== null ? `http://58.65.201.134/WebMKS_SDK_2.1.0/index.html?machine=${this.state.machine}&userId=${this.props.auth._id}&token=${this.props.auth.token}` : ""} target="_blank" rel="noopener noreferrer">
                                                                    <img src="https://static.thenounproject.com/png/3281-200.png" className="center cmp1" alt="" style={{ height: '100px', width: '100px' }}></img></a>

                                                                <br />
                                                            </div>
                                                            <Typography className={classes.title} gutterBottom>
                                                                <center>Click on computer icon to open Web console</center>
                                                                <br></br>
                                                            </Typography>
                                                        </CardContent>

                                                    </Card>
                                                </div>
                                            </div>
                                        </div>
                                    </aside>
                                </div>
                            </div>
                            <Alert />
                            <div className="row">
                                <div className=" col s12 m12 l12">
                                    <div className="collection with-header card animate fadeLeft uicards">
                                        <div className="card-content badge-light">
                                            <h5 className="task-card-title mb-2 white-text" style={{ fontFamily: "Princess Sofia" }}>Questions</h5>
                                            <small className="white-text">Answer every Question</small>
                                        </div>
                                        <div className="questionare" style={{ margin: "20px" }}>
                                            <div className="control-group">
                                                <div id="dynamicInput">
                                                    <form action="" id="evaluation-form" className="questionare" style={{ margin: "20px" }}>
                                                        {this.showFields()}
                                                    </form>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </BrowserRouter>
        )
    }
}
SessionRoom.propTypes = {
    logout: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    sendNotification: PropTypes.func.isRequired,
    getUserEmail: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    page: state.page
})

export default withRouter(connect(mapStateToProps, { logout, setAlert, setPage, sendNotification, getUserEmail  })(SessionRoom))



