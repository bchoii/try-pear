/* global Pear */
import Hyperswarm from "hyperswarm"; // Module for P2P networking and connecting peers
import crypto from "hypercore-crypto"; // Cryptographic functions for generating the key in app
import b4a from "b4a"; // Module for buffer-to-string and vice-versa conversions

const { teardown } = Pear; // Cleanup function

const swarm = new Hyperswarm();

teardown(() => swarm.destroy());

const listeners = {};

export function addEventListener(event, listener) {
  listeners[event] = listeners[event] || [];
  listeners[event].push(listener);
}

export function removeEventListener(event, listener) {
  (listeners[event] || []).splice(listeners.indexOf(listener), 1);
}

function fireEvent(event, payload) {
  console.log("event fired", event, payload);
  for (const listener of listeners[event] || []) {
    listener(payload);
  }
}

// When there's a new connection, listen for new messages, and add them to the UI
swarm.on("connection", (peer) => {
  const source = b4a.toString(peer.remotePublicKey, "hex");
  peer.on("data", (payload) => {
    console.log("message received", { source, content: payload.toString() });
    fireEvent("newMessage", { source, content: payload.toString() });
  });
  peer.on("error", (e) => console.log(`Connection error: ${e}`));
});

// When there's updates to the swarm, update the peers count
swarm.on("update", () => {
  console.log("swarm updated", swarm);
  fireEvent("newConnection", swarm.connections.size);
});

export async function joinSwarm(topic) {
  console.log("joining swarm");
  const topicBuffer = b4a.from(topic, "hex");
  const discovery = swarm.join(topicBuffer, { client: true, server: true });
  await discovery.flushed();
}

export function sendMessage(message) {
  console.log("sending message");
  const peers = [...swarm.connections];
  for (const peer of peers) peer.write(message);
}

export function getSelf() {
  return b4a.toString(swarm.keyPair.publicKey, "hex");
}
