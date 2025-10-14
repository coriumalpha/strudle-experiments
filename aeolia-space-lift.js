// ============================================================
// ✨ SESSION: Aeolia Space Lift — v2.8 (epic + sweet + space)
// Stable (no choose), clearer mix, controlled harmonic tension
// ============================================================


// --------------------
// 🎛 GLOBAL LIVE CONTROL
// --------------------
let MASTER  = 0.90;  // overall trim

// Macros (0..1)
let CUTOFF  = 0.32;  // 0 = very dark, 1 = open (LPF)
let WET     = 0.62;  // 0 = dry, 1 = very wet
let DRIVE   = 0.5;  // 0 = clean, 1 = saturated
let ENERGY  = 0.16;  // 0 = intro; 0.4 = lift; 0.75+ = climax
let TENSION = 0.85;  // 0 = off, 1 = strong (opens Dorian/Lydian spark)

// Layer switches
let S_BASE   = 1;
let S_LIFT   = 1;
let S_SHIM   = 0;
let S_PLEG1  = 1;   // Prayers
let S_ARP    = 1;
let S_MELO_A = 0;
let S_MELO_B = 1;
let S_HARM   = 0;
let S_SPACE  = 1;
let S_GHOST  = 1;
let S_SANCT  = 1;
let S_TENS   = 1;   // tension layers (Dorian/Lydian)

// Helper
const lerp = (a,b,t) => a + (b-a)*t;

// Tempo
setcpm(92/4);


// ============================================================
// 🌊 FORM ENVELOPES — long-form scenes & motion
// ============================================================
// Global “scene” curve (bars): intro(8) → lift(16) → tension(16) → climax(16) → out(8)
const ENV_SCENE = "<0.25 0.6 0.8 1.0 0.4>".segment([8,16,16,16,8]);

// Layer families
const ENV_BASE  = "<0.40 0.60 0.45 0.55 0.35>".segment([8,16,16,16,8]);
const ENV_ARP   = "<0.00 0.55 1.00 0.90 0.00>".segment([8,16,16,16,8]);
const ENV_MELO  = "<0.00 0.40 0.80 1.00 0.30>".segment([8,16,16,16,8]);
const ENV_PLEGS = "<0.30 0.65 0.95 1.00 0.40>".segment([8,16,16,16,8]);
const ENV_SANCT = "<0.00 0.75 0.50 0.80 0.00>".segment([8,8,16,16,8]);

// Pump (side-chain feel): 1.0 (no duck) → 0.75 (duck) per 1/2 bar
const ENV_PUMP = sine.range(0.78, 1.00).slow(2);

// Tension window (only in the middle scene block)
const ENV_TENS = "<0 0.6 1.0 0.4 0>".segment([8,16,16,16,8]).gain(TENSION);


// ============================================================
// 🎼 MUSICAL MATERIAL — originals
// ============================================================
const PROG_LIFT  = "<[d4 f4 a5 d5] [bb3 d4 f5 bb4] [f3 a3 c5 f5] [c4 d4 g5 c6]>".sub(24);
const PROG_SHIM  = "<[d5 f5 a6 d6] [bb4 d5 f6 bb5] [f4 a4 c6 f6] [c5 d5 g6 c6]>".sub(12);
const PROG_SPACE = "<[d4 f4 a4 d5] [bb3 d4 g4 bb4] [f3 a3 c4 f4] [c4 e4 g4 c5]>".sub(24);

const ARP_FAST   = "<[d5 f5 a5 f5]*8 [bb4 d5 f5 d5]*8 [f5 a5 c6 a5]*8 [c5 d5 g5 d5]*8>";

const MELO_A =
  "<d5 f5 a5 f5  a5 f5 d5 f5   bb4 d5 f5 d5  f5 d5 bb4 d5  f5 a5 c6 a5  c6 a5 f5 a5   c5 d5 g5 d5  g5 d5 c5 d5>";

const MELO_B =
  "<a5 c6 d6 c6  a5 f5 d5 f5   g5 bb5 c6 bb5  g5 d5 bb4 d5  f5 a5 c6 a5  a5 f5 d5 f5   g5 bb5 d6 bb5  g5 d5 c5 d5>";

