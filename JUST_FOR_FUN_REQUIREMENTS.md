# Just for Fun: Launch a Missile

## Product intent

Add a playful, clearly fictional interactive area to the portfolio without changing the professional project presentation. The first experience, "Launch a Missile," visualizes a cartoon flight from a fictional point in North Dakota to a location chosen by the visitor.

## Functional requirements

1. The home page exposes a visible **Just for Fun** link alongside the existing personal links.
2. A dedicated page introduces the game and provides an obvious route back home.
3. Location access begins only after a visitor presses **Use My Location**; the page never requests permission automatically.
4. If location access is denied or unavailable, the page explains that permission is required and offers a simple retry.
5. The selected destination and a generalized North Dakota launch point appear on an interactive map.
6. The interface identifies the origin as fictional and does not use real military-site coordinates.
7. Pressing **Launch** animates a stylized, non-physical arc between the two points and ends with a playful visual effect.
8. Visitors can replay the animation without reloading the page.
9. Location coordinates remain in browser memory only. They are not placed in URLs, analytics events, Worker requests, or persistent browser storage. The interface discloses that the external map provider receives ordinary tile requests for the displayed map area.

## Experience requirements

1. The experience should feel like a retro command-console game while remaining visually related to the portfolio.
2. Copy must clearly describe the experience as fictional entertainment, not a trajectory simulator.
3. Permission denial, geolocation timeout, unsupported browsers, and map-load failure must produce a short recovery instruction.
4. Controls must be keyboard accessible, have visible focus states, and expose status changes to assistive technology.
5. Motion must respect `prefers-reduced-motion`; in that mode, the flight completes without extended animation.
6. The layout must work from 320px mobile screens through large desktop screens.

## Technical requirements

1. Keep the implementation compatible with static GitHub Pages hosting.
2. Use Leaflet for map interaction and OpenStreetMap-compatible tiles with visible attribution.
3. Use the browser Geolocation API over HTTPS and request a single position rather than continuously tracking the visitor.
4. Use a decorative curve generated for screen animation only—no real ballistic calculations, targeting logic, or military data.
5. Keep game-specific HTML, CSS, and JavaScript isolated from the portfolio styles.
6. Avoid adding a build step or package dependency for this first iteration.

## Acceptance criteria

- A visitor can reach the game from the home page and return home.
- Granting geolocation centers the destination marker near the reported position.
- Denying geolocation leaves the visitor on the simple permission screen with a retry option.
- Launching visibly moves the game marker from the fictional origin to the selected destination.
- Replaying does not create duplicate markers, paths, timers, or controls.
- No exact visitor coordinates leave the page.
- Existing portfolio pages and visitor logging continue to operate unchanged.

## Deferred ideas

- Additional games within the Just for Fun section.
- Sound effects and a user-controlled mute preference.
- Shareable results or scorekeeping.
- Custom map artwork or self-hosted map tiles.
