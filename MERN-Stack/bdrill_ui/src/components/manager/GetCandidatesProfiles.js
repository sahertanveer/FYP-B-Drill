import React, {Component} from 'react'
import { BrowserRouter } from 'react-router-dom'
import Profiles from '../profiles/Profiles'

class GetCandidatesProfiles extends Component {
  render() {
    return (
      <BrowserRouter>
          <div>
            <Profiles role="manager" />
          </div>      
      </BrowserRouter>
    )
  }
}



export default GetCandidatesProfiles

