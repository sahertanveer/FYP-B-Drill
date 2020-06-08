import React, { Component, Fragment } from 'react';
import ChatLayout from '../chat/ChatLayout';
// import 'react-chat-widget/lib/styles.css';

class ChatBox extends Component {
  constructor() {
    super()
    this.state = {
      showChatBox: false
    }
    this.toggleChatBox = this.toggleChatBox.bind(this);
    this.closeChatBox = this.closeChatBox.bind(this);
  }

  toggleChatBox() {
    this.setState({ showChatBox: !this.state.showChatBox })
  }

  closeChatBox() {
    this.setState({ showChatBox: false })
  }

  render() {
    return (
      <div className="chatbox" style={{overflow: "hidden" }}>
        {/* {!this.state.showChatBox ? 
        <button className="btn success rcw-launcher" onClick={this.toggleChatBox}><i className="fas fa-comment-dots"/></button>
        :
        <button className="rcw-close-button" onClick={this.closeChatBox}><i className="fas fa-times-circle white-text" /></button>
        } */}

        <button className="btn success rcw-launcher" style={{ borderRadius: "50%" }} onClick={this.toggleChatBox}>
            <i className="fas fa-comment-dots" />
          </button>
        {!this.state.showChatBox ?
        "" :
          <Fragment>
            {this.state.showChatBox && (
              <div>
                <button className="btn success rcw-launcher " style={{ borderRadius: "50%" }} onClick={this.closeChatBox}>
                  <i className="fas fa-times-circle white-text" />
                </button>
                <div className="rcw-conversation-container rcw-widget-container" style={{ height: "auto", width:"100%", zIndex:9999 }}>
                {/* <div className="rcw-header">
                  <h6 className="rcw-title">B-Drill ChatBox</h6>
                  <small>We give wings to your skills, you decide where to fly</small>
                </div> */}
             <ChatLayout style={{height:"35rem"}}  chatWidget={true}/>
    
                 
                </div>
           </div>
            )}
          </Fragment>
      
        }
      </div>
    );
  }
}

export default ChatBox;











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


