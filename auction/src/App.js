import { html } from "htm/react";
import { useEffect, useState } from "react";
import { Component } from "./Component";
import { createContext } from "react";
import { addEventListener, getSelf, joinSwarm, sendMessage } from "./swarm";
import crypto from "hypercore-crypto"; // Cryptographic functions for generating the key in app
import b4a from "b4a"; // Module for buffer-to-string and vice-versa conversions

export const AppContext = createContext();

export function App() {
  useEffect(() => {
    function connectionLister(size) {
      addMessage(`new connection. now ${size}`);
    }
    function messageListener({ source, content }) {
      addMessage(`[${source}]: ${content}`);
    }
    addEventListener("newConnection", connectionLister);
    addEventListener("newMessage", messageListener);
    return () => {
      removeEventListener("newConnection", connectionLister);
      removeEventListener("newMessage", messageListener);
    };
  }, []);

  const [topic, setTopic] = useState();
  const [joined, setJoined] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function create() {
    addMessage("Creating topic...");
    const topic = b4a.toString(crypto.randomBytes(32), "hex");
    setTopic(topic);
    addMessage(`Topic created. ${topic}`);
  }

  async function join() {
    addMessage(`Joining topic... ${topic}`);
    await joinSwarm(topic);
    setJoined(true);
    addMessage(`Joined topic. ${topic}`);
  }

  function send() {
    sendMessage(input);
    addMessage(`<Me>:${input}`);
    setInput("");
  }

  function addMessage(...newMessage) {
    setMessages((messages) => [...messages, ...newMessage]);
  }

  const [pieces, setPieces] = useState([]);
  async function createPiece() {
    addMessage("Creating piece...");
    const newPiece = {
      pieceId: b4a.toString(crypto.randomBytes(32), "hex"),
      pieceSource: getSelf(),
    };
    await joinSwarm(newPiece.pieceId);
    setPieces((pieces) => [...pieces, newPiece]);
    addMessage("Piece created", newPiece.pieceId);
  }

  async function addPiece(pieceId) {
    addMessage("Adding piece...");
    const newPiece = { pieceId };
    await joinSwarm(pieceId);
    setPieces((pieces) => [...pieces, newPiece]);
    addMessage("Piece added", newPiece.pieceId);
  }

  function bid(pieceId) {
    console.log("bid", pieceId);
    sendMessage(pieceId);
  }

  function close(pieceId) {}

  return html`<${AppContext.Provider} value=${{
    topic,
    setTopic,
    create,
    joined,
    join,
    input,
    setInput,
    send,
    messages,

    pieces,
    createPiece,
    addPiece,

    bid,
  }}>
    <div>
      React App
      <${Component}></${Component}>
    </div>
  </>`;
}
