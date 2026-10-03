import {spawnSync} from 'node:child_process';
// pnpm's PATH can select macOS/Xcode Python instead of the configured project Python.
const selected=spawnSync('pyenv',['which','python3'],{encoding:'utf8'});
const python=process.env.GAMESITE_PY || (selected.status===0?selected.stdout.trim():'python3');
const result=spawnSync(process.execPath,['scripts/check-analytics-env.mjs'],{stdio:'inherit',env:{...process.env,GAMESITE_PY:python}});
process.exit(result.status??1);
