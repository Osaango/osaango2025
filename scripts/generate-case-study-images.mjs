import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const configPath = path.resolve('scripts/case-study-scenes.json');
const outDir = path.resolve('src/assets/case-study-scenes');
const humanDir = path.resolve('public/design-system/humans');

const W = 1600;
const H = 900;

const brand = {
  navy: '#10233f',
  ink: '#111820',
  slate: '#647184',
  paper: '#ffffff',
  cloud: '#eef6f8',
  line: '#dfe5ec',
  faint: '#e7f1f4',
};

const humanFiles = {
  standing: 'pose-with-scarf-standing.svg',
  pointing: 'pose-with-scarf-pointing.svg',
  thinking: 'pose-with-scarf-thinking.svg',
  listening: 'pose-with-scarf-listening.svg',
  confirming: 'pose-with-scarf-watching-hand-up.svg',
};

const humanAssets = new Map();
let activeMode = 'case';

function isCardMode() {
  return activeMode === 'card';
}

function sw(value) {
  return Math.round(value * (isCardMode() ? 1.18 : 1.1) * 10) / 10;
}

function connectorSw(value, arrow = false) {
  const factor = arrow ? (isCardMode() ? 0.9 : 0.86) : (isCardMode() ? 1.06 : 1);
  return Math.round(value * factor * 10) / 10;
}

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function markerDefs() {
  const arrowStroke = isCardMode() ? 1.75 : 1.65;
  return `
    <marker id="arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M2 2 L10 6 L2 10" fill="none" stroke="${brand.navy}" stroke-width="${arrowStroke}" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    <marker id="accentArrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M2 2 L10 6 L2 10" fill="none" stroke="var(--accent)" stroke-width="${arrowStroke}" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>`;
}

function baseSvg(scene, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc" style="--accent:${scene.accentColor};--secondary:${scene.secondaryAccent}">
  <title id="title">${esc(scene.case)}</title>
  <desc id="desc">${esc(scene.changedState)}</desc>
  <defs>
    ${markerDefs()}
    <pattern id="softGrid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="${brand.navy}" stroke-opacity=".045" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${brand.paper}"/>
  <rect width="${W}" height="${H}" fill="url(#softGrid)"/>
  <path d="M150 735 C390 635 520 690 730 575 C930 465 1080 275 1435 260" fill="none" stroke="${scene.accentColor}" stroke-width="${isCardMode() ? 92 : 100}" stroke-opacity="${isCardMode() ? '.12' : '.09'}" stroke-linecap="round"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${body}
  </g>
</svg>`;
}

function card(x, y, w, h, color = brand.navy, fill = brand.paper, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" fill-opacity="${opacity}" stroke="${color}" stroke-width="${sw(5)}"/>`;
}

function node(x, y, r, color = brand.navy, fill = brand.paper) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${color}" stroke-width="${sw(5)}"/>`;
}

function line(d, color = brand.navy, width = 5, dashed = false, arrow = false) {
  return `<path d="${d}" stroke="${color}" stroke-width="${connectorSw(width, arrow)}"${dashed ? ' stroke-dasharray="13 13"' : ''}${arrow ? ' marker-end="url(#arrow)"' : ''}/>`;
}

function accentLine(d, width = 5, dashed = false, arrow = false) {
  return `<path d="${d}" stroke="var(--accent)" stroke-width="${connectorSw(width, arrow)}"${dashed ? ' stroke-dasharray="13 13"' : ''}${arrow ? ' marker-end="url(#accentArrow)"' : ''}/>`;
}

function iconCheck(x, y, color = 'var(--secondary)') {
  return `<path d="M${x} ${y + 16} L${x + 18} ${y + 34} L${x + 52} ${y}" stroke="${color}" stroke-width="${sw(7)}"/>`;
}

