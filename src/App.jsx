import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   SHARED CONSTANTS & UTILITIES
   ═══════════════════════════════════════════════ */
const BG = "#0a0a12";
const GLASS = { background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 };
const FOOTER_TEXT = "TM & © 2026 Office of the CEO. All rights reserved.";
const SPIN_CSS = `@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;

function AmbientGlow({ color = "#F59E0B", top = "30%", left = "50%" }) {
  return <div style={{ position: "absolute", top, left, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`, transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 0 }} />;
}
function useIsMobile(bp = 700) {
  const [m, setM] = useState(typeof window !== "undefined" ? window.innerWidth < bp : false);
  useEffect(() => { const h = () => setM(window.innerWidth < bp); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, [bp]);
  return m;
}
function Footer() { return <p style={{ color: "rgba(255,255,255,0.1)", fontSize: 11, textAlign: "center", marginTop: 24 }}>{FOOTER_TEXT}</p>; }
function TopBrand() { return <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)", textAlign: "center", marginBottom: 20 }}>OFFICE OF THE CEO<span style={{ fontSize: 6, verticalAlign: "super" }}>™</span> <span style={{ margin: "0 4px" }}>|</span> officeoftheceo.ai</div>; }

/* ─── AI Refine ─── */
const MAX_CHARS = 100;
const STYLE_RULES = "STRICT RULES: Each item must be under 100 characters. Write as a clear, concise phrase — not a bullet point, not a full sentence. No periods at the end. No bullet characters. Never use specific calendar dates — use relative timeframes like 'next 90 days' or 'this quarter' instead. Be concrete and specific.";
const RP = {
  twelveMonths: `You are a CEO-level strategic advisor. The user entered company outcomes for the next 12 months. Rewrite each to be specific, measurable, and executive-grade. ${STYLE_RULES} Do not add new items. Do not number them.`,
  twelveWeeks: `You are a CEO-level strategic advisor. The user entered outcomes to accelerate with AI in the next 12 weeks. Rewrite each to be specific, actionable, and tied to a measurable result. ${STYLE_RULES} Do not add new items. Do not number them.`,
  strength: `You are a CEO-level strategic advisor. The user listed business strengths to maximize. Rewrite each to be specific and action-oriented. ${STYLE_RULES} Do not add new items. Do not number them.`,
  weakness: `You are a CEO-level strategic advisor. The user listed internal weaknesses to eliminate. Rewrite each to name the capability gap and its business impact. ${STYLE_RULES} Do not add new items. Do not number them.`,
  opportunity: `You are a CEO-level strategic advisor. The user listed opportunities to capture. Rewrite each to name the specific resource or market and the growth it enables. ${STYLE_RULES} Do not add new items. Do not number them.`,
  threat: `You are a CEO-level strategic advisor. The user listed external threats to mitigate. Rewrite each to name the specific risk and its potential impact. ${STYLE_RULES} Do not add new items. Do not number them.`,
  insights: "You are a CEO-level strategic advisor. The user wrote initial insights and actions after a SWOT analysis. Rewrite to be sharper, more specific, and actionable. Concise executive language. Keep roughly the same length. No headers or bullets. Never use specific calendar dates — use relative timeframes instead.",
  priority: `You are a CEO-level strategic advisor. The user entered a weekly priority for a team member. Rewrite to be specific and action-oriented. ${STYLE_RULES} Return only the rewritten text.`,
};
const SP = {
  twelveMonths: `Rewrite this 12-month company outcome to be specific, measurable, and executive-grade. ${STYLE_RULES} Return only the rewritten text.`,
  twelveWeeks: `Rewrite this 12-week outcome to be specific, actionable, and measurable. ${STYLE_RULES} Return only the rewritten text.`,
  strength: `Rewrite this strength to be specific and action-oriented. ${STYLE_RULES} Return only the rewritten text.`,
  weakness: `Rewrite this weakness to name the gap and its impact. ${STYLE_RULES} Return only the rewritten text.`,
  opportunity: `Rewrite this opportunity to name the resource and growth it enables. ${STYLE_RULES} Return only the rewritten text.`,
  threat: `Rewrite this threat to name the risk and its impact. ${STYLE_RULES} Return only the rewritten text.`,
  priority: `Rewrite this team priority to be specific and action-oriented. ${STYLE_RULES} Return only the rewritten text.`,
};

async function aiCall(sys, usr) {
  try {
    const r = await fetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: [{ role: "user", content: usr }] }),
    });
    const d = await r.json();
    return d.content?.map(b => b.type === "text" ? b.text : "").join("").trim() || null;
  } catch (e) { return null; }
}
async function refineSingle(text, key) {
  if (!text.trim()) return null;
  const r = await aiCall(SP[key] || RP[key], text);
  return r ? r.replace(/\.\s*$/, "").slice(0, MAX_CHARS) : null;
}

