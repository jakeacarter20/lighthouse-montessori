# Lighthouse Montessori Academy

Homepage redesign for [lighthousemontessoriacademy.com](https://www.lighthousemontessoriacademy.com/),
an independent Montessori school in Provo, Utah.

Static HTML, CSS, and JavaScript. No build step, no dependencies.

## Running it

```bash
python3 -m http.server 8777
```

Then open <http://127.0.0.1:8777>.

## Structure

```
index.html        one page, eight sections
css/style.css     design tokens, layout, light and dark themes
js/main.js        mobile menu, scroll reveals, form validation
img/              photography from the school's existing site
```

## Design notes

Layout and section rhythm are modelled on [lokalapps.com](https://www.lokalapps.com/):
a floating pill nav, colour-blocked programme cards, a photo bento grid, and a
full-bleed statement block.

The palette comes from the school's own logo, red `#EE3A25` and gold `#E8BA37`,
over the dark brown `#241212` the previous site used for text. The bright green
and muted purple on the old site came from its IONOS template rather than the
brand, so they were dropped. One accent carries every link, button, and active
state; the four programme blocks use a warm ramp built from the two logo colours.

Corner radius rule: blocks and cards 18px, inputs 12px, buttons full pill.

Motion is scroll reveals staggered in reading order, a nav shadow, and hover
lifts. Everything observable uses `IntersectionObserver`, so nothing runs on the
scroll frame, and all of it collapses under `prefers-reduced-motion`.

Fonts load from Google Fonts to keep this a zero-build project. To self-host,
download the woff2 files into `/fonts`, replace the `<link>` in the head with
`@font-face` rules, and nothing else needs to change.

## Before this goes live

- **The contact form has no backend.** It validates in the browser and shows a
  panel saying the enquiry was not sent. Point `action` at Formspree, Netlify
  Forms, or your own handler, then delete the `preventDefault()` branch at the
  end of the submit handler in `js/main.js`.
- **Programme descriptions are trimmed, not verbatim.** The lines under Nido,
  Casa, Action, and Hilltop come from the school's own division summaries on the
  About Us page, shortened to fit the cards. Worth a read-through by the school.
- **Card links point at the live site.** The six cards under "We help children
  become more:" link to absolute URLs on lighthousemontessoriacademy.com, the
  same subject pages the original cards link to. When this replaces the real
  homepage, change them to relative paths so they stay inside the site.
- **Update the social card host.** `og:url` and `og:image` in the head are
  absolute URLs on the GitHub Pages domain, because social platforms will not
  resolve a relative path. Point them at the real domain when this moves.
- **`hero-reading.jpg` is no longer used.** It was the old hero photograph.
  It is still in `img/` in case it is wanted elsewhere; delete it if not.
- **Confirm the age ranges.** The existing site states two different sets. This
  build uses the homepage body copy: Nido 0 to 3, Casa 3 to 6, Action 7 to 11,
  Hilltop 12 to 18. That still leaves an apparent gap between Casa ending at 6
  and Action starting at 7.
- **Photography.** The images are the school's own, taken from the current site.
  They show identifiable children, so confirm the school is happy with how each
  one is used before publishing anywhere new.
