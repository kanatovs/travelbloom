# TravelBloom

A responsive travel recommendation website built with HTML, CSS, and vanilla JavaScript. No production dependencies, build step, account system, or backend are required.

## Run locally

From the project directory, run:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>. Serve the project over HTTP; opening an HTML file directly will prevent the JSON fetch from working.

## Features

- Home page with an introduction, exploration button, destination cards, and category filters.
- About Us page with the project story, values, illustrative team profiles, and photography credits.
- Contact Us page with labeled name, email, and message fields and browser validation.
- Navigation and keyword search on all three pages, with Search and Reset buttons.
- Case-insensitive singular/plural category searches and English/Russian aliases.
- Two beach recommendations, two temple recommendations, and two cities per country (Australia and Japan).
- Destination details in a keyboard-accessible dialog, with local time and a travel etiquette tip.
- Responsive layouts, visible keyboard focus, reduced-motion support, and image alternative text.
- Local photographs with creator and license attribution.
- Shareable search URLs using the `q` query parameter.

The contact form is a clearly labeled educational demo. It validates inputs locally and displays a confirmation; it does not send email, save personal information, or pretend that a message was delivered. Team profiles are fictional and labeled as such. This project does not offer bookings.

## Try these searches

| Query                            | Expected result                     |
| -------------------------------- | ----------------------------------- |
| `beach`, `beaches`, `пляжи`      | Whitehaven Beach and Bondi Beach    |
| `temple`, `temples`, `храмы`     | Angkor Wat and Kiyomizu-dera        |
| `country`, `countries`, `страны` | Sydney, Melbourne, Tokyo, and Kyoto |
| `Australia`, `Австралия`         | Sydney and Melbourne                |
| `Japan`, `Япония`                | Tokyo and Kyoto                     |
| `Tokyo`                          | Tokyo                               |
| `Atlantis`                       | Helpful empty state                 |

Searches ignore leading/trailing spaces and letter case. Exact country names prioritize the two city recommendations over other attractions in that country. Reset clears the query, removes it from the URL, and displays all eight places.

## Files and data flow

```text
index.html                         Home and recommendation area
about.html                         Project, team, and credits
contact.html                       Contact form
travel_recommendation_api.json     Destination data
assets/app.js                      Browser events and safe DOM rendering
assets/search.mjs                  Pure search functions
assets/styles.css                  Responsive styling
assets/images/                     Locally hosted destination photos
assets/image-credits.json          Authors, source pages, and licenses
tests/search.test.mjs               Dependency-free Node.js tests
docs/                              Deployment and submission guidance
docs/screenshots/                  Browser screenshots for the assignment
.nojekyll                          Disable Jekyll processing on GitHub Pages
```

The home page fetches the local JSON file. `flattenPlaces` converts grouped destinations into cards. `searchPlaces` matches the query and optional category. The browser renders the results with `createElement` and `textContent`, never with user-controlled HTML. Failed destination requests display a retry action. On the other pages, the search form navigates to the home page with the query.

## Verify

Node.js is needed only for development checks, not for hosting:

```sh
node --check assets/app.js
node --check assets/search.mjs
node --test tests/*.test.mjs
```

Tests cover required image counts, category aliases, whitespace/case handling, country matching, unknown queries, local image availability, unique IDs, and valid time zones. See [the verification report](docs/VERIFICATION.md) for browser checks.

## Publish and submit

Follow [the GitHub Pages instructions](docs/DEPLOYMENT.md), then use [the submission checklist](docs/SUBMISSION.md). The site uses relative links and supports a repository path such as `/travelbloom/`.

## Photography

See [the attribution data](assets/image-credits.json) and the About Us page. Image rights remain with their creators under the individual licenses. Layout cropping does not change the original image files. Code and image licensing are separate; this repository does not relicense the photos.
