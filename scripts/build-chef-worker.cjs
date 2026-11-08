const path=require('node:path');
const root=path.resolve('vendor/cyberchef');
const webpack=require(path.join(root,'node_modules/webpack'));
const common=require(path.join(root,'webpack.config.js'));
const config={...common,context:root,mode:'production',target:'webworker',entry:{ChefWorker:path.join(root,'src/core/ChefWorker.js')},output:{...common.output,path:path.join(root,'build/runtime'),filename:'[name].js'},resolve:{...common.resolve,alias:{...common.resolve?.alias,'./config/modules/OpModules.mjs':path.join(root,'src/core/config/modules/Default.mjs')}},plugins:[...common.plugins,new webpack.DefinePlugin({COMPILE_YEAR:JSON.stringify('2026'),COMPILE_TIME:JSON.stringify(''),COMPILE_MSG:JSON.stringify(''),PKG_VERSION:JSON.stringify('11.5.0')})]};
webpack(config,(err,stats)=>{if(err||stats.hasErrors()){console.error(err||stats.toString({all:false,errors:true}));process.exitCode=1;}else console.log(stats.toString({all:false,timings:true,assets:true}));});
