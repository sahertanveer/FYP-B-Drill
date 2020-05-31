import React from 'react'
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons'
import comsatslogo from './comsatslogo.png'
import HomeLoginCards from './HomeLoginCards'
import logo2 from './logo2.PNG'

// Little helpers ...
const url = (name, wrap = false) => `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`
const Pink = ({ children }) => <span style={{ color: '#FF6AC1' }}>{children}</span>
const Yellow = ({ children }) => <span style={{ color: '#EFF59B' }}>{children}</span>
const Lightblue = ({ children }) => <span style={{ color: '#9AEDFE' }}>{children}</span>
const Green = ({ children }) => <span style={{ color: '#57EE89' }}>{children}</span>
const Blue = ({ children }) => <span style={{ color: '#57C7FF' }}>{children}</span>
const Gray = ({ children }) => <span style={{ color: '#909090' }}>{children}</span>



class Home extends React.Component {
    render() {
        return (
            <Parallax ref={ref => (this.parallax = ref)} pages={4}>

                <ParallaxLayer offset={0} speed={1} style={{ backgroundColor: '#32325d' }} />
                <ParallaxLayer offset={1} speed={1} style={{ backgroundColor: '#805E73' }} />
                <ParallaxLayer offset={2} speed={1} style={{ backgroundColor: '#87BCDE' }} />
                <ParallaxLayer offset={3} speed={1} style={{ backgroundColor: '#909090' }} />
                <ParallaxLayer offset={3.7} speed={1} style={{ backgroundColor: '#000000' }} />

                <ParallaxLayer offset={0} speed={0} factor={3} style={{ backgroundImage: url('stars', true), backgroundSize: 'cover' }} />
                <ParallaxLayer offset={1} speed={0} factor={3} style={{ backgroundImage: url('stars', true), backgroundSize: 'cover' }} />
                <ParallaxLayer offset={2} speed={0} factor={3} style={{ backgroundImage: url('stars', true), backgroundSize: 'cover' }} />
                <ParallaxLayer offset={3} speed={0} factor={3} style={{ backgroundImage: url('stars', true), backgroundSize: 'cover' }} />
                <ParallaxLayer offset={4} speed={0} factor={3} style={{ backgroundImage: url('stars', true), backgroundSize: 'cover' }} />
        
                <ParallaxLayer offset={0.6} speed={0.5} style={{ opacity: 0.5 }}>
                    <img src={url('satellite3')} style={{ display: 'block', width: '10%', marginLeft: '10%' }} />
                </ParallaxLayer>

                <ParallaxLayer offset={0.0} speed={0.5} style={{ opacity: 0.4 }}>
                    <img src={url('satellite')} style={{ display: 'block', width: '20%', marginLeft: '80%' }} />
                </ParallaxLayer>

                <ParallaxLayer offset={1.1} speed={-0.3} style={{ opacity: 0.4, pointerEvents: 'none' }}>
                    <img src={url('logo')} style={{ width: '25%', marginLeft: '65%' }} />
                </ParallaxLayer>

                <ParallaxLayer offset={1.6} speed={0.2} style={{ opacity: 0.4 }}>
                    <img src={url('cloud')} style={{ display: 'block', width: '10%', marginLeft: '1%' }} />
                </ParallaxLayer>

                <ParallaxLayer offset={2.1} speed={-0.1} style={{ opacity: 0.4 }}>
                    <img src={url('satellite4')} style={{ display: 'block', width: '9%', marginLeft: '12%' }} />
                </ParallaxLayer>

                <ParallaxLayer offset={2.8} speed={-0.1} style={{ opacity: 0.4 }}>
                    <img src={url('bash')} style={{ display: 'block', width: '10%', marginLeft: '80%' }} />
                </ParallaxLayer>

                <ParallaxLayer offset={3.7} speed={0.4} style={{ opacity: 0.2 }}>
                    <img src={url('earth')} style={{ display: 'block', width: '20%', marginLeft: '5%' }} />
                </ParallaxLayer>

                <ParallaxLayer
                    offset={0}
                    speed={0.1}
                    onClick={() => this.parallax.scrollTo(1)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* <img src={url('server')} style={{ width: '20%' }} /> */}
                    {/* <img src= {logo2} style={{alignContent: "left", width: '80px', marginTop: "-46%",}}/> */}
                    <div className="row" style={{ marginTop: "15%", marginBottom: "18%" }}>
                        <div className="col s12 m12 l12">
                            <div className="header center">
                                <h1 className="white-text center" style={{ fontFamily: "Princess Sofia", fontSize: "84px" }}>B-Drill</h1>
                                <p className="white-text center">We give wings to your skills, you decide where to fly...</p>
                            </div>
                        </div>
                    </div>
                </ParallaxLayer>

                <ParallaxLayer
                    offset={1}
                    speed={0.1}
                    onClick={() => this.parallax.scrollTo(1)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="row">
                        <div className="col s12 m12 l12 ">
                            <h3 className="white-text center" style={{ fontFamily: "Princess Sofia" }}>Login Panels</h3>
                        </div>
                        <br/>
                        <br/>
                        <div className="col s12 m12 l12 ">
                            <HomeLoginCards />
                            <p className="white-text center">Click on card to navigate to other Panels. </p>
                        </div>
                    </div>
                </ParallaxLayer>

                <ParallaxLayer
                    offset={2}
                    speed={0}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => this.parallax.scrollTo(3)}>
                    <div className="row">
                        <div className="col s12 m12 l12 ">
                            <h3 className="white-text center" style={{ fontFamily: "Princess Sofia" }}>Sponsors</h3>
                        </div>
                        <br/>
                        <br/>

                        <div className="row">
                            <div className="col s5 m3 l3 offset-m2 offset-l2 center">
                                <img src="https://infosecurity.com.pk/images/other/RNDProtfolioLogo.png"
                                    className="applogo" alt="logo" />
                            </div>
                            <div className="col s3 m2 l2 center" >
                                <img src={comsatslogo}
                                    className="applogo" alt="logo" />
                            </div>

                            <div className="col s4 m3 l3 center">
                                <img src="https://infosecurity.com.pk/images/other/TrilliumLogo.png"
                                    className="applogo" alt="logo" />
                            </div>
                        </div>
                    </div>
                </ParallaxLayer>

                <ParallaxLayer
                    offset={3}
                    speed={0}
                    style={{ display: 'flex' }}
                    onClick={() => this.parallax.scrollTo(4)}>
                    <div className="row ">
                        <div className="col s12 m12 l12 ">
                            <h3 className="white-text center" style={{ fontFamily: "Princess Sofia" }}>About B-Drill</h3>
                            <p className=" white-text justify" style={{ marginLeft: "15px", marginRight: "15px" }}>
                                We will provide a simulated environment which will represent the SDN (software defined network)
                                infrastructure which we will call Cyber Range.  Our system will automatically create different
                                dynamic attack scenarios (which will change according to user’s performance) for the user in Cyber Range.
                                Our system will provide reward-based learning and assessment for individual professionals, who want to
                                train themselves. Also, an organization can also test skills of a professional, who wants to be hired.
                                    It will provide real-time feedback. So, our automatic simulations are limited to: <br />
                                • Attack scenarios <br />
                                • Organizational network (Cyber Range)<br />
                                Automated attack system will simulate a wide range of malicious activities. Which will be according
                                to MITRE ATTACK framework (TTP’s “Tactic, Techniques and Procedure”). During the training session,
                                user activities monitoring will be done. After the training session, user profiling (on the basis of monitored
                                    data) will be done which will assess the capabilities of that person.<br />

                                Our system does not include organization’s cyber security capability evaluation, but only that of a
                                security professional. Therefore, our system will never replicate an organization network
                                infrastructure.
                                <br />
                                <br />
                            </p>
                        </div>
                    </div>
                </ParallaxLayer>

                <ParallaxLayer
                    offset={3.75}
                    speed={0}
                    style={{ display: 'flex' }}
                    onClick={() => this.parallax.scrollTo(0)}>
                    <div className="row">
                        <div className="footer">
                            <div className="center col s12 m4 l4">
                                <div className=" text white-text">
                                    <h5>Reach Us </h5>
                                    <i className="tiny material-icons">location_on</i> COMSATS University,
                                Park Road, Tarlai Kalan, <br />Islamabad, Pakistan
                            </div>
                            </div>
                            <div className="center col s12 m4 l4">
                                <div className=" text white-text ">
                                    <h5>Contact Us</h5>
                                    <i className="tiny material-icons">mail</i> Email:
                                <a href="mailto:bdrill634@gmail.com">bdrill634@gmail.com</a><br />
                                    <i className="tiny material-icons">local_phone</i> Phone: +92-51-9247000-9247002<br />
                                    +92-51-9049802<br />
                                </div>
                            </div>

                            <div className="center col s12 m4 l4">
                                <div className=" text white-text">
                                    <h5>Social</h5>
                                    <i className="fab fa-facebook"></i> Facebook:
                                <a href="mailto:bdrill634@gmail.com">bdrill634@gmail.com</a><br />
                                    <i className="fab fa-twitter"></i> Twitter:
                                <a href="mailto:bdrill634@gmail.com">bdrill634@gmail.com</a><br />
                                </div>
                            </div>
                        </div>
                    </div>
                </ParallaxLayer>
            </Parallax>
        )
    }
}





