import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'
import ProfileItems from './ProfileItems';
import { getProfiles } from '../../actions/profileAction';

class Profiles  extends Component {
  constructor(props){
    super(props);
    this.props.getProfiles(this.props.role, this.props.all, this.props._id)
  }


render(){
  let cards =[]
  let elements =[]
  return (
    
    <Fragment>
      {this.props.profile.loading ? (
        <Loader className="center" type="BallTriangle" color="cyan" height={80} width={80} />
      ) : (
             
        <Fragment>
        <h5 className="card-stats-number white-text" style={{ fontFamily: "Princess Sofia" }}> Users</h5>
          <hr/>
          <br/>
          <div className='profiles'>
             {/* <div className="row"> */}
            {this.props.profile.profiles.length > 0 ? (
              this.props.profile.profiles.map((prof, i)=> {
                elements.push(
                <ProfileItems key={prof._id} profile={prof} />)
                
                
              
                if ((i+1)%3 === 0){
                  console.log("in 3")
                  console.log(i)
                console.log(elements)
                  cards.push( <div key={prof._id} className ="row">
                  {elements}
                  </div>)
                  elements=[]
          }

         if (i+1 === this.props.profile.profiles.length){
            if(elements.length >0 ){
              console.log("in full")
              console.log(i)
                console.log(elements)
                          cards.push( <div key={prof._id} className ="row">
                          {elements}
                        </div>)
                          elements=[]
                     }
          }
    

              })
            ) : (
              <Loader className="center" type="BallTriangle" color="cyan" height={80} width={80} />
              /* <h4 className="alert-danger center white-text">No profiles found...</h4> */
            )}

            {cards}
            </div>
          {/* </div> */}
        </Fragment>
      )}
    </Fragment>
  );
};

}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  _id: state.auth._id,

});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);