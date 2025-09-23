document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".timeline-grid");

  // Crée un seul tooltip global
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);

  // utilitaires
  const clean = s => (s === undefined || s === null) ? "" : String(s).trim();

  // ---- Helpers pour gérer les dates ----
  function parseDateValue(val) {
    if (!val) return null;
    if (val.includes("M")) {
      return parseFloat(val.replace("M", "")) * 1000000;
    }
    return parseFloat(val);
  }

  function buildGridColumns(data, customWidths = {}) {
    const dates = new Set();
    data.forEach(item => {
      if (item.start) dates.add(clean(item.start));
      if (item.end) dates.add(clean(item.end));
    });

    // Tri chronologique
    const sorted = [...dates].sort((a, b) => parseDateValue(a) - parseDateValue(b));

    // Construction CSS
    const cols = sorted.map(date => {
      const width = customWidths[date] || 35;
      return `[col-${date}-start] ${width}px [col-${date}-tick] ${width}px [col-${date}-end] 0`;
    });

    return cols.join(" ");
  }

  // Charge le CSV et construit la grille
  fetch("data12.csv")
    .then(r => {
      if (!r.ok) throw new Error("Échec du chargement du CSV: " + r.status);
      return r.text();
    })
    .then(text => {
      const data = Papa.parse(text, { header: true, delimiter: ";" }).data;
      console.log("CSV parsed, lignes:", data.length);

// |||||||||||||||||||| ICI LES LARGEURS DE COLONNES PERSONNALISÉES ||||||||||||||||||||||||||||
      // === construit grid-template-columns dynamiquement ===
      const customWidths = {
        "-11700": 53,
        "-17000": 55,
        "-2550": 50,
        "-2490": 50,
        "-2000": 55,
        "-771": 70,
        "-510": 55,
        "-509": 55,
        "-348": 25,
        "-323": 50,
        "-221": 45,
        "-206": 45,
        "-59": 45,
        "-49": 50,
        "-44": 45,
        "-31": 40,
        "-27": 50,
        "-15": 45,
        "77": 50,
        "127": 40,
        "161": 55,
        "169": 55,
        "220": 50,
        "235": 45,
        "238": 45,
        "265": 45,
        "280": 45,
        "286": 55,
        "476": 50,
        "604": 50,
        "1299": 50,
        "1300": 55,
        "1400": 60,
        "1434": 55,
        "1440": 40,
        "1453": 50,
        "1480": 60,
        "1492": 40,
        "1500": 55,
        "1503": 50,
        "1512": 50,
        "1516": 45,
        "1517": 40,
        "1529": 45,
        "1540": 55,
        "1642": 25,
        "1648": 50,
        "1662": 40,
        "1751": 60,
        "1756": 70,
        "1777": 55,
        "1798": 50,
        "1801": 45,
        "1802": 45,
        "1803": 55,
        "1805": 50,
        "1806": 50,
        "1812": 40,
        "1813": 40,
        "1814": 40,
        "1815": 50,
        "1816": 65,
        "1819": 45,
        "1820": 70,
        "1827": 45,
        "1830": 50,
        "1834": 45,
        "1839": 45,
        "1841": 60,
        "1844": 45,
        "1847": 60,
        "1848": 50,
        "1849": 50,
        "1851": 55,
        "1853": 50,
        "1855": 60,
        "1861": 65,
        "1862": 45,
        "1863": 45,
        "1867": 45,
        "1870": 65,
        "1872": 65,
        "1880": 45,
        "1881": 30,
        "1885": 50,
        "1886": 60,
        "1888": 80,
        "1889": 45,
        "1890": 60,
        "1893": 75,
        "1894": 40,
        "1897": 55,
        "1899": 20,
        "1900": 20,
        "1901": 60,
        "1903": 60,
        "1904": 70,
        "1905": 50,
        "1906": 50,
        "1907": 25,
        "1908": 75,
        "1909": 60,
        "1910": 55,
        "1911": 55,
        "1912": 85,
        "1913": 20,
        "1914": 20,
        "1915": 55,
        "1916": 60,
        "1917": 50,
        "1918": 20,
        "1919": 20,
        "1920": 65,
        "1924": 70,
        "1925": 70,
        "1926": 75,
        "1928": 10,
        "1929": 60,
        "1930": 55,
        "1931": 60,
        "1932": 10,
        "1933": 30,
        "1934": 50,
        "1935": 10,
        "1936": 65,
        "1937": 65,
        "1938": 70,
        "1939": 60,
        "1940": 50,
        "1941": 50,
        "1943": 45,
        "1944": 55,
        "1945": 60,
        "1946": 10,
        "1947": 40,
        "1948": 80,
        "1949": 90,
        "1950": 65,
        "1951": 50,
        "1952": 60,
        "1953": 45,
        "1954": 60,
        "1955": 10,
        "1956": 60,
        "1957": 50,
        "1958": 60,
        "1959": 10,
        "1960": 65,
        "1962": 50,
        "1965": 45,
        "1966": 65,
        "1968": 50,
        "1969": 60,
        "1970": 50,
        "1971": 50,
        "1972": 75,
        "1973": 60,
        "1974": 50,
        "1975": 60,
        "1976": 45,
        "1979": 45,
        "1980": 45,
        "1981": 55,
        "1983": 60,
        "1985": 10,
        "1987": 10,
        "1989": 45,
        "1990": 45,
        "1991": 50,
        "1993": 50,
        "1994": 50,
        "1997": 40,
        "1998": 55,
        "2000": 45,
        "2001": 65,
        "2002": 30,
        "2003": 45,
        "2005": 65,
        "2006": 65,
        "2008": 45,
        "2011": 50,
        "2015": 50,
        "2016": 30,
        "2017": 25,
        "2019": 55,
        "2021": 10,
        "2024": 50,
        "2025": 10,
        "2026": 130,
        "2027": 190
      };
      const gridColumns = buildGridColumns(data, customWidths);
      grid.style.gridTemplateColumns = gridColumns;

      // === création des éléments ===
      data.forEach(raw => {
        const item = {
          type: clean(raw.type).toLowerCase(),
          title: clean(raw.title),
          start: clean(raw.start),
          end: clean(raw.end),
          row: clean(raw.row),
          tooltip: clean(raw.tooltip),
          class: clean(raw.class)
        };

        if (!item.type && !item.class && !item.start && !item.end) return;

        // ----- Dates (ticks) -----
        if (item.type === "date") {
          const div = document.createElement("div");
          div.className = "tick";
          div.setAttribute("date-label", item.title || item.start);
          div.dataset.date = item.start;
          div.style.gridColumn = `col-${item.start}-start / col-${item.start}-end`;
          grid.appendChild(div);
          return;
        }

        // ----- Périodes -----
        if (item.type === "period") {
          const div = document.createElement("div");
          div.className = `period ${item.class || ""}`.trim();
          if (item.tooltip) div.dataset.tooltip = item.tooltip;
          if (item.start) div.dataset.start = item.start;
          if (item.end) div.dataset.end = item.end;
          div.style.gridColumn = `col-${item.start}-tick / col-${item.end}-tick`;
          if (item.row) div.style.gridRow = item.row;
          div.innerHTML = `<span class="period-label">${item.title}</span>`;
          grid.appendChild(div);
          return;
        }

        // ----- Événements -----
        if (item.type === "event") {
          const div = document.createElement("div");
          div.className = `event ${item.class || ""}`.trim();
          div.dataset.date = item.start;
          if (item.tooltip) div.dataset.tooltip = item.tooltip;
          div.style.gridColumn = `col-${item.start}-start / col-${item.start}-end`;
          if (item.row) div.style.gridRow = item.row;
          div.innerHTML = item.title;
          grid.appendChild(div);
          return;
        }

        // ----- Fonds -----
        if (item.type === "fond") {
          const div = document.createElement("div");
          div.className = item.class || "";
          if (item.start) div.dataset.start = item.start;
          if (item.end) div.dataset.end = item.end;
          div.style.gridColumn = `col-${item.start}-tick / col-${item.end}-tick`;
          if (item.row) {
          // permet d'écrire "rowhist1 / span 3" directement dans le CSV
            div.style.gridRow = item.row;
          }
          grid.appendChild(div);
          return;
        }
      });

      // --- Tooltips ---
      const targets = document.querySelectorAll('.period[data-tooltip], .event[data-tooltip]');
      targets.forEach(el => {
        el.addEventListener("mouseenter", e => {
          tooltip.innerHTML = el.getAttribute("data-tooltip")
            ?.replace(/=>/g, "⟶"); // remplace les => par une flèche
          tooltip.classList.add("visible");
        });
el.addEventListener("mousemove", e => {
  const rect = el.getBoundingClientRect();
  const pageY = window.scrollY + rect.top;

  tooltip.style.left = `${e.pageX}px`;

  if (el.classList.contains("below")) {
    // Cas manuel : tooltip en dessous
    tooltip.classList.add("below");
    tooltip.style.top = `${window.scrollY + rect.bottom + 10}px`;
  } else {
    // Cas normal : tooltip au-dessus
    tooltip.classList.remove("below");
    tooltip.style.top = `${pageY - 10}px`;

    // Sécurité si ça sort de l'écran en haut
    if (tooltip.offsetTop < window.scrollY) {
      tooltip.classList.add("below");
      tooltip.style.top = `${window.scrollY + rect.bottom + 10}px`;
    }
  }
});
        el.addEventListener("mouseleave", () => {
          tooltip.classList.remove("visible");
        });
      });

      // --- Highlight ticks ---
      setupTickHighlights();

      console.log("Construction de la frise terminée.");
    })
    .catch(err => {
      console.error("Erreur dans le chargement du CSV ou la construction :", err);
    });

  // --------- Fonction d'activation des highlights ----------
  function setupTickHighlights() {
    function highlightTickByDate(date, active) {
      if (!date) return;
      document.querySelectorAll(`.tick[data-date="${date}"]`).forEach(t => {
        t.classList.toggle("highlight", !!active);
      });
    }

    document.querySelectorAll(".event").forEach(ev => {
      const date = ev.dataset.date;
      if (!date) return;
      ev.addEventListener("mouseenter", () => highlightTickByDate(date, true));
      ev.addEventListener("mouseleave", () => highlightTickByDate(date, false));
    });

    document.querySelectorAll(".period").forEach(p => {
      const s = p.dataset.start;
      const e = p.dataset.end;
      if (s) {
        p.addEventListener("mouseenter", () => highlightTickByDate(s, true));
        p.addEventListener("mouseleave", () => highlightTickByDate(s, false));
      }
      if (e) {
        p.addEventListener("mouseenter", () => highlightTickByDate(e, true));
        p.addEventListener("mouseleave", () => highlightTickByDate(e, false));
      }
    });
  }
});