// import React, { Component } from 'react';
// import { BrowserRouter, Route, Link } from 'react-router-dom'
// import Particles from '../components/common/Particles'

// import comsatslogo from './comsatslogo.png'
// import CandSignin from './candidate/CandSignin'
// import AdminSignin from './admin/AdminSignin'
// import ManagerSignin from './manager/ManagerSignin'
// import OrgSignin from './organization/OrgSignin'
// import DoughnutChart from './chart/DoughnutChart'

// class Home extends Component {
//     render() {

//         return (
//             <BrowserRouter>
//                 <Route path="/candsignin" component={CandSignin} />
//                 <Route path="/adminsignin" component={AdminSignin} />
//                 <Route path="/managersignin" component={ManagerSignin} />
//                 <Route path="/orgsignin" component={OrgSignin} />

//                 <div className="container-fluid">

//                     <div className="particles" style={{ zIndex: 9996, position: 'fixed', opacity: '0.8', }}>
//                         <Particles />
//                     </div>

//                     <div className="mainbody" style={{ zIndex: 9999, position: 'relative', opacity: '1' }}>
//                         {/* <nav className="nav-wrapper red darken-4 ">
//                             <div className="container">
//                                 <a href="/" className="left brand-logo">B-Drill</a>

//                                 <ul className="right">
//                                     <li><Link to="/about">About</Link></li>
//                                     <li><Link to="/contact">Contact</Link></li>
//                                 </ul>
//                             </div>
//                         </nav> */}

