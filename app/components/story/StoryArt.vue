<script setup>
// Small illustrated vignettes for each story chapter.
defineProps({ kind: { type: String, required: true } });

// Tangram (WoodenKits): the classic 7 pieces of a 4x4 square, pulled slightly
// apart so each reads as a separate wooden piece. One small triangle floats
// outside, mid-puzzle.
const U = 20;
const O = [44, 40];
const shrink = (pts, k = 0.93) => {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
};
const toPoints = (pts) => shrink(pts).map(([x, y]) => `${O[0] + x * U},${O[1] + y * U}`).join(" ");
const tangram = [
  { pts: [[0, 0], [4, 0], [2, 2]], fill: "var(--bridal)" },
  { pts: [[0, 0], [2, 2], [0, 4]], fill: "var(--gold)" },
  { pts: [[4, 2], [4, 4], [2, 4]], fill: "var(--sage)" },
  { pts: [[2, 2], [3, 1], [4, 2], [3, 3]], fill: "#E2BC8C" },
  { pts: [[2, 2], [3, 3], [1, 3]], fill: "var(--brick)" },
  { pts: [[0, 4], [1, 3], [3, 3], [2, 4]], fill: "#C99A6B" },
].map((p) => ({ ...p, points: toPoints(p.pts) }));
const floater = toPoints([[4, 0], [4, 2], [3, 1]]);
</script>

