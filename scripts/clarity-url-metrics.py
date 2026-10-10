#!/usr/bin/env python3
"""Read this site's export metrics with a pinned project identity; never log the credential."""
import argparse, base64, datetime, json, re, subprocess
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
from zoneinfo import ZoneInfo

args = argparse.ArgumentParser()
args.add_argument('--days', type=int, choices=[1, 2, 3], default=3)
args.add_argument('--reuse', type=Path)
args.add_argument('--validate-only', action='store_true')
opt = args.parse_args()
root = Path(__file__).resolve().parents[1]
cfg = json.loads((root / 'gamesite.config.json').read_text())
credential = Path.home() / '.claude/secrets/clarity-fcgalleryplanner.token'
token = credential.read_text().strip()
if not re.fullmatch(r'[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+', token):
    raise SystemExit('Invalid export credential format; no request made.')
payload = token.split('.')[1]
sub = str(json.loads(base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4))).get('sub'))
if sub != str(cfg.get('clarity', {}).get('sub')):
    raise SystemExit('Export credential does not match the pinned project; no request made.')
if opt.validate_only:
    print('PASS: project identity pinned; credential stays outside the repository.')
    raise SystemExit(0)
now = datetime.datetime.now(datetime.timezone.utc)
if opt.reuse:
    existing = json.loads(opt.reuse.read_text())
    if existing.get('project') != cfg['clarity']['project'] or existing.get('http') != 200:
        raise SystemExit('Saved response is not a verified response for this project.')
    data, read_at = existing['data'], existing['readAt']
else:
    url = f'https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays={opt.days}&dimension1=URL'
    # The header is sent through stdin, not process arguments or shell expansion.
    config = 'header = ' + json.dumps('Authorization: Bearer ' + token) + '\n'
    response = subprocess.run(['/usr/bin/curl', '--config', '-', '-sS', '--noproxy', '*', '--max-time', '30', '-w', '\n%{http_code}', url], input=config, capture_output=True, text=True)
    body, _, status = response.stdout.rpartition('\n')
    if response.returncode or status != '200':
        raise SystemExit(f'Clarity export failed HTTP{status}; no zero metrics inferred.')
    data, read_at = json.loads(body), now.isoformat()
for metric in data:
    for row in metric.get('information', []):
        key = next((k for k in ['Url', 'URL', 'url'] if k in row), None)
        if key:
            parts = urlsplit(row[key])
            if parts.hostname not in ['fcgallery.wiki', 'www.fcgallery.wiki']:
                raise SystemExit('Response contains another site; preserve old metrics and verify project ownership.')
            row[key] = urlunsplit((parts.scheme, parts.netloc, parts.path, '', ''))
folder = root / '_daily/routine' / now.astimezone(ZoneInfo('Asia/Shanghai')).date().isoformat()
folder.mkdir(parents=True, exist_ok=True)
output = {'readAt': read_at, 'project': cfg['clarity']['project'], 'http': 200, 'windowDays': opt.days, 'dimension': 'URL', 'data': data, 'credentialValidated': True, 'reusedResponse': bool(opt.reuse)}
(folder / 'clarity-url-review.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'http': 200, 'metrics': [m.get('metricName') for m in data], 'output': str(folder / 'clarity-url-review.json')}))
