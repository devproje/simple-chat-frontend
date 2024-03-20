import Head from "next/head";
import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.scss";
import styles from "@/styles/modules/Home.module.scss";
import { Login } from "@/components/login";
import { Chat } from "@/components/chat";

/** @type {WebSocket} */
let socket;

function createSocket(type, addr) {
    socket = new WebSocket(`${type}://${addr}/ws`);
}

export default function Home() {
    const [login, setLogin] = useState(false);

    createSocket("ws", "localhost:8080");

    function render() {
        if (!login) {
            return <Login socket={socket} createSocket={createSocket} login={login} setLogin={setLogin} />
        }

        return <Chat socket={socket} />;
    }

    return (
        <>
            <Head>
                <title>Personal IRC Simple Chat</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                {render()}
            </main>
        </>
    );
}
