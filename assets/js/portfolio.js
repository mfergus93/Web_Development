"use strict";

function openLinkedSection(hash) {
	if (!hash || hash === "#") return;
	let id;
	try {
		id = decodeURIComponent(hash.slice(1));
	} catch {
		return;
	}
	const target = document.getElementById(id);
	if (target instanceof HTMLDetailsElement) target.open = true;
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
	link.addEventListener("click", () => openLinkedSection(link.hash));
});

openLinkedSection(window.location.hash);
