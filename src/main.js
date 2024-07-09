import Handlebars from 'handlebars';
import './style.css'
import * as Components from './src/components';

Object.entries(Components).forEach(([ name, component ]) => {
    Handlebars.registerPartial(name, component);
});

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Navigation</h1>
    <a href="./src/pages/login/login.html">Login page</a>
    <a href="./src/pages/registration/registration.html">Registration page</a>
  </div>
`
