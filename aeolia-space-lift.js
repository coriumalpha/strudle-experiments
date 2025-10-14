// ============================================================
// ✨ SESSION: Aeolia Space Lift — v2.9 (epic + sweet + space)
// Stable (no choose). HARD MUTE per-layer using final .gain()
// ============================================================


// --------------------
// 🎛 GLOBAL LIVE CONTROL
// --------------------
let MASTER  = 0.90;  // global trim

// Macros (0..1)
let CUTOFF  = 1.82;  // 0 = very dark, 1 = open (LPF)
let WET     = 0.92;  // 0 = dry, 1 = very wet
let DRIVE   = 0.58;  // 0 = clean, 1 = saturated
let ENERGY  = 0.86;  // 0 = intro; 0.4 = lift; 0.75+ = climax
let TENSION = 0;  // opens Dorian/Lydian spark

// Layer switches (set to 0 for silence per layer)
let S_BASE   = 1;
let S_LIFT   = 1;
let S_SHIM   = 1;
let S_PLEG1  = 0;
let S_ARP    = 1;
let S_MELO_A = 0;
let S_MELO_B = 0;
let S_HARM   = 1;
let S_SPACE  = 1;
let S_GHOST  = 1;
let S_SANCT  = 1;
let S_TENS   = 0;
let S_FX     = 1;   // impacts + whoosh

// Helper
const lerp = (a,b,t) => a + (b-a)*t;

// Tempo
setcpm(92/4);


// ============================================================
// 🌊 FORM ENVELOPES — scenes & motion
// ============================================================
const ENV_SCENE = "<0.25 0.6 0.8 1.0 0.4>".segment([8,16,16,16,8]); // intro → lift → tension → climax → out
const ENV_BASE  = "<0.40 0.60 0.45 0.55 0.35>".segment([8,16,16,16,8]);
const ENV_ARP   = "<0.00 0.55 1.00 0.90 0.00>".segment([8,16,16,16,8]);
const ENV_MELO  = "<0.00 0.40 0.80 1.00 0.30>".segment([8,16,16,16,8]);
const ENV_PLEGS = "<0.30 0.65 0.95 1.00 0.40>".segment([8,16,16,16,8]);
const ENV_SANCT = "<0.00 0.75 0.50 0.80 0.00>".segment([8,8,16,16,8]);

// Sidechain-like pump (duck) over half-bars
const ENV_PUMP = sine.range(0.78, 1.00).slow(2);

// Tension activation window
const ENV_TENS = "<0 0.6 1.0 0.4 0>".segment([8,16,16,16,8]).gain(TENSION);


// ============================================================
// 🎼 MATERIAL — originals
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
// 🌈 SWEET / LUMINOUS variants
// ============================================================
const PROG_LIFT_SWEET = `
<
  <[d4 f4 a5 d5]   [d4 f4 a5 c6]>*2
  <[bb3 d4 f5 bb4] [bb3 d4 f5 c6]>*2
  <[f3 a3 c5 f5]   [f3 a3 c5 g5]>*2
  <[c4 d4 g5 c6]   [c4 d4 g5 a5]>*2
>
`.sub(24);

const PROG_SHIM_SWEET = `
<
  <[d5 f5 a6 d6]   [d5 f5 a6 c6]>*2
  <[bb4 d5 f6 bb5] [bb4 d5 f6 c6]>*2
  <[f4 a4 c6 f6]   [f4 a4 c6 g6]>*2
  <[c5 d5 g6 c6]   [c5 d5 g6 a6]>*2
>
`.sub(12);

const PROG_SPACE_ALT = `
<
  <[d4 f4 a4 d5]   [d4 f4 a4 c5]>*2
  <[bb3 d4 g4 bb4] [bb3 d4 g4 c5]>*2
  <[f3 a3 c4 f4]   [f3 a3 c4 g4]>*2
  <[c4 d4 g4 c5]   [c4 d4 g4 a4]>*2
>
`.sub(24);

const ARP_SOFT = `
<
  <[d5 f5 a5 f5]   [d5 f5 a5 c6]>*4
  <[bb4 d5 f5 d5]  [bb4 d5 f5 c6]>*4
  <[f5 a5 c6 a5]   [f5 a5 c6 g5]>*4
  <[c5 d5 g5 d5]   [c5 d5 g5 a5]>*4
>
`;

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
// 🕊️ PRAYERS — sweet set
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

// Alternations (full phrases)
const LIFT_SRC  = arrange([4, NP_PROG_LIFT_SWEET], [4, NP_PROG_LIFT]);
const SHIM_SRC  = arrange([4, NP_PROG_SHIM_SWEET], [4, NP_PROG_SHIM]);
const SPACE_PAD = arrange([4, NP_PROG_SPACE], [4, NP_PROG_SPACE_ALT]).slow(8);
const ARP_SRC   = arrange([8, note(ARP_SOFT)], [8, note(ARP_FAST)]);
const MELO_A_SRC = arrange([8, NP_MELO_A_SWEET], [8, NP_MELO_A]);
const MELO_B_SRC = arrange([8, NP_MELO_B_SWEET], [8, NP_MELO_B]);

