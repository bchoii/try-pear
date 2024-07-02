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

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

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
    sendMessage(
      JSON.stringify({ action: "bid", pieceId, bidSource: getSelf() })
    );
  }

  function close(pieceId) {
    console.log("Close", pieceId);
    setPieces((pieces) => pieces.filter((p) => p.pieceId != pieceId));
  }

  return html`<${AppContext.Provider} value=${{
    input,
    setInput,
    messages,

    pieces,
    createPiece,
    addPiece,

    bid,
    close,
  }}>
    <div>
      Auction App
      <${Component}></${Component}>
    </div>
  </>`;
}
