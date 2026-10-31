import { flattenPlaces, searchPlaces } from "./search.mjs";

const searchForm = document.querySelector(".nav-search");
const searchInput = document.querySelector("#search-input");
const results = document.querySelector("#results");
const count = document.querySelector("#result-count");
const dialog = document.querySelector("#place-dialog");
let places = [];
let category = "all";
let loadState = "loading";

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function imageFor(place, className) {
  const image = element("img", className);
  image.src = place.imageUrl;
  image.alt = place.alt;
  image.loading = "lazy";
  image.width = 640;
  image.height = 420;
  return image;
}

function showDetails(place) {
  const content = document.querySelector("#dialog-content");
  const body = element("div", "dialog-body");
  const title = element("h2", "", place.name);
  title.id = "dialog-title";
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: place.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date());
  body.append(
    element("p", "eyebrow", place.location),
    title,
    element("p", "", place.description),
    element("p", "", place.tip),
    element("p", "dialog-time", `Local time when opened: ${time}`),
  );
  content.replaceChildren(imageFor(place, "dialog-image"), body);
  dialog.showModal();
}

function createCard(place) {
  const card = element("article", "place-card");
  const photo = element("div", "card-image");
  const label = {
    beaches: "BEACH ESCAPE",
    temples: "CULTURE & CALM",
    countries: "CITY DISCOVERY",
  }[place.category];
  photo.append(imageFor(place), element("span", "card-tag", label));
  const body = element("div", "card-body");
  const titleRow = element("div", "card-title-row");
  const button = element("button", "details-button", "↗");
  button.type = "button";
  button.setAttribute("aria-label", `Explore ${place.name}`);
  button.addEventListener("click", () => showDetails(place));
  titleRow.append(element("h3", "", place.name), button);
  body.append(
    element("p", "card-location", place.location),
    titleRow,
    element("p", "", place.description),
  );
  card.append(photo, body);
  return card;
}

function render() {
  if (loadState !== "ready") return;
  const found = searchPlaces(places, searchInput.value, category);
  const query = searchInput.value.trim();
  count.textContent = `${found.length} ${found.length === 1 ? "place" : "places"}${query ? ` for “${query}”` : " to discover"}`;
  if (found.length) {
    results.replaceChildren(...found.map(createCard));
  } else {
    const empty = element("div", "empty-state");
    const reset = element(
      "button",
      "button button-green",
      "Show all places ↗",
    );
    reset.type = "button";
    reset.addEventListener("click", () => searchForm.reset());
    empty.append(
      element("h3", "", "A little off the map."),
      element(
        "p",
        "",
        "Try beach, temple, Australia, Japan — or a city like Tokyo.",
      ),
      reset,
    );
    results.replaceChildren(empty);
  }
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.category === category),
    );
  });
}

function updateUrl() {
  const url = new URL(location.href);
  const query = searchInput.value.trim();
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  history.replaceState(null, "", url);
}

if (results) {
  searchInput.value = new URLSearchParams(location.search).get("q") || "";
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    category = "all";
    render();
    updateUrl();
    document.querySelector("#discover").scrollIntoView();
  });
  searchForm.addEventListener("reset", () => {
    searchInput.value = "";
    category = "all";
    render();
    updateUrl();
  });
  document.querySelectorAll("[data-category]").forEach((button) =>
    button.addEventListener("click", () => {
      category = button.dataset.category;
      searchInput.value = "";
      render();
      updateUrl();
    }),
  );
  try {
    const response = await fetch("travel_recommendation_api.json");
    if (!response.ok)
      throw new Error(`Destination request failed: ${response.status}`);
    places = flattenPlaces(await response.json());
    loadState = "ready";
    render();
    if (searchInput.value) document.querySelector("#discover").scrollIntoView();
  } catch (error) {
    loadState = "error";
    count.textContent = "Places are temporarily unavailable.";
    const panel = element("div", "empty-state");
    const retry = element("button", "button button-green", "Try again");
    retry.type = "button";
    retry.addEventListener("click", () => location.reload());
    panel.append(
      element("h3", "", "We couldn’t load the destinations."),
      element(
        "p",
        "",
        "Please reload the page. For a local copy, start an HTTP server instead of opening the HTML file directly.",
      ),
      retry,
    );
    results.replaceChildren(panel);
    console.error("Unable to load destination data.", error);
  } finally {
    results.setAttribute("aria-busy", "false");
  }
  document
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      dialog.close();
  });
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = ["name", "email", "message"].map((id) =>
      document.getElementById(id),
    );
    fields.forEach((field) => {
      field.value = field.value.trim();
    });
    if (!contactForm.reportValidity()) return;
    document.querySelector("#form-status").textContent =
      `Thanks, ${fields[0].value}! Your message passed validation. This is a course demo; no email has been sent or stored.`;
    contactForm.reset();
  });
}

const creditsList = document.querySelector("#credits-list");
if (creditsList) {
  try {
    const response = await fetch("assets/image-credits.json");
    if (!response.ok) throw new Error("Credits request failed");
    const credits = await response.json();
    creditsList.replaceChildren(
      ...credits.map((credit) => {
        const item = element("li");
        const link = element("a", "", credit.subject);
        link.href = credit.source;
        item.append(
          link,
          document.createTextNode(` — ${credit.artist}. ${credit.license}.`),
        );
        if (credit.licenseUrl) {
          const license = element("a", "", " License");
          license.href = credit.licenseUrl;
          item.append(license);
        }
        return item;
      }),
    );
  } catch {
    const item = element("li");
    const link = element("a", "", "Open the complete image credits file");
    link.href = "assets/image-credits.json";
    item.append(link);
    creditsList.replaceChildren(item);
  }
}
