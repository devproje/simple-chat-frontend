import styles from "@/styles/modules/Chat.module.scss";
import "bootstrap-icons/font/bootstrap-icons.scss";
import { useChatScroll } from "@/util/scroll";
import React, { useState } from "react";
import { make } from "@/util/make";
import { SideBar } from "./sidebar";

function send(ev, socket, ref, isDisabled) {
    ev.preventDefault();

    if (isDisabled === true) {
        return;
    }
    
    socket.send(make("new_message", ref.current.value));
    ref.current.value = "";
}

function replaceURL(src, type) {
    return src.replace("ws://", `${type}://`).replace("wss://", `${type}://`).replace("/ws", "");
}

function change(ev, ref, limit, setDisabled) {
    ev.preventDefault();
    setDisabled(ref.current.value.length > limit);
}

function sidebar(ev, setOpen) {
    ev.preventDefault();
    setOpen(true);
}

export function Chat({ socket, secure, setLogin }) {
    const [isDisabled, setDisabled] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isOpen, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [limit, setLimit] = useState(300);
    const [name, setName] = useState(null);
    const chat = useChatScroll(messages);
    const value = React.createRef();
    const btn = React.createRef();

    let type = "http";
    if (secure) {
        type = "https";
    }

    useState(() => {
        try {
            function getServerName() {
                const url = `${replaceURL(socket.url, type)}/v1/server`;
                fetch(url).then(data => data.json()).then((json) => {
                    setName(json.name);
                    setLimit(json.content_length);
                });
            }
            
            getServerName();
            socket.onmessage = (event) => {
                let msg;
                const data = JSON.parse(event.data);
                
                function getUsers() {
                    const url = `${replaceURL(socket.url, type)}/v1/users`;
                    fetch(url).then(data => data.json()).then((json) => {
                        setUsers(json.users);
                    });
                }
                
                switch (data.type) {
                    case "new_message":
                        msg = `${data.author}: ${data.payload}`;
                        break;
                    case "set_username":
                        msg = `${data.payload} has joined the chat.`;
                        getUsers();
                        break;
                        case "left_user":
                            msg = `${data.payload} left the chat.`;
                            getUsers();
                        }
                            
                        setMessages(prev => [...prev, msg]);
                };
        } catch (err) {
            console.error("no connection to irc server");
        }
    }, [messages, users]);
                
    return (
        <>
            <div className={styles.page}>
                <div className={styles.chat_container}>
                    <div className={styles.nav}>
                        <h1>{name}</h1>
                            <div>
                            <p>Online: {users.length > 1 ? `${users.length} Users` : `${users.length} User`}</p>
                            <button onClick={ev => sidebar(ev, setOpen)}>
                                <i className={`bi bi-list`}/>
                            </button>
                        </div>
                    </div>
                    <div className={styles.chat} ref={chat}>
                        {messages.map((msg, index) => (
                            <div className={styles.message} key={index}>
                                <p className={styles.text}>{msg}</p>
                            </div>
                        ))}
                    </div>
                    <form className={styles.reply} onSubmit={ev => send(ev, socket, value, btn, isDisabled)}>
                        <div>
                            <input
                                type="text"
                                ref={value}
                                placeholder="Type your message here"
                                className={isDisabled ? styles.dis_text : ""}
                                onChange={ev => change(ev, value, limit, setDisabled)}
                                required
                            />
                            <button ref={btn} disabled={isDisabled} type="submit">Send</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={`${styles.sidebar} ${isOpen ? "" : styles.closed}`}>
                <SideBar socket={socket} users={users} setOpen={setOpen} setLogin={setLogin} />
            </div>
        </>
    );
}
