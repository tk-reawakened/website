// Run after building the product at revision 82c90b2. No legacy source is needed.
import { cp, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const productInput=process.env.TKR_PRODUCT_ROOT;
if(!productInput) throw new Error('Set TKR_PRODUCT_ROOT to the built product checkout at 82c90b2.');
const product=realpathSync(productInput);
const out=path.resolve('runner-fixture');
const scratch=await mkdtemp(path.join(tmpdir(),'tkr-game-'));
try {
  await rm(out,{recursive:true,force:true}); await mkdir(out,{recursive:true});
  for(const p of ['apps/browser/player.js','apps/browser/decode-worker.js','apps/browser/audio-worklet.js','apps/browser/bundled.json','apps/browser/precache.json','apps/service-worker.js','packages/runner-web/app/index.html','golden/closing/plan.json','media/fonts','media/cursors','media/soundfonts','stock/stock_menu','stock/stock_battle','stock/stock_rpg']) {
    await mkdir(path.dirname(path.join(out,p)),{recursive:true}); await cp(path.join(product,p),path.join(out,p),{recursive:true});
  }
  await mkdir(path.join(out,'notices'),{recursive:true});
  for (const [source, name] of [['LICENSE','product-MIT.txt'],['THIRD_PARTY_NOTICES','product-third-party.txt'],['packages/synth/node_modules/spessasynth_core/LICENSE','spessasynth-Apache-2.0.txt']]) {
    await cp(path.join(product,source),path.join(out,'notices',name));
  }
  const game=path.join(product,'docs/spec/examples/game');
  await cp(path.join(game,'Game/Example'),scratch,{recursive:true}); await mkdir(path.join(scratch,'Main'),{recursive:true}); await cp(path.join(game,'Main/example.gam'),path.join(scratch,'Main/example.gam'));
  await mkdir(path.join(out,'games'),{recursive:true});
  execFileSync('node',[path.join(product,'tools/make-package/run.mjs'),scratch,'--out',path.join(out,'games/authored-example.tpk'),'--title','Authored example village','--version','1'],{cwd:product,stdio:'inherit'});
} finally {await rm(scratch,{recursive:true,force:true});}
console.log(`Prepared ${out}`);
