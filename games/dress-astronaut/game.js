"use strict";

const NS = "http://www.w3.org/2000/svg";
const defaults = { background: "moon", helmet: "classic", faceAccessory: "none", suit: "white", feet: "boots", accessory1: "none", accessory2: "none" };
const suitColors = { white: "#f4f4f0", orange: "#ee8739", pink: "#ef9fba", blue: "#72a8d4", overalls: "#f4f4f0", tuxedo: "#222", plaid: "#682938" };
const labels = {
	backgrounds: { moon: "the Moon", mars: "Mars", station: "a space station", castle: "a castle", beach: "a beach", cornfield: "a cornfield" },
	helmets: { classic: "classic helmet", bubble: "bubble helmet", cowboy: "cowboy helmet", dunce: "Love Island dunce cap", fish: "Fish Magnet hat", hardhat: "hardhat", bow: "bow" },
	faceAccessories: { none: "no face accessory", mustache: "handlebar mustache", googly: "googly eyes", clown: "clown nose", eyepatch: "eye patch", monocle: "monocle", glasses: "glasses" },
	suits: { white: "white suit", orange: "orange suit", pink: "pink suit", blue: "blue suit", overalls: "farmer's overalls", tuxedo: "tuxedo", plaid: "burgundy plaid shirt" },
	feet: { boots: "moon boots", flippers: "flippers", toes: "two giant toes", timbs: "Timbs", jordans: "Jordans", heels: "high heels" },
	accessories: {
		none: "no accessory", flag: "flag", jetpack: "jetpack", duck: "space duck", pitchfork: "farmer's pitchfork",
		guitar: "acoustic guitar", wrench: "oversized wrench", net: "butterfly net", flowers: "bouquet of flowers",
		coffee: "coffee mug", baton: "glow baton", bags: "shopping bags", lollipop: "giant lollipop",
		chicken: "rubber chicken", telescope: "telescope", pizza: "pizza slice", alien: "tiny alien companion",
		vacuum: "vacuum cleaner", disco: "disco ball", trophy: "World's Okayest Astronaut trophy", cactus: "emotional-support cactus"
	}
};
const state = { ...defaults };
const DUNCE_RANDOM_LIMIT = 3;
const DUNCE_RANDOM_COUNT_KEY = "astronautDressup.dunceRandomCount";

function getDunceRandomCount() {
	try {
		const stored = Number.parseInt(window.localStorage.getItem(DUNCE_RANDOM_COUNT_KEY), 10);
		return Number.isFinite(stored) ? Math.min(Math.max(stored, 0), DUNCE_RANDOM_LIMIT) : 0;
	} catch (error) {
		return 0;
	}
}

function recordDunceRandomClick(count) {
	try {
		window.localStorage.setItem(DUNCE_RANDOM_COUNT_KEY, String(count));
	} catch (error) {
		// Randomization still works when browser storage is unavailable.
	}
}

const astronaut = document.querySelector("#astronaut");
const backgroundLayer = document.querySelector("#background-layer");
const suitLayer = document.querySelector("#suit-layer");
const helmetLayer = document.querySelector("#helmet-layer");
const faceAccessoryLayer = document.querySelector("#face-accessory-layer");
const feetLayer = document.querySelector("#feet-layer");
const behindLayer = document.querySelector("#accessory-behind");
const frontLayer = document.querySelector("#accessory-front");
const description = document.querySelector("#astronaut-description");
const status = document.querySelector("#outfit-status");

function svg(tag, attributes = {}) {
	const element = document.createElementNS(NS, tag);
	Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
	return element;
}

function add(layer, tag, attributes) {
	const element = svg(tag, attributes);
	layer.append(element);
	return element;
}

function addText(layer, text, attributes) {
	const element = add(layer, "text", attributes);
	element.textContent = text;
	return element;
}

function clear(...layers) {
	layers.forEach((layer) => layer.replaceChildren());
}

function drawFace() {
	add(helmetLayer, "circle", { cx: 210, cy: 137, r: 49, fill: "#d9a47d", stroke: "#333", "stroke-width": 3 });
	add(helmetLayer, "circle", { cx: 193, cy: 137, r: 4, fill: "#222" });
	add(helmetLayer, "circle", { cx: 227, cy: 137, r: 4, fill: "#222" });
	add(helmetLayer, "path", { d: "M195 156 Q210 166 225 156", fill: "none", stroke: "#7a493d", "stroke-width": 3, "stroke-linecap": "round" });
}

