import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourcePath =
  'C:\\Users\\MarjukkaNiinioja\\Downloads\\beyond_api_economy_linkedin_posts.md';
const outDir = path.resolve('public/linkedin-post-images');

const W = 1200;
const H = 1200;

const brand = {
  graphite: '#10233f',
  slate: '#1f3040',
  cloud: '#f6fafb',
  paper: '#ffffff',
  teal: '#00a6a6',
  tealDark: '#08786f',
  blue: '#1656b8',
  blueDark: '#12469b',
  purple: '#67389B',
  yellow: '#f5b30b',
  orange: '#E5640A',
  green: '#2F7D32',
  gray: '#647184',
  line: '#dfe5ec',
};

const accents = [
  [brand.blue, brand.teal, brand.yellow],
  [brand.tealDark, brand.purple, brand.blue],
  [brand.blueDark, brand.orange, brand.teal],
  [brand.purple, brand.blue, brand.yellow],
  [brand.teal, brand.green, brand.orange],
  [brand.blueDark, brand.teal, brand.green],
  [brand.graphite, brand.blue, brand.teal],
  [brand.tealDark, brand.blue, brand.yellow],
  [brand.blue, brand.green, brand.orange],
  [brand.graphite, brand.teal, brand.purple],
  [brand.purple, brand.orange, brand.yellow],
  [brand.tealDark, brand.blueDark, brand.orange],
];

const subtitles = [
  'A system is something an organization has. A capability is something it can do.',
  'Implementation-independent requirements still need ownership, consumers and outcomes.',
  'When the platform becomes the frame, capability thinking stops too early.',
  'Strategic freedom erodes when current solutions define what the organization can do.',
  'The real question is what to control, and what can be safely sourced.',
  'A widely available model can still power a distinctive capability.',
  'Product thinking may need to move one level above the interface.',
  'AI multiplies implementation choices. It does not remove architecture.',
  'Registration is not adoption. The first successful use path matters.',
  'Automate the rule. Keep judgment, evidence and accountability visible.',
  'A completed template is not the same thing as a defensible decision.',
  'Remove the technology noun before defining the problem.',
];

const motifs = [
  'systems',
  'question',
  'platform',
  'debt',
  'layers',
  'learning',
  'interfaces',
  'ai-api',
  'funnel',
  'governance',
  'evidence',
  'requirement',
];

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function textLines(lines, x, y, size, lineHeight, attrs = '') {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" ${attrs} font-size="${size}">${escapeXml(line)}</text>`,
    )
    .join('\n');
}

