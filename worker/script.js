!function(e){var n={};function t(s){if(n[s])return n[s].exports;var r=n[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,s){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:s})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(t.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(s,r,function(n){return e[n]}.bind(null,r));return s},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n){const t={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,HEAD,POST,OPTIONS","Access-Control-Max-Age":"86400"};addEventListener("fetch",e=>{const n=e.request;new URL(n.url).pathname.startsWith("/corsproxy/")?"OPTIONS"===n.method?e.respondWith(function(e){let n=e.headers;if(null!==n.get("Origin")&&null!==n.get("Access-Control-Request-Method")&&null!==n.get("Access-Control-Request-Headers")){let n={...t,"Access-Control-Allow-Headers":e.headers.get("Access-Control-Request-Headers")};return new Response(null,{headers:n})}return new Response(null,{headers:{Allow:"GET, HEAD, POST, OPTIONS"}})}(n)):"GET"===n.method||"HEAD"===n.method||"POST"===n.method?e.respondWith(async function(e){const n=new URL(e.url);let t=n.searchParams.get("apiurl");null==t&&(t="http://httpbin.org/post"),(e=new Request(t,e)).headers.set("Origin",new URL(t).origin);let s=await fetch(e);return s=new Response(s.body,s),s.headers.set("Access-Control-Allow-Origin",n.origin),s.headers.append("Vary","Origin"),s}(n)):e.respondWith(new Response(null,{status:405,statusText:"Method Not Allowed"})):e.respondWith(new Response('\n<!DOCTYPE html>\n<html lang="en">\n<head>\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.3.1/css/foundation.min.css">\n<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">\n<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">\n<link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet">\n  <meta charset="utf-8">\n  <title>Cloudflare API Demo</title>\n</head>\n\n  <body>\n      <h3 class="text-center">Cloudflare fun</h3>\n      <div class="container" id="unit-get">\n        <div class="columns medium-4">\n          <div class="card">\n            <div class="card-section" v-for="(value, key) in results">\n                <a v-bind:href="value">{{ value }}</a>\n                <v-btn @click="submit">{{ key }}</v-btn>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class="container" id="keyval-post">\n        <div class="columns medium-4">\n          <div class="card">\n          </div>\n        </div>\n      </div>\n<div>\n  <div class="text-center">\n    <v-progress-circular\n      :value="100"\n      color="blue-grey"\n    ></v-progress-circular>\n  </div>\n</div>\n<style scoped>\n.v-progress-circular {\n  margin: 1rem;\n}\n</style>\n\n    <script src="https://unpkg.com/axios/dist/axios.min.js"><\/script>\n    <script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"><\/script>\n    <script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"><\/script>\n    <script>\n      const url = "https://swapi.dev/api/"\n      const stuff = new Vue({\n         el: \'#unit-get\',\n         data: {\n           results: []\n         },\n         mounted() {\n           axios.get(url).then(response => {\n             this.results = response.data\n             console.log(response.data)\n           })\n         }, // end mounted\n         methods: {\n           submit(){\n             axios.get(url)\n              .then((response) => {\n                console.log(response.data["x.x.x.x"])\n                axios.delete(url, { \'"x.x.x.x"\': response.data["x.x.x.x"] })\n                  .then((response) => {\n                    console.log(response)\n                    axios.post(url, {\'x.x.x.x\': this.splitpercent})\n                    location.reload();\n                  })\n              })\n           } //end of submit\n         } //end of methods\n      });\n    <\/script>\n  </body>\n</html>\n',{headers:{"content-type":"text/html;charset=UTF-8"}}))})}]);