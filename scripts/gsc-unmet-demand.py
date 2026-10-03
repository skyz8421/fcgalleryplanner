#!/usr/bin/env python3
# Shim: the logic lives in template/gamesite-kit/py (one copy for every site); this site's
# settings live in gamesite.config.json → gsc. Don't add logic here.
import os, sys
sys.dont_write_bytecode = True
SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(os.path.dirname(os.path.dirname(SITE)), "template", "gamesite-kit", "py")
sys.path.insert(0, KIT)
import gsc_unmet_demand  # noqa: E402
sys.exit(gsc_unmet_demand.main(SITE, sys.argv[1:]))
