import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { flattenPlaces, normalize, searchPlaces } from "../assets/search.mjs";

const data = JSON.parse(
  await readFile(new URL("../travel_recommendation_api.json", import.meta.url)),
);
const places = flattenPlaces(data);

test("every required category has at least two distinct images", () => {
  for (const category of ["beaches", "temples", "countries"]) {
    const found = searchPlaces(places, "", category);
    assert.ok(new Set(found.map((place) => place.imageUrl)).size >= 2);
  }
  for (const country of data.countries) {
    assert.equal(searchPlaces(places, country.name).length, 2);
  }
});

test("English singular, plural, mixed case, and whitespace match categories", () => {
  for (const query of ["beach", "beaches", "  BEACHES  "])
    assert.equal(searchPlaces(places, query).length, 2);
  for (const query of ["temple", "temples", " TEMPLE "])
    assert.equal(searchPlaces(places, query).length, 2);
  for (const query of ["country", "countries"])
    assert.equal(searchPlaces(places, query).length, 4);
});

test("Russian category and country aliases work", () => {
  for (const query of ["пляж", "пляжи", "храм", "храмы"])
    assert.equal(searchPlaces(places, query).length, 2);
  assert.equal(searchPlaces(places, "Япония").length, 2);
  assert.equal(searchPlaces(places, "Австралия").length, 2);
});

test("country queries return city recommendations, not incidental beach or temple locations", () => {
  assert.deepEqual(
    searchPlaces(places, "Japan").map((place) => place.name),
    ["Tokyo", "Kyoto"],
  );
  assert.deepEqual(
    searchPlaces(places, "Australia").map((place) => place.name),
    ["Sydney", "Melbourne"],
  );
});

test("city names, partial terms, empty input, and unknown searches are predictable", () => {
  assert.equal(searchPlaces(places, "Tokyo")[0].id, "tokyo");
  assert.equal(searchPlaces(places, "Melb")[0].id, "melbourne");
  assert.equal(searchPlaces(places, "").length, 8);
  assert.equal(searchPlaces(places, "    ").length, 8);
  assert.equal(searchPlaces(places, "Atlantis").length, 0);
  assert.equal(searchPlaces(places, "<script>alert(1)</script>").length, 0);
  assert.equal(searchPlaces(places, "temple", "beaches").length, 0);
  assert.equal(normalize("  ＪＡＰＡＮ  "), "japan");
});

test("all images exist locally and all destination time zones are valid", async () => {
  assert.equal(new Set(places.map((place) => place.id)).size, places.length);
  for (const place of places) {
    const bytes = await readFile(
      new URL(`../${place.imageUrl}`, import.meta.url),
    );
    assert.ok(bytes.length > 1000, place.imageUrl);
    assert.ok(place.alt.length > 10);
    assert.doesNotThrow(
      () => new Intl.DateTimeFormat("en", { timeZone: place.timeZone }),
    );
  }
});
