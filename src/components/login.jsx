import styles from "@/styles/modules/Login.module.scss";
import { make } from "@/util/make";
import React from "react";

function send(ev, ref, except, socket, [login, setLogin]) {
    ev.preventDefault();
    if (login) {
        return;
    }

    try {
        const value = ref.current.value;
        socket.send(make("set_username", value));
    } catch (err) {
        except.current.innerText = "IRC Server is offline.";
        return;
    }
        
    ref.current.value = "";
    setLogin(true);
}

export function Login({ socket, login, setLogin }) {
    const ref = React.createRef();
    const except = React.createRef();

    return (
        <>
            <h1>Personal IRC Simple Chat</h1>
            <form className={styles.input} onSubmit={ev => send(ev, ref, except, socket, [login, setLogin])}>
                <code className={styles.except} ref={except}></code>
                <input type="text" ref={ref} placeholder="Type your nickname here" required />
                <button type="submit">Login</button>
            </form>
            <footer>
                <strong>Simple Chat</strong> by <a href="https://github.com/devproje">Project_IO</a>.
                This project is license for <strong><a href="https://github.com/devproje/simple-chat-frontend/blob/master/LICENSE">MIT</a></strong>.
            </footer>
        </>
    );
}
