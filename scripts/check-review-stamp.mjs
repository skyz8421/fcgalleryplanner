#!/usr/bin/env node
// Shim: the logic lives in template/gamesite-kit (one copy for every site); this site's settings
// live in gamesite.config.json. Don't add logic here — change the kit, or the config.
import { runGate } from "../../../template/gamesite-kit/bin/gate.mjs";
await runGate("review-stamp", new URL("..", import.meta.url));
