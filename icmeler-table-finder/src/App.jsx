import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Navigation,
  MessageCircle,
  Images,
  X,
} from "lucide-react";

// ---- Sample data (placeholder) --------------------------------------
// Fictional venues/prices/addresses/numbers/photos for layout & interaction
// demo only. Swap this array for a live feed from Icmeler_Prices_Enhanced.xlsx
// (plus real photo URLs) before this goes anywhere near production.

const RESTAURANTS = [
  {
    id: "liman-sofrasi",
    name: "Liman Sofrası",
    cuisine: "Turkish",
    tier: 1,
    waterfront: true,
    score: 8.9,
    reviews: 412,
    avgPrice: 350,
    address: "Kayabaşı Cd. 12, İçmeler",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kayaba%C5%9F%C4%B1+Cd.+12+I%C3%A7meler",
    whatsapp: "905000000001",
    photos: [
      { color: "linear-gradient(135deg, #4A7A8C, #17384A)", caption: "Harbour terrace" },
      { color: "linear-gradient(135deg, #B8502F, #6B3A22)", caption: "Grilled sea bass" },
      { color: "linear-gradient(135deg, #6F7D4A, #3C4527)", caption: "Meze spread" },
    ],
    menu: [
      { category: "Meze", items: [
        { name: "Sigara böreği", price: 140 },
        { name: "Ezme", price: 120 },
        { name: "Haydari", price: 110 },
      ]},
      { category: "Mains", items: [
        { name: "Grilled sea bass (whole)", price: 650 },
        { name: "Chicken şiş", price: 280 },
        { name: "Köfte plate", price: 260 },
      ]},
    ],
  },
  {
    id: "deniz-kenari",
    name: "Deniz Kenarı Balık",
    cuisine: "Seafood",
    tier: 3,
    waterfront: true,
    score: 9.4,
    reviews: 1180,
    avgPrice: 900,
    address: "Sahil Yolu 45, İçmeler",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Sahil+Yolu+45+I%C3%A7meler",
    whatsapp: "905000000002",
    photos: [
      { color: "linear-gradient(135deg, #235A72, #0F2E3B)", caption: "Fish counter" },
      { color: "linear-gradient(135deg, #4A9FBF, #1D5266)", caption: "Sunset view" },
    ],
    menu: [
      { category: "Starters", items: [
        { name: "Grilled octopus", price: 380 },
        { name: "Calamari", price: 290 },
      ]},
      { category: "Fish (per kg)", items: [
        { name: "Sea bream", price: 1400 },
        { name: "Sea bass", price: 1600 },
        { name: "Grouper", price: 2200 },
      ]},
    ],
  },
  {
    id: "nazar-meze",
    name: "Nazar Meze House",
    cuisine: "Turkish",
    tier: 2,
    waterfront: false,
    score: 9.1,
    reviews: 305,
    avgPrice: 420,
    address: "Çarşı Sk. 8, İçmeler",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=%C3%87ar%C5%9F%C4%B1+Sk.+8+I%C3%A7meler",
    whatsapp: "905000000003",
    photos: [
      { color: "linear-gradient(135deg, #8A5A2E, #4A2F17)", caption: "Rakı table" },
      { color: "linear-gradient(135deg, #B8863C, #6B4C1E)", caption: "Backstreet entrance" },
      { color: "linear-gradient(135deg, #6F7D4A, #3C4527)", caption: "Mixed grill" },
    ],
    menu: [
      { category: "Meze (small)", items: [
        { name: "Patlıcan salatası", price: 130 },
        { name: "Cacık", price: 100 },
        { name: "Fava", price: 120 },
      ]},
      { category: "Grill", items: [
        { name: "Lamb şiş", price: 320 },
        { name: "Mixed grill (2 people)", price: 780 },
      ]},
    ],
  },
  {
    id: "marina-trattoria",
    name: "Marina Trattoria",
    cuisine: "Italian",
    tier: 2,
    waterfront: true,
    score: 8.6,
    reviews: 267,
    avgPrice: 400,
    address: "Marina Blv. 3, İçmeler",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Marina+Blv.+3+I%C3%A7meler",
    whatsapp: "905000000004",
    photos: [
      { color: "linear-gradient(135deg, #7A3B2E, #401D16)", caption: "Wood-fired pizza" },
      { color: "linear-gradient(135deg, #4A7A8C, #17384A)", caption: "Marina view" },
    ],
    menu: [
      { category: "Pasta", items: [
        { name: "Spaghetti vongole", price: 340 },
        { name: "Penne arrabbiata", price: 260 },
      ]},
      { category: "Pizza", items: [
        { name: "Margherita", price: 280 },
        { name: "Quattro formaggi", price: 340 },
      ]},
    ],
  },
  {
    id: "cafe-badem",
    name: "Café Badem",
    cuisine: "Café",
    tier: 1,
    waterfront: false,
    score: 9.0,
    reviews: 588,
    avgPrice: 180,
    address: "Atatürk Cd. 21, İçmeler",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Atat%C3%BCrk+Cd.+21+I%C3%A7meler",
    whatsapp: "905000000005",
    photos: [
      { color: "linear-gradient(135deg, #6B4C2E, #3A2817)", caption: "Turkish breakfast" },
      { color: "linear-gradient(135deg, #B8863C, #6B4C1E)", caption: "Courtyard seating" },
    ],
    menu: [
      { category: "Breakfast", items: [
        { name: "Turkish breakfast (2 people)", price: 420 },
        { name: "Menemen", price: 190 },
      ]},
      { category: "Drinks", items: [
        { name: "Turkish coffee", price: 70 },
        { name: "Fresh orange juice", price: 90 },
      ]},
    ],
  },
  {
    id: "rakı-bar-marina",
    name: "Marina Rakı Bar",
    cuisine: "Drinks",
    tier: 2,
    waterfront: true,
    score: 8.8,
    reviews: 221,
    avgPrice: 300,
    address: "Marina Blv. 9, İçmeler",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Marina+Blv.+9+I%C3%A7meler",
    whatsapp: "905000000006",
    photos: [
      { color: "linear-gradient(135deg, #4A2F17, #8A5A2E)", caption: "Sunset cocktails" },
      { color: "linear-gradient(135deg, #17384A, #4A7A8C)", caption: "Marina bar" },
    ],
    menu: [
      { category: "Cocktails", items: [
        { name: "Mojito", price: 260 },
        { name: "Aperol spritz", price: 280 },
      ]},
      { category: "Beer & rakı", items: [
        { name: "Efes (pint)", price: 150 },
        { name: "Rakı (double)", price: 220 },
      ]},
    ],
  },
];

