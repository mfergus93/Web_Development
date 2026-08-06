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

function updatePageTabs(hash) {
	const selectedTab = hash === "#photography" ? "photography" : "professional";
	document.querySelectorAll(".page-tabs [data-tab]").forEach((tab) => {
		if (tab.dataset.tab === selectedTab) {
			tab.setAttribute("aria-current", "page");
		} else {
			tab.removeAttribute("aria-current");
		}
	});
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
	link.addEventListener("click", () => {
		openLinkedSection(link.hash);
		updatePageTabs(link.hash);
	});
});

openLinkedSection(window.location.hash);
updatePageTabs(window.location.hash);
window.addEventListener("hashchange", () => {
	openLinkedSection(window.location.hash);
	updatePageTabs(window.location.hash);
});
