import { html } from "htm/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./App.js";

export function Piece({ piece }) {
  const value = useContext(AppContext);

  const { bid } = value;

  return html`<div class="box">
    <div>Piece #${piece.pieceId}</div>
    <button onClick=${() => bid(piece.pieceId

    )}>Bid</button>
    <pre>${JSON.stringify(piece)}</pre>
  </div>`;
}