const CUISINES = ["All cuisines", "Turkish", "Seafood", "Italian", "Café", "Drinks"];
const TIERS = ["Any price", "₺", "₺₺", "₺₺₺"];

function matches(restaurant, query) {
  if (!query) return { hit: true, dish: null };
  const q = query.toLowerCase();
  if (restaurant.name.toLowerCase().includes(q)) return { hit: true, dish: null };
  if (restaurant.cuisine.toLowerCase().includes(q)) return { hit: true, dish: null };
  for (const section of restaurant.menu) {
    for (const item of section.items) {
      if (item.name.toLowerCase().includes(q)) return { hit: true, dish: item.name };
    }
  }
  return { hit: false, dish: null };
}

const selectStyle = {
  background: "#3A3A3F",
  color: "#F5F5F4",
  border: "1px solid #4A4A50",
  borderRadius: 8,
  padding: "7px 8px",
  fontSize: 12,
  fontFamily: "inherit",
  outline: "none",
  flex: 1,
  minWidth: 0,
};

export default function IcmelerTableFinder() {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("All cuisines");
  const [tierLabel, setTierLabel] = useState("Any price");
  const [expanded, setExpanded] = useState(() => new Set());
  const [gallery, setGallery] = useState(null); // { restaurantId, index } | null

  const tier = TIERS.indexOf(tierLabel); // 0 = any

  const results = useMemo(() => {
    return RESTAURANTS.map((r) => ({ ...r, matchInfo: matches(r, query) }))
      .filter((r) => r.matchInfo.hit)
      .filter((r) => cuisine === "All cuisines" || r.cuisine === cuisine)
      .filter((r) => tier === 0 || r.tier === tier)
      .sort((a, b) => b.score - a.score);
  }, [query, cuisine, tier]);

  function toggle(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const activeRestaurant = gallery ? RESTAURANTS.find((r) => r.id === gallery.restaurantId) : null;

  function stepPhoto(delta) {
    if (!gallery || !activeRestaurant) return;
    const len = activeRestaurant.photos.length;
    setGallery({ ...gallery, index: (gallery.index + delta + len) % len });
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#2A2A2D",
        minHeight: "100vh",
        color: "#F5F5F4",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        select option { background: #3A3A3F; color: #F5F5F4; }
        .card { background: #35353A; border: 1px solid #45454B; }
        .pill-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 16px;
          padding: 5px 9px;
          cursor: pointer;
          text-decoration: none;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .pill-whatsapp { color: #4ADE80; background: rgba(46,160,90,0.15); border-color: #2FAF6B; }
        .pill-map { color: #6BB8DA; background: rgba(74,159,191,0.12); border-color: #3E7E99; }
        .pill-photos { color: #C79AE8; background: rgba(167,112,214,0.14); border-color: #8E5FB8; }
        .pill-menu { color: #F2A93B; background: rgba(242,169,59,0.12); border-color: #B8863C; }
        .dotted-leader { flex: 1; border-bottom: 1px dotted #55555C; margin: 0 6px; transform: translateY(-4px); }
        .modal-nav {
          background: rgba(0,0,0,0.35);
          border: none;
          color: #F5F5F4;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      `}</style>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "18px 14px 60px" }}>
        {/* Header strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingBottom: 10,
            borderBottom: "1px solid #F2A93B44",
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: "#F2A93B" }}>
            İçmeler · Table Finder
          </span>
          <span style={{ fontSize: 11, color: "#9A9A9E" }}>
            {results.length} {results.length === 1 ? "place" : "places"}
          </span>
        </div>

        {/* Search bar */}
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 12px",
            borderRadius: 9,
            marginBottom: 8,
          }}
        >
          <Search size={15} color="#F2A93B" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'sea bass', 'meze'…"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              flex: 1,
              fontFamily: "inherit",
              color: "#F5F5F4",
            }}
          />
        </div>

        {/* Dropdown filters — cuisine (incl. Drinks) + price */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} style={selectStyle}>
            {CUISINES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={tierLabel} onChange={(e) => setTierLabel(e.target.value)} style={selectStyle}>
            {TIERS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {results.length === 0 && (
          <div style={{ padding: "18px 0", color: "#9A9A9E", fontSize: 13 }}>
            Nothing matches that search yet — try a broader term or clear a filter.
          </div>
        )}

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {results.map((r) => {
            const isOpen = expanded.has(r.id);
            return (
              <div key={r.id} className="card" style={{ borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: "#F2A93B" }}>{r.score.toFixed(1)}</div>
                    <div style={{ fontSize: 9.5, color: "#9A9A9E", letterSpacing: 0.3 }}>
                      {r.reviews.toLocaleString()} REVIEWS
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F4" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#B4B4B8", marginTop: 2 }}>
                      {r.cuisine} · {"₺".repeat(r.tier)} · ~₺{r.avgPrice} pp
                      {r.waterfront && (
                        <span style={{ marginLeft: 6, color: "#6BB8DA" }}>
                          <MapPin size={11} style={{ marginBottom: -2 }} /> waterfront
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#9A9A9E", marginTop: 3 }}>{r.address}</div>
                    {r.matchInfo.dish && (
                      <div style={{ fontSize: 11, color: "#F2A93B", marginTop: 3 }}>
                        matched: {r.matchInfo.dish}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexWrap: "nowrap",
                    justifyContent: "flex-start",
                    gap: 5,
                    overflowX: "auto",
                    paddingBottom: 2,
                  }}
                >
                  <button
                    className="pill-cta pill-photos"
                    onClick={() => setGallery({ restaurantId: r.id, index: 0 })}
                    style={{ flexShrink: 0 }}
                  >
                    <Images size={11} />
                    Photos ({r.photos.length})
                  </button>
                  <a className="pill-cta pill-map" href={r.mapUrl} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
                    <Navigation size={11} />
                    Map
                  </a>
                  <a className="pill-cta pill-whatsapp" href={`https://wa.me/${r.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
                    <MessageCircle size={11} />
                    WhatsApp
                  </a>
                  <div className="pill-cta pill-menu" onClick={() => toggle(r.id)} style={{ flexShrink: 0 }}>
                    {isOpen ? "Hide menu" : "View menu"}
                    {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  </div>
                </div>

                {isOpen && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #45454B" }}>
                    {r.menu.map((section) => (
                      <div key={section.category} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#F2A93B", marginBottom: 6 }}>
                          {section.category}
                        </div>
                        {section.items.map((item) => (
                          <div
                            key={item.name}
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              fontSize: 12.5,
                              padding: "2px 0",
                              color: r.matchInfo.dish === item.name ? "#F2A93B" : "#F5F5F4",
                              fontWeight: r.matchInfo.dish === item.name ? 600 : 400,
                            }}
                          >
                            <span>{item.name}</span>
                            <span className="dotted-leader" />
                            <span>₺{item.price}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: 24, fontSize: 10.5, color: "#77777C", textAlign: "center" }}>
          Prototype — sample data for layout only. Swap in your live price list, real addresses, WhatsApp numbers and real photos before this goes anywhere near a follower.
        </p>
      </div>

      {/* Photo carousel popup */}
      {gallery && activeRestaurant && (
        <div
          onClick={() => setGallery(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 380,
              background: "#1E1E20",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #45454B",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F4" }}>{activeRestaurant.name}</span>
              <button
                onClick={() => setGallery(null)}
                style={{ background: "transparent", border: "none", color: "#9A9A9E", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ position: "relative", height: 220, background: activeRestaurant.photos[gallery.index].color }}>
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 12,
                  fontSize: 11.5,
                  color: "#F5F5F4",
                  background: "rgba(0,0,0,0.4)",
                  padding: "3px 9px",
                  borderRadius: 16,
                }}
              >
                {activeRestaurant.photos[gallery.index].caption}
              </div>

              {activeRestaurant.photos.length > 1 && (
                <>
                  <button
                    className="modal-nav"
                    onClick={() => stepPhoto(-1)}
                    style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    className="modal-nav"
                    onClick={() => stepPhoto(1)}
                    style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
                  >
                    <ChevronRight size={17} />
                  </button>
                </>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "10px 0" }}>
              {activeRestaurant.photos.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setGallery({ ...gallery, index: i })}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: i === gallery.index ? "#F2A93B" : "#4A4A50",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
