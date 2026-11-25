<script setup>
// Ankhi Jhyal: a carved Newari window. The default slot fills the opening
// (a photo, an illustration). `lattice` is how much of the opening the
// carved screen covers, from the bottom (0 = open, 1 = fully closed).
// With `lift`, the screen slides up out of the way (used as a loader).
// The top beam and bottom sill carry a close-set row of carved six-petal
// flowers, and the top arch has mirrored carved leaves following its curve
// (flower and leaf artwork from SVG Repo, supplied by Ritika).
defineProps({
  lattice: { type: Number, default: 0.34 },
  lift: { type: Boolean, default: false },
});

const flowerId = `jhyal-flower-${useId()}`;
const barcodeId = `jhyal-barcode-${useId()}`; // equal-width vertical grooves on the beams (0.9 wide, 2.25 apart (about 4px on Home), lower half of each beam; top half left plain)
const FLOWER = 7.2; // size of each carved flower in window units (band is 9 tall, with a thin line above)
const COUNT = 18; // close-set: about 1.8 units between flowers
// evenly spaced along the 176-unit beams (x 12..188)
const flowerX = Array.from({ length: COUNT }, (_, i) => 12 + (176 / COUNT) * (i + 0.5) - FLOWER / 2);

// Pillar shaft (x 28..36, y 52..186): alternating sections from top to
// bottom: a block of small flowers (10 rows x 2 columns), a panel of
// vertical lines, then another block of flowers, with a thin horizontal line
// between sections.
const SHAFT_X = 28, SHAFT_W = 8, SHAFT_TOP = 52, SHAFT_BOTTOM = 186;
const COLS = 2, ROWS = 10; // flowers per block
const MINI = 2.6; // small flower size
const PITCH = SHAFT_W / COLS; // columns across the shaft
const GRID_H = PITCH * ROWS;
const SEP = 1.6; // space taken by each dividing line
const SECTIONS = ["grid", "lines", "grid"]; // two flower sections with lines between
const nGrids = SECTIONS.filter((k) => k === "grid").length;
const LINES_H = (SHAFT_BOTTOM - SHAFT_TOP - nGrids * GRID_H - (SECTIONS.length - 1) * SEP) / (SECTIONS.length - nGrids);
const pillar = (() => {
  const minis = [], flutes = [], dividers = [];
  let y = SHAFT_TOP;
  SECTIONS.forEach((kind, s) => {
    if (kind === "grid") {
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          minis.push({ key: `m${s}-${r}-${c}`, x: SHAFT_X + c * PITCH + (PITCH - MINI) / 2, y: y + r * PITCH + (PITCH - MINI) / 2 });
      y += GRID_H;
    } else {
      for (let c = 1; c < COLS; c++) flutes.push({ key: `f${s}-${c}`, x: SHAFT_X + c * PITCH, y1: y + 0.6, y2: y + LINES_H - 0.6 });
      y += LINES_H;
    }
    if (s < SECTIONS.length - 1) {
      dividers.push({ key: `d${s}`, y: y + SEP / 2 });
      y += SEP;
    }
  });
  return { minis, flutes, dividers };
})();

// Leaves on the arch (the crest is the curve M66 18 Q100 -6 134 18): a close,
// overlapping row of upright leaves standing on the arch's base line. They
// are tallest at the peak and shorter towards the edges so each stays inside
// the arch, lean very slightly outward from the centre, and the right half
// mirrors the left. Drawn from the edges inwards so each overlaps the next.
const leafId = `jhyal-leaf-${useId()}`;
const LEAF_AXIS = -53; // the leaf artwork points up-right at about -53 degrees
const LEAF_LEN = 1.17; // leaf length as a share of its box size
const BASE_Y = 17.6; // the arch's base line
const SPACING = 4.6; // closer than a leaf's width, so neighbours overlap
const archTop = (x) => {
  const t = (x - 66) / 68; // x runs linearly along this curve
  return (1 - t) ** 2 * 18 + 2 * t * (1 - t) * -6 + t * t * 18;
};
const leaves = Array.from({ length: 11 }, (_, i) => {
  const x = 100 + (i - 5) * SPACING;
  const room = BASE_Y - 1.4 - archTop(x); // height available under the arch
  const size = Math.min(11.5, room / LEAF_LEN);
  const cy = BASE_Y - (size * LEAF_LEN) / 2; // stem on the base, tip pointing up
  const lean = -((Math.abs(x - 100) / (5 * SPACING)) * 9); // outward lean, up to 9 deg
  const rot = -90 - LEAF_AXIS + lean;
  const transform =
    x > 100
      ? `translate(${x.toFixed(2)} ${cy.toFixed(2)}) scale(-1 1) rotate(${rot.toFixed(1)})`
      : `translate(${x.toFixed(2)} ${cy.toFixed(2)}) rotate(${rot.toFixed(1)})`;
  return { key: `leaf${i}`, size, transform, order: Math.abs(i - 5) };
}).sort((a, b) => b.order - a.order);
</script>