const MELO_HARM =
  "<f5 a5 c6 a5  c6 a5 f5 a5   d5 f5 a5 f5   a5 f5 d5 f5  a5 c6 e6 c6  e6 c6 a5 c6   d5 f5 b5 f5   b5 f5 d5 f5>";


// ============================================================
// 🌈 SWEET / LUMINOUS VARIANTS (consonant, gentle add2/6)
// ============================================================

// Pads / lifts — Dm → Bb → F → C(add2/6)
const PROG_LIFT_SWEET = `
<
  <[d4 f4 a5 d5]   [d4 f4 a5 c6]>*2
  <[bb3 d4 f5 bb4] [bb3 d4 f5 c6]>*2
  <[f3 a3 c5 f5]   [f3 a3 c5 g5]>*2
  <[c4 d4 g5 c6]   [c4 d4 g5 a5]>*2
>
`.sub(24);

// High shimmer (choir-like), suspended colors
const PROG_SHIM_SWEET = `
<
  <[d5 f5 a6 d6]   [d5 f5 a6 c6]>*2
  <[bb4 d5 f6 bb5] [bb4 d5 f6 c6]>*2
  <[f4 a4 c6 f6]   [f4 a4 c6 g6]>*2
  <[c5 d5 g6 c6]   [c5 d5 g6 a6]>*2
>
`.sub(12);

// Space glass pad with slow 9/6 colors
const PROG_SPACE_ALT = `
<
  <[d4 f4 a4 d5]   [d4 f4 a4 c5]>*2
  <[bb3 d4 g4 bb4] [bb3 d4 g4 c5]>*2
  <[f3 a3 c4 f4]   [f3 a3 c4 g4]>*2
  <[c4 d4 g4 c5]   [c4 d4 g4 a4]>*2
>
`.sub(24);

// ARP — softer, more angelic motion
const ARP_SOFT = `
<
  <[d5 f5 a5 f5]   [d5 f5 a5 c6]>*4
  <[bb4 d5 f5 d5]  [bb4 d5 f5 c6]>*4
  <[f5 a5 c6 a5]   [f5 a5 c6 g5]>*4
  <[c5 d5 g5 d5]   [c5 d5 g5 a5]>*4
>
`;

// Melodies — sweeter A/B and consonant harmony
const MELO_A_SWEET = `
< a5 c6 d6 c6   a5 f5 d5 f5
  g5 a5 bb5 a5  g5 d5 c5 d5
  f5 a5 c6 a5   a5 f5 d5 f5
  g5 a5 bb5 a5  g5 d5 c5 d5 >
`;

const MELO_B_SWEET = `
< a5 c6 d6 c6   a5 c6 a5 f5
  g5 a5 bb5 a5  g5 bb5 g5 d5
  f5 a5 c6 a5   g5 a5 g5 f5
  g5 a5 bb5 a5  g5 a5 g5 d5 >
`;

const MELO_HARM_SWEET = `
< f5 a5 c6 a5   c6 a5 f5 a5
  d5 f5 a5 f5   a5 f5 d5 f5
  g5 a5 c6 a5   a5 g5 f5 g5
  c5 d5 g5 d5   g5 d5 c5 d5 >
`;


// ============================================================
// 🕊️ PRAYERS — sweet, luminous, consonant
// ============================================================
const PLEG_SERENA = `
<[a6 d7]*8
  [bb6 d7]*4 [c7 d7]*4
  [a6 c7]*8
  [g6 a6]*4 [c7 d7]*4>
`.sub(12);

const PLEG_AUREA = `
<[f6 a6]*4 [a6 d7]*4
  [bb6 d7]*4 [bb6 c7]*4
  [g6 a6]*4 [a6 c7]*4
  [g6 a6]*4 [c7 d7]*4>
`.sub(12);

const PLEG_LUMEN = `
<[d6 f6 a6]*4 [a6 d7]*4
  [bb6 d7 f7]*4 [bb6 c7 d7]*4
  [f6 a6 c7]*4 [g6 a6 c7]*4
  [c6 d7 g7]*4 [a6 c7 d7]*4>
`.sub(12);

