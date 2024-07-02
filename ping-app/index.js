import Hyperswarm from "hyperswarm";
import crypto from "hypercore-crypto";
import b4a from "b4a";
import process from "bare-process";

const swarm = new Hyperswarm();
Pear.teardown(() => swarm.destroy());

// Keep track of all connections and console.log incoming data
swarm.on("connection", (conn) => {
  // console.log("conn", conn);
  // console.log("remotePublicKey", b4a.toString(conn.remotePublicKey, "hex"));
  // console.log("publicKey", b4a.toString(conn.publicKey, "hex"));

  const name = b4a.toString(conn.remotePublicKey, "hex");
  console.log("* got a connection from:", name, "*");
  console.log(`${[...swarm.connections].length} connections now.`);
  conn.on("data", (data) =>
    console.log(`received [${data}] from [${name.slice(0, 5)}]`)
  );
  conn.on("error", (e) => console.log(`Connection error: ${e}`));
  conn.once("close", () => {
    console.log("Connection Closed.");
  });
});

setInterval(() => {
  const peers = [...swarm.connections];
  console.log(`Sending PING to ${peers.length} connections`);
  for (const peer of peers) peer.write("PING");
}, 10000);

// Join a common topic
console.log("process.argv", process.argv);
const topic = process.argv[3]
  ? b4a.from(process.argv[3], "hex")
  : crypto.randomBytes(32);

const discovery = swarm.join(topic, { client: true, server: true });
// console.log("discovery", discovery);
console.log("swarm", swarm);
console.log(
  "swarm.keyPair.publicKey",
  b4a.toString(swarm.keyPair.publicKey, "hex")
);

// The flushed promise will resolve when the topic has been fully announced to the DHT
discovery.flushed().then(() => {
  console.log("joined topic:", b4a.toString(topic, "hex"));
});
