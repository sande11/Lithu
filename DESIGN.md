---
version: 2.0
references:
  - Synaptix SaaS landing (dark, centered hero, large dashboard + phones mockup)
  - RedSun Webflow template (glowing planet-horizon arc, product rising on scroll)
  - Turnover agency landing (floating glass cards with connector lines, wrapping word ribbon)
colors:
  bg: "#03050D"
  surface: "#0B1124"
  stroke: "rgba(160,185,255,.13)"
  text: "#EEF3FF"
  muted: "#95A3C6"
  blue: "#2F7BFF"     # accents, progress, chart (brightened logo blue)
  cyan: "#3FD0FF"     # highlights, links, glow (logo gradient end)
  violet: "#7A6BFF"   # secondary chart/glow only
  ok: "#3DDC97"       # live / in development status
typography:
  display: "Sora 600, tight tracking"
  body: "Figtree 400–600"
---

## Brand position

Sande Technologies is a software development company (Lilongwe, Malawi) that works three ways:

1. **Our products**: VepiFind, Belo and Hospr, built and run in-house.
2. **Remote tech team**: our engineers working inside a client's company.
3. **Tech agency**: client projects delivered end to end.

Headline: "We build our own products. / And we'll build yours." The second line uses the blue→cyan gradient.

## Signature: the hero showcase

Centered headline over a slowly rotating dotted Earth (the planet on the horizon). Rising out of the arc is one product scene that shows all three ways of working:

- the centre browser window is a client booking portal (agency work),
- the left phone is VepiFind (our product, a real screenshot),
- the right phone is a team chat with Sande Technologies engineers (remote team).

Glass labels with connector lines name each one. On scroll, the dashboard tilts from 20° to flat and the horizon brightens (`--p` 0→1). Reduced motion shows it flat.

## Supporting patterns

- Tech-stack strip, then a live working-hours band: the time in Lilongwe (open/closed), the visitor's own time, and how many hours of their 08:00–17:00 overlap ours, drawn on a 24-hour bar in their local time.
- Glass cards (translucent fill, 1px cool stroke, 24–28px radius). Mode cards each carry a small live-looking visual: app tiles, timezone overlap, project milestones.
- Bento grid for agency capabilities, step cards joined by a rail for the process.
- The contact section repeats the horizon arc.
- Buttons are flat: primary is solid off-white (#EEF2FA) with dark text, secondary is a thin outline. No glow, no gradient, no shine. Selected states (enquiry type, role ticks, open FAQ) use the same off-white. Light and glow belong to the scenery, not the controls.

## Don'ts

No fake testimonials, client logos or company stats. Dashboard numbers live only inside the clearly illustrative client-portal mockup.

## Pages

- `index.html` → `src/main.jsx` (home)
- `vepifind.html` → `src/vepifind.jsx` + `src/vepifind.css` (product page)
- `src/shared.jsx` holds the header, footer, logo, icons and all motion hooks; `src/styles.css` is shared by both pages.
- `vite.config.js` builds all pages, including the existing privacy and terms pages, into `dist/`.
- VepiFind download: set `DOWNLOAD_URL` at the top of `src/vepifind.jsx` and every "Get launch updates" button becomes "Download for Android".

## Motion

Every motion explains something; nothing loops for decoration except slow ambient light.

- **Load sequence (once):** headline lines slide up out of a mask, then the subtitle and buttons; the horizon rises and the product scene lifts in; connector lines grow down to each device; KPI numbers count up; the chart line draws; activity rows slide in; the team chat plays out (message, reply, typing dots, answer, standup invite).
- **Scroll:** the hero screen tilts flat and the horizon brightens; sections and cards fade up as they enter, with a short stagger; the timezone bars fill; the project milestones tick through to "Build"; the three VepiFind phones fan out from a stack; the process rail fills left to right and each step lights up in turn; the footer wordmark tightens into place. A thin progress line under the header shows how far down the page you are.
- **Pointer:** the hero screen tilts slightly toward the cursor; glass cards show a soft light that follows the cursor; primary buttons get a light sweep; capability icons tip and glow.
- **Feedback:** role checkboxes pop, the role count bumps, the enquiry type pill slides between options, and the message box glows when "Request this team" fills it.
- **VepiFind page:** push-style notifications stack in the hero; the feature tour keeps one phone pinned while you scroll and cross-fades to the screen for each feature; "In development" cards have a slowly travelling gradient border; FAQ answers expand smoothly.
- **Planet:** the horizon is a dotted Earth that turns once every two minutes (WebGL2 shader in `src/planet.jsx`, land from `src/landmask.js`). It is tilted so Africa rides the horizon; Lilongwe pulses, and arcs with travelling lights run to London, New York, Berlin, Dubai, Nairobi, Johannesburg, Lagos and Toronto. It is dimmed behind the contact form, pauses off screen, falls back to canvas dots without WebGL2, and is a still frame with reduced motion.
- **Ambient:** a faint starfield drifts upward, the horizon glow breathes, phones float.
- **Reduced motion:** everything is shown in its final state; no loops, no counting, no tilt.