//                         <div className="row" style={{ marginTop: "15%", marginBottom: "18%" }}>
//                             <div className="col s12 m12 l12">
//                                 <div className="header center">
//                                     <h1 className="white-text center" style={{ fontFamily: "Princess Sofia", fontSize: "84px" }}>B-Drill</h1>
//                                     <p className="white-text center">We give wings to your skills, you decide where to fly...</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <hr />

//                         <div className="row">
//                             <div className="col s12 m6 l3 ">
//                                 <div className="card animate fadeLeft" style={{ borderRadius: "12px" }}>
//                                     <div className="card-content lime darken-3 white-text">
//                                         <h5 className="card-stats-number white-text center">Admin Panel</h5>
//                                         <p className="card-stats-compare center">
//                                             <small className=" text text-lighten-5">Login as Admin</small>
//                                         </p>
//                                     </div>
//                                     <div className="card-action lime darken-4">
//                                         <div id="clients-bar" className="center-align">
//                                             <div className="cardGroup3">
//                                                 <a href="/adminsignin" className="btn btn-info">Click Me</a>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="col s12 m6 l3">
//                                 <div className="card animate fadeLeft">
//                                     <div className="card-content brown darken-1 white-text">
//                                         <h5 className="card-stats-number white-text center">Candidate Panel</h5>
//                                         <p className="card-stats-compare center">
//                                             <small className=" text text-lighten-5">Login as Candidate</small>
//                                         </p>
//                                     </div>
//                                     <div className="card-action brown darken-4">
//                                         <div id="clients-bar" className="center-align">
//                                             <div className="cardGroup3">
//                                                 <a href="/candsignin" className="btn btn-info">Click Me</a>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="col s12 m6 l3 ">
//                                 <div className="card animate fadeLeft" style={{ borderRadius: "12px" }}>
//                                     <div className="card-content green darken-1 white-text">
//                                         <h5 className="card-stats-number white-text center">Manager Panel</h5>
//                                         <p className="card-stats-compare center">
//                                             <small className=" text text-lighten-5">Login as Manager</small>
//                                         </p>
//                                     </div>
//                                     <div className="card-action green darken-4">
//                                         <div id="clients-bar" className="center-align">
//                                             <div className="cardGroup3">
//                                                 <a href="/managersignin" className="btn btn-info">Click Me</a>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="col s12 m6 l3 ">
//                                 <div className="card animate fadeLeft" style={{ borderRadius: "12px" }}>
//                                     <div className="card-content cyan darken-3 white-text">
//                                         <h5 className="card-stats-number white-text center">Organization Panel</h5>
//                                         <p className="card-stats-compare center">
//                                             <small className=" text text-lighten-5">Login as Organization</small>
//                                         </p>
//                                     </div>
//                                     <div className="card-action cyan darken-4">
//                                         <div id="clients-bar" className="center-align">
//                                             <div className="cardGroup3">
//                                                 <a href="/orgsignin" className="btn btn-info">Click Me</a>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="row grey">
//                             <div className="col s12 m12 l12 ">
//                                 <h3 className="white-text center" style={{ fontFamily: "Princess Sofia" }}>Sponsors</h3>
//                             </div>