function human(x, y, scale = 1, scarf = 'var(--accent)', pose = 'standing', flip = false) {
  const width = 180 * scale;
  const height = 205 * scale;
  const href = humanAssets.get(pose) ?? humanAssets.get('standing');

  if (!href) {
    throw new Error('Design-system human assets were not loaded before rendering.');
  }

  const image = `<image href="${href}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/>`;

  if (flip) {
    return `<g transform="translate(${x + width} ${y}) scale(-1 1)">${image}</g>`;
  }

  return `<g transform="translate(${x} ${y})">${image}</g>`;
}

function miniPeople(points, color = 'var(--accent)') {
  return points
    .map(([x, y, s = 0.52, flip = false], i) =>
      human(x, y, s, i % 2 ? 'var(--secondary)' : color, i % 3 === 0 ? 'pointing' : 'standing', flip),
    )
    .join('\n');
}

function aiAssistedLegacy(scene) {
  const fragments = [
    [220, 196, 150, 76],
    [470, 144, 132, 72],
    [380, 352, 140, 78],
    [190, 510, 142, 74],
    [590, 540, 130, 72],
    [650, 300, 118, 70],
  ];
  const mapped = [
    [960, 190],
    [1180, 190],
    [1070, 360],
    [915, 535],
    [1245, 535],
  ];

  return baseSvg(
    scene,
    `
    ${line('M250 235 C410 262 445 226 535 180', brand.navy, 4, true)}
    ${line('M510 352 C608 352 624 306 706 332', brand.navy, 4, true)}
    ${line('M305 520 C390 450 468 462 610 574', brand.navy, 4, true)}
    ${fragments.map(([x, y, w, h], i) => card(x, y, w, h, i % 2 ? 'var(--accent)' : brand.navy, brand.paper)).join('\n')}
    ${node(350, 280, 16, 'var(--secondary)', brand.cloud)}
    ${node(560, 418, 16, 'var(--secondary)', brand.cloud)}
    ${node(755, 428, 16, 'var(--accent)', brand.cloud)}
    ${accentLine('M805 405 C860 375 893 325 935 277', 6, false, true)}
    ${card(835, 246, 72, 54, 'var(--accent)', brand.cloud)}
    ${line('M870 273 h-20 M870 273 v-20 M870 273 h20 M870 273 v20', 'var(--accent)', 4)}
    ${mapped.map(([x, y], i) => `${node(x, y, 36, i === 2 ? 'var(--secondary)' : brand.navy, brand.paper)}${i === 2 ? iconCheck(x - 24, y - 16) : ''}`).join('\n')}
    ${line('M996 205 C1045 182 1105 182 1144 205', brand.navy, 5, false, true)}
    ${line('M1165 226 C1130 277 1108 312 1088 329', brand.navy, 5, false, true)}
    ${line('M1050 388 C998 435 952 486 928 502', brand.navy, 5, false, true)}
    ${line('M1090 392 C1150 452 1202 490 1222 504', brand.navy, 5, false, true)}
    ${human(1290, 610, .56, 'var(--accent)', 'confirming', true)}
    ${card(1172, 618, 112, 74, 'var(--secondary)', brand.cloud)}
    ${iconCheck(1204, 636, 'var(--secondary)')}
    ${human(745, 590, .58, 'var(--secondary)', 'pointing')}
    <path d="M150 720 H1450" stroke="${brand.navy}" stroke-opacity=".14" stroke-width="4"/>
    `,
  );
}

