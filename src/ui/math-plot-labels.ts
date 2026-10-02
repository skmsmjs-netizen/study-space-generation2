import katex from 'katex';

const svgNs = 'http://www.w3.org/2000/svg';
const htmlNs = 'http://www.w3.org/1999/xhtml';
const markup = new Map<string, string>();
export type LabelBox = { x: number; y: number; width: number; height: number };
export type LabelLine = { start: number[]; end: number[] };

/** Small trusted graph symbols use the same TeX engine as the equation. */
export function svgMathLabel(parent: SVGElement, tex: string, size = 13) {
  const node = document.createElementNS(svgNs, 'foreignObject');
  node.classList.add('math-graph-symbol');
  node.setAttribute('data-tex', tex);
  const content = document.createElementNS(htmlNs, 'div');
  content.classList.add('math-graph-symbol-content');
  content.style.fontSize = `${size}px`;
  let html = markup.get(tex);
  if (!html) {
    html = katex.renderToString(tex, { displayMode: false, trust: false, throwOnError: true });
    if (markup.size >= 256) markup.clear();
    markup.set(tex, html);
  }
  content.innerHTML = html;
  node.appendChild(content);
  parent.appendChild(node);
  return node;
}

export function setLabelBox(node: SVGForeignObjectElement, box: LabelBox, color: string) {
  for (const [key, value] of Object.entries(box)) node.setAttribute(key, String(value));
  (node.firstElementChild as HTMLElement).style.color = color;
}

function overlaps(a: LabelBox, b: LabelBox, gap = 3) {
  return (
    a.x < b.x + b.width + gap &&
    a.x + a.width + gap > b.x &&
    a.y < b.y + b.height + gap &&
    a.y + a.height + gap > b.y
  );
}

function crosses(box: LabelBox, line: LabelLine) {
  // Liang–Barsky clipping: test the shaft against the whole label rectangle.
  const dx = line.end[0] - line.start[0],
    dy = line.end[1] - line.start[1];
  let low = 0,
    high = 1;
  for (const [p, q] of [
    [-dx, line.start[0] - box.x],
    [dx, box.x + box.width - line.start[0]],
    [-dy, line.start[1] - box.y],
    [dy, box.y + box.height - line.start[1]],
  ]) {
    if (Math.abs(p) < 1e-10) {
      if (q < 0) return false;
    } else {
      const r = q / p;
      if (p < 0) low = Math.max(low, r);
      else high = Math.min(high, r);
    }
  }
  return low <= high;
}

/** Offset symbols from shafts, keep them inside the viewport and clear of labels. */
export function placeMathLabel(
  anchor: number[],
  direction: number[],
  width: number,
  height: number,
  occupied: LabelBox[],
  lines: LabelLine[],
  labelWidth = 24,
  labelHeight = 24,
  alongOffsets = [0, -18, 18, -36, 36],
) {
  const length = Math.hypot(...direction) || 1;
  const u = direction.map((v) => v / length),
    perpendicular = [-u[1], u[0]];
  let best: LabelBox = { x: 0, y: 0, width: labelWidth, height: labelHeight },
    score = Infinity;
  for (const distance of [20, -20, 30, -30, 40, -40]) {
    for (const along of alongOffsets) {
      const x = anchor[0] + perpendicular[0] * distance + u[0] * along - labelWidth / 2;
      const y = anchor[1] + perpendicular[1] * distance + u[1] * along - labelHeight / 2;
      const box = {
        x: Math.max(6, Math.min(width - labelWidth - 6, x)),
        y: Math.max(6, Math.min(height - labelHeight - 6, y)),
        width: labelWidth,
        height: labelHeight,
      };
      const value =
        occupied.filter((other) => overlaps(box, other)).length * 1000 +
        lines.filter((line) =>
          crosses(
            { x: box.x - 3, y: box.y - 3, width: box.width + 6, height: box.height + 6 },
            line,
          ),
        ).length *
          10000 +
        Math.abs(box.x - x) +
        Math.abs(box.y - y) +
        Math.abs(distance) * 0.01 +
        Math.abs(along) * 0.01;
      if (value < score) {
        best = box;
        score = value;
      }
    }
  }
  occupied.push(best);
  return best;
}

/** Public SVG positions drive HTML TeX labels; avoids WebKit foreignObject paint drift. */
export function plotlyMathLabels(host: HTMLElement) {
  const layer = document.createElement('div');
  layer.className = 'math-plot-symbols';
  const labels = new Map<SVGTextElement, { label: HTMLDivElement; opacity: string }>();
  const refresh = () => {
    if (!layer.isConnected) host.appendChild(layer);
    const bounds = host.getBoundingClientRect();
    for (const [text, entry] of labels) {
      if (!host.contains(text)) {
        entry.label.remove();
        labels.delete(text);
      }
    }
    for (const text of host.querySelectorAll<SVGTextElement>(
      'text.annotation-text, text.xtitle, text.ytitle',
    )) {
      const raw = text.textContent?.trim() ?? '';
      if (!/^(?:[xyzuvntTNB]|[xyz]=-?\d+\.\d{2})$/.test(raw)) continue;
      const tex = /^[TNB]$/.test(raw) ? `\\mathbf{${raw}}` : raw;
      let entry = labels.get(text);
      if (!entry) {
        const label = document.createElement('div');
        label.className = 'math-graph-symbol';
        const content = document.createElement('div');
        content.className = 'math-graph-symbol-content';
        label.appendChild(content);
        entry = { label, opacity: text.style.opacity };
        labels.set(text, entry);
        layer.appendChild(label);
      }
      const { label } = entry;
      const content = label.firstElementChild as HTMLElement;
      const style = getComputedStyle(text);
      if (label.dataset.tex !== tex) {
        label.dataset.tex = tex;
        content.innerHTML = katex.renderToString(tex, {
          displayMode: false,
          trust: false,
          throwOnError: true,
        });
      }
      // BoundingClientRect includes all Plotly transforms and CSS scaling.
      const box = text.getBoundingClientRect();
      label.style.left = `${box.left + box.width / 2 - bounds.left - host.clientLeft}px`;
      label.style.top = `${box.top + box.height / 2 - bounds.top - host.clientTop}px`;
      label.style.visibility = box.width > 0 && box.height > 0 ? 'visible' : 'hidden';
      content.style.fontSize = style.fontSize;
      content.style.color = style.fill;
      if (text.style.opacity !== '0') text.style.opacity = '0';
    }
  };
  let frame = 0;
  const schedule = () => {
    if (!frame)
      frame = requestAnimationFrame(() => {
        frame = 0;
        refresh();
      });
  };
  const observer = new MutationObserver((changes) => {
    if (changes.some((change) => !layer.contains(change.target))) schedule();
  });
  observer.observe(host, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['transform', 'style', 'x', 'y'],
  });
  const resize = new ResizeObserver(schedule);
  resize.observe(host);
  refresh();
  return () => {
    observer.disconnect();
    resize.disconnect();
    cancelAnimationFrame(frame);
    for (const [text, entry] of labels) text.style.opacity = entry.opacity;
    layer.remove();
  };
}
