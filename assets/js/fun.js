(function () {
	"use strict";

	const locateButton = document.getElementById("locate-button");
	const locationPrompt = document.getElementById("location-prompt");
	const status = document.getElementById("game-status");
	const mapStage = document.getElementById("map-stage");
	const countdown = document.getElementById("countdown");
	const replayButton = document.getElementById("replay-button");
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const origin = [47.35, -101.05];

	let map;
	let destination;
	let routeLine;
	let missileMarker;
	let pulseMarker;
	let animationFrame;
	let launchSequence = 0;

	document.querySelectorAll(".puzzle-frame iframe").forEach(function (frame) {
		function resizeFrame() {
			try {
				const body = frame.contentDocument.body;
				const bodyStyle = frame.contentWindow.getComputedStyle(body);
				const contentHeight = body.getBoundingClientRect().height + parseFloat(bodyStyle.marginTop) + parseFloat(bodyStyle.marginBottom);
				if (contentHeight > 0) frame.style.height = Math.ceil(contentHeight + 4) + "px";
			} catch (error) {
				// Keep the CSS fallback height if the embedded document is unavailable.
			}
		}

		frame.addEventListener("load", function () {
			resizeFrame();
			if ("ResizeObserver" in window) {
				const observer = new ResizeObserver(resizeFrame);
				observer.observe(frame.contentDocument.documentElement);
				observer.observe(frame.contentDocument.body);
			}
		});

		const panel = frame.closest("details");
		if (panel) panel.addEventListener("toggle", function () {
			if (panel.open) window.setTimeout(resizeFrame, 0);
		});
	});

	function setStatus(message) { status.textContent = message; }

	function ensureMap() {
		if (map) return true;
		if (typeof L === "undefined") {
			setStatus("The map could not load. Check your connection and try again.");
			return false;
		}

		map = L.map("missile-map").setView(origin, 4);
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 18,
			attribution: "&copy; OpenStreetMap contributors"
		}).addTo(map);
		L.circleMarker(origin, {
			radius: 7,
			color: "#fff2c8",
			weight: 2,
			fillColor: "#ffbd59",
			fillOpacity: 1
		}).addTo(map).bindTooltip("North Dakota");
		return true;
	}

	function clearFlight() {
		launchSequence += 1;
		if (animationFrame) cancelAnimationFrame(animationFrame);
		animationFrame = null;
		countdown.textContent = "";
		[routeLine, missileMarker, pulseMarker].forEach(function (layer) {
			if (layer && map) map.removeLayer(layer);
		});
		routeLine = null;
		missileMarker = null;
		pulseMarker = null;
	}

	function shortestLongitudeDelta(from, to) {
		return ((to - from + 540) % 360) - 180;
	}

	function buildArc(start, end) {
		const points = [];
		const lngDelta = shortestLongitudeDelta(start.lng, end.lng);
		const distance = Math.hypot(end.lat - start.lat, lngDelta);
		const midpoint = L.latLng(Math.min(78, (start.lat + end.lat) / 2 + Math.min(16, Math.max(4, distance * .28))), start.lng + lngDelta / 2);
		for (let index = 0; index <= 140; index += 1) {
			const t = index / 140;
			const inverse = 1 - t;
			const lat = inverse * inverse * start.lat + 2 * inverse * t * midpoint.lat + t * t * end.lat;
			const lng = inverse * inverse * start.lng + 2 * inverse * t * midpoint.lng + t * t * (start.lng + lngDelta);
			points.push(L.latLng(lat, ((lng + 540) % 360) - 180));
		}
		return points;
	}

	function missileIcon() {
		return L.divIcon({
			className: "missile-icon",
			html: '<svg class="missile-glyph" viewBox="0 0 68 30" aria-hidden="true"><path fill="#f6f1e8" d="M2 15 14 9l34-7 18 13-18 13-34-7z"/><path fill="#ffbd59" d="m2 15 13-5v10z"/><circle cx="47" cy="15" r="4" fill="#3ed5f0"/></svg>',
			iconSize: [34, 15],
			iconAnchor: [17, 8]
		});
	}

	function setHeading(current, next) {
		const element = missileMarker && missileMarker.getElement();
		if (!element) return;
		const from = map.latLngToLayerPoint(current);
		const to = map.latLngToLayerPoint(next);
		const glyph = element.querySelector(".missile-glyph");
		if (glyph) glyph.style.setProperty("--heading", Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI + "deg");
	}

	function finishFlight() {
		pulseMarker = L.marker(destination, {
			interactive: false,
			icon: L.divIcon({ className: "destination-pulse", iconSize: [34,34], iconAnchor: [17,17] })
		}).addTo(map);
		setStatus("");
		replayButton.hidden = false;
	}

	function animate(path, sequence) {
		const duration = reduceMotion ? 1 : 4200;
		const started = performance.now();
		function frame(now) {
			if (sequence !== launchSequence) return;
			const progress = Math.min(1, (now - started) / duration);
			const eased = progress < .5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
			const position = eased * (path.length - 1);
			const index = Math.min(path.length - 2, Math.floor(position));
			const fraction = position - index;
			const current = L.latLng(path[index].lat + (path[index + 1].lat - path[index].lat) * fraction, path[index].lng + shortestLongitudeDelta(path[index].lng, path[index + 1].lng) * fraction);
			missileMarker.setLatLng(current);
			setHeading(current, path[index + 1]);
			if (progress < 1) animationFrame = requestAnimationFrame(frame);
			else finishFlight();
		}
		animationFrame = requestAnimationFrame(frame);
	}

	function launch() {
		clearFlight();
		replayButton.hidden = true;
		const sequence = launchSequence;
		const start = L.latLng(origin);
		const path = buildArc(start, destination);
		routeLine = L.polyline(path, { color: "#ffbd59", weight: 2, opacity: .75, dashArray: "5 8" }).addTo(map);
		missileMarker = L.marker(start, { icon: missileIcon(), keyboard: false, interactive: false }).addTo(map);

		if (reduceMotion) {
			animate(path, sequence);
			return;
		}

		let count = 3;
		countdown.textContent = count;
		const timer = window.setInterval(function () {
			if (sequence !== launchSequence) {
				window.clearInterval(timer);
				return;
			}
			count -= 1;
			if (count > 0) countdown.textContent = count;
			else {
				window.clearInterval(timer);
				countdown.textContent = "";
				animate(path, sequence);
			}
		}, 650);
	}

	locateButton.addEventListener("click", function () {
		if (!navigator.geolocation) {
			setStatus("Location is not available in this browser.");
			return;
		}
		locateButton.disabled = true;
		locateButton.textContent = "Finding Location…";
		setStatus("");
		navigator.geolocation.getCurrentPosition(function (position) {
			if (!ensureMap()) {
				locateButton.disabled = false;
				locateButton.textContent = "Try Again";
				return;
			}
			destination = L.latLng(position.coords.latitude, position.coords.longitude);
			locationPrompt.hidden = true;
			mapStage.hidden = false;
			window.setTimeout(function () {
				map.invalidateSize();
				map.fitBounds(L.latLngBounds([origin, destination]), { padding: [45,45], maxZoom: 7 });
				launch();
			}, 0);
		}, function () {
			locateButton.disabled = false;
			locateButton.textContent = "Try Again";
			setStatus("Location permission is needed to run the animation.");
		}, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
	});

	replayButton.addEventListener("click", launch);
}());
