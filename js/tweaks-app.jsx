/* global React, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroLayout": "cinematic",
  "accent": "#b5532b",
  "ctaPulse": true,
  "grain": true
}/*EDITMODE-END*/;

const HERO_OPTIONS = [
  { value: "cinematic", label: "Cinematic" },
  { value: "editorial", label: "Editorial" },
  { value: "frame", label: "Card" }
];

function applyTweaks(t) {
  const root = document.documentElement;
  root.dataset.hero = t.heroLayout;
  root.style.setProperty("--accent", t.accent);
  root.dataset.pulse = t.ctaPulse ? "on" : "off";
  root.dataset.grain = t.grain ? "on" : "off";
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Hero" />
      <TweakRadio
        label="Layout"
        value={t.heroLayout}
        options={HERO_OPTIONS}
        onChange={(v) => setTweak("heroLayout", v)}
      />
      <TweakSection label="Stil" />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={["#b5532b", "#0e0e0e", "#7a6a55", "#2a6f4f"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakToggle
        label="Puls buton WhatsApp"
        value={t.ctaPulse}
        onChange={(v) => setTweak("ctaPulse", v)}
      />
      <TweakToggle
        label="Textură fină (grain)"
        value={t.grain}
        onChange={(v) => setTweak("grain", v)}
      />
    </TweaksPanel>
  );
}

// Apply defaults immediately on load (before panel is opened)
applyTweaks(TWEAK_DEFAULTS);

const tweaksRoot = document.getElementById("tweaks-root");
if (tweaksRoot) {
  ReactDOM.createRoot(tweaksRoot).render(<TweaksApp />);
}
