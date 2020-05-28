import React, { Component }  from 'react'
import { BrowserRouter, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addorupdatemachine } from '../../actions/adminAuthAction'
import { setAlert } from '../../actions/alertAction'
import Alert from '../../layout/Alert'
import { BackendInstance } from '../../config/axiosInstance';
import queryString from 'query-string'

class AddorUpdateMachine extends Component {
    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.location.search)
        this.state = {
            platform: 'Windows_10',
            architecture: 'x64',
            showMenuPlatform: false,
            showMenuArchitecture: false,
            machine_name: values.machine_name,
        }

        this.showMenuPlatform = this.showMenuPlatform.bind(this);
        this.closeMenuPlatform = this.closeMenuPlatform.bind(this);
        this.selectPlatform = this.selectPlatform.bind(this);
        this.showMenuArchitecture = this.showMenuArchitecture.bind(this);
        this.closeMenuArchitecture = this.closeMenuArchitecture.bind(this);
        this.selectArchitecture = this.selectArchitecture.bind(this);

    if(values.machine_name){
        this.getMachine()
    }      
}

async getMachine(){
    try {
        const res = await BackendInstance({
          method: 'post',
          url: '/api/attackinventory/getmachinesfromname',
          data: {
            machine_name: this.state.machine_name
          }
        })
        console.log(res.data)
  
        if ((res.data.machines).length === 1) {
          console.log(res.data)
          this.setState({platform: res.data.machines[0].platform,
             architecture: res.data.machines[0].architecture}
              )
        }
  
      } catch (err) {
        const errors = err.response.data.errors;
      
        if (errors) {
  
          errors.forEach(error => { (setAlert(error.msg, 'danger')) })
        }
     
}

};

 onChange = e =>
    this.setState({[e.target.name] : e.target.value})


onSubmit = e => {
    e.preventDefault()
    console.log(this.state)
    this.props.addorupdatemachine(this.state)
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

selectArchitecture(event) {
    event.preventDefault();
    this.setState({ architecture: event.target.innerText })

}

closeMenuArchitecture() {
    this.setState({ showMenuArchitecture: false }, () => {
        document.removeEventListener('click', this.closeMenuArchitecture);
    });
}

showMenuArchitecture(event) {
    event.preventDefault();
    this.setState({ showMenuArchitecture: true }, () => {
        document.addEventListener('click', this.closeMenuArchitecture);
    });
}


//Redirect if added 
componentDidUpdate(){
    if (this.props.machineAddedorUpdated) {
        return setAlert(' Machine added ', ' light ')
    }
    
}
render() {
return (
 <BrowserRouter>
            <div className="container-fluid uicards">
                <div className="row">
                    <div className="col s12 m8 l8 offset-m2 offset-l2">
                        <h5 className="card-stats-number " style={{ fontFamily: "Princess Sofia" }}> Machines</h5>
                        <hr />
                        <Alert />
                        <br />
                        <form onSubmit={this.onSubmit} className=" center container ">
                            
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
                                                                    <li className="collection-item black-text" onClick={this.selectPlatform}>Windows_10</li>
                                                                    <li className="collection-item black-text" onClick={this.selectPlatform}>Windows_7</li>
                                                                    <li className="collection-item black-text" onClick={this.selectPlatform}>Windows_8</li>
                                                                    <li className="collection-item black-text" onClick={this.selectPlatform}>Windows_8.1</li>
                                                                    <li className="collection-item black-text" onClick={this.selectPlatform}>Windows_XP</li>
                                                                    <li className="collection-item black-text" onClick={this.selectPlatform}>Ubuntu</li>
                                                                    <li className="collection-item black-text" onClick={this.selectPlatform}>Linux</li>
                                                                    <li className="collection-item black-text" onClick={this.selectPlatform}>Mac</li>
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

                            <div className="form-group   center">
                                <div className="row">
                                    <div className="col s12 m4 l3">
                                        <h6 htmlFor="machine_name">Machine Name:</h6>
                                    </div>
                                    <div className="col s12 m8 l9">
                                        <input
                                            type="text"
                                            className="form-control   "
                                            name="machine_name"
                                            placeholder="Machine Name *"
                                            defaultValue={this.state.machine_name}
                                            onChange={e => this.onChange(e)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group center">
                                <div className="row">
                                    <div className="col s12 m4 l3">
                                        <h6 htmlFor="architecture">Architecture:</h6>
                                    </div>
                                    <div className="col s12 m8 l9">
                                            <button className="btn success " onClick={this.showMenuArchitecture}>
                                                {this.state.architecture} <i className="tiny material-icons">arrow_drop_down</i>
                                            </button>
                                            {
                                                this.state.showMenuArchitecture
                                                    ? (
                                                        <div className="menu" ref={(element) => {
                                                            this.dropdownMenu = element;
                                                        }}>
                                                            <ul>
                                                                <div className="collection black-text">
                                                                    <li className="collection-item black-text" onClick={this.selectArchitecture}>x64</li>
                                                                    <li className="collection-item black-text" onClick={this.selectArchitecture}>x32</li>
                                                                    {/* <li className="collection-item black-text" onClick={this.selectArchitecture}>x</li> */}
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
                        </form>
                    </div>
                </div>

            </div>

        </BrowserRouter>
)}
}

AddorUpdateMachine.propTypes = {
    addorupdatemachine: PropTypes.func.isRequired,
    attack: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    alert: state.alert,
    attack: state.attack
})

export default withRouter(connect(mapStateToProps, { addorupdatemachine, setAlert })(AddorUpdateMachine))