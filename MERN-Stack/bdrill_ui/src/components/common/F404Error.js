import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';

const btnStyle = {
    borderRadius:'10px',
    backgroundImage: 'linear-gradient(to right, rgba(255,0,0,0),rgba(3, 8, 42, 1))'
  };
        

class F404Error extends Component{
    
    render(){
      
        return(
            <BrowserRouter>

            {/* Main */}
            <main style={{marginLeft:'6%'}}>
                <div className="container">

                    <div className="row">
                        <div className="col s12 m12 l12 center">
                            <img src="https://www.tripwire.com/state-of-security/wp-content/uploads/sites/3/CIS-is-releasing-their-revised-top-20-Critical-Security-Controls.jpg" 
                                alt="404 Error"
                                style={{marginTop: '4%', height: '350px', width: '100%'}}
                            />
                            <h1 className="error-code m-0 blue-text center ">404</h1>
                            <h6 className="error-code m-0 blue-text center">Bad Request</h6>
                            <a className="btn center" style={btnStyle} href="home.js">Back To Home</a>
                        </div>
                    </div>                
                </div>

            </main>

            </BrowserRouter>
        )
    }
}

export default F404Error;


