import styles from "@/styles/modules/Login.module.scss";
import { make } from "@/util/make";
import React from "react";

function send(ref, addr, socket, [login, setLogin]) {
    if (login) {
        return;
    }

    const value = ref.current.value;
    
    socket.send(make("set_username", value));
    ref.current.value = "";
    addr.current.value = "";
    setLogin(true);
}

export function Login({ secure, setSecure, createSocket, login, setLogin }) {
    const ref = React.createRef();
    const addr = React.createRef();
    const except = React.createRef();
    const secureRef = React.createRef();

    return (
        <>
            <h1>IRC Simple Chat Client</h1>
            <form className={styles.input} onSubmit={ev => {
                ev.preventDefault();
                /** @type {WebSocket} */
                let socket = createSocket(secure, addr.current.value);

                setTimeout(() => {
                    if (socket.readyState !== socket.OPEN) {
                        except.current.innerText = "IRC Server is offline.";
                        return;
                    }

                    send(ref, addr, socket, [login, setLogin]);
                }, 300);
            }}>
                <code className={styles.except} ref={except}></code>
                <input type="text" ref={addr} placeholder="Type your address here" required />
                <input type="text" ref={ref} placeholder="Type your nickname here" required />
                <div>
                    <input type="checkbox" ref={secureRef} onClick={() => {
                        setSecure(!secureRef.current.checked);
                    }}/>
                    <label htmlFor={addr}>Unsecured connection option</label>
                </div>
                <button type="submit">Login</button>
            </form>
            <footer>
                <strong>Simple Chat</strong> 2024 by <a href="https://github.com/devproje">Project_IO</a>.
                This project is license for <strong><a href="https://github.com/devproje/simple-chat-frontend/blob/master/LICENSE">MIT</a></strong>.
            </footer>
        </>
    );
}
