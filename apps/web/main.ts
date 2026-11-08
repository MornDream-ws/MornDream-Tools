import {createApp,h,onMounted,onBeforeUnmount} from 'vue';
import './style.css';
import './engine.ts';
const Workspace={setup(){onMounted(()=>import('./app.js'));onBeforeUnmount(()=>window.dispatchEvent(new Event('morndream:dispose')));return ()=>h('div',[h('div',{id:'app'}),h('div',{id:'toast',role:'status'}),h('dialog',{id:'dialog'})]);}};
createApp(Workspace).mount('#root');
