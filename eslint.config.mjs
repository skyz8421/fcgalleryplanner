import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([...nextVitals, ...nextTs, globalIgnores(['.next/**','out/**','next-env.d.ts','_raw/**','_review/**','_daily/routine/**']), {rules:{'@next/next/no-img-element':'off'}}]);