function scalingGovernance(scene) {
  const teams = isCardMode()
    ? [
        [260, 245],
        [300, 560],
        [1240, 245],
        [1190, 560],
      ]
    : [
        [230, 210],
        [250, 560],
        [690, 160],
        [760, 610],
        [1190, 210],
        [1220, 560],
      ];

  return baseSvg(
    scene,
    `
    ${card(625, 292, 350, 230, brand.navy, brand.paper)}
    ${node(705, 375, 28, 'var(--accent)', brand.cloud)}
    ${node(800, 375, 28, 'var(--secondary)', brand.cloud)}
    ${node(895, 375, 28, 'var(--accent)', brand.cloud)}
    ${line('M690 456 H912', brand.navy, 6)}
    ${iconCheck(760, 438, 'var(--secondary)')}
    ${teams.map(([x, y], i) => `${card(x - 82, y - 46, 164, 92, i % 2 ? 'var(--secondary)' : 'var(--accent)', brand.paper)}${node(x - 42, y, 13, brand.navy, brand.cloud)}${node(x, y, 13, brand.navy, brand.cloud)}${node(x + 42, y, 13, brand.navy, brand.cloud)}`).join('\n')}
    ${line('M342 246 C448 282 520 322 625 360', brand.navy, 4.8)}
    ${line('M374 560 C462 520 532 486 625 452', brand.navy, 4.8)}
    ${line('M1138 246 C1048 280 1018 322 975 360', brand.navy, 4.8)}
    ${line('M1110 560 C1040 525 1016 488 975 452', brand.navy, 4.8)}
    ${accentLine('M342 246 C600 110 990 110 1138 246', 5.5, false, true)}
    ${accentLine('M374 560 C612 715 958 710 1110 560', 5.5, false, true)}
    ${accentLine('M520 662 C760 800 1045 760 1245 628', 4.6, true, true)}
    ${human(1338, 372, isCardMode() ? .72 : .66, 'var(--accent)', 'pointing', true)}
    ${miniPeople(isCardMode() ? [[185, 112, .48], [1130, 102, .48, true]] : [[185, 96, .5], [1165, 96, .5, true], [678, 645, .5], [246, 642, .5]])}
    <path d="M150 720 H1450" stroke="${brand.navy}" stroke-opacity=".16" stroke-width="${sw(4)}"/>
    `,
  );
}

function integrationTransformation(scene) {
  return baseSvg(
    scene,
    `
    ${card(150, 172, 225, 95, 'var(--accent)', brand.paper)}
    ${card(150, 328, 225, 95, 'var(--accent)', brand.paper)}
    ${card(150, 484, 225, 95, 'var(--accent)', brand.paper)}
    ${card(465, 188, 190, 82, brand.navy, brand.paper)}
    ${card(455, 376, 210, 82, brand.navy, brand.paper)}
    ${card(465, 568, 190, 82, brand.navy, brand.paper)}
    ${line('M375 220 H465 M375 375 H455 M375 532 H465', brand.navy, 4.8, true)}
    ${accentLine('M690 420 H906', 10, false, true)}
    <rect x="1080" y="126" width="322" height="650" rx="32" fill="none" stroke="var(--accent)" stroke-opacity=".28" stroke-width="${sw(5)}"/>
    ${card(905, 150, 128, 555, 'var(--secondary)', brand.cloud)}
    ${line('M969 190 V665', 'var(--secondary)', 7)}
    ${card(1125, 170, 225, 90, brand.navy, brand.paper)}
    ${card(1125, 330, 225, 90, brand.navy, brand.paper)}
    ${card(1125, 490, 225, 90, brand.navy, brand.paper)}
    ${card(1125, 650, 225, 90, brand.navy, brand.paper)}
    ${line('M1033 220 H1125 M1033 375 H1125 M1033 535 H1125 M1033 695 H1125', brand.navy, 5, false, true)}
    ${line('M655 229 C750 240 825 285 905 340', brand.navy, 4.8, true)}
    ${line('M665 417 C750 420 825 420 905 420', brand.navy, 4.8, true)}
    ${line('M655 609 C750 590 825 550 905 500', brand.navy, 4.8, true)}
    ${human(700, 580, isCardMode() ? .76 : .82, 'var(--accent)', 'pointing')}
    ${human(1340, 540, isCardMode() ? .72 : .76, 'var(--secondary)', 'standing', true)}
    ${node(969, 420, 42, 'var(--secondary)', brand.paper)}
    ${iconCheck(945, 404, 'var(--secondary)')}
    <path d="M150 720 H1450" stroke="${brand.navy}" stroke-opacity=".16" stroke-width="${sw(4)}"/>
    `,
  );
}

