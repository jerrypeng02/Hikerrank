import React, {Component} from "react";
import WebSocketInstance from "./WebSocket";
import axios from 'axios';
import DisplayAuthorPic from './DisplayAuthorPic'

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login_status: sessionStorage.getItem('login_status'),
            username: sessionStorage.getItem('username'),
            chat_id: this.props.chat_id,
            messages: [],
            message: ''
        }
        this.initializeChat();
    }

    initializeChat() {
        WebSocketInstance.addCallbacks(
            this.setMessages.bind(this),
            this.addMessage.bind(this)
        )
        WebSocketInstance.fetchMessages(
            this.state.username,
            this.state.chat_id
        );

    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(function() {
            if (WebSocketInstance.state() === 1) {
                console.log("Connection is made");
                callback();
                return;
            } else {
                console.log("wait for connection...");
                component.waitForSocketConnection(callback);
            }
            }, 100);
    }

    addMessage(message) {
        const listMessages = this.state.messages;
        listMessages.push(message);
        this.setState({
            messages: listMessages
        });
    }

    setMessages(messages) {
        this.setState({ messages: messages.reverse()});
    }

    // react里写form所需的那个form里value的changeHandler，把form里的value和一个component state连起来
    messageChangeHandler = event => {
        this.setState({
            message: event.target.value
        });
    };

    // send message button的handler
    sendMessageHandler = e => {
        e.preventDefault();
        const messageObject = {
            from: this.state.username,
            content: this.state.message,
            chat_id: this.state.chat_id,
        };
        // 通过websocket发给consumer，consumer收到以后call new_message method来处理
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({
            message: ''
        });
    };

    renderTimestamp = timestamp => {
        let time = new Date(timestamp);
        return (time.getHours() < 10 ? '0' : '')
            + (time.getHours() % 12 === 0 ? 12 : (time.getHours() % 12)) + ':'
            + (time.getMinutes() < 10 ? '0' : '')
            + time.getMinutes() + (time.getHours() < 12 ? 'AM' : 'PM')
    };

    // 把一个message里的data变成呈现在页面上的HTML
    renderMessages = messages => {
        const currentUser = this.state.username;
        
        return messages.map((message, i, arr) => (
            <li
                key={message.id}
                style={{ marginBottom: arr.length - 1 === i ? "300px" : "15px" }}
                className={message.author === currentUser ? "sent" : "replies"}
            >
                {/* <img
                    src={message_pic_dict[message.id]}
                    alt="profile-pic"
                /> */}
                <DisplayAuthorPic message_id={message.id} message_author_name={message.author}/>
                <p>
                    <small>{message.author}</small>
                    <br />
                    {message.content}
                    <br />
                    <small>{this.renderTimestamp(message.timestamp)}</small>
                </p>
            </li>
        ));
    };

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    };

    componentDidMount() {
        // this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return (
            <div className="content">
                <div className="messages">
                    <ul id="chat-log">
                        {
                            this.state.messages &&
                            this.renderMessages(this.state.messages)
                        }
                        <div
                            style={{ float: "left", clear: "both" }}
                            ref={el => {this.messagesEnd = el;}}
                        />
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input
                                onChange={this.messageChangeHandler}
                                value={this.state.message}
                                required
                                id="chat-message-input"
                                type="text"
                                placeholder="Write your message..."
                            />
                            <button id="chat-message-submit" className="submit">
                                <i class="fa fa-paper-plane-o fa-2x" aria-hidden="true"></i> 
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Chat;