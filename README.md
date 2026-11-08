# Portfolio — React + Express

A personal portfolio in a black-and-white editorial style: a sticky contents sidebar, light and dark themes, a GitHub contribution graph and a working contact form.

- **Front end:** React 18 + Vite (`client/`)
- **Back end:** Express (`server/app.js`). Locally `server/index.js` runs it; on Vercel `api/index.js` runs it as a serverless function

## Run it

Use Node.js 18.17 or newer.

```bash
npm install
npm run dev        # React on http://localhost:5173 and the API on :5000
```

Production (one server, one port):

```bash
npm run prod       # builds the site to dist/, then serves it with Express on http://localhost:5000
```

## Make it yours

All the content is in **`server/data/portfolio.js`**: name, bio, projects, experience, stack, posts, certifications, testimonials and achievements. Edit that one file. Everything in it right now is sample content.

- **Photo:** put an image in `client/public/` (for example `avatar.jpg`), then set `avatar: '/avatar.jpg'`.
- **Real GitHub graph:** set `github: 'your-username'`. The server fetches your public contributions and caches them for 6 hours. Until you set it, the graph shows sample data.
- **Sections:** the order and labels are in `client/src/sections.js`.
- **Colors and fonts:** the tokens at the top of `client/src/styles.css` (`:root` for light, `[data-theme='dark']` for dark).

## API

| Method | Route            | What it does                                                              |
| ------ | ---------------- | ------------------------------------------------------------------------- |
| GET    | `/api/portfolio` | All page content                                                          |
| GET    | `/api/activity`  | Contribution graph data (GitHub or sample)                                |
| POST   | `/api/contact`   | `{ name, email, message }`. Validated, rate-limited, saved to `server/data/messages.json` |

Contact form messages are saved to `server/data/messages.json` when you run the site locally. If `RESEND_API_KEY` is set, they're emailed to you instead (see below).

## Deploy to Vercel

### 1. First deploy (from this folder, no GitHub needed)

```bash
npx vercel          # log in in the browser, then accept the defaults
npx vercel --prod   # publishes to your live URL, e.g. https://yuki-emit.vercel.app
```

The build settings come from `vercel.json`, so you don't need to change anything when it asks.

After any change, run `npx vercel --prod` again.

### 2. Optional: get contact-form messages by email

Vercel can't save files, so without this the form opens the visitor's own email app with their message filled in.

1. Sign up at https://resend.com **with the same email the messages should go to** (yukianenias@gmail.com). Its free test sender can only email the account owner.
2. Create an API key.
3. In Vercel, open your project → **Settings → Environment Variables** and add `RESEND_API_KEY` with that key.
4. Run `npx vercel --prod` again.

### Alternative: deploy from GitHub

Push this folder to a GitHub repository, then go to https://vercel.com/new and import it. Every `git push` deploys automatically.
