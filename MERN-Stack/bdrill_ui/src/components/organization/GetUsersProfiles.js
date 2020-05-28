import React, {Component} from 'react'
import { BrowserRouter } from 'react-router-dom'
import Profiles from '../profiles/Profiles'

class GetUsersProfiles extends Component {
  render() {
    return (
      <BrowserRouter>
          <div>
            {/* <Profiles role="candidate"/> */}
            <Profiles role="organization"/>
          </div>      
      </BrowserRouter>
    )
  }
}



export default GetUsersProfiles

