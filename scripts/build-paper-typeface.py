"""Rebuild complete licensed paper fonts with 95% native horizontal metrics.

Python 3.10+, fonttools 4.66.1 and brotli 1.2.0. Runtime builds consume the
saved WOFF2 files, so Python is only needed when the approved font changes.
"""
from pathlib import Path
import hashlib
import json
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parent.parent
SCALE = 0.95
FAMILY = "ManSeekSong Paper"
OUTPUT = ROOT / "src/ui/fonts/paper"
OUTPUT.mkdir(parents=True, exist_ok=True)


def positions(font, modify=False):
    values = []
    if "GPOS" not in font:
        return values
    for lookup in font["GPOS"].table.LookupList.Lookup:
        # These pinned source fonts use pair kerning only. A changed source
        # needs an explicit review rather than quietly retaining 100% offsets.
        if lookup.LookupType != 2:
            raise ValueError("Unsupported GPOS lookup in new source")
        for subtable in lookup.SubTable:
            if subtable.Format != 1:
                raise ValueError("Unsupported GPOS pair format in new source")
            for pair_set in subtable.PairSet:
                for pair in pair_set.PairValueRecord:
                    for record in (pair.Value1, pair.Value2):
                        if record is None:
                            continue
                        for attr in ("XPlaDevice", "XAdvDevice"):
                            if getattr(record, attr, None) is not None:
                                raise ValueError("New source has horizontal device offsets")
                        for attr in ("XPlacement", "XAdvance"):
                            if hasattr(record, attr):
                                if modify:
                                    setattr(record, attr, round(getattr(record, attr) * SCALE))
                                values.append(getattr(record, attr))
    return values


def build(style, weight):
    source = ROOT / f"assets/paper/NanumMyeongjo-{style}.ttf"
    target = OUTPUT / f"manseek-paper-{style.lower()}-95.woff2"
    original = TTFont(source)
    font = TTFont(source)
    glyph_set = font.getGlyphSet()
    outlines = {}
    for name in font.getGlyphOrder():
        recording = DecomposingRecordingPen(glyph_set)
        glyph_set[name].draw(recording)
        pen = TTGlyphPen(None)
        recording.replay(TransformPen(pen, (SCALE, 0, 0, 1, 0, 0)))
        outlines[name] = pen.glyph()
    for name, glyph in outlines.items():
        font["glyf"][name] = glyph
        advance, bearing = font["hmtx"].metrics[name]
        font["hmtx"].metrics[name] = (round(advance * SCALE), round(bearing * SCALE))
    positions(font, modify=True)
    font["OS/2"].xAvgCharWidth = round(font["OS/2"].xAvgCharWidth * SCALE)
    # Remove ALL localized reserved family names, not only the English records.
    names = {1: FAMILY, 2: style, 3: f"ManSeekSong-Paper-{style}-95-v1",
             4: f"{FAMILY} {style}", 6: f"ManSeekSongPaper-{style}95",
             16: FAMILY, 17: style}
    font["name"].names = [record for record in font["name"].names if record.nameID not in names]
    for name_id, value in names.items():
        for platform, encoding, language in ((3, 1, 0x409), (1, 0, 0)):
            font["name"].setName(value, name_id, platform, encoding, language)
    for table in ("fpgm", "prep", "cvt ", "hdmx", "LTSH", "VDMX", "DSIG"):
        if table in font:
            del font[table]
    font.flavor = "woff2"
    font.save(target)
    result = TTFont(target)
    assert original.getBestCmap() == result.getBestCmap()
    assert original.getGlyphOrder() == result.getGlyphOrder()
    for name, (advance, bearing) in original["hmtx"].metrics.items():
        assert result["hmtx"].metrics[name] == (round(advance * SCALE), round(bearing * SCALE))
        before = original["glyf"][name].getCoordinates(original["glyf"])[0]
        after = result["glyf"][name].getCoordinates(result["glyf"])[0]
        assert len(before) == len(after)
        # TrueType serializes integer points; vertical geometry stays exact.
        assert all(y == new_y and abs(x * SCALE - new_x) <= 0.51
                   for (x, y), (new_x, new_y) in zip(before, after))
    assert positions(result) == [round(value * SCALE) for value in positions(original)]
    assert result["OS/2"].usWeightClass == weight
    for table in ("hhea", "OS/2"):
        for attr in ("ascent", "descent", "lineGap", "sTypoAscender", "sTypoDescender", "sTypoLineGap"):
            if hasattr(original[table], attr):
                assert getattr(original[table], attr) == getattr(result[table], attr)
    return {"style": style, "weight": weight, "source": str(source.relative_to(ROOT)),
            "target": str(target.relative_to(ROOT)), "mappedCharacters": len(result.getBestCmap()),
            "glyphs": len(result.getGlyphOrder()), "bytes": target.stat().st_size,
            "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
            "targetSha256": hashlib.sha256(target.read_bytes()).hexdigest(),
            "fullCoveragePreserved": True, "allOutlinesAndAdvancesVerified": True,
            "verticalMetricsPreserved": True, "kerningVerified": True}


manifest = {"family": FAMILY, "sourceFamily": "Nanum Myeongjo", "glyphScaleX": SCALE,
            "nativeHorizontalMetrics": True, "cssTransformRequired": False,
            "license": "public/fonts/paper/OFL.txt",
            "sources": "https://github.com/google/fonts/tree/main/ofl/nanummyeongjo",
            "faces": [build(style, weight) for style, weight in (("Regular", 400), ("Bold", 700), ("ExtraBold", 800))]}
(ROOT / "assets/paper/font-width-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(json.dumps(manifest))
