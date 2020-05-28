import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getallattacks, deleteAttack } from '../../actions/adminAuthAction'
import { setAlert } from '../../actions/alertAction'
import Alert from '../../layout/Alert'

class GetAllAttacks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAlert: false,
      search: ''
    }
    this.props.getallattacks();
    this.renderAttackTableData = this.renderAttackTableData.bind(this);
    this.deleteattack = this.deleteattack.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange = (e) => {
    this.setState({ search: e.target.value })
  }

  deleteattack(e) {
    e.preventDefault();
    this.props.deleteAttack(e.currentTarget.value);
    this.props.getallattacks();
  }

  renderAttackTableData() {
    if (this.props.attack.attacksFound) {
      const { search } = this.state;
      var FilterAttacks = [];
      var searchFilter = search.toLowerCase()
      FilterAttacks = this.props.attack.attacks.filter(attack => {
        return Object.keys(attack).some(key =>
          attack[key].toLowerCase().includes(searchFilter)
        );
      })

      return FilterAttacks.map((attack, index) => {
        const { _id, procedure_id, procedure_name, tactic_name, technique_name, category, platform } = attack //destructuring
        return (
          <tr key={procedure_id}>
            <td>{procedure_id}</td>
            <td>{procedure_name}</td>
            <td>{tactic_name ? tactic_name : <center>--</center>}</td>
            <td>{technique_name ? technique_name : <center>--</center>}</td>
            <td>{category}</td>
            <td>{platform}</td>
            <td>
              <a href={`/addorupdateattack?procedureId=${procedure_id}`} className="btn btn-primary white-text">
                <i className=" tiny material-icons white-text"> edit</i>
              </a>
              <button className="btn btn-danger" value={_id} onClick={(e) => this.deleteattack(e)}>
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
          <div className="row" >
            <div className="col s12 m12 l12">
              <div className="card animate fadeLeft uicards">
                <div className="card-content">
                  <div className="row">
                    <div className="col s6 m6 l7">
                      <h5 className="card-stats-number" style={{ fontFamily: "Princess Sofia" }}>Attacks</h5>
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
                          <th>Procedure Id</th>
                          <th>Procedure Name</th>
                          <th>Tactic Name</th>
                          <th>Technique Name</th>
                          <th>Category</th>
                          <th>Platform</th>
                          <th>Edit/Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderAttackTableData()}
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

GetAllAttacks.propTypes = {
  deleteAttack: PropTypes.func.isRequired,
  getallattacks: PropTypes.func.isRequired,
  attack: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  attack: state.attack,
})

export default (connect(mapStateToProps, { setAlert, deleteAttack, getallattacks })(GetAllAttacks))