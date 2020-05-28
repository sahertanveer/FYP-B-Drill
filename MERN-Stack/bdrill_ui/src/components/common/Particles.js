import React, { Component } from 'react'
import Particles from 'react-particles-js'

class Particle extends Component{
    render() {
        return(
            <Particles
            // params={particleOpt} />
            params={{

              "particles": {
                "number": {
                  "value": 160
                },
                "color": {
                  "value": "#80BD9E"
                },
                "shape": {
                  "type": "circle",
                  "stroke": {
                    "width": 1,
                    "color": "#ccc"
                  }
                },
                "opacity": {
                  "value": 0.2,
                  "random": true,
                  "anim": {
                    "enable": false,
                    "speed": 1
                  }
                },
                "size": {
                  "value": 2,
                  "random": false,
                  "anim": {
                    "enable": false,
                    "speed": 30
                  }
                },
                "move": {
                  "direction": "right",
                  "out_mode": "out",
                  "enable": true,
                  "speed": 3,
                  "straight": false
                },
                "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#07575B",
                  "width": 1
                },
              },
              "interactivity": {
                "events": {
                  "onhover": {
                    "enable": true,
                    "mode": "repulse"
                  },
                  "onclick": {
                    "enable": true,
                    "mode": "push"
                  }
                },
                "modes": {
                  "repulse": {
                    "distance": 50,
                    "duration": 0.4
                  },
                  "bubble": {
                    "distance": 150,
                    "opacity": 20,
                    "size": 10
                  }
                }
              }

            }}
          />
        )
    }
}

export default Particle