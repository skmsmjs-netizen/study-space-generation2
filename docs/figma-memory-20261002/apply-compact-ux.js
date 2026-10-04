/* use_figma async body. INPUT is a bounded batch from compact-ux-cards.json.
 * Keep managed card IDs, titles, source, existing design links and index cards.
 * Compare the current full body before writes; tolerate an identical completed retry.
 * Detailed source/reference arrays remain in compact-ux-cards.json and original docs.
 */
const page = figma.root.children.find(p => p.id === '73:68');
if (!page || page.name !== '20 전체 UX 경우·경로') throw Error('Wrong UX page');
await figma.setCurrentPageAsync(page);
const allCards = page.findAll(n => n.type === 'FRAME' && /^\[[^\]]+\] /.test(n.name) && !n.name.startsWith('[UXPATH '));
const byId = new Map(allCards.map(n => [n.name.match(/^\[([^\]]+)\]/)[1], n]));
function fnv(value) { let h = 2166136261; for (let i=0;i<value.length;i++) {h ^= value.charCodeAt(i); h = Math.imul(h,16777619);} return (h>>>0).toString(16).padStart(8,'0'); }
const plans = [];
for (const item of INPUT.items) {
  const card = byId.get(item.id);
  if (!card || card.id !== item.nodeId || card.name !== '['+item.id+'] '+item.title) throw Error('Card drift '+item.id);
  const bodyNodes = card.children.filter(n => n.type === 'TEXT' && /^조건·행동·결과 /.test(n.name));
  if (!bodyNodes.length) throw Error('Body missing '+item.id);
  const current = bodyNodes.map(n => n.characters).join('');
  if (fnv(current) !== item.beforeHash && current !== item.body) throw Error('Body drift '+item.id);
  for (const n of bodyNodes) for (const seg of n.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(seg.fontName);
  plans.push({item,card,bodyNodes});
}
const mutated = new Set(), removed = [], rows = [];
let linkCount=0;
for (const {item,card,bodyNodes} of plans) {
  const body = bodyNodes[0];
  body.characters=item.body;
  body.setRangeHyperlink(0,body.characters.length,null);
  const pattern = /\b(?:X-[a-f0-9]{12}|[RMOA]\d{2})\b/g;
  for (const match of body.characters.matchAll(pattern)) {
    const target = byId.get(match[0]);
    if (!target) continue;
    body.setRangeHyperlink(match.index,match.index+match[0].length,{type:'URL',value:'https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id='+target.id.replace(':','-')});
    linkCount++;
  }
  body.textAutoResize='HEIGHT';
  mutated.add(body.id); mutated.add(card.id); if(card.parent)mutated.add(card.parent.id);
  for (const n of bodyNodes.slice(1)) { removed.push(n.id); n.remove(); }
  rows.push({id:item.id,nodeId:card.id,bodyNodeId:body.id,bodyHash:fnv(body.characters),bodyLength:body.characters.length,width:card.width,height:card.height});
}
return {pageId:page.id,policy:'summary-reference-v1',createdNodeIds:[],mutatedNodeIds:[...mutated],removedNodeIds:removed,rows,linkCount,runtimeTested:false};
