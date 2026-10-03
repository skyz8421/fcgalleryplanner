#!/usr/bin/env python3
"""GSC fails closed; unavailable official sources preserve their last valid hash and report a gap."""
import sys
sys.dont_write_bytecode=True
from pathlib import Path
import json,datetime,hashlib,re,subprocess
ROOT=Path(__file__).resolve().parents[1]
KIT=ROOT.parents[1]/'template/gamesite-kit/py'
sys.path.insert(0,str(KIT))
from _gapi import call
CONFIG=json.loads((ROOT/'data/watch-config.json').read_text())
now=datetime.datetime.now(datetime.timezone.utc);today=now.date();age=(today-datetime.date.fromisoformat(CONFIG['launched'])).days
scope='https://www.googleapis.com/auth/webmasters.readonly'
endpoint='https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3Afcgallery.wiki/searchAnalytics/query'
def query(dimensions):
 code,value=call('POST',endpoint,scope,{'startDate':str(today-datetime.timedelta(days=7)),'endDate':str(today),'dimensions':dimensions,'dataState':'all','rowLimit':25000})
 if code!=200 or not isinstance(value,dict):raise SystemExit('GSC failed: HTTP '+str(code))
 return value.get('rows',[])
queries=query(['query']);pages=query(['page']);dates=query(['date'])
previousPath=ROOT/'data/watch-state.json';previous=json.loads(previousPath.read_text()) if previousPath.exists() else {}
raw=ROOT.parent/'futgg/_raw/daily'/str(today);raw.mkdir(parents=True,exist_ok=True)
from bs4 import BeautifulSoup
sources={};changed=[];gaps=[]
for label,url in CONFIG['official'].items():
 proc=subprocess.run(['/usr/bin/curl','--http1.1','-L','-sS','--retry','1','--max-time','15','-w','\n%{http_code}',url],capture_output=True,text=True)
 body,_,status=proc.stdout.rpartition('\n')
 if proc.returncode or status!='200' or len(body)<500:
  gaps.append('Official source failed: '+label+' HTTP '+status)
  if label in previous.get('official',{}):sources[label]=previous['official'][label]
  continue
 soup=BeautifulSoup(body,'html.parser')
 for tag in soup(['script','style','svg','nav','footer','header']):tag.decompose()
 main=soup.find('main') or soup.body or soup;text=re.sub(r'\s+',' ',main.get_text(' ',strip=True))
 if len(text)<300:
  gaps.append('Official source has no readable content: '+label)
  if label in previous.get('official',{}):sources[label]=previous['official'][label]
  continue
 digest=hashlib.sha256(text.encode()).hexdigest();sources[label]={'url':url,'sha256':digest}
 (raw/(label+'.txt')).write_text(text)
 if previous.get('official',{}).get(label,{}).get('sha256') not in (None,digest):changed.append(label)
impressions=sum(r['impressions'] for r in dates);clicks=sum(r['clicks'] for r in dates)
qualified=[r for r in queries if r['impressions']>=25]
new=[r for r in qualified if r['keys'][0] not in previous.get('handledQueries',[])]
ads=bool(re.search(r"key:\s*['\"][0-9a-f]{32}['\"]",(ROOT/'data/ads.ts').read_text()))
value=CONFIG['valueDefaults'];healthy=impressions>=value['retain7dImpressions'] or clicks>=value['retain7dClicks']
# Sparse new-site data and missing data never mark the new site low-value.
weak=previous.get('weakRuns',0)+1 if age>=value['recentDays'] and ads and pages and not healthy else 0
weekly=weak>=value['lowWindows'];signals=[]
if gaps:signals.append('official-collection-gap')
if new:signals.append('gsc-qualified-query')
if changed:signals.append('official-content-change')
if age>=2 and not previous.get('checked48h'):signals.append('48h-review')
if CONFIG['adDecisionDay']<=age<=CONFIG['adDecisionDay']+1 and not ads:signals.append('adsterra-window')
lastCommunity=previous.get('lastCommunityAt');communityDue=not lastCommunity or (today-datetime.date.fromisoformat(lastCommunity)).days>=3
if communityDue:signals.append('community-sweep')
result={'at':now.isoformat(),'ageDays':age,'adsActive':ads,'gsc':{'days':7,'dataState':'all','pageRows':len(pages),'impressions':impressions,'clicks':clicks,'qualifiedQueries':qualified,'newQueries':new,'zeroRows':'no impressions yet' if not pages and age<=3 else ('unavailable or delayed; investigate' if not pages else None)},'official':sources,'changedOfficial':changed,'collectionGaps':gaps,'signals':signals,'requestedCadence':'weekly' if weekly else 'daily','defaults':value,'runtimeLimit':'Scheduler wakes the model before this script; pre-wake code filtering is not available in this host.'}
state={**previous,'lastCollectedAt':now.isoformat(),'official':sources,'weakRuns':weak,'requestedCadence':result['requestedCadence']}
for path,payload in [(previousPath,state),(raw/'signals.json',result)]:
 tmp=path.with_suffix('.tmp');tmp.write_text(json.dumps(payload,indent=2)+'\n');tmp.replace(path)
print(json.dumps(result,indent=2))
if not pages and age>=4:sys.exit(3)
