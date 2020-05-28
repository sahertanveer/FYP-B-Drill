import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getallplatforms, deletePlatform } from '../../actions/adminAuthAction'
import { setAlert } from '../../actions/alertAction'
import Alert from '../../layout/Alert'

class GetAllPlatforms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayAlert: false,
            search: ''
        }
        this.props.getallplatforms();
        this.renderPlatformTableData = this.renderPlatformTableData.bind(this);
        this.deleteplatform = this.deleteplatform.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange = (e) => {
        this.setState({ search: e.target.value })
    }

    deleteplatform(e) {
        e.preventDefault();
        this.props.deletePlatform(e.currentTarget.value);
        this.props.getallplatforms();
    }

    renderPlatformTableData() {
        if (this.props.attack.platformFound) {
            const { search } = this.state;
            var FilterPlatform = [];
            var searchFilter = search.toLowerCase()
            FilterPlatform = this.props.attack.platforms.filter(platform => {
                return Object.keys(platform).some(key =>
                    platform[key].toLowerCase().includes(searchFilter)
                );
            })

            return FilterPlatform.map((platform) => {
                const { _id, platform_family, platform_name } = platform //destructuring
                return (
                    <tr key={_id}>
                        <td className="center">{platform_family}</td>
                        <td className="center">{platform_name}</td>
                        <td className="center">
                            <button className="btn btn-danger" value={_id} onClick={(e) => { this.deleteplatform(e) }}>
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
                                <div className="card-content ">
                                    <div className="row">
                                        <div className="col s6 m6 l7">
                                            <h5 className="card-stats-number" style={{ fontFamily: "Princess Sofia" }}> Platforms</h5>
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
                                                    <th className="center">Platform Family</th>
                                                    <th className="center">Platform Name</th>
                                                    <th className="center">Edit/Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderPlatformTableData()}
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

GetAllPlatforms.propTypes = {
    deletePlatform: PropTypes.func.isRequired,
    getallplatforms: PropTypes.func.isRequired,
    attack: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    attack: state.attack,
})

export default (connect(mapStateToProps, { setAlert, deletePlatform, getallplatforms })(GetAllPlatforms))