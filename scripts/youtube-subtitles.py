"""Fetch public captions only. No cookies, browser profile, audio download, or proxies."""
import json
import re
import sys
from youtube_transcript_api import YouTubeTranscriptApi
from requests import Session

video_id = sys.argv[1]
if not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
    raise ValueError("Invalid video id")

class BoundedSession(Session):
    def request(self, *args, **kwargs):
        kwargs["timeout"] = (8, 15)
        return super().request(*args, **kwargs)

transcript = YouTubeTranscriptApi(http_client=BoundedSession()).fetch(video_id, languages=["ko", "en"])
def stamp(seconds):
    milliseconds = round(seconds * 1000)
    return f"{milliseconds // 3600000:02d}:{milliseconds // 60000 % 60:02d}:{milliseconds // 1000 % 60:02d}.{milliseconds % 1000:03d}"
text = "WEBVTT\n\n" + "\n\n".join(f"{stamp(s.start)} --> {stamp(s.start + s.duration)}\n{s.text}" for s in transcript)
if len(text) > 1000000:
    raise ValueError("Transcript too large")
print(json.dumps({"title": f"YouTube · {video_id}", "text": text}, ensure_ascii=False))
