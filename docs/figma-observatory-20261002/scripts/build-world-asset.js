// Async use_figma body. Preserve this entry point; never re-import the whole scene as vectors.
// INPUT = {pageId?:'7:70', assetId?, part?, svg?, svgSha256, source, sourceSha256,
//          mockup:{imageHash,width:960,height:400,scope:'whole-scene',fileKey?}}
// imageHash must already be in this file through upload_assets. PNG bytes/URLs are preparation
// material only: upload_assets is the supported upload path, not createImage/createImageAsync.
// Legacy part/svg-only calls fail before mutations. Source SVGs remain in local source manifests.
const mockup = INPUT.mockup || INPUT;
if (INPUT.representation && INPUT.representation !== 'image-mockup') {
  throw new Error('IMAGE_MOCKUP_REQUIRED: native SVG scene imports are disabled in this generator.');
}
if (typeof mockup.imageHash !== 'string' || !mockup.imageHash.trim()) {
  throw new Error('IMAGE_UPLOAD_REQUIRED: capture the complete 0 -100 960 400 scene, upload PNG with upload_assets, then pass mockup.imageHash. PNG bytes, URLs and legacy part/svg inputs do not trigger an SVG fallback.');
}
if (mockup.scope !== 'whole-scene' || mockup.width !== 960 || mockup.height !== 400) {
  throw new Error('WHOLE_SCENE_REQUIRED: use scope whole-scene and the uncropped 960x400 logical bounds, including the original sky. A per-part image cannot replace the whole widget.');
}
if (mockup.fileKey && figma.fileKey && mockup.fileKey !== figma.fileKey) {
  throw new Error('IMAGE_FILE_MISMATCH: upload or reuse the image in the current Figma file.');
}
const image = figma.getImageByHash(mockup.imageHash);
if (!image) throw new Error('IMAGE_HASH_NOT_FOUND: upload_assets must finish in this file before generation.');
const imageSize = await image.getSizeAsync();
if (!(imageSize.width > 0 && imageSize.height > 0) || Math.abs(imageSize.width / imageSize.height - 2.4) > 0.0024) {
  throw new Error('IMAGE_BOUNDS_MISMATCH: the whole scene must keep its 2.4:1 aspect ratio without cropping.');
}
const page = await figma.getNodeByIdAsync(INPUT.pageId || '7:70');
if (!page || page.type !== 'PAGE') throw new Error('Component page missing.');
await figma.setCurrentPageAsync(page);
const name = 'Observatory/v2/__Asset/OriginalObservatory';
function owningPage(node) { let current = node; while (current && current.type !== 'PAGE') current = current.parent; return current; }
let asset = INPUT.assetId ? await figma.getNodeByIdAsync(INPUT.assetId) : page.findOne(n => n.type === 'COMPONENT' && n.name === name);
if (INPUT.assetId && (!asset || asset.type !== 'COMPONENT' || asset.name !== name || owningPage(asset)?.id !== page.id)) {
  throw new Error('ASSET_ID_MISMATCH: read back the original component before updating the input.');
}
const createdNodeIds = [];
if (asset) {
  // The compact live master uses its own IMAGE fill (zero descendants); older safe
  // imports use one full-size IMAGE rectangle. Reuse both without recreating the master.
  const direct = asset.children.length === 0;
  const art = direct ? asset : asset.children[0];
  if (asset.children.length > 1 || (!direct && art.type !== 'RECTANGLE') || !Array.isArray(art.fills) || art.fills.length !== 1 || art.fills[0].type !== 'IMAGE' || art.fills[0].imageHash !== mockup.imageHash || !['FIT', 'FILL'].includes(art.fills[0].scaleMode)) {
    throw new Error('RASTER_MIGRATION_REQUIRED: preserve the existing component ID and its instances; use the separately reviewed raster replacement. This generator never deletes or silently overlays existing scene layers.');
  }
  if (asset.width !== 960 || asset.height !== 400 || art.width !== 960 || art.height !== 400 || (!direct && (art.x !== 0 || art.y !== 0))) {
    throw new Error('EXISTING_BOUNDS_MISMATCH: read back and repair the existing mockup without recreating its component.');
  }
} else {
  if (!INPUT.source || !/^[a-f0-9]{64}$/i.test(INPUT.sourceSha256 || '') || !/^[a-f0-9]{64}$/i.test(INPUT.svgSha256 || '')) {
    throw new Error('SOURCE_CONTRACT_REQUIRED: a new world mockup needs its source file, source SHA-256 and preserved local SVG SHA-256.');
  }
  asset = figma.createComponent();
  createdNodeIds.push(asset.id);
  asset.name = name;
  asset.resize(960, 400);
  asset.fills = [];
  asset.clipsContent = false;
  asset.x = Math.max(5000, ...page.children.filter(n => n.id !== asset.id).map(n => n.x + n.width + 200));
  asset.y = 100;
  page.appendChild(asset);
  asset.description = 'Complete 0 -100 960 400 scene as one image mockup. Original SVG, source geometry and runtime remain in the app/source manifests. No crop or inferred learning result.\nSource: ' + INPUT.source + '\nSource SHA-256: ' + INPUT.sourceSha256 + '\nSVG SHA-256: ' + INPUT.svgSha256;
  const art = figma.createRectangle();
  createdNodeIds.push(art.id);
  art.name = 'Original whole scene / image mockup';
  art.resize(960, 400);
  art.fills = [{ type: 'IMAGE', scaleMode: 'FIT', imageHash: mockup.imageHash }];
  art.strokes = [];
  asset.appendChild(art);
  art.x = art.y = 0;
}
return {createdNodeIds, mutatedNodeIds:[], assetId:asset.id, partId:asset.children.length===0?asset.id:asset.children[0].id, part:INPUT.part ?? null, bounds:{width:asset.width,height:asset.height}, children:asset.children.map(n=>({id:n.id,name:n.name})), representation:'image-mockup', imageHash:mockup.imageHash, svgSha256:INPUT.svgSha256 ?? null, sourceSvgPreservedLocally:true, webAppChanged:false, reused:createdNodeIds.length===0};
