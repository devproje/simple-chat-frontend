import styles from "@/styles/modules/Chat.module.scss";
import { make, payloadType } from "@/util/make";
import React, { useState } from "react";

function send(ev, socket, ref) {
    ev.preventDefault();
    socket.send(make(payloadType.newMessage, ref.current.value));
    ref.current.value = "";
}

export function Chat({ socket }) {
    const [messages, setMessages] = useState([]);
    const value = React.createRef();
    
    try {
        socket.onmessage = (event) => {
            setMessages(prev => [...prev, event.data]);
        };
    } catch (err) {
        console.error("no connection to irc server");
    }

    return (
        <>
            <div className={styles.chat_container}>
                <div className={styles.chat_area}>
                    <div className={styles.nav}>
                        <h1>Personal IRC Simple Chat</h1>
                    </div>
                    <div className={styles.msg_list}>
                        {
                            messages.map(
                                (msg, index) => (
                                    <div className={styles.msg} key={index}>
                                        <p>{msg}</p>
                                    </div>
                                )
                            )
                        }
                    </div>
                    <form className={styles.input} onSubmit={ev => send(ev, socket, value)}>
                        <input type="text" ref={value} placeholder="Type your message here" required />
                        <button type="submit">Send</button>
                    </form>
                </div>
                <div className={styles.user_list}></div>
            </div>
        </>
    );
}
