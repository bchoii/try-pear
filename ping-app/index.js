import Hyperswarm from "hyperswarm";
import crypto from "hypercore-crypto";
import b4a from "b4a";
import process from "bare-process";

const swarm = new Hyperswarm();
Pear.teardown(() => swarm.destroy());

// Keep track of all connections and console.log incoming data
const conns = [];
swarm.on("connection", (conn) => {
  const name = b4a.toString(conn.remotePublicKey, "hex");
  console.log("* got a connection from:", name, "*");
  conns.push(conn);
  console.log(`${conns.length} connections now.`);
  conn.once("close", () => {
    console.log("Connection Closed.");
    conns.splice(conns.indexOf(conn), 1);
  });
  conn.on("data", (data) =>
    console.log(`received [${data}] from [${name.slice(0, 5)}]`)
  );
  conn.on("error", (e) => console.log(`Connection error: ${e}`));
});

setInterval(() => {
  console.log(`Sending PING to ${conns.length} connections`);
  for (const conn of conns) {
    conn.write(`PING`);
  }
}, 10000);

// Join a common topic
console.log("process.argv", process.argv);
const topic = process.argv[3]
  ? b4a.from(process.argv[3], "hex")
  : crypto.randomBytes(32);

const discovery = swarm.join(topic, { client: true, server: true });

// The flushed promise will resolve when the topic has been fully announced to the DHT
discovery.flushed().then(() => {
  console.log("joined topic:", b4a.toString(topic, "hex"));
});
