/**
 * Spain Trip Planner — availability grid (persisted in localStorage)
 * May 2026: Sat 5/16 through Mon 5/25 (Memorial Day)
 */

const STORAGE_KEY = "spain-trip-availability-2026-v3";
const DAYS = [
  "5/18", "5/19", "5/20", "5/21", "5/22", "5/23", "5/24", "5/25",
];

const DEFAULT_PEOPLE = [
  {
    name: "Brandon",
    days: { "5/18": true, "5/19": true, "5/20": true, "5/21": true, "5/22": true, "5/23": true, "5/24": true },
  },
  {
    name: "DJ + Bridgette",
    days: { "5/20": true, "5/21": true, "5/22": true, "5/23": true, "5/24": true },
  },
  {
    name: "Harrison + Michelle",
    days: { "5/22": true, "5/23": true, "5/24": true, "5/25": true },
  },
  {
    name: "Jared + Brittany",
    days: { "5/18": true, "5/19": true },
  },
];

function loadPeople() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    savePeople(DEFAULT_PEOPLE);
    return DEFAULT_PEOPLE;
  } catch {
    return DEFAULT_PEOPLE;
  }
}

function savePeople(people) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
}

function renderGrid() {
  const people = loadPeople();
  const tbody = document.getElementById("availability-body");
  tbody.innerHTML = "";

  people.forEach((person, rowIndex) => {
    const tr = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = person.name;
    tr.appendChild(nameCell);

    DAYS.forEach((day) => {
      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell-btn" + (person.days && person.days[day] ? " available" : "");
      btn.setAttribute("aria-label", `Toggle ${day} for ${person.name}`);
      btn.dataset.row = rowIndex;
      btn.dataset.day = day;
      btn.addEventListener("click", () => {
        const list = loadPeople();
        const row = list[Number(btn.dataset.row)];
        if (!row) return;
        row.days = row.days || {};
        row.days[day] = !row.days[day];
        savePeople(list);
        renderGrid();
      });
      td.appendChild(btn);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

if (document.getElementById("availability-body")) renderGrid();

/**
 * Weather by day — typical late-May (historical averages)
 */
const WEATHER_DAYS = [
  { dayLabel: "Mon", date: "5/18", city: "Sevilla", high: "82°F", low: "59°F", conditions: "Mostly sunny", precip: "10% chance" },
  { dayLabel: "Tue", date: "5/19", city: "Sevilla", high: "83°F", low: "60°F", conditions: "Sunny", precip: "5%" },
  { dayLabel: "Wed", date: "5/20", city: "Sevilla", high: "84°F", low: "60°F", conditions: "Sunny", precip: "5%" },
  { dayLabel: "Thu", date: "5/21", city: "Sevilla → Madrid", high: "82° / 75°", low: "59° / 54°", conditions: "Pleasant, transfer day", precip: "10% / 15%" },
  { dayLabel: "Fri", date: "5/22", city: "Madrid", high: "76°F", low: "55°F", conditions: "Partly cloudy", precip: "20% chance" },
  { dayLabel: "Sat", date: "5/23", city: "Madrid", high: "77°F", low: "55°F", conditions: "Sunny", precip: "5%" },
  { dayLabel: "Sun", date: "5/24", city: "Madrid", high: "78°F", low: "56°F", conditions: "Sunny", precip: "10%" },
  { dayLabel: "Mon", date: "5/25", city: "Madrid", high: "79°F", low: "57°F", conditions: "Sunny, Memorial Day", precip: "5%" },
];

function renderWeatherGrid() {
  const container = document.getElementById("weather-grid");
  if (!container) return;
  container.innerHTML = WEATHER_DAYS.map((d) => {
    let cityClass = "";
    if (d.city === "Sevilla → Madrid") cityClass = "weather-day-transfer";
    else if (d.city.includes("Sevilla")) cityClass = "weather-day-sevilla";
    else if (d.city.includes("Madrid")) cityClass = "weather-day-madrid";
    else if (d.city === "—") cityClass = "weather-day-empty";
    return `
    <div class="weather-day ${cityClass}">
      <div class="weather-day-header">
        <span class="weather-day-name">${d.dayLabel} ${d.date}</span>
        <span class="weather-day-city">${d.city}</span>
      </div>
      <div class="weather-day-temp">${d.high} / ${d.low}</div>
      <div class="weather-day-conditions">${d.conditions}</div>
      <div class="weather-day-precip">Precip: ${d.precip}</div>
    </div>
  `;
  }).join("");
}

if (document.getElementById("weather-grid")) renderWeatherGrid();

/**
 * Day-by-day itinerary — expand/collapse
 */
function doBlock(label, items) {
  if (!items || items.length === 0) return "";
  return `<div class="day-do-block"><h4>${label}</h4><ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
}

const ITINERARY_DAYS = [
  {
    dayLabel: "Monday",
    date: "5/18",
    city: "Sevilla",
    cityClass: "sevilla",
    arrivals: "Brandon (Florence) & Jared + Brittany (Marbella/train) arriving today.",
    morning: ["Settle in; wander Barrio Santa Cruz (free)", "Coffee at a terrace in Santa Cruz", "Quick peek at the Cathedral from outside (free) or book Alcázar for later"],
    afternoon: ["Real Alcázar — ticket required, book ahead — ~€14.50", "Plaza de España & Maria Luisa Park (free)", "Torre del Oro (tower by the river) — ~€3 or view from outside (free)"],
    evening: ["Tapas in Triana or El Arenal", "Stroll along the river (Paseo de Colón)", "Sunset from Triana bridge or a rooftop (Hotel Eme, Doña María)"],
    eat: ["Tapas in Triana or El Arenal", "Evening by the river"],
    night: ["El Garlochi (quirky bar, altar decor) — closes 2:00 AM", "Bar Alfalfa — cocktails & crowd — closes 2:30 AM", "Calle Betis (Triana) — bars along the river — most close 2:00–3:00 AM"],
  },
  {
    dayLabel: "Tuesday",
    date: "5/19",
    city: "Sevilla",
    cityClass: "sevilla",
    departures: "Jared + Brittany depart (Sevilla → Boston).",
    morning: ["Cathedral & Giralda — ticket required — ~€12; climb tower for views", "Archivo de Indias (free) next to the Cathedral", "Calle Sierpes — window-shop and people-watch (free)"],
    afternoon: ["Barrio Santa Cruz — get lost in the narrow streets (free)", "Shopping on Calle Sierpes or in the alleys", "Real Alcázar if you skipped it Monday — ~€14.50"],
    evening: ["Mercado Lonja del Barranco — bites and drinks", "Flamenco show (Casa de la Memoria, La Casa del Flamenco) — ticket ~€20–35, book ahead", "Tapas crawl in Triana or El Arenal"],
    eat: ["Mercado Lonja del Barranco", "Flamenco show (Casa de la Memoria, La Casa del Flamenco) — ticket ~€20–35, book ahead"],
    night: ["Casa Anselma (Triana) — no sign, live flamenco & drinks — closes 3:00 AM", "Antique (cocktails) — closes 2:30 AM", "Rooftop: Hotel Eme or Doña María — close 12:30–1:00 AM"],
  },
  {
    dayLabel: "Wednesday",
    date: "5/20",
    city: "Sevilla",
    cityClass: "sevilla",
    arrivals: "DJ + Bridgette arriving this morning (NYC → Sevilla).",
    morning: ["Plaza de España & Maria Luisa Park (free)", "Rent a rowboat at the plaza or just wander the tiles (free)", "Palacio de las Dueñas (house museum) — ~€10 if open"],
    afternoon: ["Alcázar if you haven’t been — ~€14.50, book ahead", "Cathedral & Giralda if you haven’t — ~€12", "Relax at a Triana terrace or Mercado Lonja del Barranco"],
    evening: ["Long lunch or late tapas in Triana", "Rooftop or terrace drinks (Hotel Eme, Doña María, or a Triana bar)", "Evening stroll along the river or in Santa Cruz"],
    eat: ["Long lunch in Triana", "Rooftop or terrace drinks"],
    night: ["El Rinconcillo (oldest bar in Sevilla, tapas & sherry) — closes 1:00 AM", "Pura Vida — late-night bar — closes 3:00 AM", "Calle Sierpes area — bars and terraces — most close 2:00 AM"],
  },
  {
    dayLabel: "Thursday",
    date: "5/21",
    city: "Sevilla → Madrid",
    cityClass: "transfer",
    arrivals: "Harrison + Michelle arriving tonight or early Fri a.m. (into Madrid).",
    morning: ["Last coffee and pastry in Santa Cruz (free)", "One more lap of Alcázar gardens or Plaza de España (free)", "Pack and check out; light breakfast near the hotel"],
    afternoon: ["Train or flight to Madrid (Renfe AVE ~2.5 hrs; book ahead)", "Check in to Madrid hotel", "Short walk around the neighborhood (Sol, La Latina, or Huertas)"],
    evening: ["Dinner in La Latina (Cava Baja strip) or Mercado de San Miguel", "Evening stroll: Plaza Mayor, Sol, or Gran Vía", "Early night or a couple of bars on Cava Baja"],
    eat: ["Breakfast in Sevilla", "Dinner in Madrid (La Latina or Mercado de San Miguel)"],
    night: ["La Latina: Cava Baja strip (many bars) — most close 2:00–3:00 AM", "Salmon Guru (cocktails) — closes 2:30 AM", "Mercado de San Miguel — drinks & bites — closes 12:00 AM"],
  },
  {
    dayLabel: "Friday",
    date: "5/22",
    city: "Madrid",
    cityClass: "madrid",
    morning: ["Prado Museum — ticket required, reserve ahead — ~€15", "Day trip: Toledo (train ~€22 RT; cathedral ~€12, Alcázar ~€5) — book on Renfe", "Day trip: Segovia (train ~€10–16 RT; Alcázar ~€6, aqueduct free)"],
    afternoon: ["Retiro Park — stroll, rowboats ~€6–8 per boat, or just relax (free)", "Reina Sofía (modern art) — ~€12 if you prefer 20th century", "Gran Vía or Salamanca for shopping and cafés"],
    evening: ["Mercado de San Miguel — tapas and drinks", "La Latina tapas crawl (Cava Baja, Cava Alta)", "Rooftop: The Principal or Círculo de Bellas Artes — entry ~€4–5"],
    eat: ["Mercado de San Miguel", "La Latina tapas crawl"],
    night: ["The Principal Madrid (rooftop, views) — closes 1:30 AM", "Círculo de Bellas Artes (rooftop) — closes 12:00 AM", "Kapital (multi-floor club) — closes 6:00 AM; Joy Eslava (iconic club) — closes 5:30 AM"],
  },
  {
    dayLabel: "Saturday",
    date: "5/23",
    city: "Madrid",
    cityClass: "madrid",
    morning: ["Royal Palace — ticket required, book ahead — ~€14", "Day trip: Ávila (walls ~€5; train ~€8–14 RT)", "Day trip: El Escorial (monastery ~€10; train/bus from Madrid)", "Day trip: Segovia if you didn’t go Friday (Alcázar ~€6, aqueduct free)"],
    afternoon: ["Gran Vía & shopping (free)", "Retiro Park — rowboats, crystal palace, or lazy stroll (free)", "Thyssen-Bornemisza Museum — ~€13; or Prado if you skipped it"],
    evening: ["Churros at Chocolatería San Ginés", "Rooftop bar: Círculo de Bellas Artes or The Principal", "Plaza Mayor or Sol for people-watching and last shopping"],
    eat: ["Churros at Chocolatería San Ginés", "Rooftop bar (Círculo de Bellas Artes, The Principal)"],
    night: ["Gran Vía bars — typically 2:00–3:00 AM", "1862 Dry Bar (cocktails) — closes 2:30 AM", "Fabrik or Shoko (clubs) — close 5:30–6:00 AM; Sol/Huertas bars — 2:00–3:00 AM"],
  },
  {
    dayLabel: "Sunday",
    date: "5/24",
    city: "Madrid",
    cityClass: "madrid",
    departures: "Brandon (Madrid → Chicago) & DJ + Bridgette (Madrid → NYC) depart.",
    morning: ["Prado (if not done) — ~€15", "Retiro Park — morning walk or rowboats (free)", "El Rastro flea market (Sunday only, free) or a quiet café"],
    afternoon: ["Brunch or long lunch (La Latina, Malasaña, or Retiro area)", "Brandon & DJ + Bridgette head to airport", "Last museum (Reina Sofía ~€12, Thyssen ~€13) or Retiro for those staying"],
    evening: ["Low-key: La Latina terraces or one last rooftop", "Quiet dinner near the hotel or Mercado de San Miguel", "Early night for those flying tomorrow"],
    eat: ["Brunch or lunch before departures"],
    night: ["Low-key: La Latina terraces or one last rooftop (many close 12:00–1:00 AM); early night for those flying."],
  },
  {
    dayLabel: "Monday",
    date: "5/25",
    city: "Madrid",
    cityClass: "madrid",
    departures: "Harrison + Michelle depart (Madrid).",
    morning: ["Memorial Day — leisurely breakfast and coffee (free)", "Last stroll: Retiro, Gran Vía, or Sol", "Harrison + Michelle depart; pack and wrap up"],
    afternoon: [],
    evening: [],
    eat: ["Coffee and pastries or last tapas"],
    night: ["—"],
  },
];

function renderDayList() {
  const container = document.getElementById("day-list");
  if (!container) return;
  container.innerHTML = ITINERARY_DAYS.map(
    (d, i) => `
    <div class="day-card" data-day-index="${i}">
      <button type="button" class="day-card-header" aria-expanded="false" aria-controls="day-content-${i}" id="day-btn-${i}">
        <span class="day-card-title">${d.dayLabel} ${d.date}</span>
        <span class="day-card-city day-city-${d.cityClass}">${d.city}</span>
        <span class="day-card-chevron" aria-hidden="true">▼</span>
      </button>
      <div class="day-card-content" id="day-content-${i}" role="region" aria-labelledby="day-btn-${i}" hidden>
        ${d.arrivals ? `<div class="day-arrivals"><strong>Arrivals:</strong> ${d.arrivals}</div>` : ""}
        ${d.departures ? `<div class="day-departures"><strong>Departures:</strong> ${d.departures}</div>` : ""}
        <div class="day-do">
          ${doBlock("Morning", d.morning)}
          ${doBlock("Afternoon", d.afternoon)}
          ${doBlock("Evening", d.evening)}
        </div>
        <div class="day-eat">
          <h4>Eat & drink</h4>
          <ul>${d.eat.map((x) => `<li>${x}</li>`).join("")}</ul>
        </div>
        ${d.night && d.night.length && d.night[0] !== "—" ? `<div class="day-night"><h4>Bars & nightlife</h4><ul>${d.night.map((x) => `<li>${x}</li>`).join("")}</ul></div>` : ""}
      </div>
    </div>
  `
  ).join("");

  container.querySelectorAll(".day-card-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.parentElement.querySelector(".day-card-content");
      const expanded = content.hidden;
      content.hidden = !expanded;
      btn.setAttribute("aria-expanded", expanded);
      btn.parentElement.classList.toggle("day-card-open", expanded);
    });
  });

  // Open first day by default
  const first = container.querySelector(".day-card");
  if (first) {
    const btn = first.querySelector(".day-card-header");
    const content = first.querySelector(".day-card-content");
    content.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    first.classList.add("day-card-open");
  }
}

if (document.getElementById("day-list")) renderDayList();