function drawBackground() {
	if (state.background === "station") {
		add(backgroundLayer, "rect", { width: 420, height: 540, fill: "#747d86" });
		add(backgroundLayer, "rect", { x: 42, y: 35, width: 336, height: 280, rx: 48, fill: "#101827", stroke: "#343a40", "stroke-width": 16 });
		add(backgroundLayer, "circle", { cx: 210, cy: 192, r: 104, fill: "#277ac2" });
		add(backgroundLayer, "path", { d: "M122 159 Q158 128 182 151 Q202 118 229 145 Q267 132 296 168 Q267 180 252 211 Q223 222 203 201 Q169 221 133 195Z", fill: "#70ad67" });
		add(backgroundLayer, "path", { d: "M0 366 H420 V540 H0Z", fill: "#9aa2a9" });
		[38,106,174,242,310,378].forEach((x) => add(backgroundLayer, "line", { x1: x, y1: 366, x2: x, y2: 540, stroke: "#6d757c", "stroke-width": 3 }));
		add(backgroundLayer, "rect", { x: 12, y: 80, width: 38, height: 205, fill: "#4e5962", stroke: "#333", "stroke-width": 3 });
		add(backgroundLayer, "rect", { x: 370, y: 80, width: 38, height: 205, fill: "#4e5962", stroke: "#333", "stroke-width": 3 });
		return;
	}
	if (state.background === "castle") {
		add(backgroundLayer, "rect", { width: 420, height: 540, fill: "#b9d8e8" });
		add(backgroundLayer, "circle", { cx: 345, cy: 73, r: 34, fill: "#f5dc8a" });
		add(backgroundLayer, "rect", { y: 360, width: 420, height: 180, fill: "#6f9658" });
		add(backgroundLayer, "path", { d: "M35 370 V184 H96 V370 M324 370 V184 H385 V370 M92 370 V233 H328 V370", fill: "#a79b88", stroke: "#554e45", "stroke-width": 4 });
		add(backgroundLayer, "path", { d: "M35 184 V156 H50 V171 H65 V156 H81 V171 H96 V184 M324 184 V156 H339 V171 H354 V156 H370 V171 H385 V184 M92 233 V207 H112 V221 H132 V207 H152 V221 H172 V207 H192 V221 H212 V207 H232 V221 H252 V207 H272 V221 H292 V207 H312 V221 H328 V233", fill: "#a79b88", stroke: "#554e45", "stroke-width": 4, "stroke-linejoin": "round" });
		add(backgroundLayer, "path", { d: "M188 370 V308 Q210 274 232 308 V370Z", fill: "#4c3d34" });
		return;
	}
	if (state.background === "beach") {
		add(backgroundLayer, "rect", { width: 420, height: 540, fill: "#8dd2ed" });
		add(backgroundLayer, "circle", { cx: 350, cy: 72, r: 38, fill: "#f7d45b" });
		add(backgroundLayer, "path", { d: "M0 296 Q100 277 210 300 T420 294 V420 H0Z", fill: "#3f9fc6" });
		add(backgroundLayer, "path", { d: "M0 326 Q104 303 212 330 T420 319", fill: "none", stroke: "#d8f4ff", "stroke-width": 10 });
		add(backgroundLayer, "path", { d: "M0 382 Q110 339 220 375 T420 359 V540 H0Z", fill: "#e7c983" });
		add(backgroundLayer, "line", { x1: 64, y1: 171, x2: 82, y2: 390, stroke: "#8b5a2b", "stroke-width": 7 });
		add(backgroundLayer, "path", { d: "M25 179 Q62 116 111 170 Q72 159 25 179Z", fill: "#e85d5d", stroke: "#333", "stroke-width": 3 });
		return;
	}
	if (state.background === "cornfield") {
		add(backgroundLayer, "rect", { width: 420, height: 540, fill: "#add8ed" });
		add(backgroundLayer, "circle", { cx: 350, cy: 72, r: 37, fill: "#f2d064" });
		add(backgroundLayer, "rect", { y: 342, width: 420, height: 198, fill: "#85643f" });
		for (let x = 18; x < 420; x += 34) {
			add(backgroundLayer, "line", { x1: x, y1: 382, x2: x + 3, y2: 249, stroke: "#527c36", "stroke-width": 6 });
			add(backgroundLayer, "path", { d: `M${x+2} 300 Q${x-18} 278 ${x-15} 260 M${x+2} 326 Q${x+24} 302 ${x+22} 282`, fill: "none", stroke: "#6f9947", "stroke-width": 7, "stroke-linecap": "round" });
			add(backgroundLayer, "ellipse", { cx: x + 4, cy: 287, rx: 8, ry: 21, fill: "#e0b63d", stroke: "#8b7130", "stroke-width": 2 });
		}
		add(backgroundLayer, "path", { d: "M0 389 Q110 361 210 389 T420 382 V540 H0Z", fill: "#a77b49", opacity: ".7" });
		return;
	}
	if (state.background === "mars") {
		add(backgroundLayer, "rect", { width: 420, height: 540, fill: "#d49a78" });
		add(backgroundLayer, "circle", { cx: 348, cy: 79, r: 35, fill: "#f4c58c", opacity: ".72" });
		add(backgroundLayer, "path", { d: "M0 357 L75 292 L126 337 L190 276 L267 345 L333 307 L420 363 V540 H0Z", fill: "#9f5f4d" });
		add(backgroundLayer, "path", { d: "M0 389 Q95 350 184 394 T420 382 V540 H0Z", fill: "#b96e54" });
		add(backgroundLayer, "ellipse", { cx: 75, cy: 457, rx: 49, ry: 14, fill: "#955542", opacity: ".55" });
		add(backgroundLayer, "ellipse", { cx: 352, cy: 421, rx: 38, ry: 10, fill: "#955542", opacity: ".5" });
		return;
	}
	add(backgroundLayer, "rect", { width: 420, height: 540, fill: "#101827" });
	[[45,55,2],[92,118,1.5],[154,51,1.5],[281,74,2],[361,128,1.5],[393,47,1],[35,210,1],[374,235,2]].forEach(([cx,cy,r]) => add(backgroundLayer, "circle", { cx, cy, r, fill: "#fff" }));
	add(backgroundLayer, "path", { d: "M0 390 Q70 348 137 390 Q210 344 277 390 Q350 351 420 382 V540 H0Z", fill: "#b9bcc0" });
	add(backgroundLayer, "ellipse", { cx: 74, cy: 444, rx: 45, ry: 13, fill: "#92969b" });
	add(backgroundLayer, "ellipse", { cx: 350, cy: 420, rx: 34, ry: 10, fill: "#92969b" });
}

