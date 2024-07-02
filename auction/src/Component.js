import { html } from "htm/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./App.js";
import { Piece } from "./Piece";

export function Component() {
  const value = useContext(AppContext);

  const {
    input,
    setInput,
    messages,

    pieces,
    createPiece,
    addPiece,
  } = value;

  return html`<div>
    <div>
      <button onClick=${createPiece}>Create Piece</button>
    </div>
    <div>
      <form
        onSubmit=${(e) => {
          e.preventDefault();
          addPiece(input);
        }}
      >
        <input onChange=${(e) => setInput(e.target.value)} value=${input} />
        <button>Add Piece</button>
      </form>
    </div>

    ${pieces.map((piece) => html` <${Piece} piece=${piece} /> `)}

    <div>
      <ol>
        ${messages.map((message) => html`<li>${message}</li>`)}
      </ol>
    </div>
  </div>`;
}
