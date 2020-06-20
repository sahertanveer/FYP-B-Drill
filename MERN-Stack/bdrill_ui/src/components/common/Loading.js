import React, { Component } from 'react';
import Loader from 'react-loader-spinner'
// import 'react-chat-widget/lib/styles.css';
const styleObj = {
  marginTop: "20%"
}

class Loading extends Component {


  render() {
    return (
      <center><div className="root"  style={styleObj}>
         <Loader color="#00BFFF" height={100} width={100} timeout={0} /> </div></center>
  
    );
  }
}

export default Loading;











// import React, { Component } from 'react';
// import { Widget, addResponseMessage } from 'react-chat-widget';
// // import ChatLayout from '../chat/ChatLayout'
// // import 'react-chat-widget/lib/styles.css';

// class ChatBox extends Component {
//   componentDidMount() {
//     addResponseMessage("Welcome to this awesome chat!");

//   }

//   handleNewUserMessage = (newMessage) => {
//     console.log(`New message incoming! ${newMessage}`);
//     // Now send the message throught the backend API
//     //addResponseMessage(response);
//   }

//   render() {
//     return (
//       <div className="chatbox">
//         <Widget
//           handleNewUserMessage={this.handleNewUserMessage}
//           //profileAvatar='https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
//           title="B-Drill ChatBox"
//           subtitle="We give wings to your skills, you decide where to fly"
//         />
//       </div>
//     );
//   } 
// }

// export default ChatBox;



//React Chat Window
// import React, {Component} from 'react';
// import {Launcher} from 'react-chat-window';

// class ChatBox extends Component{

//  //for messagebox
//  constructor() {
//   super();
//   this.state = {
//     messageList: []
//   };
// }

// _onMessageWasSent(message) {
//   this.setState({
//     messageList: [...this.state.messageList, message]
//   })
// }

// _sendMessage(text) {
//   if (text.length > 0) {
//     this.setState({
//       messageList: [...this.state.messageList, {
//         author: 'them',
//         type: 'text',
//         data: { text }
//       }]
//     })
//   }
// }

// render() {
//   return (<div>
//     <Launcher
//       agentProfile={{
//         teamName: 'react-chat-window',
//        // imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
//       }}
//       onMessageWasSent={this._onMessageWasSent.bind(this)}
//       messageList={this.state.messageList}
//       showEmoji
//     />
//   </div>)
// }
// }

// export default ChatBox;