function drawHelmet() {
	if (state.helmet === "bubble") {
		const clip = add(helmetLayer, "clipPath", { id: "bubble-water-clip" });
		add(clip, "circle", { cx: 210, cy: 136, r: 74 });
		add(helmetLayer, "circle", { cx: 210, cy: 136, r: 78, fill: "#dff5ff", "fill-opacity": ".72", stroke: "#333", "stroke-width": 5 });
		drawFace();
		add(helmetLayer, "path", { d: "M136 145 Q154 137 173 145 T210 145 T247 145 T284 145 V216 H136Z", fill: "#55b9df", "fill-opacity": ".55", "clip-path": "url(#bubble-water-clip)" });
		add(helmetLayer, "path", { d: "M136 145 Q154 137 173 145 T210 145 T247 145 T284 145", fill: "none", stroke: "#218bb5", "stroke-width": 3, "clip-path": "url(#bubble-water-clip)" });
		add(helmetLayer, "ellipse", { cx: 240, cy: 169, rx: 13, ry: 8, fill: "#f2a12d", stroke: "#8a5219", "stroke-width": 2 });
		add(helmetLayer, "path", { d: "M228 169 L216 159 L216 179Z", fill: "#f2a12d", stroke: "#8a5219", "stroke-width": 2, "stroke-linejoin": "round" });
		add(helmetLayer, "circle", { cx: 246, cy: 167, r: 2, fill: "#222" });
		add(helmetLayer, "circle", { cx: 260, cy: 151, r: 3, fill: "none", stroke: "#218bb5", "stroke-width": 2 });
		add(helmetLayer, "circle", { cx: 267, cy: 141, r: 5, fill: "none", stroke: "#218bb5", "stroke-width": 2 });
		add(helmetLayer, "path", { d: "M166 91 Q192 66 225 71", fill: "none", stroke: "#fff", "stroke-width": 8, "stroke-linecap": "round", opacity: ".8" });
		return;
	}

	add(helmetLayer, "circle", { cx: 210, cy: 137, r: 69, fill: "#f4f4f0", stroke: "#333", "stroke-width": 5 });
	add(helmetLayer, "ellipse", { cx: 210, cy: 139, rx: 55, ry: 47, fill: "#9bd0e5", stroke: "#333", "stroke-width": 4 });
	drawFace();
	add(helmetLayer, "path", { d: "M170 105 Q195 83 224 89", fill: "none", stroke: "#fff", "stroke-width": 7, "stroke-linecap": "round", opacity: ".7" });

	if (state.helmet === "cowboy") {
		add(helmetLayer, "path", { d: "M147 76 Q210 57 273 76 Q255 89 210 88 Q165 89 147 76Z", fill: "#8b5a2b", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(helmetLayer, "path", { d: "M177 70 L184 34 Q210 21 236 34 L243 70Z", fill: "#a96f35", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(helmetLayer, "path", { d: "M181 58 Q210 68 239 58", fill: "none", stroke: "#4e321d", "stroke-width": 6 });
	} else if (state.helmet === "dunce") {
		add(helmetLayer, "path", { d: "M166 81 L210 3 L254 81Z", fill: "#f3efe2", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(helmetLayer, "ellipse", { cx: 210, cy: 81, rx: 52, ry: 11, fill: "#f3efe2", stroke: "#333", "stroke-width": 4 });
		addText(helmetLayer, "I ♥", { x: 210, y: 30, "text-anchor": "middle", fill: "#c33", "font-family": "Arial, sans-serif", "font-size": 9, "font-weight": 700 });
		helmetLayer.lastElementChild.setAttribute("y", "35");
		addText(helmetLayer, "LOVE", { x: 210, y: 49, "text-anchor": "middle", fill: "#222", "font-family": "Arial, sans-serif", "font-size": 8, "font-weight": 700 });
		addText(helmetLayer, "ISLAND", { x: 210, y: 62, "text-anchor": "middle", fill: "#222", "font-family": "Arial, sans-serif", "font-size": 8, "font-weight": 700 });
	} else if (state.helmet === "fish") {
		add(helmetLayer, "path", { d: "M164 74 Q170 23 210 21 Q250 23 256 74Z", fill: "#71845b", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(helmetLayer, "path", { d: "M150 75 Q210 58 270 75 Q253 91 210 87 Q167 91 150 75Z", fill: "#63764e", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		addText(helmetLayer, "WOMEN FEAR ME", { x: 210, y: 43, "text-anchor": "middle", fill: "#fff", "font-family": "Verdana, Arial, sans-serif", "font-size": 8, "font-weight": 700 });
		addText(helmetLayer, "FISH WANT ME", { x: 210, y: 56, "text-anchor": "middle", fill: "#fff", "font-family": "Verdana, Arial, sans-serif", "font-size": 8, "font-weight": 700 });
	} else if (state.helmet === "hardhat") {
		add(helmetLayer, "path", { d: "M161 82 Q166 34 210 29 Q254 34 259 82Z", fill: "#f2c230", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(helmetLayer, "path", { d: "M210 31 V76 M151 82 H269", fill: "none", stroke: "#333", "stroke-width": 7, "stroke-linecap": "round" });
	} else if (state.helmet === "bow") {
		add(helmetLayer, "path", { d: "M207 73 Q170 43 163 68 Q162 89 207 79Z M213 73 Q250 43 257 68 Q258 89 213 79Z", fill: "#e76b91", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(helmetLayer, "circle", { cx: 210, cy: 76, r: 12, fill: "#f08aaa", stroke: "#333", "stroke-width": 4 });
	}
}

function drawFaceAccessory() {
	if (state.faceAccessory === "mustache") {
		add(faceAccessoryLayer, "path", { d: "M210 151 C197 143 183 145 178 156 C187 155 194 162 210 157 C226 162 233 155 242 156 C237 145 223 143 210 151Z", fill: "#55351f", stroke: "#2d2118", "stroke-width": 2, "stroke-linejoin": "round" });
	} else if (state.faceAccessory === "googly") {
		add(faceAccessoryLayer, "circle", { cx: 191, cy: 137, r: 13, fill: "#fff", stroke: "#222", "stroke-width": 2 });
		add(faceAccessoryLayer, "circle", { cx: 229, cy: 137, r: 13, fill: "#fff", stroke: "#222", "stroke-width": 2 });
		add(faceAccessoryLayer, "circle", { cx: 195, cy: 141, r: 6, fill: "#222" });
		add(faceAccessoryLayer, "circle", { cx: 225, cy: 132, r: 6, fill: "#222" });
	} else if (state.faceAccessory === "clown") {
		add(faceAccessoryLayer, "circle", { cx: 210, cy: 149, r: 11, fill: "#df3e48", stroke: "#8d2028", "stroke-width": 2 });
	} else if (state.faceAccessory === "eyepatch") {
		add(faceAccessoryLayer, "path", { d: "M165 115 L252 153", fill: "none", stroke: "#222", "stroke-width": 3.5 });
		add(faceAccessoryLayer, "path", { d: "M213 131 Q227 122 241 131 L238 147 Q227 155 216 147Z", fill: "#222", stroke: "#111", "stroke-width": 2 });
	} else if (state.faceAccessory === "monocle") {
		add(faceAccessoryLayer, "circle", { cx: 231, cy: 137, r: 18, fill: "none", stroke: "#b7903c", "stroke-width": 4 });
		add(faceAccessoryLayer, "path", { d: "M245 149 Q258 175 250 203", fill: "none", stroke: "#b7903c", "stroke-width": 3, "stroke-linecap": "round" });
	} else if (state.faceAccessory === "glasses") {
		add(faceAccessoryLayer, "circle", { cx: 188, cy: 137, r: 20, fill: "none", stroke: "#222", "stroke-width": 4 });
		add(faceAccessoryLayer, "circle", { cx: 232, cy: 137, r: 20, fill: "none", stroke: "#222", "stroke-width": 4 });
		add(faceAccessoryLayer, "path", { d: "M208 136 Q210 132 212 136 M168 134 L157 130 M252 134 L263 130", fill: "none", stroke: "#222", "stroke-width": 4, "stroke-linecap": "round" });
	}
}

function drawSuit() {
	if (state.suit === "plaid") {
		const clip = add(suitLayer, "clipPath", { id: "plaid-shirt-clip" });
		add(clip, "path", { d: "M132 188 Q210 159 288 188 L275 352 Q210 374 145 352Z" });
		const armClip = add(suitLayer, "clipPath", { id: "plaid-arm-clip" });
		add(armClip, "path", { d: "M142 205 Q111 214 88 267 L109 282 Q135 250 158 231Z M278 205 Q309 214 332 267 L311 282 Q285 250 262 231Z" });
		add(suitLayer, "path", { d: "M142 325 L199 325 L192 463 L129 463Z M221 325 L278 325 L291 463 L228 463Z", fill: "#4f7092", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(suitLayer, "path", { d: "M142 205 Q111 214 88 267 L109 282 Q135 250 158 231Z M278 205 Q309 214 332 267 L311 282 Q285 250 262 231Z", fill: "#682938", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		[104, 132, 288, 316].forEach((x) => add(suitLayer, "line", { x1: x, y1: 194, x2: x, y2: 292, stroke: "#211a1c", "stroke-width": 6, opacity: ".72", "clip-path": "url(#plaid-arm-clip)" }));
		[222, 246, 270].forEach((y) => add(suitLayer, "line", { x1: 78, y1: y, x2: 342, y2: y, stroke: "#211a1c", "stroke-width": 6, opacity: ".72", "clip-path": "url(#plaid-arm-clip)" }));
		[116, 300].forEach((x) => add(suitLayer, "line", { x1: x, y1: 194, x2: x, y2: 292, stroke: "#b56a78", "stroke-width": 2, opacity: ".8", "clip-path": "url(#plaid-arm-clip)" }));
		[234, 258].forEach((y) => add(suitLayer, "line", { x1: 78, y1: y, x2: 342, y2: y, stroke: "#b56a78", "stroke-width": 2, opacity: ".8", "clip-path": "url(#plaid-arm-clip)" }));
		add(suitLayer, "path", { d: "M132 188 Q210 159 288 188 L275 352 Q210 374 145 352Z", fill: "#682938", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		[166, 194, 222, 250].forEach((x) => add(suitLayer, "line", { x1: x, y1: 174, x2: x, y2: 362, stroke: "#211a1c", "stroke-width": 7, opacity: ".72", "clip-path": "url(#plaid-shirt-clip)" }));
		[216, 252, 288, 324].forEach((y) => add(suitLayer, "line", { x1: 126, y1: y, x2: 294, y2: y, stroke: "#211a1c", "stroke-width": 7, opacity: ".72", "clip-path": "url(#plaid-shirt-clip)" }));
		[180, 208, 236, 264].forEach((x) => add(suitLayer, "line", { x1: x, y1: 174, x2: x, y2: 362, stroke: "#b56a78", "stroke-width": 2, opacity: ".8", "clip-path": "url(#plaid-shirt-clip)" }));
		[234, 270, 306, 342].forEach((y) => add(suitLayer, "line", { x1: 126, y1: y, x2: 294, y2: y, stroke: "#b56a78", "stroke-width": 2, opacity: ".8", "clip-path": "url(#plaid-shirt-clip)" }));
		add(suitLayer, "path", { d: "M169 181 L210 213 L191 232 L163 195Z M251 181 L210 213 L229 232 L257 195Z", fill: "#7b3443", stroke: "#211a1c", "stroke-width": 3, "stroke-linejoin": "round" });
		add(suitLayer, "line", { x1: 210, y1: 213, x2: 210, y2: 351, stroke: "#211a1c", "stroke-width": 3 });
		[241, 270, 299, 328].forEach((y) => add(suitLayer, "circle", { cx: 210, cy: y, r: 3, fill: "#d6c5b5", stroke: "#211a1c", "stroke-width": 1 }));
		add(suitLayer, "rect", { x: 230, y: 244, width: 29, height: 28, rx: 2, fill: "#682938", stroke: "#211a1c", "stroke-width": 2 });
		return;
	}

	if (state.suit === "tuxedo") {
		add(suitLayer, "path", { d: "M145 193 L190 216 L210 345 L154 350Z M275 193 L230 216 L210 345 L266 350Z", fill: "#191919", stroke: "#333", "stroke-width": 3, "stroke-linejoin": "round" });
		add(suitLayer, "path", { d: "M181 194 L210 227 L239 194 L229 263 H191Z", fill: "#fff", stroke: "#333", "stroke-width": 3, "stroke-linejoin": "round" });
		add(suitLayer, "path", { d: "M210 224 L192 211 L190 238 L210 230 L230 238 L228 211Z", fill: "#b52e36", stroke: "#333", "stroke-width": 2, "stroke-linejoin": "round" });
		add(suitLayer, "circle", { cx: 210, cy: 277, r: 4, fill: "#eee" });
		add(suitLayer, "circle", { cx: 210, cy: 299, r: 4, fill: "#eee" });
		return;
	}

	if (state.suit !== "overalls") return;

	add(suitLayer, "path", { d: "M164 226 L256 226 L266 350 Q210 366 154 350Z", fill: "#527ca5", stroke: "#333", "stroke-width": 3, "stroke-linejoin": "round" });
	add(suitLayer, "path", { d: "M165 190 L181 186 L194 235 L178 241Z M255 190 L239 186 L226 235 L242 241Z", fill: "#527ca5", stroke: "#333", "stroke-width": 3, "stroke-linejoin": "round" });
	add(suitLayer, "path", { d: "M142 325 L199 325 L192 463 L129 463Z M221 325 L278 325 L291 463 L228 463Z", fill: "#527ca5", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
	add(suitLayer, "rect", { x: 181, y: 259, width: 58, height: 42, rx: 4, fill: "#668eb5", stroke: "#333", "stroke-width": 3 });
	add(suitLayer, "path", { d: "M191 274 Q210 285 229 274", fill: "none", stroke: "#d9e3ec", "stroke-width": 2 });
	add(suitLayer, "circle", { cx: 181, cy: 211, r: 4, fill: "#d6aa45", stroke: "#333", "stroke-width": 1 });
	add(suitLayer, "circle", { cx: 239, cy: 211, r: 4, fill: "#d6aa45", stroke: "#333", "stroke-width": 1 });
}

function drawFeet() {
	if (state.feet === "boots") {
		add(feetLayer, "path", { d: "M126 449 H194 V488 Q169 501 113 489 L116 466Z", fill: "#777", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(feetLayer, "path", { d: "M226 449 H294 L307 489 Q251 501 226 488Z", fill: "#777", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		return;
	}

	if (state.feet === "flippers") {
		add(feetLayer, "path", { d: "M130 449 H192 L185 478 L88 505 Q77 496 91 482Z", fill: "#58b8b0", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(feetLayer, "path", { d: "M228 449 H290 L329 482 Q343 496 332 505 L235 478Z", fill: "#58b8b0", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		return;
	}

	if (state.feet === "timbs") {
		add(feetLayer, "path", { d: "M124 444 H193 V485 Q164 501 108 486 L116 463Z", fill: "#b98245", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(feetLayer, "path", { d: "M227 444 H296 L304 463 L312 486 Q256 501 227 485Z", fill: "#b98245", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(feetLayer, "path", { d: "M132 457 H184 M130 466 H183 M236 457 H288 M237 466 H290", fill: "none", stroke: "#f0d3a6", "stroke-width": 3, "stroke-linecap": "round" });
		add(feetLayer, "path", { d: "M108 486 Q160 501 193 485 M227 485 Q260 501 312 486", fill: "none", stroke: "#222", "stroke-width": 7 });
		return;
	}

	if (state.feet === "jordans") {
		add(feetLayer, "path", { d: "M124 450 H192 L194 486 Q160 500 103 486 L116 467Z", fill: "#fff", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(feetLayer, "path", { d: "M228 450 H296 L304 467 L317 486 Q260 500 226 486Z", fill: "#fff", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(feetLayer, "path", { d: "M118 469 Q151 448 187 472 L163 482Z M302 469 Q269 448 233 472 L257 482Z", fill: "#d64545", stroke: "#333", "stroke-width": 3, "stroke-linejoin": "round" });
		add(feetLayer, "path", { d: "M103 486 Q157 499 194 486 M226 486 Q263 499 317 486", fill: "none", stroke: "#d64545", "stroke-width": 7 });
		return;
	}

	if (state.feet === "heels") {
		add(feetLayer, "path", { d: "M132 452 H192 L188 481 Q154 494 114 480 L123 463Z", fill: "#d84b69", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(feetLayer, "path", { d: "M228 452 H288 L297 463 L306 480 Q266 494 232 481Z", fill: "#d84b69", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(feetLayer, "path", { d: "M178 483 V507 M242 483 V507 M174 507 H185 M235 507 H246", fill: "none", stroke: "#333", "stroke-width": 6, "stroke-linecap": "round" });
		add(feetLayer, "path", { d: "M124 462 L187 478 M296 462 L233 478", fill: "none", stroke: "#f4a3b6", "stroke-width": 5 });
		return;
	}

	// Exactly two comically oversized toes: one for each foot.
	add(feetLayer, "path", { d: "M126 449 Q158 438 190 457 L184 483 Q147 514 91 496 Q76 486 89 470Z", fill: "#d9a47d", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
	add(feetLayer, "path", { d: "M230 457 Q262 438 294 449 L331 470 Q344 486 329 496 Q273 514 236 483Z", fill: "#d9a47d", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
	add(feetLayer, "ellipse", { cx: 107, cy: 480, rx: 16, ry: 9, fill: "#f3c8bd", stroke: "#855e55", "stroke-width": 2 });
	add(feetLayer, "ellipse", { cx: 313, cy: 480, rx: 16, ry: 9, fill: "#f3c8bd", stroke: "#855e55", "stroke-width": 2 });
}

function drawAccessory() {
	if (state.accessory === "flag") {
		add(frontLayer, "line", { x1: 335, y1: 175, x2: 335, y2: 475, stroke: "#555", "stroke-width": 7 });
		add(frontLayer, "path", { d: "M338 183 H405 L384 207 L405 231 H338Z", fill: "#d84b4b", stroke: "#333", "stroke-width": 3, "stroke-linejoin": "round" });
	} else if (state.accessory === "jetpack") {
		add(behindLayer, "rect", { x: 111, y: 206, width: 48, height: 151, rx: 18, fill: "#777", stroke: "#333", "stroke-width": 4 });
		add(behindLayer, "rect", { x: 261, y: 206, width: 48, height: 151, rx: 18, fill: "#777", stroke: "#333", "stroke-width": 4 });
		add(behindLayer, "path", { d: "M122 357 L148 357 L135 409Z", fill: "#ef8b35", stroke: "#333", "stroke-width": 3 });
		add(behindLayer, "path", { d: "M272 357 L298 357 L285 409Z", fill: "#ef8b35", stroke: "#333", "stroke-width": 3 });
	} else if (state.accessory === "pitchfork") {
		add(frontLayer, "line", { x1: 323, y1: 280, x2: 273, y2: 91, stroke: "#8b5a2b", "stroke-width": 9, "stroke-linecap": "round" });
		add(frontLayer, "path", { d: "M244 105 Q273 117 302 105 M248 106 L239 66 M265 112 L260 63 M282 112 L285 63 M299 106 L307 66", fill: "none", stroke: "#555", "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" });
		add(frontLayer, "circle", { cx: 323, cy: 280, r: 10, fill: "#f4f4f0", stroke: "#333", "stroke-width": 3 });
	} else if (state.accessory === "duck") {
		add(frontLayer, "ellipse", { cx: 335, cy: 303, rx: 31, ry: 23, fill: "#f4ce38", stroke: "#333", "stroke-width": 3 });
		add(frontLayer, "circle", { cx: 355, cy: 282, r: 18, fill: "#f4ce38", stroke: "#333", "stroke-width": 3 });
		add(frontLayer, "circle", { cx: 361, cy: 277, r: 3, fill: "#222" });
		add(frontLayer, "path", { d: "M371 284 L393 291 L371 297Z", fill: "#ef8b35", stroke: "#333", "stroke-width": 2 });
		add(frontLayer, "path", { d: "M323 303 Q338 290 347 307", fill: "none", stroke: "#b18c1f", "stroke-width": 3 });
	} else if (state.accessory === "guitar") {
		add(behindLayer, "path", { d: "M285 191 L347 99", stroke: "#71431f", "stroke-width": 14, "stroke-linecap": "round" });
		add(behindLayer, "ellipse", { cx: 309, cy: 322, rx: 47, ry: 62, transform: "rotate(-24 309 322)", fill: "#b66d2f", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "circle", { cx: 309, cy: 315, r: 15, fill: "#4b2b19", stroke: "#333", "stroke-width": 3 });
		add(frontLayer, "line", { x1: 291, y1: 353, x2: 351, y2: 121, stroke: "#e6d1a5", "stroke-width": 2 });
	} else if (state.accessory === "wrench") {
		add(frontLayer, "path", { d: "M323 281 L354 214 L342 187 Q352 163 379 169 L363 184 L375 199 L395 190 Q400 218 376 229 L344 292Z", fill: "#aeb5b9", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
	} else if (state.accessory === "net") {
		add(frontLayer, "line", { x1: 323, y1: 282, x2: 361, y2: 126, stroke: "#8b5a2b", "stroke-width": 7, "stroke-linecap": "round" });
		add(frontLayer, "ellipse", { cx: 368, cy: 99, rx: 36, ry: 45, transform: "rotate(15 368 99)", fill: "#dff5ff", "fill-opacity": ".35", stroke: "#555", "stroke-width": 4 });
		add(frontLayer, "path", { d: "M339 76 L392 120 M334 94 L384 136 M356 56 L400 92 M339 124 L389 71", fill: "none", stroke: "#888", "stroke-width": 1.5 });
	} else if (state.accessory === "flowers") {
		add(frontLayer, "path", { d: "M323 282 L348 343 M323 282 L370 339 M323 282 L386 317", fill: "none", stroke: "#4d8b4a", "stroke-width": 5 });
		[[348,343,"#e85d75"],[370,339,"#f0c84b"],[386,317,"#9b6acb"],[361,318,"#f08b45"]].forEach(([cx,cy,fill]) => { add(frontLayer,"circle",{cx,cy,r:13,fill,stroke:"#333","stroke-width":2}); add(frontLayer,"circle",{cx,cy,r:4,fill:"#f5dc61"}); });
	} else if (state.accessory === "coffee") {
		add(frontLayer, "rect", { x: 320, y: 284, width: 57, height: 47, rx: 5, fill: "#f4f0e8", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "path", { d: "M377 295 Q404 294 397 317 Q392 329 377 321", fill: "none", stroke: "#333", "stroke-width": 5 });
		add(frontLayer, "path", { d: "M336 275 Q328 262 339 251 M356 275 Q348 262 359 251", fill: "none", stroke: "#999", "stroke-width": 3, "stroke-linecap": "round" });
	} else if (state.accessory === "baton") {
		add(frontLayer, "line", { x1: 323, y1: 280, x2: 372, y2: 105, stroke: "#69e7ff", "stroke-width": 15, "stroke-linecap": "round", opacity: ".35" });
		add(frontLayer, "line", { x1: 329, y1: 260, x2: 372, y2: 105, stroke: "#baf6ff", "stroke-width": 7, "stroke-linecap": "round" });
		add(frontLayer, "line", { x1: 323, y1: 282, x2: 333, y2: 247, stroke: "#555", "stroke-width": 12, "stroke-linecap": "round" });
	} else if (state.accessory === "bags") {
		add(frontLayer, "path", { d: "M304 292 H350 L357 385 H297Z", fill: "#d98aa2", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "path", { d: "M340 307 H390 L398 404 H334Z", fill: "#7ab4a8", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "path", { d: "M311 292 Q323 267 339 292 M350 307 Q365 279 381 307", fill: "none", stroke: "#333", "stroke-width": 4 });
	} else if (state.accessory === "lollipop") {
		add(frontLayer, "line", { x1: 323, y1: 282, x2: 369, y2: 164, stroke: "#eee", "stroke-width": 7 });
		add(frontLayer, "circle", { cx: 377, cy: 139, r: 39, fill: "#ef6b91", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "path", { d: "M377 139 Q397 119 404 141 Q408 161 384 169 Q355 176 346 151 Q337 124 361 106", fill: "none", stroke: "#fff", "stroke-width": 5, "stroke-linecap": "round" });
	} else if (state.accessory === "chicken") {
		add(frontLayer, "ellipse", { cx: 348, cy: 329, rx: 25, ry: 48, fill: "#f1c52f", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "circle", { cx: 354, cy: 274, r: 18, fill: "#f1c52f", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "path", { d: "M370 274 L394 283 L370 291Z", fill: "#e76532", stroke: "#333", "stroke-width": 2 });
		add(frontLayer, "path", { d: "M338 374 L325 402 M358 374 L370 402", fill: "none", stroke: "#e76532", "stroke-width": 6 });
	} else if (state.accessory === "telescope") {
		add(frontLayer, "path", { d: "M305 240 L389 195 L401 218 L317 263Z", fill: "#627b91", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "ellipse", { cx: 397, cy: 207, rx: 11, ry: 19, transform: "rotate(-28 397 207)", fill: "#9dd9ef", stroke: "#333", "stroke-width": 3 });
		add(frontLayer, "path", { d: "M351 248 L329 420 M351 248 L380 420 M351 248 L355 420", fill: "none", stroke: "#555", "stroke-width": 6 });
	} else if (state.accessory === "pizza") {
		add(frontLayer, "path", { d: "M318 284 L397 253 L369 342Z", fill: "#f3d16b", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(frontLayer, "path", { d: "M397 253 Q363 247 318 284", fill: "none", stroke: "#b87938", "stroke-width": 11, "stroke-linecap": "round" });
		add(frontLayer, "circle", { cx: 365, cy: 281, r: 8, fill: "#c9473e" });
		add(frontLayer, "circle", { cx: 350, cy: 310, r: 8, fill: "#c9473e" });
	} else if (state.accessory === "alien") {
		add(frontLayer, "ellipse", { cx: 355, cy: 325, rx: 27, ry: 35, fill: "#79bd66", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "ellipse", { cx: 345, cy: 318, rx: 7, ry: 12, transform: "rotate(-20 345 318)", fill: "#171717" });
		add(frontLayer, "ellipse", { cx: 365, cy: 318, rx: 7, ry: 12, transform: "rotate(20 365 318)", fill: "#171717" });
		add(frontLayer, "path", { d: "M344 351 L338 376 M366 351 L372 376", fill: "none", stroke: "#333", "stroke-width": 5 });
	} else if (state.accessory === "vacuum") {
		add(frontLayer, "path", { d: "M324 282 Q391 292 369 397", fill: "none", stroke: "#555", "stroke-width": 8 });
		add(frontLayer, "rect", { x: 337, y: 374, width: 58, height: 72, rx: 15, fill: "#8e6eb0", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "circle", { cx: 350, cy: 447, r: 9, fill: "#333" });
		add(frontLayer, "circle", { cx: 383, cy: 447, r: 9, fill: "#333" });
		add(frontLayer, "path", { d: "M343 447 L320 481 H405", fill: "none", stroke: "#555", "stroke-width": 7, "stroke-linecap": "round" });
	} else if (state.accessory === "disco") {
		add(frontLayer, "line", { x1: 355, y1: 0, x2: 355, y2: 65, stroke: "#555", "stroke-width": 3 });
		add(frontLayer, "circle", { cx: 355, cy: 102, r: 37, fill: "#c7d1d8", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "path", { d: "M318 91 H392 M318 110 H392 M337 69 V135 M355 65 V139 M373 69 V135", fill: "none", stroke: "#fff", "stroke-width": 3, opacity: ".9" });
	} else if (state.accessory === "trophy") {
		add(frontLayer, "path", { d: "M326 281 H383 L375 329 Q354 349 334 329Z", fill: "#e5b93f", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "path", { d: "M330 293 Q305 284 310 312 Q315 331 337 322 M379 293 Q404 284 399 312 Q394 331 372 322", fill: "none", stroke: "#e5b93f", "stroke-width": 8 });
		add(frontLayer, "path", { d: "M354 342 V366 M331 371 H378", fill: "none", stroke: "#333", "stroke-width": 8 });
		addText(frontLayer, "OKAYEST", { x: 354, y: 312, "text-anchor": "middle", fill: "#493813", "font-family": "Verdana, Arial, sans-serif", "font-size": 8, "font-weight": 700 });
	} else if (state.accessory === "cactus") {
		add(frontLayer, "path", { d: "M340 330 V283 Q340 263 353 263 Q366 263 366 283 V299 H377 V282 Q377 270 388 270 Q399 270 399 282 V311 Q399 326 382 326 H366 V330Z", fill: "#4c9b62", stroke: "#333", "stroke-width": 4, "stroke-linejoin": "round" });
		add(frontLayer, "path", { d: "M330 329 H400 L390 382 H340Z", fill: "#b76f42", stroke: "#333", "stroke-width": 4 });
		add(frontLayer, "circle", { cx: 351, cy: 286, r: 2, fill: "#222" });
		add(frontLayer, "circle", { cx: 359, cy: 286, r: 2, fill: "#222" });
		add(frontLayer, "path", { d: "M350 297 Q355 301 360 297", fill: "none", stroke: "#222", "stroke-width": 2 });
	}
}

function drawAccessorySlot(value, side) {
	if (value === "none") return;
	const previous = state.accessory;
	const behindStart = behindLayer.children.length;
	const frontStart = frontLayer.children.length;
	state.accessory = value;
	drawAccessory();

	const transform = side === "left" ? "translate(420 0) scale(-1 1)" : null;
	[[behindLayer, behindStart], [frontLayer, frontStart]].forEach(([layer, start]) => {
		const additions = [...layer.children].slice(start);
		if (!additions.length) return;
		const group = svg("g", transform ? { transform } : {});
		additions.forEach((node) => group.append(node));
		layer.append(group);
	});

	if (previous === undefined) delete state.accessory;
	else state.accessory = previous;
}

function drawAccessories() {
	drawAccessorySlot(state.accessory1, "left");
	drawAccessorySlot(state.accessory2, "right");
}

function accessoryText() {
	const selected = [state.accessory1, state.accessory2]
		.filter((value) => value !== "none")
		.map((value) => labels.accessories[value]);
	if (!selected.length) return "no accessories";
	if (selected.length === 1) return selected[0];
	return `${selected[0]} and ${selected[1]}`;
}

function outfitText() {
	const faceText = state.faceAccessory === "none" ? "" : ` with ${labels.faceAccessories[state.faceAccessory]}`;
	return `${labels.helmets[state.helmet]}${faceText}, ${labels.suits[state.suit]}, ${labels.feet[state.feet]}, and ${accessoryText()} on ${labels.backgrounds[state.background]}`;
}

function render() {
	clear(backgroundLayer, suitLayer, helmetLayer, faceAccessoryLayer, feetLayer, behindLayer, frontLayer);
	astronaut.style.setProperty("--suit-color", suitColors[state.suit]);
	drawBackground();
	drawAccessories();
	drawSuit();
	drawHelmet();
	drawFaceAccessory();
	drawFeet();

	document.querySelectorAll("#gamemenu [data-category] button[data-value]").forEach((button) => {
		const category = button.closest("[data-category]").dataset.category;
		button.setAttribute("aria-pressed", String(state[category] === button.dataset.value));
	});

	const text = outfitText();
	description.textContent = `An astronaut wearing a ${text}.`;
	status.textContent = text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

function closeMenus(except = null) {
	document.querySelectorAll("#gamemenu .menu-category").forEach((menu) => {
		if (menu === except) return;
		menu.removeAttribute("data-open");
		menu.querySelector(".menu-heading").setAttribute("aria-expanded", "false");
	});
}

document.querySelectorAll("#gamemenu .menu-heading").forEach((heading) => {
	heading.addEventListener("click", (event) => {
		event.stopPropagation();
		const menu = heading.closest(".menu-category");
		const willOpen = !menu.hasAttribute("data-open");
		closeMenus(menu);
		menu.toggleAttribute("data-open", willOpen);
		heading.setAttribute("aria-expanded", String(willOpen));
	});
});

document.querySelectorAll("#gamemenu [data-category] button[data-value]").forEach((button) => {
	button.addEventListener("click", () => {
		state[button.closest("[data-category]").dataset.category] = button.dataset.value;
		render();
		closeMenus();
	});
});

document.querySelector("#randomize").addEventListener("click", () => {
	const dunceRandomCount = getDunceRandomCount();
	document.querySelectorAll("#gamemenu [data-category]").forEach((menu) => {
		const choices = [...menu.querySelectorAll("button[data-value]")];
		state[menu.dataset.category] = choices[Math.floor(Math.random() * choices.length)].dataset.value;
	});
	if (dunceRandomCount < DUNCE_RANDOM_LIMIT) {
		state.helmet = "dunce";
		recordDunceRandomClick(dunceRandomCount + 1);
	}
	render();
	closeMenus();
});

document.querySelector("#reset").addEventListener("click", () => {
	Object.assign(state, defaults);
	render();
	closeMenus();
});

document.addEventListener("click", () => closeMenus());
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") closeMenus();
});

render();
