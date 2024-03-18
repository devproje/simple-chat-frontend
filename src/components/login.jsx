function nicknameForm(event, /** @type {WebSocket} */ sock, [login, setLogin]) {
    event.preventDefault();
    if (login) {
        return;
    }

    if (sock.readyState !== WebSocket.OPEN) {
        console.log(exceptMessage.current);
        exceptMessage.current.textContent = "Error: IRC Server not opened.";
        return;
    }
    
    sock.send(make("set_username", nickname.current.value));
    nickname.current.value = "";
    setLogin(true);
}

export function Login({ socket, login, setLogin }) {
    return (
        <>
            <h1>Personal IRC Simple Chat</h1>
            <form className={styles.nickname} id="nickname" onSubmit={ev => nicknameForm(ev, socket, [login, setLogin])}>
                <code ref={exceptMessage} className={styles.except}></code>
                <div>
                    <input ref={nickname} type="text" placeholder="Type your nickname here" required />
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