const PLEG_SRC = arrange(
  [4, note(PLEG_SERENA)],
  [4, note(PLEG_AUREA)],
  [4, note(PLEG_LUMEN)],
  [4, note(PLEG_CAELUM)]
);

// Ghost echo (A_SWEET ↔ B)
const GHOST_SRC = arrange([8, NP_MELO_A_SWEET], [8, NP_MELO_B]).slow(4);


// ============================================================
// ⚡ HARMONIC TENSION — Dorian / Lydian (scene-gated)
// ============================================================
const DORIAN_SPARK = "<[e6 a6]*8 [e6 d6]*8 [e6 a6]*8 [d6 e6]*8>".sub(12);
const LYDIAN_GLEAM = "<[a6 b6]*8 [a6 b6]*8 [b6 c7]*8 [a6 b6]*8>".sub(12);

const NP_DORIAN_SPARK = note(DORIAN_SPARK);
const NP_LYDIAN_GLEAM = note(LYDIAN_GLEAM);


// ============================================================
// 🔊 LAYERS — apply final HARD MUTE at the end of each chain
// ============================================================

// 🌑 BASE
$: note("d4!16 f4!16 a3!16 d4!16".sub(24)).slow(4).s("gm_pad_warm")
  .attack(0.12).release(0.8).sustain(0.9)
  .shape(lerp(0.02, 0.10, DRIVE))
  .hpf(60).lpf(lerp(140, 300, CUTOFF))
  .gain(ENV_PUMP * lerp(0.10, 0.18, ENERGY) * ENV_BASE)   // musical shaping
  .room(0.75).mix(lerp(0.30, 0.45, WET))
  .gain(MASTER * S_BASE)                                   // FINAL HARD MUTE

// 🌊 MAIN LIFT
$: LIFT_SRC.s("gm_pad_warm")
  .attack(0.02).release(0.95).sustain(0.92)
  .shape(lerp(0.04, 0.16, DRIVE))
  .hpf(120).lpf(lerp(260, 460, CUTOFF))
  .gain(ENV_PUMP * lerp(0.30, 0.46, CUTOFF) * ENV_SCENE)
  .room(0.88).mix(lerp(0.48, 0.64, WET))
  .gain(MASTER * S_LIFT)                                   // FINAL HARD MUTE

// ✨ SHIMMER
$: SHIM_SRC.s("gm_synth_choir")
  .attack(0.05).release(1.8).sustain(0.97)
  .detune(0.01).vibrato(0.08)
  .hpf(950).lpf(lerp(1400, 1750, CUTOFF))
  .gain(lerp(0.10, 0.18, ENERGY) * ENV_SCENE)
  .room(0.90).mix(lerp(0.50, 0.68, WET))
  .pan(sine.range(0.24,0.36).slow(16))
  .gain(MASTER * S_SHIM)                                   // FINAL HARD MUTE

// 🌌 SPACE HALO
$: SPACE_PAD.s("gm_pad_glass")
  .attack(0.35).release(2.8).sustain(1)
  .hpf(600).lpf(lerp(1700, 2400, CUTOFF))
  .gain(lerp(0.03, 0.08, ENERGY) * ENV_SCENE)
  .room(1).mix(lerp(0.58, 0.72, WET))
  .pan(sine.range(0.42,0.58).slow(20))
  .gain(MASTER * S_SPACE)                                  // FINAL HARD MUTE

// 🕊️ PRAYERS
$: PLEG_SRC.s("gm_fx_brightness")
  .attack(0.02).release(2.6).sustain(0.98)
  .detune(0.01).vibrato(0.18)
  .hpf(1150).lpf(lerp(2100, 2500, CUTOFF))
  .room(0.96).mix(lerp(0.56, 0.75, WET))
  .gain(0.12 * ENV_PLEGS)
  .pan(sine.range(0.44, 0.56).slow(18))
  .gain(MASTER * S_PLEG1)                                  // FINAL HARD MUTE

// ⚡ DORIAN SPARK (tension)
$: NP_DORIAN_SPARK.s("gm_synth_choir")
  .attack(0.03).release(1.6).sustain(0.95)
  .vibrato(0.12)
  .hpf(1400).lpf(lerp(2000, 2350, CUTOFF))
  .gain(0.06 * ENV_TENS)
  .room(0.92).mix(lerp(0.50, 0.66, WET))
  .pan(sine.range(0.47,0.53).slow(14))
  .gain(MASTER * S_TENS)                                   // FINAL HARD MUTE

// ⚡ LYDIAN GLEAM (tension)
$: NP_LYDIAN_GLEAM.s("gm_synth_choir")
  .attack(0.03).release(1.6).sustain(0.95)
  .vibrato(0.12)
  .hpf(1500).lpf(lerp(2100, 2400, CUTOFF))
  .gain(0.05 * ENV_TENS)
  .room(0.94).mix(lerp(0.50, 0.66, WET))
  .pan(sine.range(0.47,0.53).slow(18))
  .gain(MASTER * S_TENS)                                   // FINAL HARD MUTE