function motifSvg(kind, palette) {
  const [primary, secondary, tertiary] = palette;
  const common = `fill="none" stroke-linecap="round" stroke-linejoin="round"`;

  if (kind === 'none') {
    return '';
  }

  if (kind === 'systems') {
    return `
      <g opacity=".92" ${common}>
        <rect x="760" y="280" width="210" height="120" rx="18" stroke="${primary}" stroke-width="8"/>
        <rect x="685" y="525" width="210" height="120" rx="18" stroke="${secondary}" stroke-width="8"/>
        <rect x="850" y="755" width="210" height="120" rx="18" stroke="${tertiary}" stroke-width="8"/>
        <path d="M865 400 C840 455 805 485 790 525" stroke="${primary}" stroke-width="7"/>
        <path d="M875 645 C900 700 930 725 955 755" stroke="${secondary}" stroke-width="7"/>
      </g>`;
  }

  if (kind === 'question') {
    return `
      <g opacity=".92" ${common}>
        <path d="M802 330 C875 260 1012 294 1035 405 C1055 506 948 537 911 594 C893 621 890 642 890 674" stroke="${primary}" stroke-width="22"/>
        <circle cx="888" cy="790" r="18" fill="${secondary}" stroke="none"/>
        <path d="M710 520 H795 M955 705 H1060" stroke="${tertiary}" stroke-width="8"/>
      </g>`;
  }

  if (kind === 'platform') {
    return `
      <g opacity=".92" ${common}>
        <path d="M700 825 H1060" stroke="${primary}" stroke-width="9"/>
        <rect x="730" y="710" width="285" height="90" rx="16" stroke="${secondary}" stroke-width="8"/>
        <rect x="775" y="585" width="285" height="90" rx="16" stroke="${primary}" stroke-width="8"/>
        <rect x="705" y="460" width="285" height="90" rx="16" stroke="${tertiary}" stroke-width="8"/>
        <path d="M850 460 V390 C850 358 876 332 908 332 H1028" stroke="${primary}" stroke-width="8"/>
      </g>`;
  }

  if (kind === 'debt') {
    return `
      <g opacity=".92" ${common}>
        <path d="M735 370 H1025 M735 505 H1025 M735 640 H1025 M735 775 H1025" stroke="${primary}" stroke-width="8"/>
        <path d="M745 335 C815 430 800 520 867 608 C918 675 930 748 900 850" stroke="${secondary}" stroke-width="15"/>
        <path d="M1010 335 C955 420 980 508 925 592 C884 655 855 735 875 850" stroke="${tertiary}" stroke-width="15"/>
      </g>`;
  }

  if (kind === 'layers') {
    return `
      <g opacity=".92" ${common}>
        <path d="M705 730 L880 630 L1055 730 L880 830 Z" stroke="${primary}" stroke-width="8"/>
        <path d="M705 610 L880 510 L1055 610 L880 710 Z" stroke="${secondary}" stroke-width="8"/>
        <path d="M705 490 L880 390 L1055 490 L880 590 Z" stroke="${tertiary}" stroke-width="8"/>
      </g>`;
  }

  if (kind === 'learning') {
    return `
      <g opacity=".92" ${common}>
        <path d="M715 805 C780 675 830 615 910 570 C982 529 1038 468 1062 350" stroke="${primary}" stroke-width="12"/>
        <circle cx="760" cy="765" r="38" stroke="${secondary}" stroke-width="8"/>
        <circle cx="880" cy="600" r="38" stroke="${tertiary}" stroke-width="8"/>
        <circle cx="1038" cy="395" r="38" stroke="${secondary}" stroke-width="8"/>
        <path d="M930 350 H1045 V465" stroke="${primary}" stroke-width="8"/>
      </g>`;
  }

  if (kind === 'interfaces') {
    return `
      <g opacity=".92" ${common}>
        <circle cx="875" cy="595" r="76" stroke="${primary}" stroke-width="9"/>
        <path d="M875 330 V515 M875 675 V880 M635 595 H799 M951 595 H1115" stroke="${primary}" stroke-width="8"/>
        <rect x="800" y="270" width="150" height="90" rx="15" stroke="${secondary}" stroke-width="8"/>
        <rect x="800" y="840" width="150" height="90" rx="15" stroke="${secondary}" stroke-width="8"/>
        <rect x="560" y="550" width="150" height="90" rx="15" stroke="${tertiary}" stroke-width="8"/>
        <rect x="1040" y="550" width="150" height="90" rx="15" stroke="${tertiary}" stroke-width="8"/>
      </g>`;
  }

  if (kind === 'ai-api') {
    return `
      <g opacity=".92" ${common}>
        <path d="M710 700 C770 570 832 515 925 500 C1015 486 1052 422 1065 335" stroke="${primary}" stroke-width="10"/>
        <path d="M735 405 H870 M735 490 H840 M735 575 H810" stroke="${secondary}" stroke-width="8"/>
        <circle cx="925" cy="500" r="75" stroke="${tertiary}" stroke-width="8"/>
        <path d="M890 500 H960 M925 465 V535" stroke="${tertiary}" stroke-width="8"/>
        <path d="M705 815 H1055" stroke="${primary}" stroke-width="8"/>
      </g>`;
  }

  if (kind === 'funnel') {
    return `
      <g opacity=".92" ${common}>
        <path d="M700 345 H1085 L990 505 H795 Z" stroke="${primary}" stroke-width="8"/>
        <path d="M795 545 H990 L940 700 H845 Z" stroke="${secondary}" stroke-width="8"/>
        <path d="M845 740 H940 L915 865 H870 Z" stroke="${tertiary}" stroke-width="8"/>
        <circle cx="735" cy="415" r="12" fill="${secondary}" stroke="none"/>
        <circle cx="820" cy="415" r="12" fill="${secondary}" stroke="none"/>
        <circle cx="905" cy="415" r="12" fill="${secondary}" stroke="none"/>
      </g>`;
  }

  if (kind === 'governance') {
    return `
      <g opacity=".92" ${common}>
        <path d="M725 390 H1035 V820 H725 Z" stroke="${primary}" stroke-width="8"/>
        <path d="M780 510 L835 565 L970 430" stroke="${secondary}" stroke-width="12"/>
        <path d="M785 660 H975 M785 735 H915" stroke="${tertiary}" stroke-width="8"/>
        <circle cx="1040" cy="830" r="62" stroke="${secondary}" stroke-width="8"/>
        <path d="M1010 830 H1070" stroke="${secondary}" stroke-width="8"/>
      </g>`;
  }

  if (kind === 'evidence') {
    return `
      <g opacity=".92" ${common}>
        <rect x="710" y="345" width="350" height="455" rx="18" stroke="${primary}" stroke-width="8"/>
        <path d="M770 455 H990 M770 545 H960 M770 635 H930" stroke="${secondary}" stroke-width="8"/>
        <path d="M810 795 L735 885 M810 795 L885 885" stroke="${tertiary}" stroke-width="8"/>
        <circle cx="1008" cy="783" r="48" stroke="${tertiary}" stroke-width="8"/>
      </g>`;
  }

  return `
    <g opacity=".92" ${common}>
      <path d="M725 780 C775 635 855 535 1015 440" stroke="${primary}" stroke-width="12"/>
      <rect x="720" y="340" width="310" height="120" rx="18" stroke="${secondary}" stroke-width="8"/>
      <path d="M785 610 H1030 M785 700 H970" stroke="${tertiary}" stroke-width="8"/>
      <path d="M1015 440 L1045 350 M1015 440 L1100 475" stroke="${primary}" stroke-width="8"/>
    </g>`;
}

