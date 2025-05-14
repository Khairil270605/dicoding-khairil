import { router } from './router.js';
import './style.css';
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
