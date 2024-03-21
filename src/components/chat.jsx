import styles from "@/styles/modules/Chat.module.scss";
import "bootstrap-icons/font/bootstrap-icons.scss";
import { useChatScroll } from "@/util/scroll";
import DOMPurify from "isomorphic-dompurify";
import React, { useState } from "react";
import { make } from "@/util/make";
import { marked } from "marked";
import { SideBar } from "./SideBar";

function send(ev, socket, ref) {
    ev.preventDefault();
    
    socket.send(make("new_message", ref.current.value));
    ref.current.value = "";
}

function replaceURL(src, type) {
    return src.replace("ws://", `${type}://`).replace("wss://", `${type}://`).replace("/ws", "");
}

function press(ev, ref) {
    if (ev.keyCode == 13 && ev.shiftKey) {
        ev.preventDefault();
        ref.current.value += "\n";
        console.log(ref.current.value);
        return;
    }

}

function sidebar(ev, setOpen) {
    ev.preventDefault();
    setOpen(true);
}

export function Chat({ socket, secure }) {
    const [messages, setMessages] = useState([]);
    const [isOpen, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
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
                        msg = `**${data.author}:** ${data.payload}`;
                        break;
                    case "set_username":
                        msg = `**${data.payload}** has joined the chat.`;
                        getUsers();
                        break;
                        case "left_user":
                            msg = `**${data.payload}** left the chat.`;
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
                                <p className={styles.text} dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(marked(msg))
                                }}></p>
                            </div>
                        ))}
                    </div>
                    <form className={styles.reply} onSubmit={ev => send(ev, socket, value, btn)}>
                        <div>
                            <input type="text" ref={value} onKeyDown={ev => press(ev, value)} placeholder="Type your message here" required />
                            <button ref={btn} type="submit">Send</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={`${styles.sidebar} ${isOpen ? "open" : styles.closed}`}>
                <SideBar isOpen={isOpen} setOpen={setOpen} />
            </div>
        </>
    );
}
