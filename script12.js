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
        "-2000": 55,
        "-771": 70,
        "476": 50,
        "1950": 65,
        "1951": 50,
        "1952": 60,
        "1953": 45,
        "1954": 60,
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
        "1998": 55,
        "2000": 45,
        "2001": 65,
        "2002": 30,
        "2003": 45,
        "2005": 45,
        "2006": 65,
        "2008": 45,
        "2011": 50,
        "2015": 50,
        "2016": 30,
        "2017": 25,
        "2019": 55,
        "2021": 10,
        "2024": 50,
        "2025": 10
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
          tooltip.style.top = `${pageY - 10}px`;
          if (tooltip.offsetTop < window.scrollY) {
            tooltip.style.top = `${window.scrollY + rect.bottom + 10}px`;
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
