import DHT from "hyperdht";
import b4a from "b4a";
import process from "bare-process";

console.log("process.argv", process.argv);
console.log("Connecting to:", process.argv[3]);
const publicKey = b4a.from(process.argv[3], "hex");

const dht = new DHT();
const conn = dht.connect(publicKey);
conn.once("open", () => console.log("got connection!"));

process.stdin.pipe(conn).pipe(process.stdout);
