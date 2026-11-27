# Summit Roofing Co. — Website

A one-page website for a **fictional** American roofing company, built as a portfolio project.
Plain HTML, CSS and JavaScript, with no build step and no dependencies.

> Summit Roofing Co. is not a real business. The phone number uses the 555-01xx range, which is reserved for fictional use.
> Projects, testimonials, service areas, the address, licensing and the warranty are clearly labeled placeholders.

## Preview locally

```bash
cd summit-roofing
python3 -m http.server 8080
# open http://localhost:8080
```

Double-clicking `index.html` also works. The contact form needs a real web server (or a deployed site) to send messages.

## Project structure

```
summit-roofing/
├── index.html                    # All sections, SEO meta, JSON-LD
├── assets/
│   ├── css/styles.css            # Design tokens, components, responsive rules
│   ├── js/config.js              # ← Form Access Key + phone settings
│   ├── js/main.js                # Menu, animations, slider, FAQ, form submission
│   ├── video/hero-roofers.mp4    # Hero loop (H.264, 900×1124, ~266 KB, no audio)
│   └── img/                      # Poster (WebP + JPG), OG image, favicons
├── robots.txt
├── vercel.json                   # Vercel: static preset, clean URLs, security + cache headers
├── .vercelignore                 # Keeps README / guides / templates off the live site
├── DEPLOY-VERCEL.md              # Step-by-step Vercel deployment guide
└── seo/sitemap.template.xml      # Fill in the domain, then move to the site root
```

## Contact form setup (Web3Forms)

The form sends real submissions through [Web3Forms](https://web3forms.com) (free plan available).

1. Go to **https://web3forms.com**, enter the inbox that should receive estimate requests, and copy the **Access Key** they send you.
2. Open **`assets/js/config.js`** and paste it:
   ```js
   web3formsAccessKey: "your-access-key-here",
   ```
3. Deploy the site, open it, and **send one real test request**. Confirm it arrives in your inbox.
4. Optional: in the Web3Forms dashboard, restrict the key to your domain.

**About the key:** Web3Forms Access Keys are meant to be used in front-end code. A key only lets someone send a message *to your inbox*; it is not a secret password. Never put other API keys or passwords in this site.

**How the form behaves**

| Situation | What the visitor sees |
|---|---|
| Missing or invalid fields | Inline error under each field; focus moves to the first problem |
| No Access Key in `config.js` | "This form isn't connected yet, so your request was not sent", plus the phone number. Nothing is sent. |
| Sending | Button disabled, spinner, "Sending your request…" (double submits are blocked) |
| Web3Forms confirms `success: true` | "Thank you for contacting Summit Roofing Co. Your request has been received. Our team will follow up with you soon." |
| Rejected, timed out (15 s), offline or network error | Error message with the phone number. The form keeps what the visitor typed. **Success is never shown.** |

**Spam protection:** a hidden `botcheck` honeypot field. Web3Forms rejects any submission where it is ticked.

**Fields sent:** name, phone, email, ZIP, service, optional message, plus `subject`, `from_name` and `replyto` (the visitor's email, so you can reply directly).

To use **Formspree** instead: set `formEndpoint` in `config.js` to your Formspree form URL. In `main.js`, change the success check from `data.success === true` to `res.ok`, and remove the `access_key` line.

## Before going live: replace these placeholders

| Where | Placeholder | Replace with |
|---|---|---|
| `assets/js/config.js` | `web3formsAccessKey: ""` | Your Web3Forms Access Key |
| `index.html`, `config.js` | (555) 010-7700 / `tel:+15550107700` | Real phone (search the files for `555`) |
| `index.html` | `hello@summitroofing.example` | Real email |
| `index.html` → Contact | `[Business address placeholder]` | Real address (or remove the row for a service-area business) |
| `index.html` → Contact | Hours | Real business hours |
| `index.html` → Service Area | Demo City, North Demo Heights, … | Real cities, towns or ZIP codes |
| `index.html` → Why Summit | License, insurance, certifications, warranty `[…placeholder]` | Verified details only |
| `index.html` → Projects | "Demo project" cards, Hollis Residence | Real project photos and details (or keep the demo labels) |
| `index.html` → Testimonials | Sample reviews | Real reviews only, with permission. Don't label them as Google reviews unless they come from Google. |
| `index.html` → demo bar, About "Portfolio notice", footer note | Demo disclaimers | Remove once everything above is real |
| `index.html` `<head>` | Commented `canonical` / `og:url` | Uncomment and set `https://YOUR-DOMAIN/` |
| `index.html` `<head>` | `og:image`, `twitter:image` | Make them absolute: `https://YOUR-DOMAIN/assets/img/og-image.jpg` |
| `seo/sitemap.template.xml` | `YOUR-DOMAIN` | Set the domain, save as `/sitemap.xml`, add the `Sitemap:` line to `robots.txt` |
| JSON-LD in `<head>` | name, telephone, email, areaServed | Real values. Add `url`, `address`, `openingHoursSpecification` and `image` **only** when they are real and visible on the page. Never add ratings or reviews you can't verify. |

## SEO notes

- One H1 (hero), logical H2/H3 order, descriptive alt text on every image.
- The structured data type is `RoofingContractor` (schema.org). It contains no invented address, coordinates, hours, ratings or licenses.
- `robots.txt` allows crawling. Add the sitemap line once the domain exists.
- Serve the site over HTTPS (Netlify, Vercel, Cloudflare Pages and GitHub Pages all do this automatically).

## Performance notes

- Hero video: 266 KB MP4 (H.264, faststart, no audio track). It loads only after the page has finished loading and fades in over a 16 KB WebP poster (JPG fallback), so there is no layout shift. Visitors with *reduced motion* or *data saver* turned on see the poster only. The video pauses when it scrolls off screen.
- Google Fonts load without blocking rendering (`display=swap`).
- Images below the fold are lazy-loaded. Unsplash images are served as WebP/AVIF automatically (`auto=format`).
- No frameworks or libraries; `main.js` is about 19 KB.

## Deploy

**Vercel (configured):** follow **DEPLOY-VERCEL.md**. The recommended project name is `summit-roofing-demo`, with no build step.

It's a plain static site, so Netlify Drop, GitHub Pages and Cloudflare Pages also work. `vercel.json` is simply ignored by other hosts.

## Credits

Photography: Unsplash and Pexels contributors. The hero illustration video was supplied by the site owner.
