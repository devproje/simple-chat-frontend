import styles from "@/styles/modules/Login.module.scss";
import { make } from "@/util/make";
import React from "react";

function send(ev, ref, except, socket, [login, setLogin]) {
    ev.preventDefault();
    if (login) {
        return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        except.current.innerText = "IRC Server is offline.";
        return;
    }
    
    const value = ref.current.value;
    socket.send(make("set_username", value));
    
    ref.current.value = "";
    setLogin(true);
}

export function Login({ socket, login, setLogin }) {
    const value = React.createRef();
    const except = React.createRef();

    return (
        <>
            <h1>Personal IRC Simple Chat</h1>
            <form className={styles.input} onSubmit={ev => send(ev, value, except, socket, [login, setLogin])}>
                <code className={styles.except} ref={except}></code>
                <div>
                    <input type="text" ref={value} placeholder="Type your nickname here" required />
                    <button type="submit">Login</button>
                </div>
            </form>
            <footer>
                <strong>Simple Chat</strong> by <a href="https://github.com/devproje">Project_IO</a>.
                The source code is licensed <strong><a href="https://github.com/devproje/simple-chat-frontend/blob/master/LICENSE">MIT</a></strong>.
            </footer>
        </>
    );
}
