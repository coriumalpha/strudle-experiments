// ============================================================
// ✨ SESSION: Aeolia Space Lift — v2 (epic + sweet + space)
// ============================================================

// --------------------
// 🎛 LIVE CONTROL
// --------------------
let S_BASE   = 1;
let S_LIFT   = 1;
let S_SHIM   = 1;
let S_PLEG1  = 1;   // Aeolia Prayer (clean, no E)
let S_PLEG2  = 0;   // Dorian Prayer (E only in Dm)
let S_ARP    = 1;
let S_MELO_A = 1;
let S_MELO_B = 0;
let S_HARM   = 1;
let S_SPACE  = 1;   // interstellar “halo” pad
let S_GHOST  = 1;   // melodic ghost delay

// Global macros (0..1)
let CUTOFF = 0.28;   // 0 = very dark, 1 = more open (LPF)
let WET    = 0.45;   // 0 = dry, 1 = very wet (reverb)
let DRIVE  = 0.28;   // 0 = clean, 1 = saturated
let ENERGY = 0.00;   // 0 = intro; 0.4 = lift; 0.75+ = climax

// Helper for interpolation
const lerp = (a,b,t) => a + (b-a)*t;

// Global tempo
setcpm(92/4);


// ===============================
// 🎼 HARMONIC / MELODIC MATERIAL
// ===============================
const PROG_LIFT = "<[d4 f4 a5 d5] [bb3 d4 f5 bb4] [f3 a3 c5 f5] [c4 d4 g5 c6]>".sub(24);
const PROG_SHIM = "<[d5 f5 a6 d6] [bb4 d5 f6 bb5] [f4 a4 c6 f6] [c5 d5 g6 c6]>".sub(12);

// “space” variation (enters during high lifts/climax)
const PROG_SPACE = "<[d4 f4 a4 d5] [bb3 d4 g4 bb4] [f3 a3 c4 f4] [c4 e4 g4 c5]>".sub(24);

const PLEG_AEOL = "<[a6 bb6]*16 [c6 d6]*16 [g6 a6]*16 [g6 a6]*16>".sub(12);  // clear (no E)
const PLEG_DOR1 = "<[e6 f6]*16  [c6 d6]*16 [g6 a6]*16 [g6 a6]*16>".sub(12);  // brightness only in Dm

const ARP_FAST  = "<[d5 f5 a5 f5]*8 [bb4 d5 f5 d5]*8 [f5 a5 c6 a5]*8 [c5 d5 g5 d5]*8>";

const MELO_A =
  "<d5 f5 a5 f5  a5 f5 d5 f5   bb4 d5 f5 d5  f5 d5 bb4 d5  f5 a5 c6 a5  c6 a5 f5 a5   c5 d5 g5 d5  g5 d5 c5 d5>";

const MELO_B =
  "<a5 c6 d6 c6  a5 f5 d5 f5   g5 bb5 c6 bb5  g5 d5 bb4 d5  f5 a5 c6 a5  a5 f5 d5 f5   g5 bb5 d6 bb5  g5 d5 c5 d5>";

const MELO_HARM =
  "<f5 a5 c6 a5  c6 a5 f5 a5   d5 f5 a5 f5   a5 f5 d5 f5  a5 c6 e6 c6  e6 c6 a5 c6   d5 f5 b5 f5   b5 f5 d5 f5>";


// ============================================================
// 🌑 BASE — warm ground (LPF/Gain by CUTOFF/DRIVE)
// ============================================================
$: note("d4!16 f4!16 a3!16 d4!16".sub(24)).slow(4).s("gm_pad_warm")
  .attack(0.12).release(0.8).sustain(0.9)
  .shape(lerp(0.02, 0.10, DRIVE))
  .lpf(lerp(140, 320, CUTOFF))
  .gain(lerp(0.10, 0.18, ENERGY) * S_BASE)


// ============================================================
// 🌊 MAIN LIFT — medium progression (opens and grows with macros)
// ============================================================
$: note(PROG_LIFT).slow(4).s("gm_pad_warm")
  .attack(0.02).release(0.95).sustain(0.92)
  .shape(lerp(0.04, 0.16, DRIVE))
  .lpf(lerp(260, 460, CUTOFF))
  .gain(lerp(0.52, 0.86, CUTOFF) * S_LIFT)


// ============================================================
// ✨ SHIMMER — dark high atmosphere (macro WET)
// ============================================================
$: note(PROG_SHIM).slow(4).s("gm_synth_choir")
  .attack(0.05).release(1.8).sustain(0.97)
  .detune(0.01).vibrato(0.08)
  .lpf(lerp(1300, 1750, CUTOFF)).hpf(900)
  .gain(lerp(0.12, 0.18, ENERGY) * S_SHIM)
  .room(0.90).mix(lerp(0.50, 0.68, WET))
  .pan(sine.range(0.44,0.56).slow(16))


