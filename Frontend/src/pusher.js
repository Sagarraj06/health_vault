import Pusher from "pusher-js";

const key = import.meta.env.VITE_PUSHER_KEY;
const cluster = import.meta.env.VITE_PUSHER_CLUSTER;

let pusher = null;

if (key && cluster) {
    pusher = new Pusher(key, {
        cluster: cluster,
    });
} else {
    console.warn("Pusher environment variables missing. Real-time features disabled.");
}

export default pusher;
