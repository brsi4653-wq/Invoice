# Simon VC: Mayhem Squad Call

Voice, video and chat for up to **7 people**, right in the browser. No Discord, no installs, no accounts.

Live at **https://brsi4653-wq.github.io/Simon-VC/**

## How it works
- **Host** (just you): open the site, go to the **Host** tab, log in, then **Start a party**.
- Every party gets a **fresh random 4-digit code** and its own **invite link** (`.../Simon-VC/?p=1234`).
  The same code only comes back if you reconnect within 30 seconds (refresh, dropped Wi-Fi). Otherwise it's a new code.
- **Friends** either type the code on the main page, or open the invite link. The link only asks for their name.
  If they've used the site before, it joins them straight away with their saved name and camera/mic choice.
- Up to 7 people in one party. The host can **lock** the party so nobody new can join, and **remove** people (click their name).
- Mute (Ctrl+Shift+M), camera, screen share (desktop) with a big spotlight view, and per-person volume up to **300%** (click someone's name). Volume is saved for each person.
- Green rings show who's talking.
- **Chat** with emoji, stickers, links, a typing indicator and floating reactions. The host's browser keeps the history, so it's still there when people rejoin.
- **Badges**: only the host can hand them out (*Manage badges*, or click someone's name). There are built-in badges and you can make your own. A person's top badge colors their name.

## How it's built
Everything is in `index.html`, plus the logos in `assets/`. Every pair of people connects directly over WebRTC (a "mesh").
The free PeerJS server only introduces people to each other. Chat and the party roster go through the host's browser.
Camera quality drops automatically as the party grows, so 7 people stays smooth.

## Changing the host password
Only a slow PBKDF2 hash of the password is stored here. Open the site, press F12 and run:

```js
await hashPassword("your new password")
```

Paste the result into `HOST_HASH` in `index.html`.

## If someone connects but has no sound or video
Some strict networks (school, some mobile carriers) need a TURN relay. Add TURN credentials (Cloudflare and Metered have free tiers) to `ICE_SERVERS` in `index.html`.