<template>
  <!-- Frontend: the illustration from the original site -->
  <div v-if="kind === 'frontend'" class="flex h-full w-full items-center justify-center p-[9%]">
    <img src="/main-design.png" alt="Illustration of a developer surrounded by app icons" class="h-full w-full object-contain" loading="lazy" />
  </div>

  <svg v-else viewBox="0 0 200 160" class="h-full w-full" aria-hidden="true">
    <!-- 3ds Max during lockdown: a 3D app with four viewports, a gizmo and the pointer -->
    <g v-if="kind === 'render'" transform="translate(100 82) scale(0.8) translate(-100 -79)">
      <rect x="20" y="18" width="160" height="122" rx="9" style="fill: var(--surface); stroke: var(--wood)" stroke-width="1.6" />
      <path d="M20 32 V27 a9 9 0 0 1 9 -9 H171 a9 9 0 0 1 9 9 V32 Z" style="fill: var(--paper-2)" />
      <circle cx="30" cy="25" r="2.4" style="fill: var(--bridal)" />
      <circle cx="37" cy="25" r="2.4" style="fill: var(--gold)" />
      <circle cx="44" cy="25" r="2.4" style="fill: var(--sage)" />
      <!-- toolbar: move, rotate, scale, render -->
      <g style="stroke: var(--ink)" fill="none" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M30 37 h8 M34 33 v8 M36.5 34.5 L38 37 L36.5 39.5 M31.5 34.5 L30 37 L31.5 39.5" />
        <path d="M44 37 a4 4 0 1 0 4 -4 M48 33 l2 -1.4 M48 33 l1.4 2" />
        <rect x="55" y="33.5" width="7" height="7" />
        <path d="M66 40.5 l4 -7 l4 7 Z" style="fill: var(--gold-soft)" />
      </g>
      <!-- viewports -->
      <g style="fill: var(--paper-2); stroke: var(--line)" stroke-width="0.8">
        <rect x="24" y="44" width="75" height="45" rx="2" />
        <rect x="101" y="44" width="75" height="45" rx="2" />
        <rect x="24" y="91" width="75" height="45" rx="2" />
        <rect x="101" y="91" width="75" height="45" rx="2" style="fill: var(--sage-soft)" />
      </g>
      <g style="stroke: var(--line)" stroke-width="0.5">
        <line v-for="i in 5" :key="`g1${i}`" :x1="24 + i * 12.5" y1="44" :x2="24 + i * 12.5" y2="89" />
        <line v-for="i in 5" :key="`g2${i}`" :x1="101 + i * 12.5" y1="44" :x2="101 + i * 12.5" y2="89" />
        <line v-for="i in 5" :key="`g3${i}`" :x1="24 + i * 12.5" y1="91" :x2="24 + i * 12.5" y2="136" />
      </g>
      <g font-family="Epilogue, sans-serif" font-size="5" style="fill: var(--muted)">
        <text x="27" y="50">Top</text><text x="104" y="50">Front</text><text x="27" y="97">Left</text><text x="104" y="97">Perspective</text>
      </g>
      <!-- wireframes in the three flat views -->
      <g fill="none" style="stroke: var(--ink)" stroke-width="0.9">
        <rect x="46" y="57" width="20" height="20" /><circle cx="78" cy="67" r="7" />
        <rect x="123" y="58" width="20" height="20" /><circle cx="155" cy="71" r="7" />
        <rect x="46" y="104" width="20" height="20" /><circle cx="78" cy="117" r="7" />
        <path d="M46 57 L66 77 M66 57 L46 77" stroke-width="0.4" />
      </g>
      <!-- shaded cube in perspective, with move gizmo -->
      <polygon points="138,100 152,107 138,114 124,107" style="fill: var(--gold-soft); stroke: var(--wood)" stroke-width="0.9" />
      <polygon points="124,107 138,114 138,128 124,121" style="fill: var(--brick-soft); stroke: var(--wood)" stroke-width="0.9" />
      <polygon points="152,107 138,114 138,128 152,121" style="fill: var(--brick); stroke: var(--wood)" stroke-width="0.9" />
      <g stroke-width="1.6" stroke-linecap="round">
        <line x1="138" y1="114" x2="160" y2="124" stroke="#D64545" />
        <line x1="138" y1="114" x2="116" y2="124" stroke="#4F9A5A" />
        <line x1="138" y1="114" x2="138" y2="95" stroke="#3E6FB0" />
      </g>
      <polygon points="160,124 154.5,123.6 157.5,119.4" fill="#D64545" />
      <polygon points="116,124 118.5,119.4 121.5,123.6" fill="#4F9A5A" />
      <polygon points="138,93 135,98.5 141,98.5" fill="#3E6FB0" />
      <!-- the pointer, grabbing the blue arrow -->
      <path
        transform="translate(139 90) scale(1.05)"
        d="M0 0 L0 22 L5.5 16.5 L9.5 26 L13.5 24.2 L9.6 15 L17 15 Z"
        style="fill: var(--ink)"
        stroke="#fff"
        stroke-width="1.4"
        stroke-linejoin="round"
      />
    </g>

    <!-- Woodshop: a wooden tangram, one piece mid-move -->
    <g v-else-if="kind === 'woodshop'">
      <rect :x="O[0] - 3" :y="O[1] - 3" :width="4 * U + 6" :height="4 * U + 6" rx="4" fill="none" style="stroke: var(--wood-carve)" stroke-width="1.5" stroke-dasharray="4 4" />
      <polygon
        v-for="(p, i) in tangram"
        :key="i"
        :points="p.points"
        :style="{ fill: p.fill }"
        stroke="#5B3A26"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <!-- the missing piece, lifted out and turned, with its dotted path -->
      <path d="M118 46 C 140 40, 158 52, 156 72" fill="none" style="stroke: var(--wood-carve)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 4" />
      <g transform="translate(34 40) rotate(22 152 100)">
        <polygon :points="floater" style="fill: var(--mist)" stroke="#5B3A26" stroke-width="1.6" stroke-linejoin="round" />
      </g>
    </g>

    <!-- Graphic design: a vector app (CorelDRAW-style) with a selected curve, handles and the pointer -->
    <g v-else-if="kind === 'design'" transform="translate(100 82) scale(0.78) translate(-100 -79)">
      <rect x="20" y="18" width="160" height="122" rx="9" style="fill: var(--surface); stroke: var(--wood)" stroke-width="1.6" />
      <path d="M20 32 V27 a9 9 0 0 1 9 -9 H171 a9 9 0 0 1 9 9 V32 Z" style="fill: var(--paper-2)" />
      <circle cx="30" cy="25" r="2.4" style="fill: var(--bridal)" />
      <circle cx="37" cy="25" r="2.4" style="fill: var(--gold)" />
      <circle cx="44" cy="25" r="2.4" style="fill: var(--sage)" />
      <!-- toolbox -->
      <rect x="20" y="32" width="17" height="108" style="fill: var(--paper-2)" />
      <g style="stroke: var(--ink)" fill="none" stroke-width="1.2" stroke-linejoin="round">
        <path d="M25 40 L25 50 L28 47.5 L30 52 L31.6 51.2 L29.6 46.8 L33 46.8 Z" style="fill: var(--ink)" />
        <path d="M28.5 58 L33 66 L28.5 72 L24 66 Z M28.5 66 L28.5 72" />
        <rect x="24" y="78" width="9" height="7" />
        <ellipse cx="28.5" cy="94" rx="4.6" ry="3.6" />
        <path d="M24.5 108 L28.5 100 L32.5 108 M26 105 H31" />
        <path d="M24 118 C26 114 31 122 33 117" />
      </g>
      <!-- colour palette strip -->
      <rect
        v-for="(c, i) in ['--bridal', '--gold', '--brick', '--sage', '--mist', '--wood-carve', '--ink', '--paper']"
        :key="c"
        x="170"
        :y="34 + i * 13"
        width="8"
        height="12"
        rx="1.5"
        :style="{ fill: `var(${c})`, stroke: 'var(--line)' }"
        stroke-width="0.6"
      />
      <!-- selected curve with bounding box -->
      <path d="M62 116 C 56 84, 86 58, 132 54 C 128 88, 102 114, 62 116 Z" style="fill: var(--gold-soft); stroke: var(--bridal)" stroke-width="1.6" />
      <rect x="56" y="50" width="80" height="70" fill="none" style="stroke: var(--muted)" stroke-width="0.9" stroke-dasharray="3 2" />
      <g style="fill: var(--surface); stroke: var(--ink)" stroke-width="0.9">
        <rect v-for="(h, i) in [[56, 50], [96, 50], [136, 50], [56, 85], [136, 85], [56, 120], [96, 120], [136, 120]]" :key="`h${i}`" :x="h[0] - 2.5" :y="h[1] - 2.5" width="5" height="5" />
      </g>
      <!-- bezier handles -->
      <g style="stroke: var(--brick)" stroke-width="1">
        <line x1="62" y1="116" x2="56" y2="84" />
        <line x1="132" y1="54" x2="86" y2="58" />
        <line x1="132" y1="54" x2="150" y2="36" />
      </g>
      <g style="fill: var(--brick)">
        <circle cx="56" cy="84" r="2.6" />
        <circle cx="86" cy="58" r="2.6" />
        <circle cx="150" cy="36" r="2.6" />
      </g>
      <g style="fill: var(--surface); stroke: var(--bridal)" stroke-width="1.4">
        <rect x="59" y="113" width="6" height="6" />
        <rect x="129" y="51" width="6" height="6" />
      </g>
      <!-- the pointer, dragging a handle -->
      <path
        transform="translate(148 34) scale(1.15)"
        d="M0 0 L0 22 L5.5 16.5 L9.5 26 L13.5 24.2 L9.6 15 L17 15 Z"
        style="fill: var(--ink)"
        stroke="#fff"
        stroke-width="1.4"
        stroke-linejoin="round"
      />
    </g>

    <!-- Beijing (BUPT): textbooks, a graduation cap and a folding fan, floating.
         The fan is SVG Repo artwork supplied by Ritika (recoloured). -->
    <g v-else-if="kind === 'beijing'">
      <g style="fill: #DCE8EE">
        <ellipse cx="34" cy="30" rx="20" ry="7" /><ellipse cx="48" cy="25" rx="12" ry="7" /><ellipse cx="164" cy="26" rx="18" ry="6" /><ellipse cx="152" cy="22" rx="10" ry="5" />
      </g>

      <!-- soft shadows that breathe with the floating items -->
      <ellipse class="float-shadow s1" cx="60" cy="142" rx="34" ry="4" style="fill: var(--line)" />
      <ellipse class="float-shadow s3" cx="150" cy="142" rx="26" ry="3.5" style="fill: var(--line)" />

      <!-- textbooks -->
      <g class="floaty f1">
        <g stroke="#2B2522" stroke-width="2">
          <rect x="18" y="114" width="84" height="11" rx="1.5" style="fill: var(--bridal)" />
          <rect x="24" y="103" width="74" height="11" rx="1.5" style="fill: var(--gold)" />
          <rect x="20" y="92" width="78" height="11" rx="1.5" style="fill: var(--sage)" />
        </g>
        <g stroke="#fff" stroke-width="1" opacity="0.7">
          <line x1="26" y1="119.5" x2="66" y2="119.5" />
          <line x1="32" y1="108.5" x2="64" y2="108.5" />
          <line x1="28" y1="97.5" x2="62" y2="97.5" />
        </g>
      </g>

      <!-- graduation cap, hovering above the books -->
      <g class="floaty f2">
        <g transform="rotate(-10 59 66)">
          <g stroke="#2B2522" stroke-width="2" stroke-linejoin="round">
            <path d="M44 70 V76 Q59 82 74 76 V70 Z" style="fill: var(--ink)" />
            <polygon points="59,56 94,66 59,76 24,66" style="fill: var(--ink)" />
          </g>
          <path d="M59 66 L88 69 L88 81" fill="none" style="stroke: var(--gold)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M85.5 80 h5 l-1.2 8 h-2.6 Z" style="fill: var(--gold)" />
          <circle cx="59" cy="66" r="2.4" style="fill: var(--gold)" />
        </g>
      </g>

      <!-- folding fan -->
      <g class="floaty f3">
        <g transform="rotate(8 151 104)">
          <image href="/images/story/fan.svg" x="116" y="52" width="70" height="70" />
          <path d="M150 108 q -4 6 1 11" fill="none" style="stroke: var(--bridal)" stroke-width="1.6" stroke-linecap="round" />
        </g>
      </g>
    </g>

    <!-- Sydney: the Opera House (artwork supplied by Ritika) -->
    <g v-else-if="kind === 'sydney'">
      <!-- the Opera House (SVG Repo artwork supplied by Ritika) on the harbour -->
      <image href="/images/story/opera-house.svg" x="6" y="56" width="188" height="75" preserveAspectRatio="xMidYMax meet" />
      <path d="M0 129 Q50 124 100 129 T200 129 V160 H0 Z" fill="#8FB8CC" opacity="0.9" />
      <g fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity="0.8">
        <path d="M24 140 q8 -4 16 0 q8 4 16 0" />
        <path d="M100 146 q8 -4 16 0 q8 4 16 0" />
        <path d="M150 137 q6 -3 12 0 q6 3 12 0" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
/* Beijing scene: items drift gently, each on its own rhythm */
.floaty {
  transform-box: fill-box;
  transform-origin: center;
  animation: drift 5s ease-in-out infinite;
}
.f2 {
  animation-duration: 4.2s;
  animation-delay: -1.4s;
}
.f3 {
  animation-duration: 5.6s;
  animation-delay: -2.6s;
}
@keyframes drift {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(-1.5deg);
  }
}
.float-shadow {
  transform-box: fill-box;
  transform-origin: center;
  opacity: 0.7;
  animation: breathe 5s ease-in-out infinite;
}
.s3 {
  animation-duration: 5.6s;
  animation-delay: -2.6s;
}
@keyframes breathe {
  0%,
  100% {
    transform: scaleX(1);
    opacity: 0.7;
  }
  50% {
    transform: scaleX(0.82);
    opacity: 0.45;
  }
}
</style>
