# Deploy Summit Roofing Co. (demo) to Vercel

Recommended project name: **summit-roofing-demo**
Cost: **free** (Vercel Hobby plan). No custom domain and no purchase needed.

This is a static site: no build step, no npm install, no server code.
Vercel serves `index.html` from the project root, and `vercel.json` adds clean URLs, security headers and caching.

> Vercel's free Hobby plan is for personal, non-commercial projects. A portfolio demo like this fits.
> If you later launch a real client's site, the client should use their own Vercel account (Pro plan for commercial use).

---

## Before you start

1. Unzip `summit-roofing.zip`. You get a folder called `summit-roofing`.
2. Check that the folder contains `index.html`, `vercel.json` and an `assets` folder.
3. Two files start with a dot (`.vercelignore`, `.gitignore`), so they may be hidden:
   - **Mac:** in Finder press `Cmd + Shift + .`
   - **Windows:** File Explorer → View → Show → Hidden items

   If they don't get uploaded, the site still works. The README would just also be publicly visible.

---

## Option A: GitHub + Vercel website (recommended, nothing to install)

### Step 1: Put the project on GitHub
1. Sign in at **github.com** (a free account is fine).
2. Click **+ → New repository**.
3. Repository name: `summit-roofing-demo`. Public or Private both work. Click **Create repository**.
4. On the empty repo page, click **"uploading an existing file"**.
5. Open your `summit-roofing` folder, select **everything inside it** (not the folder itself), and drag it into the browser.
   `index.html` must end up at the top level of the repository, not inside a sub-folder.
6. Click **Commit changes**.

### Step 2: Import it into Vercel
1. Go to **vercel.com** → **Sign Up** → **Continue with GitHub** (choose the free **Hobby** plan).
2. Click **Add New… → Project**.
3. Find `summit-roofing-demo` in the list and click **Import**.
   If it isn't listed, click "Adjust GitHub App Permissions" and allow access to the repo.
4. On the **Configure Project** screen:
   - **Project Name:** `summit-roofing-demo`
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Build and Output Settings:** leave everything empty / default (there is no build command)
   - **Environment Variables:** none needed
5. Click **Deploy**. It takes about 20–40 seconds.

### Step 3: Open your site
Vercel shows a link like **https://summit-roofing-demo.vercel.app**.
If that name is already taken, Vercel adds a few extra letters; the exact link is shown on your project page.

**Updating later:** edit or upload changed files in GitHub and commit. Vercel redeploys automatically.

---

## Option B: Vercel CLI (needs Node.js installed)

```bash
npm install -g vercel
cd summit-roofing
vercel login
vercel
```
Answer the prompts:
- Set up and deploy? **Y**
- Which scope? **your personal account**
- Link to existing project? **N**
- Project name? **summit-roofing-demo**
- In which directory is your code located? **./**
- Want to modify the settings? **N**

That creates a preview deployment. To publish the main link:
```bash
vercel --prod
```

---

## After deploying: 2-minute check

Open the live link on your computer **and** your phone:

- [ ] The black **"Demo website"** notice is visible at the top
- [ ] The hero roofing animation plays (it shows the still image first, then the animation fades in)
- [ ] All photos in Services, Projects and "Why Summit" load
- [ ] The menu links scroll to the right sections; the ☰ menu works on your phone
- [ ] On your phone, scroll down: the **Call Now / Get Free Estimate** bar appears
- [ ] Fill in the form and submit. **Expected:** a message saying the form *isn't connected yet* (see below)

---

## Optional: make the form send real emails

The form is ready, but it needs a free Web3Forms Access Key:

1. Go to **web3forms.com**, enter your email, and copy the Access Key they send you.
2. In GitHub, open `assets/js/config.js` → click the ✏️ pencil → paste the key:
   `web3formsAccessKey: "your-key-here",`
3. Commit. Vercel redeploys in about 30 seconds.
4. Submit the form on the live site and confirm the email arrives.
5. Optional: in the Web3Forms dashboard, restrict the key to your `*.vercel.app` address.

The key is designed to be used in front-end code (it only lets people message *your* inbox). Never put any other passwords or secret keys in this project.

---

## Optional: social preview and search settings for the demo

- **Link previews (WhatsApp, LinkedIn, Facebook):** these need full URLs. Once you know your Vercel link, open `index.html` and:
  - uncomment the `canonical` and `og:url` lines and replace `https://YOUR-DOMAIN/` with your Vercel link
  - change `og:image` and `twitter:image` to `https://<your-link>/assets/img/og-image.jpg`
- **Keeping the demo out of Google:** the site is currently indexable. Because the business is fictional, you may prefer that searchers don't find it. To do that, change `<meta name="robots" content="index, follow">` to `content="noindex, follow"`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| **404: NOT_FOUND** on the home page | `index.html` isn't at the repository root (you uploaded the folder inside a folder). In Vercel → Project → Settings → Build and Deployment → **Root Directory**, choose the sub-folder that contains `index.html`, then redeploy. |
| Vercel asks for a build command | Leave it empty. Framework Preset = **Other**. |
| Photos don't appear | They load from Unsplash/Pexels. Try another network or turn off ad/content blockers. |
| Animation doesn't play on an iPhone | Low Power Mode blocks autoplay; the still image is shown instead (expected). It also stays still if "Reduce Motion" is on. |
| Changes don't show | Wait for the new deployment to finish (Vercel → Deployments), then hard-refresh (`Ctrl/Cmd + Shift + R`). CSS/JS files are cached for up to 1 hour. |
