import { html } from "htm/react";
import { useEffect, useState } from "react";
import { Component } from "./Component";
import { createContext } from "react";
import { addEventListener, joinSwarm, sendMessage } from "./swarm";
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

  function addMessage(newMessage) {
    setMessages((messages) => [...messages, newMessage]);
  }

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
  }}>
    <div>
      React App
      <${Component}></${Component}>
    </div>
  </>`;
}