// ============================================================
// 🌌 SPACE HALO — subtle glass pad that embraces the mix
// ============================================================
$: note(choose([PROG_LIFT, PROG_SPACE])).slow(8).s("gm_pad_glass")
  .attack(0.35).release(2.8).sustain(1)
  .lpf(lerp(1700, 2400, CUTOFF))
  .gain(lerp(0.03, 0.07, ENERGY) * S_SPACE)
  .room(1).mix(lerp(0.60, 0.75, WET))
  .pan(sine.range(0.42,0.58).slow(20))


// ============================================================
// 🕊️ PRAYER v1 — Aeolia (clean)
// ============================================================
$: note(PLEG_AEOL).slow(4).s("gm_fx_brightness")
  .attack(0.01).release(2.0).sustain(0.99)
  .detune(0.008).vibrato(0.18)
  .hpf(1200).lpf(lerp(2000, 2350, CUTOFF))
  .gain(sine.range(0.10,0.22).segment(16)).gain(0.10 * S_PLEG1)
  .room(0.9).mix(lerp(0.55, 0.68, WET))


// ============================================================
// 🕊️ PRAYER v2 — Dorian (enters in the drop/energy)
// ============================================================
$: note(PLEG_DOR1).slow(4).s("gm_fx_brightness")
  .attack(0.01).release(2.2).sustain(0.99)
  .detune(0.008).vibrato(0.20)
  .hpf(1200).lpf(lerp(2050, 2400, CUTOFF))
  .gain(sine.range(0.12,0.26).segment(16)).gain(lerp(0.00, 0.10, ENERGY) * S_PLEG2)
  .room(0.9).mix(lerp(0.56, 0.70, WET))


// ============================================================
// ⏱️ FAST OSTINATO — machine with epic accents
// ============================================================
$: note(ARP_FAST).s("pulse").slow(2)
  .attack(0).release(0.06).sustain(0.16)
  .hpf(1000).lpf(lerp(1300, 1650, CUTOFF))
  .gain("<0.55 0.52 0.42 0.52>").gain(lerp(0.18, 0.26, ENERGY) * S_ARP)
  .every(16, x => x.add("<0 12 0 0>"))              // occasional octave jumps
  .every(32, x => x.gain(1.15))                     // small cyclic push
  .delay(0.0625)
  .pan(sine.range(0.46,0.54).slow(10))


// ============================================================
// 🎯 LONG MELODY A — melodic engine (enters in lift)
// ============================================================
$: note(MELO_A).s("pulse").slow(2)
  .attack(0).release(0.06).sustain(0.16)
  .hpf(900).lpf(lerp(1200, 1500, CUTOFF))
  .gain(lerp(0.00, 0.22, ENERGY) * S_MELO_A)
  .pan(sine.range(0.46,0.54).slow(8))
  .add("<0 0 12 0>")


 // ============================================================
 // 🔁 LONG MELODY B — response (warmer)
 // ============================================================
$: note(MELO_B).s("pulse").slow(2)
  .attack(0).release(0.06).sustain(0.16)
  .hpf(900).lpf(lerp(1200, 1550, CUTOFF))
  .gain(lerp(0.16, 0.24, ENERGY) * S_MELO_B)
  .pan(sine.range(0.54,0.46).slow(10))


// ============================================================
// 👻 GHOST DELAY — floating melodic tail (sweet/space)
// ============================================================
$: note(choose([MELO_A, MELO_B])).s("gm_pad_warm").slow(4)
  .attack(0.04).release(0.9).sustain(0.85)
  .detune(0.004).vibrato(0.06)
  .hpf(700).lpf(lerp(1500, 2000, CUTOFF))
  .gain(lerp(0.00, 0.12, ENERGY) * S_GHOST)
  .delay(0.125)
  .room(0.85).mix(lerp(0.50, 0.65, WET))
  .pan(sine.range(0.48,0.52).slow(14))


// ============================================================
// 🤝 COUNTER-MELODY — warm thirds/sixths (late climax)
// ============================================================
$: note(MELO_HARM).s("gm_pad_warm").slow(2)
  .attack(0.02).release(0.55).sustain(0.9)
  .detune(0.004).vibrato(0.08)
  .hpf(600).lpf(lerp(1700, 2050, CUTOFF))
  .gain(lerp(0.10, 0.18, ENERGY) * S_HARM)
  .room(0.78).mix(lerp(0.48, 0.60, WET))
  .delay(0.125)
  .pan(sine.range(0.48,0.52).slow(12))


// ============================================================
// 💥 IMPACTS & TRANSITIONS (drops/lifts)
// ============================================================
$: sound("cr, bd").bank("RolandTR909")
  .room(0.6).mix(lerp(0.45, 0.60, WET))
  .gain(lerp(0.012, 0.028, ENERGY))

// subtle whoosh announcing changes (every 16 bars)
$: sound("noise").s("gm_fx_brightness").slow(1)
  .attack(0.4).release(0.9).sustain(0)
  .hpf(1000).lpf(lerp(2000, 2600, CUTOFF))
  .gain(lerp(0.00, 0.03, ENERGY))
  .every(16, x => x)
  .pan(sine.range(0.45,0.55).slow(12))
