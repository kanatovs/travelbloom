// Keep matching independent of the DOM so it can be tested with Node.js.
const aliases = {
  beaches: ["beach", "beaches", "пляж", "пляжи"],
  temples: ["temple", "temples", "храм", "храмы"],
  countries: ["country", "countries", "страна", "страны"],
};

export function normalize(value) {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, " ");
}

export function flattenPlaces(data) {
  return [
    ...data.beaches.map((place) => ({ ...place, category: "beaches" })),
    ...data.temples.map((place) => ({ ...place, category: "temples" })),
    ...data.countries.flatMap((country) =>
      country.cities.map((place) => ({
        ...place,
        category: "countries",
        countryKeywords: country.keywords,
        keywords: [...country.keywords, ...place.keywords],
      })),
    ),
  ];
}

export function searchPlaces(places, query = "", category = "all") {
  const term = normalize(query);
  const matchedCategory = Object.keys(aliases).find((key) =>
    aliases[key].includes(term),
  );
  const isCountry = places.some((place) =>
    place.countryKeywords?.some((keyword) => normalize(keyword) === term),
  );
  return places.filter((place) => {
    if (category !== "all" && place.category !== category) return false;
    if (!term) return true;
    if (matchedCategory) return place.category === matchedCategory;
    if (isCountry)
      return Boolean(
        place.countryKeywords?.some((keyword) => normalize(keyword) === term),
      );
    // Country names intentionally match city recommendations, giving two images per country.
    return place.keywords.some((keyword) => normalize(keyword).includes(term));
  });
}
