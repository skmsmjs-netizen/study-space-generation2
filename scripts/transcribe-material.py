"""Local-only faster-whisper. No lecture audio leaves this computer."""
import json
import sys
from pathlib import Path
from faster_whisper import WhisperModel

model_path = Path(__file__).resolve().parents[1] / '.local' / 'study-transcription-model'
model = WhisperModel(str(model_path), device='cpu', compute_type='int8', local_files_only=True)
segments, info = model.transcribe(sys.argv[1], language='ko', beam_size=5, vad_filter=True)
rows = [dict(id=f'a{index+1}', start=float(row.start), end=float(row.end), text=row.text)
        for index, row in enumerate(segments) if row.text.strip()]
print(json.dumps(rows, ensure_ascii=True))