<template>
  <div class="jhyal relative w-full" style="aspect-ratio: 200 / 230">
    <div class="jhyal-opening absolute overflow-hidden" style="left: 22%; top: 20%; width: 56%; height: 63.5%; background: var(--mist)">
      <slot />
      <div
        v-if="lattice > 0"
        class="lattice-screen absolute inset-x-0 bottom-0"
        :class="{ 'is-lifted': lift }"
        :style="{ height: `${lattice * 100}%` }"
        aria-hidden="true"
      />
    </div>
    <svg class="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 200 230" aria-hidden="true">
      <defs>
        <pattern :id="barcodeId" patternUnits="userSpaceOnUse" x="14" y="0" width="3.15" height="20">
          <rect x="0" y="0" width="0.9" height="20" style="fill: var(--gold)" />
        </pattern>
        <symbol :id="flowerId" viewBox="0 0 378.832 378.832">
          <path d="M208.556,171.543c4.136-2.547,8.403-5.034,12.664-7.531c4.294-2.445,8.578-4.903,12.854-7.217c2.127-1.175,4.251-2.319,6.363-3.429c2.104-1.11,4.184-2.223,6.25-3.268c8.241-4.247,16.062-7.987,22.858-11.027c6.796-3.05,12.566-5.398,16.66-6.954c2.034-0.793,3.679-1.343,4.779-1.748c1.116-0.383,1.712-0.582,1.712-0.582s-0.478,0.411-1.36,1.188c-0.901,0.751-2.201,1.896-3.905,3.265c-3.394,2.762-8.312,6.591-14.349,10.953c-6.033,4.364-13.184,9.266-20.98,14.276c-1.939,1.272-3.939,2.517-5.96,3.783c-2.016,1.276-4.065,2.543-6.149,3.796c-4.142,2.553-8.412,5.029-12.674,7.524c-4.294,2.443-8.577,4.896-12.859,7.207c-0.468,0.26-0.933,0.495-1.401,0.749c22.938,4.027,85.072,12.512,117.978-6.487c74.679-43.117,33.771-50.114,17.416-78.445c-16.358-28.33-1.969-67.258-76.646-24.141c-32.899,18.999-56.62,77.048-64.605,98.929C207.655,172.103,208.093,171.819,208.556,171.543z" />
          <path d="M214.46,197.051c4.282,2.311,8.565,4.766,12.859,7.207c4.262,2.496,8.532,4.974,12.677,7.524c2.081,1.253,4.132,2.521,6.148,3.796c2.019,1.269,4.019,2.508,5.957,3.78c7.799,5.015,14.949,9.913,20.981,14.28c6.036,4.361,10.955,8.186,14.349,10.95c1.704,1.368,3.004,2.517,3.905,3.264c0.886,0.779,1.36,1.191,1.36,1.191s-0.596-0.201-1.711-0.583c-1.103-0.403-2.744-0.956-4.779-1.748c-4.091-1.558-9.865-3.902-16.661-6.953c-6.794-3.042-14.617-6.782-22.855-11.028c-2.069-1.044-4.148-2.157-6.253-3.27c-2.112-1.105-4.236-2.252-6.363-3.428c-4.276-2.312-8.562-4.770-12.854-7.215c-4.261-2.497-8.527-4.984-12.664-7.531c-0.463-0.276-0.899-0.561-1.356-0.842c7.985,21.881,31.706,79.929,64.607,98.927c74.681,43.113,60.288,4.188,76.646-24.141c16.354-28.332,57.262-35.333-17.416-78.445c-32.904-18.999-95.038-10.513-117.978-6.491C213.527,196.556,213.992,196.791,214.46,197.051z" />
          <path d="M195.327,214.924c0.134,4.857,0.155,9.8,0.189,14.738c-0.032,4.938-0.042,9.876-0.182,14.739c-0.04,2.429-0.111,4.842-0.213,7.226c-0.086,2.381-0.166,4.735-0.293,7.05c-0.45,9.258-1.112,17.899-1.876,25.308c-0.761,7.407-1.616,13.581-2.312,17.904c-0.331,2.156-0.679,3.855-0.874,5.016c-0.233,1.156-0.354,1.775-0.354,1.775s-0.119-0.619-0.353-1.775c-0.196-1.159-0.541-2.857-0.873-5.016c-0.695-4.323-1.552-10.497-2.313-17.904c-0.761-7.407-1.426-16.05-1.874-25.306c-0.128-2.315-0.209-4.671-0.294-7.052c-0.102-2.384-0.174-4.797-0.213-7.226c-0.14-4.863-0.148-9.8-0.182-14.738c0.034-4.939,0.056-9.88,0.188-14.739c0.013-0.534,0.033-1.055,0.053-1.59c-14.955,17.854-53.368,67.42-53.368,105.415c0.001,86.229,26.517,54.305,59.227,54.306c32.712-0.002,59.228,31.922,59.228-54.306c0-37.995-38.412-87.562-53.367-105.415C195.294,213.869,195.315,214.389,195.327,214.924z" />
          <path d="M170.277,207.289c-4.137,2.546-8.404,5.034-12.664,7.531c-4.294,2.444-8.579,4.903-12.855,7.216c-2.127,1.175-4.251,2.32-6.363,3.429c-2.104,1.109-4.185,2.224-6.251,3.269c-8.241,4.245-16.063,7.988-22.858,11.027c-6.796,3.051-12.569,5.397-16.66,6.954c-2.035,0.792-3.679,1.344-4.78,1.747c-1.116,0.384-1.711,0.583-1.711,0.583s0.475-0.412,1.359-1.189c0.902-0.749,2.202-1.895,3.906-3.266c3.394-2.765,8.314-6.589,14.349-10.95c6.033-4.365,13.184-9.267,20.98-14.277c1.94-1.271,3.94-2.516,5.96-3.783c2.016-1.274,4.066-2.543,6.149-3.796c4.144-2.552,8.413-5.028,12.676-7.523c4.294-2.442,8.576-4.896,12.858-7.208c0.468-0.259,0.934-0.493,1.402-0.754c-22.939-4.021-85.073-12.507-117.979,6.492c-74.679,43.116-33.771,50.115-17.416,78.445c16.358,28.331,1.968,67.254,76.645,24.142c32.904-18.999,56.624-77.048,64.608-98.929C171.178,206.729,170.739,207.014,170.277,207.289z" />
          <path d="M164.372,181.781c-4.282-2.312-8.564-4.765-12.858-7.208c-4.263-2.496-8.532-4.972-12.676-7.523c-2.083-1.253-4.134-2.521-6.149-3.796c-2.02-1.268-4.02-2.512-5.959-3.782c-7.798-5.013-14.949-9.912-20.981-14.278c-6.034-4.362-10.955-8.187-14.349-10.951c-1.704-1.37-3.004-2.516-3.906-3.264c-0.885-0.779-1.359-1.191-1.359-1.191s0.595,0.2,1.711,0.583c1.102,0.404,2.744,0.955,4.779,1.747c4.092,1.557,9.865,3.904,16.661,6.954c6.794,3.042,14.617,6.78,22.856,11.028c2.068,1.044,4.148,2.158,6.253,3.268c2.112,1.108,4.236,2.253,6.363,3.429c4.276,2.313,8.562,4.771,12.855,7.216c4.26,2.497,8.527,4.984,12.664,7.53c0.462,0.277,0.898,0.562,1.355,0.842c-7.984-21.88-31.705-79.929-64.608-98.928C32.346,30.344,46.737,69.269,30.38,97.6c-16.354,28.331-57.262,35.331,17.416,78.444c32.904,19,95.038,10.514,117.979,6.494C165.306,182.277,164.84,182.04,164.372,181.781z" />
          <path d="M183.504,163.907c-0.133-4.859-0.153-9.798-0.188-14.738c0.033-4.939,0.042-9.875,0.181-14.738c0.04-2.43,0.113-4.842,0.214-7.226c0.085-2.381,0.165-4.735,0.293-7.05c0.449-9.258,1.113-17.899,1.875-25.307c0.762-7.407,1.617-13.582,2.312-17.904c0.332-2.158,0.678-3.856,0.874-5.016c0.232-1.157,0.353-1.775,0.353-1.775s0.119,0.618,0.354,1.775c0.195,1.159,0.542,2.857,0.874,5.016c0.693,4.322,1.551,10.497,2.312,17.904c0.762,7.407,1.426,16.049,1.875,25.307c0.128,2.313,0.208,4.669,0.293,7.05c0.102,2.384,0.174,4.796,0.214,7.226c0.14,4.863,0.147,9.799,0.182,14.738c-0.034,4.94-0.057,9.879-0.188,14.738c-0.013,0.536-0.034,1.057-0.052,1.591c14.954-17.854,53.366-67.42,53.366-105.415c0-86.229-26.517-54.305-59.228-54.305s-59.227-31.924-59.227,54.305c0,37.995,38.413,87.562,53.367,105.415C183.538,164.964,183.518,164.443,183.504,163.907z" />
        </symbol>
        <symbol :id="leafId" viewBox="0 0 512 512">
          <path d="M377.478,0.174c-34.179-3.423-37.602,44.438-119.644,78.618c-83.543,34.808-166.39,80.55-167.693,254.14c-0.155,18.807-1.314,51.296-1.513,65.056c-0.276,19.691,0.287,40.872-8.69,51.738c-7.311,8.857-20.176,18.818-32.866,27.531L81.87,512c31.032-24.306,39.834-26.493,46.35-26.35c15.549,0.342,31.33,0.496,47.155-0.762c100.318-7.995,202.137-56.718,253.379-149.714C521.042,167.679,411.657,3.598,377.478,0.174z M368.81,109.802c-6.184,20.817-26.957,51.826-91.925,128.445c-33.517,39.535-72.158,107.672-99.743,168.344c-8.361,18.388-36.432,4.925-26.405-13.473c13.042-19.403,43.08-104.117,86.558-160.968c43.489-56.862,101.411-105.685,110.378-133.801C351.857,79.112,377.048,82.116,368.81,109.802z" />
        </symbol>
      </defs>
      <path d="M100 -6 L104 2 L100 6 L96 2 Z" style="fill: var(--gold)" />
      <path d="M66 18 Q100 -6 134 18 Z" style="fill: var(--wood); stroke: var(--wood-dark)" stroke-width="1.5" />
      <path d="M84 16 Q100 4 116 16" fill="none" style="stroke: var(--wood-carve)" stroke-width="2" />
      <!-- carved leaves on the arch: solid gold with a thin dark edge so overlaps read clearly -->
      <g style="fill: var(--gold); stroke: var(--wood-dark)" stroke-width="18" stroke-linejoin="round">
        <use v-for="l in leaves" :key="l.key" :href="`#${leafId}`" :x="-l.size / 2" :y="-l.size / 2" :width="l.size" :height="l.size" :transform="l.transform" />
      </g>
      <path d="M0 24 Q2 14 14 17 L186 17 Q198 14 200 24 L194 31 L6 31 Z" style="fill: var(--wood); stroke: var(--wood-dark)" stroke-width="1.5" />
      <!-- barcode strip carved along the top beam -->
      <rect x="14" y="24" width="172" height="6.2" :fill="`url(#${barcodeId})`" opacity="0.85" />
      <line x1="14" y1="24" x2="186" y2="24" style="stroke: var(--gold)" stroke-width="0.55" />
      <!-- top beam with a close-set row of carved flowers -->
      <rect x="12" y="31" width="176" height="9" style="fill: var(--wood-dark)" />
      <line x1="12" y1="31.9" x2="188" y2="31.9" style="stroke: var(--gold)" stroke-width="0.55" />
      <g style="fill: var(--gold)" opacity="0.9">
        <use v-for="(x, i) in flowerX" :key="`ft${i}`" :href="`#${flowerId}`" :x="x" :y="32.6" :width="FLOWER" :height="FLOWER" />
      </g>
      <!-- side pillars: the right one is an exact mirror of the left -->
      <g v-for="side in ['left', 'right']" :key="`pillar-${side}`" :transform="side === 'right' ? 'translate(200 0) scale(-1 1)' : undefined">
        <!-- the post itself (thinner than before) -->
        <rect x="26" y="40" width="12" height="158" style="fill: var(--wood); stroke: var(--wood-dark)" stroke-width="1.5" />
        <!-- recessed shaft: flower blocks and vertical-line panels, separated by horizontal lines -->
        <rect :x="SHAFT_X - 1" :y="SHAFT_TOP - 1" :width="SHAFT_W + 2" :height="SHAFT_BOTTOM - SHAFT_TOP + 2" rx="1" style="fill: var(--wood-dark)" />
        <g style="fill: var(--gold)">
          <use v-for="m in pillar.minis" :key="m.key" :href="`#${flowerId}`" :x="m.x" :y="m.y" :width="MINI" :height="MINI" />
        </g>
        <g style="stroke: var(--gold)" stroke-width="0.5" opacity="0.9">
          <line v-for="f in pillar.flutes" :key="f.key" :x1="f.x" :y1="f.y1" :x2="f.x" :y2="f.y2" />
        </g>
        <g style="stroke: var(--gold)" stroke-width="0.55">
          <line v-for="d in pillar.dividers" :key="d.key" :x1="SHAFT_X - 1" :y1="d.y" :x2="SHAFT_X + SHAFT_W + 1" :y2="d.y" />
        </g>
        <!-- capital (top) and base (bottom) blocks -->
        <rect x="24" y="40" width="16" height="11" rx="1" style="fill: var(--wood); stroke: var(--wood-dark)" stroke-width="1.2" />
        <line x1="25" y1="47.5" x2="39" y2="47.5" style="stroke: var(--gold)" stroke-width="0.55" />
        <rect x="24" y="187" width="16" height="11" rx="1" style="fill: var(--wood); stroke: var(--wood-dark)" stroke-width="1.2" />
        <line x1="25" y1="190.5" x2="39" y2="190.5" style="stroke: var(--gold)" stroke-width="0.55" />
      </g>
      <!-- brown wood filling the gap between the frame and the opening, so nothing behind the window shows through -->
      <path d="M38 40 H162 V198 H38 Z M44 46 V192 H156 V46 Z" fill-rule="evenodd" style="fill: var(--wood-dark)" />
      <rect x="38" y="40" width="124" height="158" fill="none" style="stroke: var(--wood)" stroke-width="6" />
      <rect x="38" y="40" width="124" height="158" fill="none" style="stroke: var(--wood-dark)" stroke-width="1.2" />
      <!-- bottom sill with the same row of flowers -->
      <rect x="12" y="198" width="176" height="9" style="fill: var(--wood-dark)" />
      <line x1="12" y1="198.9" x2="188" y2="198.9" style="stroke: var(--gold)" stroke-width="0.55" />
      <g style="fill: var(--gold)" opacity="0.9">
        <use v-for="(x, i) in flowerX" :key="`fb${i}`" :href="`#${flowerId}`" :x="x" :y="199.6" :width="FLOWER" :height="FLOWER" />
      </g>
      <path d="M6 207 L194 207 L200 216 Q198 225 186 222 L14 222 Q2 225 0 216 Z" style="fill: var(--wood); stroke: var(--wood-dark)" stroke-width="1.5" />
      <!-- matching barcode strip carved along the sill -->
      <rect x="14" y="214.5" width="172" height="6.7" :fill="`url(#${barcodeId})`" opacity="0.85" />
      <line x1="14" y1="214.5" x2="186" y2="214.5" style="stroke: var(--gold)" stroke-width="0.55" />
    </svg>
  </div>
</template>

<style scoped>
/* Window colour scheme, scoped to the window so the rest of the site keeps its
   own colours: brown wood with orange carved detailing. */
.jhyal {
  --wood: #422313; /* main wood: brown */
  --wood-dark: #2a160b; /* outlines and recesses */
  --wood-carve: #6b3a1e; /* mid-tone wood */
  --gold: #e07b32; /* carved details: orange */
}
/* lattice: brown slats over a dark-brown backing */
.jhyal .lattice-screen {
  background-color: rgba(42, 22, 11, 0.6);
  background-image: repeating-linear-gradient(45deg, transparent 0 5px, #5a3018 5px 9px),
    repeating-linear-gradient(-45deg, transparent 0 5px, #5a3018 5px 9px);
  border-top-color: #422313;
}
</style>
