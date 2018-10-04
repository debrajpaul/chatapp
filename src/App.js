import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";
import { Button, Icon, Input } from "semantic-ui-react";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            msg: "",
            msgs: []
        };
        this.socket = io("localhost:4001");

        this.socket.on("RECEIVE_MESSAGE", function(data) {
            addMessage(data);
        });

        const addMessage = data => {
            console.log(data);
            this.setState({ msgs: data });
            //	console.log(this.state.msgs);
        };

        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit("SEND_MESSAGE", {
                username: this.state.user,
                message: this.state.msg
            });
            this.setState({ msg: "" });
        };
    }

    render() {
        return (
            <div className="App">
                {this.state.msgs.length > 0 && (
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
                )}
                <div className="post-message-box">
                    <Input
                        name="user"
                        icon="user"
                        iconPosition="left"
                        placeholder="User"
                        value={this.state.user}
                        onChange={ev =>
                            this.setState({ user: ev.target.value })
                        }
                    />
                    <Input
                        style={{ marginLeft: "1em" }}
                        name="msg"
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
