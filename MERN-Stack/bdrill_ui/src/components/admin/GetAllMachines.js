import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getallmachines, deleteMachine } from '../../actions/adminAuthAction'
import { setAlert } from '../../actions/alertAction'
import Alert from '../../layout/Alert'

class GetAllMachines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayAlert: false,
            search: ''
        }
        this.props.getallmachines();
        this.renderMachineTableData = this.renderMachineTableData.bind(this);
        this.deletemachine = this.deletemachine.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange = (e) => {
        this.setState({ search: e.target.value })
    }

    deletemachine(e) {
        e.preventDefault();
        this.props.deleteMachine(e.currentTarget.value);
        this.props.getallmachines();
    }

    renderMachineTableData() {
        if (this.props.attack.machineFound) {
            const { search } = this.state;
            var FilterMachines = [];
            var searchFilter = search.toLowerCase()
            FilterMachines = this.props.attack.machines.filter(machine => {
                return Object.keys(machine).some(key =>
                    machine[key].toLowerCase().includes(searchFilter)
                );
            })

            return FilterMachines.map((machine) => {
                const { _id, platform, machine_name, architecture } = machine //destructuring
                return (
                    <tr key={_id}>
                        <td className="center">{platform}</td>
                        <td className="center">{machine_name}</td>
                        <td className="center">{architecture}</td>
                        <td className="center">
                            <a href={`/addorupdatemachine?machine_name=${machine_name}`} className="btn btn-primary white-text">
                                <i className=" tiny material-icons white-text"> edit</i>
                            </a>
                            {/* {(e) =>  this.delete(e)} */}
                            <button className="btn btn-danger" value={_id} onClick={(e) => { this.deletemachine(e) }}>
                                <i className=" tiny material-icons white-text"> delete</i>
                            </button>
                        </td>
                    </tr>
                )
            })
        }
    }

    render() {
        return (
            <BrowserRouter>
                <div className="container-fluid">

                    <Alert />

                    <div className="row">
                        <div className="col s12 m12 l12">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content">
                                    <div className="row">
                                        <div className="col s6 m6 l7">
                                            <h5 className="card-stats-number" style={{ fontFamily: "Princess Sofia" }}> Machines</h5>
                                        </div>
                                        <div className="col s1 m1 l1 offset-l1 offset-m1 offset-s1">
                                            <div className="search right" style={{ marginTop: '20%' }}>
                                                <i className="fas fa-search"></i>
                                            </div>
                                        </div>
                                        <div className="col s4 m4 l3">
                                            <input
                                                placeholder="Search…"
                                                inputProps={{ 'aria-label': 'search' }}
                                                value={this.state.search}
                                                onChange={(e) => this.onChange(e)}
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                    <br/>
                                    <div>
                                        <table border="1" className="center">
                                            <thead>
                                                <tr className=" badge-light center">
                                                    <th className="center">Platform</th>
                                                    <th className="center">Machine Name</th>
                                                    <th className="center">Architecture</th>
                                                    <th className="center">Edit/Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderMachineTableData()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

GetAllMachines.propTypes = {
    deleteMachine: PropTypes.func.isRequired,
    getallmachines: PropTypes.func.isRequired,
    attack: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    attack: state.attack,
})

export default (connect(mapStateToProps, { setAlert, deleteMachine, getallmachines })(GetAllMachines))