# KRATOS — preview page

Plain HTML / CSS / JS. No build step, no dependencies.

## Run it

1. Open this folder in VS Code (`File → Open Folder`).
2. Install the **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.

## Sequence

1. **Awaiting cartridge** — console idle, `AWAITING CARTRIDGE` on screen.
2. **Insert** — drag the cartridge into the port on the top edge. The tab flips to
   `ACE MODULE LOCKED` and the cartridge stays seated, sticking out of the slot.
3. **Campus search** — about four seconds of searching with a repeating sonar ping.
   Four activity signals resolve one at a time: CODING, CAT EXAM, ASSESSMENT, PROJECT.
4. **Undefined signal** — a fifth, crimson signal appears where nothing should be.
   Labelled `UNDEFINED`.
5. **Target lock** — the readout climbs 28 → 61 → 88 → 100%, the known signals fade,
   and the marker resolves onto the college crest.
6. **Location** — `EASWARI ENGINEERING COLLEGE / RAMAPURAM · CHENNAI`, then the
   `ACCESS GRANTED` banner.
7. **Loading** — roughly 3.5 seconds in large type: LOADING → READY.
8. **Teaser video** — the lion's blue eye, the flash, the zoom out to the lion,
   the KRATOS '26 wordmark and COMING SOON. This is the ending: the clip holds on
   its final frame and the REPLAY button appears.

## The video

`assets/intro.mp4` is your Flow teaser, re-encoded for web with faststart so it
begins playing before the whole file downloads. It plays full screen after the
loading beat and holds on its last frame.

It starts muted, because browsers block unmuted autoplay. A SOUND ON button sits
next to SKIP so the visitor can turn audio on themselves.

To swap in a different cut, just replace `assets/intro.mp4`. If the file is ever
missing, the sequence falls back to the built-in reveal page (BE READY → KRATOS →
COMING SOON), so nothing breaks.

## Files

| File | What it holds |
|---|---|
| `index.html` | Markup for the console, video stage and reveal page |
| `styles.css` | All styling. Palette is in `:root` at the top |
| `script.js` | Drag logic and the scene timeline |
| `assets/cartridge.png` | The ACE cartridge, cut out |
| `assets/crest.png` | College crest — used as the map marker |
| `assets/kratos-word.png` | KRATOS wordmark, no year — used on the reveal |
| `assets/kratos-logo.png` | Full KRATOS '26 wordmark, kept as a spare |
| `assets/lion.png`, `assets/ace.png`, `assets/easwari.png` | Source marks |

## Tuning

- **Timing** — every beat is an `await wait(ms)` in `script.js`.
- **Signal names and positions** — the `SIGNALS` array in `script.js`.
- **Colours** — `:root` at the top of `styles.css`.


## Sound

All the interface audio is generated in the browser with the Web Audio API — there
are no sound files to manage. The sonar ping during the search, the blips as each
signal lands, the low alert on the undefined signal, and the rising confirm on
ACCESS GRANTED are all synthesised in `script.js`. Adjust or mute them there.

Browsers only allow audio after a user gesture, so the sound starts from the moment
the visitor drags the cartridge — which is exactly when it is needed.

## Watermark

The lion mark sits behind the whole interface at 5% opacity, set in `styles.css`
on `body::after`. Raise or lower the `opacity` value there.
