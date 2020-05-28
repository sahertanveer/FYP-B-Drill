import React, {Component} from 'react'
import { BrowserRouter } from 'react-router-dom'
import UserProfile from '../profile/UserProfile'

class ManagerProfile extends Component {
  render() {
    return (
      <BrowserRouter>
          <div>
            <UserProfile />
          </div>      
      </BrowserRouter>
    )
  }
}



export default ManagerProfile
