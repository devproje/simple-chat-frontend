import Head from "next/head";
import { make } from "@/util/make";
import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.scss";
import styles from "@/styles/modules/Home.module.scss";

const socket = new WebSocket("ws://localhost:8080/ws");

let message = React.createRef();
let nickname = React.createRef();
let exceptMessage = React.createRef();

function nicknameForm(event, [login, setLogin]) {
    event.preventDefault();
    if (login) {
        return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        console.log(exceptMessage.current);
        exceptMessage.current.textContent = "Error: IRC Server not opened.";
        return;
    }
    
    socket.send(make("set_nickname", nickname.current.value));
    nickname.current.value = "";
    setLogin(true);
}

function sendForm(event) {
    event.preventDefault();
    socket.send(make("new_message", message.current.value));
    message.current.value = "";
}

export default function Home() {
    const [login, setLogin] = useState(false);
    const [messages, setMessages] = useState([]);
    
    socket.onmessage = (event) => {
        setMessages(prev => [...prev, event.data]);
    };

    let form = (
        <>
            <nav className={styles.nav}>
                <h1>Personal IRC Simple Chat</h1>
            </nav>
            <div className={styles.msg_list}>
                {messages.map((msg, index) => (
                    <div className={styles.msg}>
                        <p key={index}>{msg}</p>
                    </div>
                ))}
            </div>
            <form className={styles.chat} id="send" onSubmit={sendForm}>
                <input ref={message} type="text" placeholder="Type message here" required/>
                <button type="submit">Send</button>
            </form>
        </>
    )

    if (!login) {
        form = (
            <>
                <h1>Personal IRC Simple Chat</h1>
                <form className={styles.nickname} id="nickname" onSubmit={ev => nicknameForm(ev, [login, setLogin])}>
                    <code ref={exceptMessage} className={styles.except}></code>
                    <div>
                        <input ref={nickname} type="text" placeholder="Type your nickname here" required />
                        <button type="submit">Login</button>
                    </div>
                </form>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Personal IRC Simple Chat</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>{form}</main>
        </>
    );
}
