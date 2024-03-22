import styles from "@/styles/modules/SideBar.module.scss";

function close(ev, setOpen) {
    ev.preventDefault();
    setOpen(false);
}

function leave(ev, socket, setLogin) {
    ev.preventDefault();
    socket.close();

    setLogin(false);
}

export function SideBar({ socket, users, setOpen, setLogin }) {
    return (
        <div className={styles.sidebar}>
            <div className={styles.pane_title}>
                <button className={styles.close_btn} onClick={ev => close(ev, setOpen)}>
                    <i className="bi bi-x-lg" />
                </button>
                <h3 className={styles.online}>Online: {users.length} {users.length > 1 ? "Users" : "User"}</h3>
            </div>
            <div className={styles.user_list}>
                {users.map((user, index) => (
                    <div key={index} className={styles.items}>
                        <h3>{user.name}</h3>
                    </div>
                ))}
            </div>
            <div className={styles.pane_title}>
                <button className={styles.leave_btn} onClick={ev => leave(ev, socket, setLogin)}>
                    <h3>Leave</h3>
                </button>
            </div>
        </div>
    );
}