const PLEG_CAELUM = `
<[a6 c7]*4 [a6 d7]*4
  [bb6 c7]*4 [bb6 d7]*4
  [g6 a6]*4 [a6 c7]*4
  [g6 a6]*4 [c7 d7]*4>
`.sub(12);


// ============================================================
// 🧪 DERIVED & SOURCES — arranged alternations (no choose)
// ============================================================
// Parse once
const NP_PROG_LIFT        = note(PROG_LIFT);
const NP_PROG_LIFT_SWEET  = note(PROG_LIFT_SWEET);
const NP_PROG_SHIM        = note(PROG_SHIM);
const NP_PROG_SHIM_SWEET  = note(PROG_SHIM_SWEET);
const NP_PROG_SPACE       = note(PROG_SPACE);
const NP_PROG_SPACE_ALT   = note(PROG_SPACE_ALT);

const NP_MELO_A           = note(MELO_A);
const NP_MELO_A_SWEET     = note(MELO_A_SWEET);
const NP_MELO_B           = note(MELO_B);
const NP_MELO_B_SWEET     = note(MELO_B_SWEET);
const NP_MELO_HARM_SWEET  = note(MELO_HARM_SWEET);

// Main alternations by full phrases
const LIFT_SRC  = arrange([4, NP_PROG_LIFT_SWEET], [4, NP_PROG_LIFT]); // start sweet → then orig
const SHIM_SRC  = arrange([4, NP_PROG_SHIM_SWEET], [4, NP_PROG_SHIM]);
const SPACE_PAD = arrange([4, NP_PROG_SPACE], [4, NP_PROG_SPACE_ALT]).slow(8);

// ARP: machine ↔ soft angelic
const ARP_SRC   = arrange([8, note(ARP_SOFT)], [8, note(ARP_FAST)]);

// Melodies: enable/alternate to taste
const MELO_A_SRC = arrange([8, NP_MELO_A_SWEET], [8, NP_MELO_A]);
const MELO_B_SRC = arrange([8, NP_MELO_B_SWEET], [8, NP_MELO_B]);

// Prayers: rotate sweet set, full phrases
const PLEG_SRC = arrange(
  [4, note(PLEG_SERENA)],
  [4, note(PLEG_AUREA)],
  [4, note(PLEG_LUMEN)],
  [4, note(PLEG_CAELUM)]
);

// Ghost echo (A ↔ B), can swap to A vs A_SWEET if you prefer
const GHOST_SRC = arrange([8, NP_MELO_A_SWEET], [8, NP_MELO_B]).slow(4);


// ============================================================
// ⚡ HARMONIC TENSION LAYERS — controlled, scene-based
// ============================================================
// Dorian Spark (E natural only supportive of Dm)
const DORIAN_SPARK = `
<[e6 a6]*8   [e6 d6]*8   [e6 a6]*8   [d6 e6]*8>
`.sub(12);

// Lydian Gleam (B natural only supportive of F)
const LYDIAN_GLEAM = `
<[a6 b6]*8   [a6 b6]*8   [b6 c7]*8   [a6 b6]*8>
`.sub(12);

// Parse
const NP_DORIAN_SPARK = note(DORIAN_SPARK);   // sits above, soft add9 color on Dm only
const NP_LYDIAN_GLEAM = note(LYDIAN_GLEAM);   // #4 color over F only

// Gate their level by ENV_TENS and S_TENS so they “bloom & fade”
const TENS_GAIN = ENV_TENS.gain(S_TENS);


// ============================================================
// 🔊 LAYERS — bottom → top (first method stays on the $: line)
// ============================================================

// 🌑 BASE — warm ground (cleaner low end, less verb)
$: note("d4!16 f4!16 a3!16 d4!16".sub(24)).slow(4).s("gm_pad_warm")
  .attack(0.12).release(0.8).sustain(0.9)
  .shape(lerp(0.02, 0.10, DRIVE))
  .hpf(60).lpf(lerp(140, 300, CUTOFF))
  .gain(MASTER * ENV_PUMP * lerp(0.10, 0.18, ENERGY) * S_BASE * ENV_BASE)
  .room(0.75).mix(lerp(0.30, 0.45, WET))

