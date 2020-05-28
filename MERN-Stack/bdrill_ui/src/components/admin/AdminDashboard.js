import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { YMaps, Map } from 'react-yandex-maps';

import BarChart from '../chart/BarChart'

class AdminDashboard extends Component {
  render() {
    return (

      <BrowserRouter>
        <main>
          <div className="container-fluid">
            <div className="row">
              <div className="col xs12 s12 m6 l9">
                <h1 className="white-text">B-Drill</h1>
                <p className="cyan-text" >
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
                <div className="card-action uicards cardGroup">
                      <div className="row" >
                        <div className="col xs12 s12 m6 l6 center" style={{ padding: '5px' }}>
                          <i className=" large material-icons">network_check</i>
                        </div>
                        <div className="col xs12 s12 m6 l6 center" >
                          <h4 className="white-text" >14</h4>
                          <p> Connections</p>
                          <br />
                        </div>
                    </div>
                </div>
              </div>

              <div className="col xs12 s12 m6 l3">
                <div className="card-action uicards cardGroup">
                      <div className="row" >
                        <div className="col xs12 s12 m6 l6 center" style={{ padding: '5px' }}>
                          <i className=" large material-icons">desktop_windows</i>
                        </div>
                        <div className="col xs12 s12 m6 l6 center" >
                          <h4 className="white-text" >143</h4>
                          <p> Machines </p>
                          <br />
                        </div>
                  </div>
                </div>
              </div>

              <div className="col xs12 s12 m6 l3">
                <div className="card-action uicards cardGroup">
                      <div className="row" >
                        <div className="col xs12 s12 m6 l6 center" style={{ padding: '5px' }}>
                          <i className=" large material-icons">adb</i>
                        </div>
                        <div className="col xs12 s12 m6 l6 center" >
                          <h4 className="white-text" >50</h4>
                          <p> Total Attacks </p>
                          <small>Campaigns + Scenarios</small>
                          <br />
                        </div>
                  </div>
                </div>
              </div>

              <div className="col xs12 s12 m6 l3">
                <div className="card-action uicards cardGroup">
                      <div className="row" >
                        <div className="col xs12 s12 m6 l6 center" style={{ padding: '5px' }}>
                          <i className=" large material-icons">sync</i>
                        </div>
                        <div className="col xs12 s12 m6 l6 center" >
                          <h4 className="white-text" >11</h4>
                          <p> Tactics </p>
                          <br />
                        </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row uicards">
              <div className="col s12 m12 l12">
                <a href="/admintactics"><h5 className=" primary cyan-text"> Tactics</h5></a>
                <div className="row">
                  <div className="col s12 m12 l11 offset-l1">
                    <BarChart />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col s12 m6 l6">
                <div className="card animate fadeLeft uicards">
                  <div className="card-content">
                    <h5 className="card-stats-number"> Users</h5>
                    <hr />
                    <br />

                    <div className="row">
                      <div className="col s8 m8 l8">
                        <i className=" tiny material-icons cyan-text">people</i> Online Users
                      </div>
                      <div className="col s4 m4 l4 center">
                        <p>25</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col s8 m8 l8">
                        <i className=" tiny material-icons cyan-text">business</i> Registered Organizations
                      </div>
                      <div className="col s4 m4 l4 center">
                        <p>14</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col s8 m8 l8">
                        <i className=" tiny material-icons cyan-text">people</i> Registered Managers
                      </div>
                      <div className="col s4 m4 l4 center">
                        <p>45</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col s8 m8 l8">
                        <i className=" tiny material-icons cyan-text">people</i> Registered Candidates
                      </div>
                      <div className="col s4 m4 l4 center">
                        <p>143</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className="col s12 m6 l6">
                <div className="card animate fadeLeft uicards">
                  <div className="card-content">
                    <h5 className="card-stats-number " style={{ fontFamily: "Princess Sofia" }}> Origins</h5>
                    <hr />
                    <br />
                    <YMaps>
                      <div>
                        <Map defaultState={{ center: [69.345116, 30.375320], zoom: 5 }} />
                      </div>
                    </YMaps>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>

      </BrowserRouter>
    )
  }
}

export default AdminDashboard;
