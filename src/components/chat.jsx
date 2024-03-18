import styles from "@/styles/modules/Chat.module.scss";

function sendForm(event, /** @type {WebSocket} */ sock) {
    event.preventDefault();
    sock.send(make("new_message", message.current.value));
    message.current.value = "";
}

export function Chat() {
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.nav}>
                    <h1>Personal IRC Simple Chat</h1>
                </div>
                <div className={styles.chat_area}>
                    <div className={styles.msg_list}>
                        {messages.map((msg, index) => (
                            <div key={index} className={styles.msg}>
                                <p>{msg}</p>
                            </div>
                        ))}
                    </div>
                    <form className={styles.chat} id="send" onSubmit={ev => sendForm(ev, socket)}>
                        <input ref={message} type="text" placeholder="Type message here" required/>
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
            <div className={styles.online}></div>
        </div>
    );
}
