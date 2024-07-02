import { html } from "htm/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./App.js";
import { Piece } from "./Piece";

export function Component() {
  const value = useContext(AppContext);

  const {
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
  } = value;

  return html`<div>
    ${!joined &&
    html`<button onClick=${create}>Create</button>
      <input onInput=${(e) => setTopic(e.target.value)} value=${topic} />
      <button disabled=${!topic} onClick=${join}>Join</button>`}
    ${joined &&
    html`
      <div>
        <form
          onSubmit=${(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input onChange=${(e) => setInput(e.target.value)} value=${input} />
        </form>
      </div>
    `}
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

    ${pieces.map(
      (piece) => html`
        <div>
          <${Piece} piece=${piece} />
        </div>
      `
    )}

    <div>
      <ol>
        ${messages.map((message) => html`<li>${message}</li>`)}
      </ol>
    </div>
  </div>`;
}