function makeSvg(post) {
  const palette = accents[(post.number - 1) % accents.length];
  const [primary, secondary, tertiary] = palette;
  const titleMaxChars = post.variant === 'quote' ? 16 : 13;
  const titleLines = wrapText(post.title, titleMaxChars);
  const subtitleLines = wrapText(post.subtitle, 31);
  const longestTitleLine = Math.max(...titleLines.map((line) => line.length));
  const titleSize =
    post.variant === 'quote'
      ? 58
      : longestTitleLine > 15
        ? 58
        : titleLines.length > 5
          ? 58
          : titleLines.length > 3
            ? 64
            : 74;
  const titleStart = post.variant === 'quote' ? 398 : 416;
  const titleBottom = titleStart + (titleLines.length - 1) * titleSize * 1.04;
  const ruleY = Math.max(710, titleBottom + 86);
  const subtitleY = ruleY + 76;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${brand.paper}"/>
      <stop offset=".62" stop-color="${brand.cloud}"/>
      <stop offset="1" stop-color="#eef6f8"/>
    </linearGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#24313a" stroke-opacity=".055" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#paper)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <path d="M-90 1020 C210 820 380 945 690 770 C965 615 990 345 1285 235" fill="none" stroke="${primary}" stroke-width="140" stroke-opacity=".08"/>
  <path d="M-80 1045 C230 840 392 980 715 785 C980 625 1010 365 1285 255" fill="none" stroke="${secondary}" stroke-width="46" stroke-opacity=".14"/>
  ${motifSvg(post.motif, palette)}
  <rect x="84" y="84" width="1032" height="1032" rx="34" fill="none" stroke="${brand.graphite}" stroke-opacity=".12" stroke-width="2"/>
  <rect x="84" y="84" width="14" height="1032" fill="${primary}"/>
  <circle cx="150" cy="150" r="28" fill="${secondary}"/>
  <circle cx="220" cy="150" r="14" fill="${tertiary}"/>
  <text x="142" y="276" font-family="Inter, Arial, sans-serif" font-size="31" font-weight="800" fill="${primary}" letter-spacing="0">BEYOND API ECONOMY</text>
  <text x="142" y="324" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="650" fill="${brand.gray}" letter-spacing="0">Capability thinking for API and AI strategy</text>
  <g font-family="Inter, Arial, sans-serif" font-weight="820" fill="#111820" letter-spacing="0">
    ${textLines(titleLines, 142, titleStart, titleSize, titleSize * 1.04)}
  </g>
  <path d="M142 ${ruleY} H522" stroke="${secondary}" stroke-width="8" stroke-linecap="round"/>
  <g font-family="Inter, Arial, sans-serif" font-weight="560" fill="#25313a" letter-spacing="0">
    ${textLines(subtitleLines, 142, subtitleY, 35, 48)}
  </g>
  <text x="142" y="1042" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="${primary}">beyondapieconomy.com</text>
  <text x="995" y="1042" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="23" font-weight="700" fill="#5c6870">Beyond API Economy - Marjukka Niinioja</text>
</svg>`;
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const md = await fs.readFile(sourcePath, 'utf8');
  const matches = [...md.matchAll(/^## Post (\d+) --- (.+)$/gm)];

  if (matches.length === 0) {
    throw new Error(`No posts found in ${sourcePath}`);
  }

  const posts = matches.map((match, index) => ({
    number: Number(match[1]),
    title: match[2].trim(),
    subtitle: subtitles[index],
    motif: motifs[index],
  }));

  for (const post of posts) {
    const fileBase = `${String(post.number).padStart(2, '0')}-${slugify(post.title)}`;
    const svg = makeSvg(post);
    const svgPath = path.join(outDir, `${fileBase}.svg`);
    const pngPath = path.join(outDir, `${fileBase}.png`);

    await fs.writeFile(svgPath, svg, 'utf8');
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
    console.log(pngPath);
  }

  const quoteVariant = {
    number: 1,
    title: 'A system is something an organization has. A capability is something it can do.',
    subtitle: 'Your customer portal is not a capability.',
    motif: 'none',
    variant: 'quote',
  };
  const quoteFileBase = '01-quote-system-vs-capability';
  const quoteSvg = makeSvg(quoteVariant);
  const quoteSvgPath = path.join(outDir, `${quoteFileBase}.svg`);
  const quotePngPath = path.join(outDir, `${quoteFileBase}.png`);

  await fs.writeFile(quoteSvgPath, quoteSvg, 'utf8');
  await sharp(Buffer.from(quoteSvg)).png({ compressionLevel: 9 }).toFile(quotePngPath);
  console.log(quotePngPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
