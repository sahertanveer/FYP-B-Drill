import React, { Component } from 'react'
import { BrowserRouter, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addorupdateattack, getallplatforms } from '../../actions/adminAuthAction'
import { setAlert } from '../../actions/alertAction'
import Alert from '../../layout/Alert'
import { BackendInstance } from '../../config/axiosInstance';
import queryString from 'query-string'

class AddorUpdateAttack extends Component {
    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.location.search)
        this.state = {
            procedure_name: '',
            tactic_name: '',
            showMenuCategory: false,
            showMenuPlatform: false,
            technique_name: '',
            platform: 'Select Platform',
            procedure_id: values.procedureId,
            category: 'Scenario'
        }

        this.props.getallplatforms();
        this.showMenuPlatform = this.showMenuPlatform.bind(this);
        this.closeMenuPlatform = this.closeMenuPlatform.bind(this);
        this.selectPlatform = this.selectPlatform.bind(this);
        this.showMenuCategory = this.showMenuCategory.bind(this);
        this.closeMenuCategory = this.closeMenuCategory.bind(this);
        this.selectCategory = this.selectCategory.bind(this);

        if (values.procedureId) {
            this.getAttack()
        }

    }

    async getAttack() {

        try {
            const res = await BackendInstance({
                method: 'post',
                url: '/api/attackinventory/getscenariosfromid',
                data: {
                    procedure_id: this.state.procedure_id//'5db080230b62e76104bdd4bd'
                }
            })

            if ((res.data.attacks).length === 1) {
                this.setState({
                    tactic_name: res.data.attacks[0].tactic_name,
                    technique_name: res.data.attacks[0].technique_name,
                    procedure_name: res.data.attacks[0].procedure_name,
                    platform: res.data.attacks[0].platform,
                    category: res.data.attacks[0].category
                },
                )

            }


        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {

                errors.forEach(error => { (setAlert(error.msg, 'danger')) })
            }

        }

    };
    // const { procedure_id, procedure_name, tactic_name, technique_name, platform } = formData;

    onChange = e =>
        this.setState({ [e.target.name]: e.target.value })
        
    // setFormData({ ...formData, [e.target.name]: e.target.value })

    onSubmit = e => {
        e.preventDefault()
        this.props.addorupdateattack(this.state);
    }

    selectPlatform(event) {
        event.preventDefault();
        this.setState({ platform: event.target.innerText })

    }

    closeMenuPlatform() {
        this.setState({ showMenuPlatform: false }, () => {
            document.removeEventListener('click', this.closeMenuPlatform);
        });
    }

    showMenuPlatform(event) {
        event.preventDefault();
        this.setState({ showMenuPlatform: true }, () => {
            document.addEventListener('click', this.closeMenuPlatform);
        });
    }

    selectCategory(event) {
        event.preventDefault();
        this.setState({ category: event.target.innerText })

    }

    closeMenuCategory() {
        this.setState({ showMenuCategory: false }, () => {
            document.removeEventListener('click', this.closeMenuCategory);
        });
    }

    showMenuCategory(event) {
        event.preventDefault();

        this.setState({ showMenuCategory: true }, () => {
            document.addEventListener('click', this.closeMenuCategory);
        });
    }

    //Redirect if added 
    componentDidUpdate() {
        if (this.props.attackAddedorUpdated) {
            return setAlert(' Attack added ', ' light ')
        }

    }
    render() {
        return (
            <BrowserRouter>
                <div className="container-fluid uicards">
                    <div className="row">
                        <div className="col s12 m8 l8 offset-m2 offset-l2">
                            <h5 className="card-stats-number" style={{ fontFamily: "Princess Sofia" }}> Attacks</h5>
                            <hr />
                            <Alert />
                            <br />
                            <form onSubmit={this.onSubmit} className="center container ">

                                <div className="form-group center">
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <h6 htmlFor="category">Category:</h6>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <button className="btn success center " onClick={this.showMenuCategory}>
                                                {this.state.category} <i className="tiny material-icons">arrow_drop_down</i>
                                            </button>
                                            {
                                                this.state.showMenuCategory
                                                    ? (
                                                        <div className="menu" ref={(element) => {
                                                            this.dropdownMenu = element;
                                                        }}>
                                                            <ul>
                                                                <div className="collection black-text">
                                                                    <li className="collection-item black-text" onClick={this.selectCategory}>Scenario</li>
                                                                    <li className="collection-item black-text" onClick={this.selectCategory}>Campaign</li>
                                                                </div>
                                                            </ul>
                                                        </div>
                                                    )
                                                    : (
                                                        null
                                                    )
                                            }
                                        </div>
                                    </div>
                                </div>


                                <div className="form-group center">
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <h6 htmlFor="procedure_id">{this.state.category === "Scenario" ? "Procedure Id:" : "Campaign Id"}</h6>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <input
                                                type="text"
                                                className="form-control   "
                                                name="procedure_id"
                                                placeholder={this.state.category === "Scenario" ? "Procedure Id" : "Campaign Id"}
                                                value={this.state.procedure_id}
                                                onChange={e => this.onChange(e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="form-group   center">
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <h6 htmlFor="procedure_name">{this.state.category === "Scenario" ? "Procedure Name:" : "Campaign Name"}</h6>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <input
                                                type="text"
                                                className="form-control   "
                                                name="procedure_name"
                                                placeholder={this.state.category === "Scenario" ? "Procedure Name" : "Campaign Name"}
                                                value={this.state.procedure_name}
                                                onChange={e => this.onChange(e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {this.state.category === "Scenario" ?
                                    <div>
                                        <div className="form-group   center">
                                            <div className="row">
                                                <div className="col s12 m4 l3">
                                                    <h6 htmlFor="procedure_name">Tactic Name:</h6>
                                                </div>
                                                <div className="col s12 m8 l9">
                                                    <input
                                                        type="text"
                                                        className="form-control   "
                                                        name="tactic_name"
                                                        placeholder="Tactic Name *"
                                                        value={this.state.tactic_name}
                                                        onChange={e => this.onChange(e)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col s12 m4 l3">
                                                    <h6 htmlFor="technique_name">Technique Name:</h6>
                                                </div>
                                                <div className="col s12 m8 l9">
                                                    <input
                                                        type="text"
                                                        className="form-control   "
                                                        name="technique_name"
                                                        placeholder="Technique Name *"
                                                        value={this.state.technique_name}
                                                        onChange={e => this.onChange(e)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : null}

                                <div className="form-group">
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <h6 htmlFor="platform">Platform:</h6>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <button className="btn success " onClick={this.showMenuPlatform}>
                                                {this.state.platform} <i className="tiny material-icons">arrow_drop_down</i>
                                            </button>
                                            {
                                                this.state.showMenuPlatform
                                                    ? (
                                                        <div className="menu" ref={(element) => {
                                                            this.dropdownMenu = element;
                                                        }}>
                                                            <ul>
                                                                <div className="collection black-text">
                                                                    {
                                                                        (this.props.attack.platformFound) ? (
                                                                             this.props.attack.platforms.map((platform) => {
                                                                                const {_id, platform_name} = platform
                                                                                return <li key={_id} className="collection-item black-text" onClick={this.selectPlatform}>{platform_name}</li>
                                                                            })
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            </ul>
                                                        </div>
                                                    )
                                                    : (
                                                        null
                                                    )
                                            }
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn success"
                                    style={{ opacity: '0.9' }}
                                >
                                    Submit
                                </button>
                                <br/>
                                <br/>
                                <br/>
                            </form>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    }

}

AddorUpdateAttack.propTypes = {
    addorupdateattack: PropTypes.func.isRequired,
    attack: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
    getallplatforms: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    alert: state.alert,
    attack: state.attack
})

export default withRouter(connect(mapStateToProps, { addorupdateattack, setAlert, getallplatforms })(AddorUpdateAttack))