/* ─── Shared Icons ─── */
function MailIcon({ size = 18, color = "#fff" }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>; }
function CopyIcon({ size = 18, color = "#fff" }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>; }
function SparkleIcon({ size = 16, color = "#F59E0B" }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M12 2l1.09 4.26L17 7.27l-3.18 2.73L14.64 15 12 12.77 9.36 15l.82-4.99L7 7.27l3.91-.99L12 2z"/><path d="M5 17l.5 2 .5-2 2-.5-2-.5-.5-2-.5 2-2 .5 2 .5z" opacity="0.6"/><path d="M19 8l.5 2 .5-2 2-.5-2-.5L19 5l-.5 2-2 .5 2 .5z" opacity="0.6"/></svg>; }
function GripIcon({ size = 16, color = "rgba(255,255,255,0.2)" }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>; }

/* ─── Nav Buttons ─── */
function NavButtons({ onBack, onNext, nextLabel = "Next →", mobile }) {
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
      {onBack && <button onClick={onBack} style={{ padding: "14px 36px", borderRadius: 12, fontWeight: 600, fontSize: 16, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", width: mobile ? "48%" : "auto" }}>← Back</button>}
      {onNext && <button onClick={onNext} style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000", border: "none", padding: "14px 44px", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 0 40px rgba(245,158,11,0.25),inset 0 1px 0 rgba(255,255,255,0.2)", transition: "transform 0.2s,box-shadow 0.2s", width: mobile ? (onBack ? "48%" : "100%") : "auto" }} onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 0 60px rgba(245,158,11,0.35),inset 0 1px 0 rgba(255,255,255,0.2)"; }} onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 40px rgba(245,158,11,0.25),inset 0 1px 0 rgba(255,255,255,0.2)"; }}>{nextLabel}</button>}
    </div>
  );
}
/* ═══════════════════════════════════════════════
   VISION & SWOT SNAPSHOT TOOL
   ═══════════════════════════════════════════════ */
