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
import RESTAURANTS from "./data/restaurants.json";

// ---- Data ------------------------------------------------------------
// RESTAURANTS is loaded from ./data/restaurants.json — generated from
// Icmeler_Prices_Enhanced.xlsx (7 restaurants, 363 menu items, real prices).
// Menu/pricing data is real. score, reviews, address, mapUrl, whatsapp and
// photos are not in the price guide and come through as null/[] until
// sourced separately — the UI below renders sensible fallbacks for those
// rather than assuming they're populated.

const CUISINES = [
  "All cuisines",
  ...Array.from(new Set(RESTAURANTS.map((r) => r.cuisine))).sort(),
];
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
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
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
    if (len === 0) return;
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

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 14px 60px" }}>
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

        {/* Results — single column on phone, fluidly adds columns on wider screens */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 10,
            alignItems: "start",
          }}
        >
          {results.map((r) => {
            const isOpen = expanded.has(r.id);
            const hasPhotos = r.photos && r.photos.length > 0;
            return (
              <div key={r.id} className="card" style={{ borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: "#F2A93B" }}>
                      {r.score != null ? r.score.toFixed(1) : "—"}
                    </div>
                    <div style={{ fontSize: 9.5, color: "#9A9A9E", letterSpacing: 0.3 }}>
                      {r.reviews != null ? `${r.reviews.toLocaleString()} REVIEWS` : "RATING PENDING"}
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
                    {r.address && (
                      <div style={{ fontSize: 11, color: "#9A9A9E", marginTop: 3 }}>{r.address}</div>
                    )}
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
                  {hasPhotos && (
                    <button
                      className="pill-cta pill-photos"
                      onClick={() => setGallery({ restaurantId: r.id, index: 0 })}
                      style={{ flexShrink: 0 }}
                    >
                      <Images size={11} />
                      Photos ({r.photos.length})
                    </button>
                  )}
                  {r.mapUrl && (
                    <a className="pill-cta pill-map" href={r.mapUrl} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
                      <Navigation size={11} />
                      Map
                    </a>
                  )}
                  {r.whatsapp && (
                    <a className="pill-cta pill-whatsapp" href={`https://wa.me/${r.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
                      <MessageCircle size={11} />
                      WhatsApp
                    </a>
                  )}
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
          Prices sourced from the live İçmeler price guide. Ratings, addresses, WhatsApp numbers and real photos are still being sourced per venue.
        </p>
      </div>

      {/* Photo carousel popup */}
      {gallery && activeRestaurant && activeRestaurant.photos.length > 0 && (
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
