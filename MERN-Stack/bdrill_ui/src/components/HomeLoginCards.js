import { render } from 'react-dom'
import React, { useState, useCallback } from 'react'
import { useTransition } from 'react-spring'
// import './styles.css'

const pages = [
  ({ style }) => <div className="mycard"
    style={{ ...style, background: '#562a3a', width: "100%", marginLeft: '-2%' }}>
    <div className="row">
      <div className="col s12 m12 l12 center ">
        <h5 className="white-text">Admin Panel</h5>
      </div>
      <div className="col s12 m12 l12 center">
        <a href="/adminsignin" className=" btn btn-login">Login </a>
        <br />
      </div>
    </div>
  </div>,

  ({ style }) => <div className="mycard"
    style={{ ...style, background: '#562a3a', width: "100%", marginLeft: '-2%' }}>
    <div className="row">
      <div className="col s12 m12 l12 center ">
        <h5 className="white-text">Organization Panel</h5>
      </div>
      <div className="col s12 m12 l12 center">
        <a href="/orgsignin" className=" btn btn-login">Login </a>
        <br />
      </div>
    </div>
  </div>,
  ({ style }) => <div className="mycard"
    style={{ ...style, background: '#562a3a', width: "100%", marginLeft: '-2%' }}>
    <div className="row">
      <div className="col s12 m12 l12 center ">
        <h5 className="white-text">Manager Panel</h5>
      </div>
      <div className="col s12 m12 l12 center">
        <a href="/managersignin" className=" btn btn-login">Login </a>
        <br />
      </div>
    </div>
  </div>,
  ({ style }) => <div className="mycard"
    style={{ ...style, background: '#562a3a', width: "100%", marginLeft: '-2%' }}>
    <div className="row">
      <div className="col s12 m12 l12 center ">
        <h5 className="white-text">Candidate Panel</h5>
      </div>
      <div className="col s12 m12 l12 center">
        <a href="/candsignin" className=" btn btn-login">Login </a>
        <br />
      </div>
    </div>
  </div>,
]

function HomeLoginCards() {
  const [index, set] = useState(0)
  const onClick = useCallback(() => set(state => (state + 1) % 4), [])
  const transitions = useTransition(index, p => p, {
    from: { opacity: 0, transform: 'translate3d(0%,0,0)' },
    enter: { opacity: 0, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(0%,0,0)' },
  })
  return (
    <div className="simple-trans-main" onClick={onClick}>
      {transitions.map(({ item, props, key }) => {
        const Page = pages[item]
        return <Page key={key} style={props} />
      })}
    </div>
  )
}



export default HomeLoginCards