function platformVision(scene) {
  const layerY = [286, 408, 530];

  return baseSvg(
    scene,
    `
    ${human(160, 230, isCardMode() ? .68 : .62, 'var(--accent)', 'standing')}
    ${human(172, 545, isCardMode() ? .68 : .62, 'var(--secondary)', 'standing')}
    ${card(310, 210, 190, 88, 'var(--accent)', brand.paper)}
    ${card(310, 528, 190, 88, 'var(--secondary)', brand.paper)}
    ${accentLine('M500 254 C610 278 662 320 714 360', 6, false, true)}
    ${line('M500 572 C610 548 668 510 714 470', brand.navy, 6, false, true)}
    <rect x="720" y="238" width="500" height="420" rx="36" fill="${brand.paper}" stroke="var(--accent)" stroke-opacity=".32" stroke-width="${sw(5)}"/>
    ${layerY.map((y, i) => card(760, y, 420, 82, i === 0 ? 'var(--accent)' : i === 1 ? brand.navy : 'var(--secondary)', i === 1 ? brand.paper : brand.cloud)).join('\n')}
    ${line('M800 327 H1140 M800 449 H1140 M800 571 H1140', brand.navy, 5.2)}
    ${card(1045, 170, 150, 70, 'var(--secondary)', brand.cloud)}
    ${line('M1120 240 V286', 'var(--secondary)', 5.5, false, true)}
    ${node(1118, 188, 18, 'var(--secondary)', brand.paper)}
    ${line('M1107 188 H1129 M1118 177 V199', 'var(--secondary)', 4)}
    ${card(1302, 300, 190, 84, brand.navy, brand.paper)}
    ${card(1302, 492, 190, 84, brand.navy, brand.paper)}
    ${line('M1220 330 C1260 324 1272 318 1302 330', brand.navy, 5.5, false, true)}
    ${line('M1220 548 C1260 540 1272 530 1302 524', brand.navy, 5.5, false, true)}
    ${human(1218, 610, isCardMode() ? .68 : .62, 'var(--accent)', 'confirming', true)}
    ${iconCheck(998, 558, 'var(--secondary)')}
    <path d="M150 720 H1450" stroke="${brand.navy}" stroke-opacity=".16" stroke-width="${sw(4)}"/>
    `,
  );
}

function fondiaLegalServices(scene) {
  return baseSvg(
    scene,
    `
    ${human(170, 272, isCardMode() ? .72 : .66, 'var(--accent)', 'standing')}
    ${card(330, 225, 185, 86, 'var(--accent)', brand.paper)}
    ${card(330, 430, 185, 86, 'var(--secondary)', brand.paper)}
    ${line('M515 268 C620 295 670 335 735 398', brand.navy, 5.6, false, true)}
    ${line('M515 472 C615 450 665 430 735 412', brand.navy, 5.6, false, true)}
    ${card(735, 260, 370, 260, brand.navy, brand.paper)}
    ${node(828, 352, 34, 'var(--accent)', brand.cloud)}
    ${node(920, 352, 34, 'var(--secondary)', brand.cloud)}
    ${node(1012, 352, 34, 'var(--accent)', brand.cloud)}
    ${line('M805 435 H1035 M845 470 H995', brand.navy, 5.4)}
    ${card(1230, 190, 165, 76, brand.navy, brand.paper)}
    ${card(1230, 360, 165, 76, brand.navy, brand.paper)}
    ${card(1230, 530, 165, 76, brand.navy, brand.paper)}
    ${line('M1105 360 C1155 300 1188 246 1230 228', brand.navy, 5.2, false, true)}
    ${line('M1105 390 H1230', brand.navy, 5.2, false, true)}
    ${line('M1105 422 C1160 470 1195 525 1230 568', brand.navy, 5.2, false, true)}
    ${human(1118, 590, isCardMode() ? .7 : .64, 'var(--secondary)', 'pointing')}
    <path d="M150 720 H1450" stroke="${brand.navy}" stroke-opacity=".16" stroke-width="${sw(4)}"/>
    `,
  );
}

