import {defineConfig} from 'vite';
export default defineConfig({worker:{format:'es'},server:{allowedHosts:['terminal.local']},preview:{allowedHosts:['terminal.local']}});
