import styles from "@/styles/modules/SideBar.module.scss";

function close(ev, setOpen) {
    ev.preventDefault();
    setOpen(false);
}

export function SideBar({ isOpen, setOpen }) {
    return (
        <div className={styles.sidebar}>
            <button className={styles.close_btn} onClick={ev => close(ev, setOpen)}>
                <i className="bi bi-x-lg" />
            </button>
        </div>
    );
}