function financialApiManagement(scene) {
  return baseSvg(
    scene,
    `
    ${human(235, 470, isCardMode() ? .72 : .66, 'var(--accent)', 'pointing')}
    ${human(1220, 470, isCardMode() ? .72 : .66, 'var(--secondary)', 'standing', true)}
    ${card(470, 300, 660, 135, brand.navy, brand.paper)}
    ${line('M535 366 H1065', brand.navy, 5.8)}
    ${node(560, 366, 24, 'var(--accent)', brand.cloud)}
    ${node(735, 366, 24, 'var(--secondary)', brand.cloud)}
    ${node(910, 366, 24, 'var(--accent)', brand.cloud)}
    ${node(1085, 366, 24, 'var(--secondary)', brand.cloud)}
    ${card(560, 520, 150, 78, 'var(--accent)', brand.paper)}
    ${card(808, 520, 150, 78, 'var(--secondary)', brand.paper)}
    ${line('M635 435 V520 M885 435 V520', brand.navy, 5.2, false, true)}
    ${accentLine('M470 650 C650 735 940 735 1130 650', 5.2, false, true)}
    ${iconCheck(1020, 530, 'var(--secondary)')}
    ${miniPeople(isCardMode() ? [[690, 110, .5], [860, 110, .5, true]] : [[610, 110, .5], [780, 110, .5, true], [950, 110, .5]])}
    <path d="M150 720 H1450" stroke="${brand.navy}" stroke-opacity=".16" stroke-width="${sw(4)}"/>
    `,
  );
}

function usMarketExpansion(scene) {
  return baseSvg(
    scene,
    `
    ${node(250, 232, 32, brand.navy, brand.paper)}
    ${node(250, 432, 32, brand.navy, brand.paper)}
    ${node(250, 632, 32, brand.navy, brand.paper)}
    ${card(390, 184, 185, 82, 'var(--accent)', brand.paper)}
    ${card(390, 390, 185, 82, 'var(--secondary)', brand.paper)}
    ${card(390, 590, 185, 82, brand.navy, brand.paper)}
    ${line('M282 232 H390 M282 432 H390 M282 632 H390', brand.navy, 5.4)}
    ${accentLine('M575 225 C690 258 745 326 800 420', 5.8, false, true)}
    ${line('M575 431 H800', brand.navy, 5.8, false, true)}
    ${line('M575 630 C690 590 748 528 800 444', brand.navy, 5.8, false, true)}
    ${node(855, 430, 58, 'var(--accent)', brand.paper)}
    ${iconCheck(825, 404, 'var(--secondary)')}
    ${accentLine('M915 430 C1025 390 1115 350 1215 292', 7.5, false, true)}
    ${card(1215, 245, 210, 95, brand.navy, brand.paper)}
    ${card(1215, 480, 210, 95, brand.navy, brand.paper)}
    ${line('M1305 340 V480', brand.navy, 5.2, true)}
    ${human(720, 592, isCardMode() ? .72 : .66, 'var(--accent)', 'pointing')}
    ${human(1235, 600, isCardMode() ? .7 : .64, 'var(--secondary)', 'standing', true)}
    <path d="M150 720 H1450" stroke="${brand.navy}" stroke-opacity=".16" stroke-width="${sw(4)}"/>
    `,
  );
}

