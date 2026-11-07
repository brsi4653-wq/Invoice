# Squad Call

A 1-on-1 voice and video "party" that runs in any web browser. You don't need Discord, an account, or an install.

- **Host** (just you): tap **Host login**, enter the password, then **Start a party**. You get a 4-digit code.
- **Friend**: open the site, type the code, then **Join party**. You can also send them the link from **Copy link** (`?code=1234`) so the code is already filled in.
- One party at a time, two people max. If a third person tries to join, they're told it's full.
- Your code stays the same until you press **End party**, so refreshing the page won't break it.
- In a call you can mute, turn your camera off, share your screen (on desktop) and set your friend's volume.

The whole app is `index.html`. Calls go straight between the two browsers over WebRTC, using the free PeerJS server to connect them.

## Hosting on GitHub Pages
Settings → Pages → Deploy from a branch → `main` / `(root)`.

## Changing the host password
The password is not stored in this repo, only a slow PBKDF2 hash of it. To change it, open the site, open the browser console (F12) and run:

```js
await hashPassword("your new password")
```

Paste the result into `HOST_HASH` in `index.html`.

## If a call connects but there's no sound or video
A few strict networks (some school or mobile networks) need a TURN relay. Add TURN credentials (Cloudflare and Metered have free tiers) to `ICE_SERVERS` in `index.html`.