// 🌊 MAIN LIFT — pad progression (sweet ↔ orig)
$: LIFT_SRC.s("gm_pad_warm")
  .attack(0.02).release(0.95).sustain(0.92)
  .shape(lerp(0.04, 0.16, DRIVE))
  .hpf(120).lpf(lerp(260, 460, CUTOFF))
  .gain(MASTER * ENV_PUMP * lerp(0.30, 0.46, CUTOFF) * S_LIFT * ENV_SCENE)
  .room(0.88).mix(lerp(0.48, 0.64, WET))

// ✨ SHIMMER — choir highs (sweet ↔ orig), keep the air, no mud
$: SHIM_SRC.s("gm_synth_choir")
  .attack(0.05).release(1.8).sustain(0.97)
  .detune(0.01).vibrato(0.08)
  .hpf(950).lpf(lerp(1400, 1750, CUTOFF))
  .gain(MASTER * lerp(0.10, 0.18, ENERGY) * S_SHIM * ENV_SCENE)
  .room(0.90).mix(lerp(0.50, 0.68, WET))
  .pan(sine.range(0.24,0.36).slow(16))

// 🌌 SPACE HALO — subtle glass pad (space ↔ alt)
$: SPACE_PAD.s("gm_pad_glass")
  .attack(0.35).release(2.8).sustain(1)
  .hpf(600).lpf(lerp(1700, 2400, CUTOFF))
  .gain(MASTER * lerp(0.03, 0.08, ENERGY) * S_SPACE * ENV_SCENE)
  .room(1).mix(lerp(0.58, 0.72, WET))
  .pan(sine.range(0.42,0.58).slow(20))

// 🕊️ PRAYERS — sweet rotation (full phrases)
$: PLEG_SRC.s("gm_fx_brightness")
  .attack(0.02).release(2.6).sustain(0.98)
  .detune(0.01).vibrato(0.18)
  .hpf(1150).lpf(lerp(2100, 2500, CUTOFF))
  .room(0.96).mix(lerp(0.56, 0.75, WET))
  .gain(MASTER * 0.12 * S_PLEG1 * ENV_PLEGS)
  .pan(sine.range(0.44, 0.56).slow(18))

// ⚡ DORIAN SPARK — tension window (only blooms in middle scenes)
$: NP_DORIAN_SPARK.s("gm_synth_choir")
  .attack(0.03).release(1.6).sustain(0.95)
  .vibrato(0.12)
  .hpf(1400).lpf(lerp(2000, 2350, CUTOFF))
  .gain(MASTER * 0.06 * TENS_GAIN)
  .room(0.92).mix(lerp(0.50, 0.66, WET))
  .pan(sine.range(0.47,0.53).slow(14))

// ⚡ LYDIAN GLEAM — shines above F chord area
$: NP_LYDIAN_GLEAM.s("gm_synth_choir")
  .attack(0.03).release(1.6).sustain(0.95)
  .vibrato(0.12)
  .hpf(1500).lpf(lerp(2100, 2400, CUTOFF))
  .gain(MASTER * 0.05 * TENS_GAIN)
  .room(0.94).mix(lerp(0.50, 0.66, WET))
  .pan(sine.range(0.47,0.53).slow(18))

// ⏱️ FAST OSTINATO — machine ↔ soft angelic, with pump
$: ARP_SRC.s("pulse").slow(2)
  .attack(0).release(0.055).sustain(0.15)
  .hpf(1050).lpf(lerp(1350, 1650, CUTOFF))
  .gain("<0.52 0.50 0.42 0.50>").gain(MASTER * ENV_PUMP * lerp(0.18, 0.26, ENERGY) * S_ARP * ENV_ARP)
  .every(32, x => x.add("<0 12 0 0>"))
  .delay(0.0625)
  .pan(sine.range(0.46,0.54).slow(10))

