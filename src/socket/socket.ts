import { io } from "socket.io-client";

const socket = io("https://iqcanada.waysdatalabs.com/", {
    autoConnect: false
});

export default socket;

// http://localhost:3016/

// https://iqcanada.waysdatalabs.com/