import { io } from "socket.io-client";

const socket = io("https://iqcanada.waysdatalabs.com/", {
    autoConnect: true
});

export default socket;

// http://localhost:3015/