// ⏱️ FAST OSTINATO
$: ARP_SRC.s("pulse").slow(2)
  .attack(0).release(0.055).sustain(0.15)
  .hpf(1050).lpf(lerp(1350, 1650, CUTOFF))
  .gain("<0.52 0.50 0.42 0.50>" * ENV_PUMP * lerp(0.18, 0.26, ENERGY) * ENV_ARP)
  .every(32, x => x.add("<0 12 0 0>"))
  .delay(0.0625)
  .pan(sine.range(0.46,0.54).slow(10))
  .gain(MASTER * S_ARP)                                    // FINAL HARD MUTE

// 🎯 LONG MELODY A
$: MELO_A_SRC.s("pulse").slow(2)
  .attack(0).release(0.06).sustain(0.16)
  .hpf(900).lpf(lerp(1200, 1500, CUTOFF))
  .gain(lerp(0.00, 0.22, ENERGY) * ENV_MELO)
  .pan(sine.range(0.46,0.54).slow(8))
  .add("<0 0 12 0>")
  .gain(MASTER * S_MELO_A)                                  // FINAL HARD MUTE

// 🔁 LONG MELODY B
$: MELO_B_SRC.s("pulse").slow(2)
  .attack(0).release(0.06).sustain(0.16)
  .hpf(900).lpf(lerp(1200, 1550, CUTOFF))
  .gain(lerp(0.16, 0.26, ENERGY) * ENV_MELO)
  .pan(sine.range(0.54,0.46).slow(10))
  .gain(MASTER * S_MELO_B)                                  // FINAL HARD MUTE

// 👻 GHOST DELAY
$: GHOST_SRC.s("gm_pad_warm")
  .attack(0.04).release(0.9).sustain(0.85)
  .detune(0.004).vibrato(0.06)
  .hpf(700).lpf(lerp(1500, 2000, CUTOFF))
  .gain(lerp(0.00, 0.12, ENERGY) * ENV_MELO)
  .delay(0.125)
  .room(0.84).mix(lerp(0.48, 0.62, WET))
  .pan(sine.range(0.48,0.52).slow(14))
  .gain(MASTER * S_GHOST)                                   // FINAL HARD MUTE

// 🤝 COUNTER-MELODY (sweet harmony)
$: note(MELO_HARM_SWEET).s("gm_pad_warm").slow(2)
  .attack(0.02).release(0.55).sustain(0.9)
  .detune(0.004).vibrato(0.08)
  .hpf(600).lpf(lerp(1700, 2050, CUTOFF))
  .gain(lerp(0.10, 0.18, ENERGY) * ENV_MELO)
  .room(0.78).mix(lerp(0.48, 0.60, WET))
  .delay(0.125)
  .pan(sine.range(0.48,0.52).slow(12))
  .gain(MASTER * S_HARM)                                     // FINAL HARD MUTE

// 🎻 SANCTUS — violins
const SANCTUS_LINE = "<a6 c7 d7 c7  bb6 d7 f7 d7  c7 e7 f7 e7  d7 g7 a7 g7>".sub(12);

$: note(SANCTUS_LINE).fast(8).s("gm_violin")
  .attack(0.28).release(2.6).sustain(0.98)
  .detune(0.002).vibrato(0.12)
  .hpf(900).lpf(lerp(1800, 2600, CUTOFF))
  .gain(sine.range(0.06,0.16).slow(12))
  .gain(lerp(0.10, 0.00, CUTOFF) * ENV_SANCT)
  .room(0.97).mix(lerp(0.58, 0.74, WET))
  .pan(sine.range(0.47,0.53).slow(16))
  .gain(MASTER * S_SANCT)                                    // FINAL HARD MUTE

// optional glass halo
$: note(SANCTUS_LINE).slow(8).s("gm_pad_glass")
  .attack(0.5).release(3).sustain(1)
  .hpf(700).lpf(lerp(1900,2600,CUTOFF))
  .gain(0.04 * ENV_SANCT)
  .room(1).mix(0.74)
  .pan(sine.range(0.44,0.56).slow(22))
  .gain(MASTER * S_SANCT)                                    // FINAL HARD MUTE

// 💥 IMPACTS & TRANSITIONS (FX)
$: sound("cr, bd").bank("RolandTR909")
  .room(0.6).mix(lerp(0.45, 0.60, WET))
  .gain(ENV_SCENE * lerp(0.012, 0.028, ENERGY))
  .gain(MASTER * S_FX * .15)                                       // FINAL HARD MUTE

$: sound("noise").s("gm_fx_brightness").slow(1)
  .attack(0.4).release(0.9).sustain(0)
  .hpf(1000).lpf(lerp(2000, 2600, CUTOFF))
  .gain(lerp(0.00, 0.03, ENERGY))
  .every(16, x => x)
  .pan(sine.range(0.45,0.55).slow(12))
  .gain(MASTER * S_FX)                                       // FINAL HARD MUTE