// 🎯 LONG MELODY A — orig ↔ sweet (off by default via S_MELO_A)
$: MELO_A_SRC.s("pulse").slow(2)
  .attack(0).release(0.06).sustain(0.16)
  .hpf(900).lpf(lerp(1200, 1500, CUTOFF))
  .gain(MASTER * lerp(0.00, 0.22, ENERGY) * S_MELO_A * ENV_MELO)
  .pan(sine.range(0.46,0.54).slow(8))
  .add("<0 0 12 0>")

// 🔁 LONG MELODY B — sweet ↔ orig (on in your switches)
$: MELO_B_SRC.s("pulse").slow(2)
  .attack(0).release(0.06).sustain(0.16)
  .hpf(900).lpf(lerp(1200, 1550, CUTOFF))
  .gain(MASTER * lerp(0.16, 0.26, ENERGY) * S_MELO_B * ENV_MELO)
  .pan(sine.range(0.54,0.46).slow(10))

// 👻 GHOST DELAY — A_SWEET ↔ B echo pad (glassier tail)
$: GHOST_SRC.s("gm_pad_warm")
  .attack(0.04).release(0.9).sustain(0.85)
  .detune(0.004).vibrato(0.06)
  .hpf(700).lpf(lerp(1500, 2000, CUTOFF))
  .gain(MASTER * lerp(0.00, 0.12, ENERGY) * S_GHOST * ENV_MELO)
  .delay(0.125)
  .room(0.84).mix(lerp(0.48, 0.62, WET))
  .pan(sine.range(0.48,0.52).slow(14))

// 🤝 COUNTER-MELODY — sweet harmony (enable with S_HARM)
$: note(MELO_HARM_SWEET).s("gm_pad_warm").slow(2)
  .attack(0.02).release(0.55).sustain(0.9)
  .detune(0.004).vibrato(0.08)
  .hpf(600).lpf(lerp(1700, 2050, CUTOFF))
  .gain(MASTER * lerp(0.10, 0.18, ENERGY) * S_HARM * ENV_MELO)
  .room(0.78).mix(lerp(0.48, 0.60, WET))
  .delay(0.125)
  .pan(sine.range(0.48,0.52).slow(12))

// 🎻 SANCTUS — luminous violins
const SANCTUS_LINE = "<a6 c7 d7 c7  bb6 d7 f7 d7  c7 e7 f7 e7  d7 g7 a7 g7>".sub(12);

$: note(SANCTUS_LINE).slow(4).s("gm_violin")
  .attack(0.28).release(2.6).sustain(0.98)
  .detune(0.002).vibrato(0.12)
  .hpf(900).lpf(lerp(1800, 2600, CUTOFF))
  .gain(sine.range(0.06,0.16).slow(12))
  .gain(lerp(0.10, 0.00, CUTOFF))
  .gain(MASTER * ENV_SANCT * S_SANCT)
  .room(0.97).mix(lerp(0.58, 0.74, WET))
  .pan(sine.range(0.47,0.53).slow(16))

// optional glass halo
$: note(SANCTUS_LINE).slow(8).s("gm_pad_glass")
  .attack(0.5).release(3).sustain(1)
  .hpf(700).lpf(lerp(1900,2600,CUTOFF))
  .gain(MASTER * 0.04 * ENV_SANCT * S_SANCT)
  .room(1).mix(0.74)
  .pan(sine.range(0.44,0.56).slow(22))

// 💥 IMPACTS & TRANSITIONS
$: sound("cr, bd").bank("RolandTR909")
  .room(0.6).mix(lerp(0.15, 0.30, WET))
  .gain(MASTER * ENV_SCENE * lerp(0.004, 0.008, ENERGY)).gain(.2)

$: sound("[- <[mt mt] [mt mt mt mt]> [mt mt - mt] [mt - <mt [mt mt]> [- - - <bd [bd, hh]>]]]").bank("RolandTR909")

$: sound("noise").s("gm_fx_brightness").slow(1)
  .attack(0.4).release(0.9).sustain(0)
  .hpf(1000).lpf(lerp(2000, 2600, CUTOFF))
  .gain(MASTER * lerp(0.00, 0.03, ENERGY))
  .every(16, x => x)
  .pan(sine.range(0.45,0.55).slow(12))
