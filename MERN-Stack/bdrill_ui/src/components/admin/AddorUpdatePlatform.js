import React, { Component }  from 'react'
import { BrowserRouter, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addorupdateplatform } from '../../actions/adminAuthAction'
import { setAlert } from '../../actions/alertAction'
import Alert from '../../layout/Alert'
import { BackendInstance } from '../../config/axiosInstance';
import queryString from 'query-string'

class AddorUpdatePlatform extends Component {
    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.location.search)
        this.state = {
            platform_family: '',
            platform_name: values.platform_name
        }

        this.showMenuCategory = this.showMenuCategory.bind(this);
        this.closeMenuCategory = this.closeMenuCategory.bind(this);
        this.selectCategory = this.selectCategory.bind(this);

        if(values.platform_name){
            this.getPlatform()
        }    
    }

    async getPlatform(){

        try {
            const res = await BackendInstance({
              method: 'post',
              url: '/api/attackinventory/getplatformfromname',
              data: {
                platform_name: this.state.platform_name//'5db080230b62e76104bdd4bd'
              }
            })
            console.log(res.data)
      
            if ((res.data.platforms).length === 1) {
              console.log(res.data)
              this.setState({ platform_family: res.data.platforms[0].platform_family})
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
    this.setState({[e.target.name] : e.target.value})
// setFormData({ ...formData, [e.target.name]: e.target.value })

onSubmit = e => {
    e.preventDefault()
    console.log(this.state)
    this.props.addorupdateplatform(this.state);
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
componentDidUpdate(){
    if (this.props.platformAddedorUpdated) {
        return setAlert(' Platform added ', ' light ')
    }
    
}
render() {
return (
 <BrowserRouter>
            <div className="container-fluid uicards">
                <div className="row">
                    <div className="col s12 m8 l8 offset-m2 offset-l2">
                        <h5 className="card-stats-number  " style={{ fontFamily: "Princess Sofia" }}> Platforms</h5>
                        <hr />
                        <Alert />
                        <br />
                        <form onSubmit={this.onSubmit} className="center container ">
                            
                            <div className="form-group">
                                <div className="row">
                                    <div className="col s12 m4 l3">
                                        <h6 htmlFor="platform_family">Platform Family:</h6>
                                    </div>
                                    <div className="col s12 m8 l9">
                                        <input
                                            type="text"
                                            className="form-control   "
                                            name="platform_family"
                                            placeholder="Platform Family*"
                                            value={this.state.platform_family}
                                            onChange={e => this.onChange(e)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group center">
                                <div className="row">
                                    <div className="col s12 m4 l3">
                                        <h6 htmlFor="platform_name">Platform Name:</h6>
                                    </div>
                                    <div className="col s12 m8 l9">
                                        <input
                                            type="text"
                                            className="form-control   "
                                            name="platform_name"
                                            placeholder="Platform Name *"
                                            defaultValue={this.state.platform_name}
                                            onChange={e => this.onChange(e)}
                                            required
                                        />
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
)
}

}

AddorUpdatePlatform.propTypes = {
    addorupdateplatform: PropTypes.func.isRequired,
    attack: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    alert: state.alert,
    attack: state.attack
})

export default withRouter(connect(mapStateToProps, { addorupdateplatform, setAlert })(AddorUpdatePlatform))