function chemicalManufacturingAudit(scene) {
  return baseSvg(
    scene,
    `
    ${card(185, 190, 210, 82, 'var(--accent)', brand.paper)}
    ${card(185, 400, 210, 82, 'var(--secondary)', brand.paper)}
    ${card(185, 610, 210, 82, brand.navy, brand.paper)}
    ${card(640, 255, 330, 260, brand.navy, brand.paper)}
    ${node(735, 346, 32, 'var(--accent)', brand.cloud)}
    ${node(820, 346, 32, 'var(--secondary)', brand.cloud)}
    ${node(905, 346, 32, 'var(--accent)', brand.cloud)}
    ${line('M704 440 H910 M744 476 H870', brand.navy, 5.4)}
    ${line('M395 232 C500 260 570 300 640 340', brand.navy, 5.2, false, true)}
    ${line('M395 442 H640', brand.navy, 5.2, false, true)}
    ${line('M395 652 C510 600 570 535 640 472', brand.navy, 5.2, false, true)}
    ${card(1170, 210, 210, 82, brand.navy, brand.paper)}
    ${card(1170, 420, 210, 82, brand.navy, brand.paper)}
    ${card(1170, 630, 210, 82, brand.navy, brand.paper)}
    ${line('M970 340 C1065 292 1105 250 1170 250', brand.navy, 5.2, false, true)}
    ${line('M970 420 H1170', brand.navy, 5.2, false, true)}
    ${line('M970 472 C1065 540 1105 650 1170 672', brand.navy, 5.2, false, true)}
    ${accentLine('M570 650 C760 735 990 735 1190 650', 5.2, true, true)}
    ${human(520, 560, isCardMode() ? .72 : .66, 'var(--accent)', 'pointing')}
    ${human(1320, 525, isCardMode() ? .7 : .64, 'var(--secondary)', 'standing', true)}
    <path d="M150 720 H1450" stroke="${brand.navy}" stroke-opacity=".16" stroke-width="${sw(4)}"/>
    `,
  );
}

function makeSvg(scene) {
  if (scene.id === 'fondia-digital-legal-services') return fondiaLegalServices(scene);
  if (scene.id === 'financial-services-api-management') return financialApiManagement(scene);
  if (scene.id === 'us-market-expansion-integration-strategy') return usMarketExpansion(scene);
  if (scene.id === 'chemical-manufacturing-information-audit') return chemicalManufacturingAudit(scene);
  if (scene.id === 'ai-assisted-legacy-discovery') return aiAssistedLegacy(scene);
  if (scene.id === 'scaling-api-governance') return scalingGovernance(scene);
  if (scene.id === 'integration-architecture-transformation') return integrationTransformation(scene);
  if (scene.id === 'platform-vision-ai-enabled-services') return platformVision(scene);
  throw new Error(`Unknown case-study scene: ${scene.id}`);
}

async function writeImages(scene) {
  activeMode = 'case';
  const svg = makeSvg(scene);
  const svgPath = path.join(outDir, `${scene.id}.svg`);
  const pngPath = path.join(outDir, `${scene.id}.png`);
  const socialPath = path.join(outDir, `${scene.id}-social.png`);
  activeMode = 'card';
  const cardSvg = makeSvg(scene);
  const cardPath = path.join(outDir, `${scene.id}-card.png`);

  await fs.writeFile(svgPath, svg, 'utf8');
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
  await sharp(Buffer.from(svg)).resize(1200, 630, { fit: 'cover' }).png({ compressionLevel: 9 }).toFile(socialPath);
  await sharp(Buffer.from(cardSvg)).png({ compressionLevel: 9 }).toFile(cardPath);

  console.log(svgPath);
  console.log(pngPath);
  console.log(cardPath);
  console.log(socialPath);
}

async function loadHumanAssets() {
  await Promise.all(
    Object.entries(humanFiles).map(async ([pose, file]) => {
      const source = await fs.readFile(path.join(humanDir, file), 'utf8');
      const encoded = Buffer.from(source).toString('base64');
      humanAssets.set(pose, `data:image/svg+xml;base64,${encoded}`);
    }),
  );
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  await loadHumanAssets();
  const scenes = JSON.parse(await fs.readFile(configPath, 'utf8'));

  for (const scene of scenes) {
    await writeImages(scene);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
