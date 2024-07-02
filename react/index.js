import { createRoot } from "react-dom/client";
import { html } from "htm/react";
import { App } from "./src/App";

const root = createRoot(document.querySelector("#root"));
root.render(html`<${App} />`);
