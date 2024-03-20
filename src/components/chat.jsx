import styles from "@/styles/modules/Chat.module.scss";
import { make } from "@/util/make";
import { useChatScroll } from "@/util/scroll";
import React, { useState } from "react";
import sanitize from "sanitize-html";

function send(ev, socket, ref) {
    ev.preventDefault();
    socket.send(make("new_message", ref.current.value));
    ref.current.value = "";
}

export function Chat({ socket, props }) {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const chat = useChatScroll(messages);
    const value = React.createRef();

    useState(() => {
        try {
            socket.onmessage = (event) => {
                let msg;
                const data = JSON.parse(event.data);

                
                function getUsers() {
                    const url = `http://${socket.url.replace("ws://", "").replace("/ws", "")}/v1/users`;
                    fetch(url).then(data => data.json()).then((json) => {
                        setUsers(json.users);
                    });
                }
                
                switch (data.type) {
                    case "new_message":
                        msg = `<strong>${data.author}</strong>: ${data.payload}`;
                        break;
                    case "set_username":
                        msg = `<strong>${data.payload}</strong>&nbsp;has joined the chat.`;
                        getUsers();
                        break;
                    case "left_user":
                        msg = `<strong>${data.payload}</strong>&nbsp;left the chat.`;
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
            <div className={styles.chat_container}>
                <div className={styles.chat_area}>
                    <div className={styles.nav}>
                        <h1>Personal IRC Simple Chat</h1>
                    </div>
                    <div className={styles.msg_list} ref={chat}>
                        {
                            messages.map((msg, index) => (
                                <div className={styles.msg} key={index}>
                                    <p dangerouslySetInnerHTML={{
                                        __html: sanitize(msg, {
                                            allowedAttributes: false,
                                            allowVulnerableTags: false,
                                        })
                                    }}></p>
                                </div>
                            ))
                        }
                    </div>
                    <form className={styles.input} onSubmit={ev => send(ev, socket, value)}>
                        <input type="text" ref={value} placeholder="Type your message here" required />
                        <button type="submit">Send</button>
                    </form>
                </div>
                <div className={styles.user_list}>
                    <div className={styles.user_title}>
                        <h2>User List</h2>
                    </div>
                    {
                        users.map((user, index) => (
                            <div className={styles.user} key={index}>
                                <h3>{user.name}</h3>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
}
