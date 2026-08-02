"use strict";

function ensureStatusBar() {
	const resizable = document.querySelector("#resizable");
	if (!resizable || resizable.querySelector("#statusbar")) return;
	const status = document.createElement("div");
	status.id = "statusbar";
	status.setAttribute("aria-hidden", "true");
	resizable.append(status);
}

const shellObserver = new MutationObserver(ensureStatusBar);
shellObserver.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener("load", ensureStatusBar);
ensureStatusBar();
