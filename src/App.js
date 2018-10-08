import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";
import { Button, Icon, Input } from "semantic-ui-react";
class App extends Component {
    constructor(props) {
        super(props);
        //defining state for the component
        this.state = {
            user: "",
            msg: "",
            msgs: []
        };
        //socket will listen to localhost:4001
        this.socket = io("localhost:4001");
        //socket receives messages array
        this.socket.on("RECEIVE_MESSAGE", function(data) {
            addMessage(data);
        });
        //adds received messages to states message array
        const addMessage = data => {
            this.setState({ msgs: data });
        };
        //socket sends username and corresponding message to server
        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit("SEND_MESSAGE", {
                username: this.state.user,
                message: this.state.msg
            });
            this.setState({ msg: "" });
        };
        //socket sends delete messages request to server
        this.deleteMessage = ev => {
            ev.preventDefault();
            this.socket.emit("CLEAR_CHAT");
            this.setState({ msgs: [] });
        };
    }
    // socket sends first call to the server
    componentWillMount() {
        this.socket.emit("FIRST_CALL");
        this.setState({ msg: "" });
    }

    render() {
        return (
            <div className="App">
                <div className="user-box">
                    <Input
                        name="user"
                        icon="user"
                        iconPosition="left"
                        placeholder="User"
                        value={this.state.user}
                        style={{ width: "15em" }}
                        onChange={ev =>
                            this.setState({ user: ev.target.value })
                        }
                    />
                    <Button
                        onClick={this.deleteMessage}
                        secondary
                        basic
                        icon
                        style={{ marginLeft: "1em" }}
                    >
                        <Icon name="trash" />
                    </Button>
                </div>
                {this.state.msgs.length && this.state.msgs.length > 0 ? (
                    <div className="message-container">
                        {this.state.msgs.map((m, i) => {
                            return (
                                <div key={i}>
                                    <Icon name="user" size="small" />
                                    {m.username + " "} : {" " + m.message}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    ""
                )}
                <div className="post-message-box">
                    <Input
                        icon="comments"
                        iconPosition="left"
                        style={{ marginLeft: "1em" }}
                        name="msg"
                        style={{ width: "15em" }}
                        placeholder="Type message here..."
                        value={this.state.msg}
                        onChange={ev => this.setState({ msg: ev.target.value })}
                    />
                    <Button
                        onClick={this.sendMessage}
                        secondary
                        icon
                        style={{ marginLeft: "1em" }}
                    >
                        <Icon name="arrow right" />
                    </Button>
                </div>
            </div>
        );
    }
}

export default App;