function ClockIcon({ size = 24, color = "#8B5CF6" }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>; }
function SWOTTargetIcon({ size = 24, color = "#F59E0B" }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill={color} stroke="none"/></svg>; }
function StarIcon({ size = 28, color = "#22C55E" }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>; }
function AlertIcon({ size = 28, color = "#EF4444" }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function PlusCircleIcon({ size = 28, color = "#3B82F6" }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function ShieldIcon({ size = 28, color = "#F59E0B" }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }

const SWOT_ICONS = { strength: StarIcon, weakness: AlertIcon, opportunity: PlusCircleIcon, threat: ShieldIcon };
const QUADRANTS = [
  { id: "strength", label: "BIGGEST STRENGTHS", sublabel: "TO MAXIMIZE", prompt: "What successes will you build on in the next 90 days?", placeholder: "Strength...", color: "#22C55E", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
  { id: "weakness", label: "BIGGEST WEAKNESSES", sublabel: "TO ELIMINATE", prompt: "What internal gaps could slow your progress?", placeholder: "Weakness...", color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
  { id: "opportunity", label: "BIGGEST OPPORTUNITIES", sublabel: "TO CAPTURE", prompt: "What untapped resources can accelerate growth?", placeholder: "Opportunity...", color: "#3B82F6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
  { id: "threat", label: "BIGGEST THREATS", sublabel: "TO MITIGATE", prompt: "What external risks need your attention now?", placeholder: "Threat...", color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
];
const DEFAULT_SWOT = { strength: ["","",""], weakness: ["","",""], opportunity: ["","",""], threat: ["","",""] };

/* Entry List with drag + AI */
function EntryList({ items, onUpdate, glowColor, placeholder, sectionKey, multiline }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [rIdx, setRIdx] = useState(null);
  const dn = useRef(null);
  const upd = (i, v) => { const clean = v.replace(/\n/g, " "); const a = [...items]; a[i] = clean.slice(0, MAX_CHARS); onUpdate(a); };
  const add = () => onUpdate([...items, ""]);
  const rm = (i) => { if (items.length > 1) onUpdate(items.filter((_, j) => j !== i)); };
  const ds = (e, i) => { setDragIdx(i); dn.current = e.target; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", ""); setTimeout(() => { if (dn.current) dn.current.style.opacity = "0.4"; }, 0); };
  const de = () => { if (dn.current) dn.current.style.opacity = "1"; if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) { const a = [...items]; const [m] = a.splice(dragIdx, 1); a.splice(overIdx, 0, m); onUpdate(a); } setDragIdx(null); setOverIdx(null); dn.current = null; };
  const dov = (e, i) => { e.preventDefault(); setOverIdx(i); };
  const refOne = async (i) => { if (!items[i]?.trim() || rIdx !== null) return; setRIdx(i); const r = await refineSingle(items[i], sectionKey); if (r) { const a = [...items]; a[i] = r; onUpdate(a); } setRIdx(null); };
  const busy = rIdx !== null;
  const fieldStyle = (i) => ({ flex: 1, padding: multiline ? "8px 12px" : "11px 14px", borderRadius: 8, minWidth: 0, background: rIdx === i ? "rgba(245,158,11,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${rIdx === i ? glowColor + "40" : "rgba(255,255,255,0.06)"}`, color: "#fff", fontSize: multiline ? 13 : 15, fontFamily: "Georgia,serif", outline: "none", transition: "all 0.3s", resize: "none", lineHeight: 1.4, ...(multiline ? { height: 48, display: "block" } : {}) });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <style>{SPIN_CSS}</style>
      {items.map((item, i) => (
        <div key={i} draggable onDragStart={e => ds(e, i)} onDragEnd={de} onDragOver={e => dov(e, i)}
          style={{ display: "flex", alignItems: multiline ? "flex-start" : "center", gap: 6, borderTop: overIdx === i && dragIdx !== null && dragIdx !== i ? `2px solid ${glowColor}60` : "2px solid transparent", paddingTop: 2, transition: "border-color 0.15s" }}>
          <div style={{ cursor: "grab", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 2px", touchAction: "none", marginTop: multiline ? 10 : 0 }} onMouseDown={e => e.currentTarget.style.cursor = "grabbing"} onMouseUp={e => e.currentTarget.style.cursor = "grab"}><GripIcon size={14} color="rgba(255,255,255,0.15)" /></div>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 700, width: 18, textAlign: "center", flexShrink: 0, marginTop: multiline ? 10 : 0 }}>{i + 1}</span>
          {multiline
            ? <textarea value={item} maxLength={MAX_CHARS} onChange={e => upd(i, e.target.value)} placeholder={placeholder || "Item " + (i + 1)} style={fieldStyle(i)} onFocus={e => { e.target.style.borderColor = glowColor + "60"; e.target.style.boxShadow = `0 0 12px ${glowColor}10`; }} onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.06)"; e.target.style.boxShadow = "none"; }} />
            : <input type="text" value={item} maxLength={MAX_CHARS} onChange={e => upd(i, e.target.value)} placeholder={placeholder || "Item " + (i + 1)} style={fieldStyle(i)} onFocus={e => { e.target.style.borderColor = glowColor + "60"; e.target.style.boxShadow = `0 0 12px ${glowColor}10`; }} onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.06)"; e.target.style.boxShadow = "none"; }} />}
          {item.length >= MAX_CHARS - 10 && <span style={{ fontSize: 10, color: item.length >= MAX_CHARS ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.15)", flexShrink: 0, width: 28, textAlign: "center", marginTop: multiline ? 10 : 0 }}>{MAX_CHARS - item.length}</span>}
          {item.trim() && <button onClick={() => refOne(i)} disabled={busy} title="Refine with AI" style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0, background: rIdx === i ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${rIdx === i ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)"}`, cursor: busy ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", opacity: rIdx !== null && rIdx !== i ? 0.3 : 1, marginTop: multiline ? 8 : 0 }}>
            {rIdx === i ? <span style={{ fontSize: 11, color: "#F59E0B", animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> : <SparkleIcon size={14} color={glowColor} />}
          </button>}
          {items.length > 1 && <button onClick={() => rm(i)} style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: multiline ? 8 : 0 }}>×</button>}
        </div>
      ))}
      <button onClick={add} style={{ marginTop: 4, width: "100%", padding: 7, borderRadius: 8, background: "transparent", color: "rgba(255,255,255,0.2)", border: "1px dashed rgba(255,255,255,0.06)", cursor: "pointer", fontSize: 12 }}>+ Add</button>
    </div>
  );
}

/* Textarea with AI */
function GlowTextarea({ value, onChange, placeholder, minHeight = 120, glowColor = "#F59E0B", sectionKey, allContext }) {
  const [rfn, setRfn] = useState(false);
  const doRefine = async () => { if (!value.trim() || rfn) return; setRfn(true); const ctx = allContext ? `Context:\n${allContext}\n\nInsights to refine:\n${value}` : value; const r = await aiCall(RP[sectionKey] || RP.insights, ctx); if (r) onChange({ target: { value: r } }); setRfn(false); };
  return (
    <div><style>{SPIN_CSS}</style>
      <textarea value={value} onChange={onChange} placeholder={placeholder} style={{ width: "100%", minHeight, padding: 16, borderRadius: 12, fontSize: 16, fontFamily: "Georgia,serif", lineHeight: 1.6, outline: "none", resize: "vertical", background: rfn ? "rgba(245,158,11,0.03)" : "rgba(255,255,255,0.03)", border: `1px solid ${rfn ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.08)"}`, color: "#fff", transition: "all 0.3s" }}
        onFocus={e => { e.target.style.borderColor = glowColor + "60"; e.target.style.boxShadow = `0 0 20px ${glowColor}10`; }} onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }} />
      {value.trim() && <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={doRefine} disabled={rfn} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: rfn ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", color: rfn ? "#F59E0B" : "rgba(245,158,11,0.6)", cursor: rfn ? "wait" : "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>
          {rfn ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Refining...</> : <><SparkleIcon size={13} color="rgba(245,158,11,0.6)" /> Refine with AI</>}
        </button>
      </div>}
    </div>
  );
}

/* SWOT Welcome */
function SWOTWelcome({ onStart }) {
  const [company, setCompany] = useState("");
  const [mode, setMode] = useState("company"); // "company" or "personal"
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const mobile = useIsMobile();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: mobile ? 20 : 40, background: BG, position: "relative", overflow: "hidden" }}>
      <AmbientGlow color="#F59E0B" top="20%" /><AmbientGlow color="#22C55E" top="80%" left="70%" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1060, width: "100%", textAlign: "center" }}>
        <TopBrand />
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: mobile ? 36 : 56, fontWeight: 700, lineHeight: 1.1, margin: "0 0 20px", background: "linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.7) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          AI-First Vision &<br />SWOT Snapshot<span style={{ fontSize: mobile ? 14 : 20, verticalAlign: "super" }}>™</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: mobile ? 15 : 17, fontFamily: "Georgia,serif", margin: "0 0 28px" }}>Define what winning looks like. See where AI accelerates the path.</p>

        {/* Company / Personal toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            {[{ id: "company", label: "Company" }, { id: "personal", label: "Personal" }].map(t => (
              <button key={t.id} onClick={() => setMode(t.id)} style={{ padding: "10px 24px", fontSize: 14, fontWeight: 600, background: mode === t.id ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.03)", color: mode === t.id ? "#F59E0B" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", borderRight: t.id === "company" ? "1px solid rgba(255,255,255,0.06)" : "none" }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }}>AI-FIRST VISION</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", margin: "0 8px" }}>—</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(139,92,246,0.5)" }}>What has to happen</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 12 : 20, marginBottom: 10 }}>
          <div style={{ ...GLASS, padding: mobile ? "20px 16px" : "24px 24px", display: "flex", alignItems: "center", gap: 16, textAlign: "left" }}>
            <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 12, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><ClockIcon size={24} color="#8B5CF6" /></div>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ color: "#8B5CF6", fontWeight: 800, fontSize: mobile ? 16 : 20, letterSpacing: "0.04em" }}>Next 12 Months</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "Georgia,serif", lineHeight: 1.4, marginTop: 2 }}>{mode === "personal" ? "The outcomes you need to achieve" : "The outcomes your company needs to achieve"}</div></div>
          </div>
          <div style={{ position: "relative" }}>
            {!mobile && <span style={{ position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.15)", fontSize: 16 }}>→</span>}
            <div style={{ ...GLASS, padding: mobile ? "20px 16px" : "24px 24px", display: "flex", alignItems: "center", gap: 16, textAlign: "left", height: "100%" }}>
              <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 12, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><SWOTTargetIcon size={24} color="#F59E0B" /></div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ color: "#F59E0B", fontWeight: 800, fontSize: mobile ? 16 : 20, letterSpacing: "0.04em" }}>Next 12 Weeks</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "Georgia,serif", lineHeight: 1.4, marginTop: 2 }}>Which of those will AI help you accelerate?</div></div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", margin: "6px 0 10px", color: "rgba(255,255,255,0.1)", fontSize: 18 }}>↓</div>
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }}>AI-FIRST SWOT SNAPSHOT</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", margin: "0 8px" }}>—</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(245,158,11,0.5)" }}>What AI makes possible</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 10 : 14, marginBottom: 40 }}>
          {QUADRANTS.map(q => { const Icon = SWOT_ICONS[q.id]; return (
            <div key={q.id} style={{ ...GLASS, padding: mobile ? "18px 16px" : "22px 22px", borderColor: q.border, display: "flex", alignItems: "flex-start", gap: 14, textAlign: "left" }}>
              <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 10, background: q.bg, border: `1px solid ${q.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={22} color={q.color} /></div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ color: q.color, fontWeight: 800, fontSize: 12, letterSpacing: "0.06em", lineHeight: 1.3 }}>{q.label}</div><div style={{ color: q.color, fontWeight: 700, fontSize: 11, opacity: 0.7, marginTop: 1 }}>{q.sublabel}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "Georgia,serif", lineHeight: 1.4, marginTop: 6 }}>{q.prompt}</div></div>
            </div>
          ); })}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder={mode === "personal" ? "Your Name" : "Company Name"}
            style={{ padding: "12px 16px", borderRadius: 10, fontSize: 17, fontFamily: "Georgia,serif", fontWeight: 700, outline: "none", width: mobile ? "100%" : 280, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
          <button onClick={() => onStart(company, mode)} style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000", border: "none", padding: "12px 40px", borderRadius: 10, fontWeight: 700, fontSize: 17, cursor: "pointer", boxShadow: "0 0 40px rgba(245,158,11,0.25),inset 0 1px 0 rgba(255,255,255,0.2)", whiteSpace: "nowrap", width: mobile ? "100%" : "auto" }}>Begin →</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 14 }}><span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{today}</span></div>
        <Footer />
      </div>
    </div>
  );
}

/* SWOT Vision */
function SWOTVision({ companyName, isPersonal, outcomes, setOutcomes, onBack, onNext }) {
  const mobile = useIsMobile();
  const you = isPersonal ? "you" : "your company";
  return (
    <div style={{ minHeight: "100vh", padding: mobile ? 20 : 40, background: BG, position: "relative", overflow: "hidden" }}>
      <AmbientGlow color="#F59E0B" top="15%" left="30%" /><AmbientGlow color="#8B5CF6" top="70%" left="70%" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
        <TopBrand />
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", textAlign: "center", marginBottom: 16 }}>AI-FIRST VISION & SWOT SNAPSHOT{companyName ? " — " + companyName.toUpperCase() : ""}</div>
        <h2 style={{ fontFamily: "Georgia,serif", color: "#fff", fontSize: mobile ? 30 : 40, fontWeight: 700, textAlign: "center", margin: "0 0 6px" }}>{isPersonal ? "Your Outcomes" : "Company Outcomes"}</h2>
        <p style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 40, fontSize: 16 }}>What does winning look like for {you}?</p>
        <div style={{ ...GLASS, padding: mobile ? 20 : 28, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ClockIcon size={22} color="#8B5CF6" /></div>
            <div><div style={{ fontFamily: "Georgia,serif", fontWeight: 700, color: "#fff", fontSize: mobile ? 18 : 20 }}>Next 12 Months</div><div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>What outcomes {isPersonal ? "do you" : "does your company"} need to achieve in the next 12 months?</div></div>
          </div>
          <EntryList items={outcomes.twelveMonths} onUpdate={v => setOutcomes({ ...outcomes, twelveMonths: v })} glowColor="#8B5CF6" placeholder="12-month outcome..." sectionKey="twelveMonths" />
        </div>
        <div style={{ ...GLASS, padding: mobile ? 20 : 28, marginBottom: 8, borderColor: "rgba(245,158,11,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><SWOTTargetIcon size={22} color="#F59E0B" /></div>
            <div><div style={{ fontFamily: "Georgia,serif", fontWeight: 700, color: "#fff", fontSize: mobile ? 18 : 20 }}>Next 12 Weeks</div><div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>Which of those will AI help you accelerate this quarter?</div></div>
          </div>
          <EntryList items={outcomes.twelveWeeks} onUpdate={v => setOutcomes({ ...outcomes, twelveWeeks: v })} glowColor="#F59E0B" placeholder="12-week outcome..." sectionKey="twelveWeeks" />
        </div>
        <NavButtons onBack={onBack} onNext={onNext} nextLabel="SWOT Snapshot →" mobile={mobile} />
        <Footer />
      </div>
    </div>
  );
}

/* SWOT Screen */
function SWOTSwot({ companyName, swot, setSwot, onBack, onNext }) {
  const mobile = useIsMobile();
  return (
    <div style={{ minHeight: "100vh", padding: mobile ? 20 : 40, background: BG, position: "relative", overflow: "hidden" }}>
      <AmbientGlow color="#22C55E" top="10%" left="25%" /><AmbientGlow color="#EF4444" top="70%" left="75%" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>
        <TopBrand />
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", textAlign: "center", marginBottom: 16 }}>AI-FIRST VISION & SWOT SNAPSHOT{companyName ? " — " + companyName.toUpperCase() : ""}</div>
        <h2 style={{ fontFamily: "Georgia,serif", color: "#fff", fontSize: mobile ? 30 : 40, fontWeight: 700, textAlign: "center", margin: "0 0 6px" }}>AI-First SWOT Snapshot</h2>
        <p style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 36, fontSize: 16 }}>Where can AI accelerate your path forward?</p>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          {QUADRANTS.map(q => { const Icon = SWOT_ICONS[q.id]; return (
            <div key={q.id} style={{ ...GLASS, padding: mobile ? 20 : 24, borderColor: q.border }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, background: q.bg, border: `1px solid ${q.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={20} color={q.color} /></div>
                <div><div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: q.color, lineHeight: 1.3 }}>{q.label}</div><div style={{ fontSize: 11, fontWeight: 700, color: q.color, opacity: 0.6 }}>{q.sublabel}</div></div>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12, fontFamily: "Georgia,serif", lineHeight: 1.5 }}>{q.prompt}</p>
              <EntryList items={swot[q.id]} onUpdate={a => setSwot({ ...swot, [q.id]: a })} glowColor={q.color} placeholder={q.placeholder} sectionKey={q.id} multiline />
            </div>
          ); })}
        </div>
        <NavButtons onBack={onBack} onNext={onNext} nextLabel="Insights & Actions →" mobile={mobile} />
        <Footer />
      </div>
    </div>
  );
}

/* SWOT Insights */
function SWOTInsights({ companyName, outcomes, swot, insights, setInsights, onBack, onReset }) {
  const mobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const filled = (a) => a.filter(s => s.trim());
  const buildContext = () => { const parts = []; const m = filled(outcomes.twelveMonths); if (m.length) parts.push("12-Month Outcomes: " + m.join("; ")); const w = filled(outcomes.twelveWeeks); if (w.length) parts.push("12-Week Outcomes: " + w.join("; ")); QUADRANTS.forEach(q => { const f = filled(swot[q.id]); if (f.length) parts.push(q.label + ": " + f.join("; ")); }); return parts.join("\n"); };
  const getSummary = () => { const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }); const L = []; L.push("AI-FIRST VISION & SWOT SNAPSHOT"); if (companyName) L.push(companyName); L.push(date); L.push("-------------------------------------------"); L.push(""); L.push("COMPANY OUTCOMES"); L.push(""); L.push("Next 12 Months:"); const m12 = filled(outcomes.twelveMonths); if (m12.length) m12.forEach((o, i) => L.push("  " + (i+1) + ". " + o)); else L.push("  (not entered)"); L.push(""); L.push("Next 12 Weeks:"); const w12 = filled(outcomes.twelveWeeks); if (w12.length) w12.forEach((o, i) => L.push("  " + (i+1) + ". " + o)); else L.push("  (not entered)"); L.push(""); L.push("-------------------------------------------"); L.push(""); L.push("AI-FIRST SWOT SNAPSHOT"); L.push(""); QUADRANTS.forEach(q => { L.push(q.label + " " + q.sublabel + ":"); const items = filled(swot[q.id]); if (items.length) items.forEach((s, i) => L.push("  " + (i+1) + ". " + s)); else L.push("  (not entered)"); L.push(""); }); L.push("-------------------------------------------"); L.push(""); L.push("BIGGEST INSIGHTS / ACTIONS TO TAKE"); L.push(""); L.push(insights || "(not entered)"); L.push(""); L.push("-------------------------------------------"); L.push("Office of the CEO™ | officeoftheceo.ai"); return L.join("\n"); };
  const handleCopy = () => { try { const ta = document.createElement("textarea"); ta.value = getSummary(); ta.style.position = "fixed"; ta.style.left = "-9999px"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch(e) { setShowExport(true); } };
  const handleEmail = () => { const s = "AI-First Vision & SWOT Snapshot" + (companyName ? " - " + companyName : ""); const a = document.createElement("a"); a.href = "mailto:?subject=" + encodeURIComponent(s) + "&body=" + encodeURIComponent(getSummary()); a.click(); };
  return (
    <div style={{ minHeight: "100vh", padding: mobile ? 20 : 40, background: BG, position: "relative", overflow: "hidden" }}>
      <AmbientGlow color="#F59E0B" top="15%" left="30%" /><AmbientGlow color="#22C55E" top="65%" left="70%" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>
        <TopBrand />
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", textAlign: "center", marginBottom: 16 }}>AI-FIRST VISION & SWOT SNAPSHOT{companyName ? " — " + companyName.toUpperCase() : ""}</div>
        <h2 style={{ fontFamily: "Georgia,serif", color: "#fff", fontSize: mobile ? 30 : 40, fontWeight: 700, textAlign: "center", margin: "0 0 6px" }}>Biggest Insights / Actions to Take</h2>
        <p style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 36, fontSize: 16 }}>What just became clear? What will you do about it?</p>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ ...GLASS, padding: 20 }}><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#8B5CF6", marginBottom: 8 }}>NEXT 12-MONTH OUTCOMES</div>{filled(outcomes.twelveMonths).length ? filled(outcomes.twelveMonths).map((o, i) => <p key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "Georgia,serif", lineHeight: 1.6, margin: "0 0 4px" }}>{i+1}. {o}</p>) : <p style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", fontFamily: "Georgia,serif", margin: 0 }}>—</p>}</div>
          <div style={{ ...GLASS, padding: 20 }}><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#F59E0B", marginBottom: 8 }}>NEXT 12-WEEK OUTCOMES</div>{filled(outcomes.twelveWeeks).length ? filled(outcomes.twelveWeeks).map((o, i) => <p key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "Georgia,serif", lineHeight: 1.6, margin: "0 0 4px" }}>{i+1}. {o}</p>) : <p style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", fontFamily: "Georgia,serif", margin: 0 }}>—</p>}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {QUADRANTS.map(q => { const Icon = SWOT_ICONS[q.id]; const items = filled(swot[q.id]); return (
            <div key={q.id} style={{ ...GLASS, padding: 16, borderColor: q.border }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><Icon size={16} color={q.color} /><div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", color: q.color, lineHeight: 1.3 }}>{q.label}</div></div>{items.length ? items.map((s, i) => <p key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "Georgia,serif", lineHeight: 1.5, margin: "0 0 2px" }}>{i+1}. {s}</p>) : <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "Georgia,serif", margin: 0 }}>—</p>}</div>
          ); })}
        </div>
        <div style={{ ...GLASS, padding: mobile ? 20 : 28, marginBottom: 24, borderColor: "rgba(245,158,11,0.15)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "#F59E0B", marginBottom: 14 }}>BIGGEST INSIGHTS / ACTIONS TO TAKE</div>
          <GlowTextarea value={insights} onChange={e => setInsights(e.target.value)} placeholder="What patterns emerged? What's the most important thing to act on?" glowColor="#F59E0B" minHeight={160} sectionKey="insights" allContext={buildContext()} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
          <button onClick={handleEmail} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#000", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 0 20px rgba(245,158,11,0.2)", flex: mobile ? 1 : "none" }}><MailIcon size={18} color="#000" /> Email Results</button>
          <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 600, fontSize: 15, cursor: "pointer", flex: mobile ? 1 : "none" }}><CopyIcon size={18} color="rgba(255,255,255,0.6)" /> {copied ? "Copied!" : "Copy Results"}</button>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onBack} style={{ padding: "12px 32px", borderRadius: 12, fontWeight: 600, fontSize: 15, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", flex: mobile ? 1 : "none" }}>← Back</button>
          <button onClick={onReset} style={{ padding: "12px 32px", borderRadius: 12, background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 15, cursor: "pointer", flex: mobile ? 1 : "none" }}>Start Over</button>
        </div>
        {showExport && <div style={{ ...GLASS, padding: 20, marginTop: 24 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Select all and copy:</span><button onClick={() => setShowExport(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16 }}>×</button></div><textarea readOnly value={getSummary()} onClick={e => e.target.select()} style={{ width: "100%", height: 300, padding: 14, borderRadius: 10, fontSize: 12, fontFamily: "monospace", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", resize: "none", outline: "none" }} /></div>}
        <Footer />
      </div>
    </div>
  );
}

/* SWOT App */
function SwotApp() {
  const [screen, setScreen] = useState("welcome");
  const [companyName, setCompanyName] = useState("");
  const [isPersonal, setIsPersonal] = useState(false);
  const [outcomes, setOutcomes] = useState({ twelveMonths: ["","",""], twelveWeeks: ["","",""] });
  const [swot, setSwot] = useState({ ...DEFAULT_SWOT });
  const [insights, setInsights] = useState("");
  const reset = () => { setScreen("welcome"); setCompanyName(""); setIsPersonal(false); setOutcomes({ twelveMonths: ["","",""], twelveWeeks: ["","",""] }); setSwot({ ...DEFAULT_SWOT }); setInsights(""); };
  if (screen === "welcome") return <SWOTWelcome onStart={(co, mode) => { setCompanyName(co); setIsPersonal(mode === "personal"); setScreen("vision"); }} />;
  if (screen === "vision") return <SWOTVision companyName={companyName} isPersonal={isPersonal} outcomes={outcomes} setOutcomes={setOutcomes} onBack={() => setScreen("welcome")} onNext={() => setScreen("swot")} />;
  if (screen === "swot") return <SWOTSwot companyName={companyName} swot={swot} setSwot={setSwot} onBack={() => setScreen("vision")} onNext={() => setScreen("insights")} />;
  if (screen === "insights") return <SWOTInsights companyName={companyName} outcomes={outcomes} swot={swot} insights={insights} setInsights={setInsights} onBack={() => setScreen("swot")} onReset={reset} />;
  return null;
}

/* ─── Standalone Export ─── */
export default function App() {
  return <SwotApp />;
}
