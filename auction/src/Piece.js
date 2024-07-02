import { html } from "htm/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./App.js";
import { addEventListener, getSelf, removeEventListener } from "./swarm.js";

export function Piece({ piece }) {
  const value = useContext(AppContext);
  const [bidCount, setBidCount] = useState(0);
  const [bidSource, setBidSource] = useState();

  useEffect(() => {
    function listener(message) {
      const { source } = message;
      const { action, pieceId } = JSON.parse(message.content);
      console.log("new Message", source, action, pieceId);
      if (pieceId == piece.pieceId) {
        setBidSource(source);
        setBidCount((bidCount) => bidCount + 1);
      }
    }
    addEventListener("newMessage", listener);
    return () => {
      removeEventListener("newMessage", listener);
    };
  }, []);

  const { bid, close } = value;

  return html`<div class="box">
    <div>Piece #${piece.pieceId}</div>
    ${piece.pieceSource == getSelf()
      ? html`
          <div>Bid Count: ${bidCount}</div>
          <div>Latest Bid By: ${bidSource}</div>
          <div>
            <button onClick=${() => close(piece.pieceId)}>Close</button>
          </div>
        `
      : html`<button onClick=${() => bid(piece.pieceId)}>Bid</button>`}
  </div>`;
}