//                             <div className="row">
//                                 <div className="col s5 m3 l3 offset-m2 offset-l2 center">
//                                     <img src="https://infosecurity.com.pk/images/other/RNDProtfolioLogo.png"
//                                         className="applogo" alt="logo" />
//                                 </div>
//                                 <div className="col s3 m2 l2 center" >
//                                     <img src={comsatslogo}
//                                         className="applogo" alt="logo" />
//                                 </div>

//                                 <div className="col s4 m3 l3 center">
//                                     <img src="https://infosecurity.com.pk/images/other/TrilliumLogo.png"
//                                         className="applogo" alt="logo" />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="row">
//                             <div className="col s4 m4 l4">
//                                 <DoughnutChart />
//                                 <h3 className="red-text bold center" style={{ fontFamily: "Arial" }}>Users</h3>
//                             </div>
//                             <div className="col s4 m4 l4">
//                                 <DoughnutChart />
//                                 <h3 className="red-text bold center" style={{ fontFamily: "Arial" }}>Machines</h3>
//                             </div>
//                             <div className="col s4 m4 l4">
//                                 <DoughnutChart />
//                                 <h3 className="red-text bold center" style={{ fontFamily: "Arial" }}>Tactics</h3>
//                             </div>
//                         </div>

//                         <div className="row teal darken-3 ">
//                             <div className="col s12 m12 l12 ">
//                                 <h3 className="white-text center" style={{ fontFamily: "Princess Sofia" }}>About B-Drill</h3>
//                                 <p className=" white-text justify" style={{ marginLeft: "15px", marginRight: "15px" }}>
//                                     We will provide a simulated environment which will represent the SDN (software defined network)
//                                     infrastructure which we will call Cyber Range.  Our system will automatically create different
//                                     dynamic attack scenarios (which will change according to user’s performance) for the user in Cyber Range.
//                                     Our system will provide reward-based learning and assessment for individual professionals, who want to
//                                     train themselves. Also, an organization can also test skills of a professional, who wants to be hired.
//                                     It will provide real-time feedback. So, our automatic simulations are limited to: <br />
//                                     • Attack scenarios <br />
//                                     • Organizational network (Cyber Range)<br />
//                                     Automated attack system will simulate a wide range of malicious activities. Which will be according
//                                     to MITRE ATTACK framework (TTP’s “Tactic, Techniques and Procedure”). During the training session,
//                                     user activities monitoring will be done. After the training session, user profiling (on the basis of monitored
//                                     data) will be done which will assess the capabilities of that person.<br />

//                                     Our system does not include organization’s cyber security capability evaluation, but only that of a
//                                     security professional. Therefore, our system will never replicate an organization network
//                                     infrastructure.
//                                 <br />
//                                 <br />
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="row">
//                             <div className="footer">
//                                 <div className="center col s12 m4 l4">
//                                     <div className=" text white-text">
//                                         <h5>Reach Us </h5>
//                                         <i className="tiny material-icons">location_on</i> COMSATS University,
//                                 Park Road, Tarlai Kalan, <br />Islamabad, Pakistan
//                             </div>
//                                 </div>
//                                 <div className="center col s12 m4 l4">
//                                     <div className=" text white-text ">
//                                         <h5>Contact Us</h5>
//                                         <i className="tiny material-icons">mail</i> Email:
//                                 <a href="mailto:bdrill634@gmail.com">bdrill634@gmail.com</a><br />
//                                         <i className="tiny material-icons">local_phone</i> Phone: +92-51-9247000-9247002<br />
//                                         +92-51-9049802<br />
//                                     </div>
//                                 </div>

//                                 <div className="center col s12 m4 l4">
//                                     <div className=" text white-text">
//                                         <h5>Social</h5>
//                                         <i className="fab fa-facebook"></i> Facebook:
//                                 <a href="mailto:bdrill634@gmail.com">bdrill634@gmail.com</a><br />
//                                         <i className="fab fa-twitter"></i> Twitter:
//                                 <a href="mailto:bdrill634@gmail.com">bdrill634@gmail.com</a><br />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </BrowserRouter>
//         );
//     }
// }

export default Home;





