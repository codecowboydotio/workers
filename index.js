// We support the GET, POST, HEAD, and OPTIONS methods from any origin,
// and allow any header on requests. These headers must be present
// on all responses to all CORS preflight requests. In practice, this means
// all responses to OPTIONS requests.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
}

// The URL for the remote third party API you want to fetch from
// but does not implement CORS
const API_URL = "http://httpbin.org/post"

// The endpoint you want the CORS reverse proxy to be on
const PROXY_ENDPOINT = "/corsproxy/"

// The rest of this snippet for the demo page
function rawHtmlResponse(html) {
  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  })
}

const DEMO_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.3.1/css/foundation.min.css">
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet">
  <meta charset="utf-8">
  <title>Cloudflare Frontend</title>
</head>
  <body>
      <h3 class="text-center">Cloudflare fun</h3>
      <div class="container" id="unit-get">
        <div class="columns medium-4">
          <div class="card"> 
            <div class="card-section">
                <v-btn v-on:click="people">People</v-btn>
                <v-btn v-on:click="planets">Planets</v-btn>
            </div>
            <p v-if="called !== null">{{ called }}</p>
            <div class="card-section" v-for="(key, value) in results">
              <p>{{ key.name }}</p>
            </div>
          </div>
        </div>
      </div>
<div>
  <div class="text-center">
    <v-progress-circular
      :value="100"
      color="blue-grey"
    ></v-progress-circular>
  </div>
</div>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>

    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>
    <script>
      const url = "https://svk-swapi-api.sales-public.f5demos.com/"
      const backend = "https://swapi.scottvankalken.workers.dev/"
      const stuff = new Vue({
         el: '#unit-get',
         data: {
           results: [],
           called: null
         },
         methods: {
           people(){
             var be_url = backend + "people"
             console.log(be_url)
             axios.get(be_url)
              .then((response) => {
                console.log(response.data)
                this.results = response.data
                this.called = be_url
              })
           }, //end of people
           planets(){
             var be_url = backend + "planets"
             console.log(be_url)
             axios.get(be_url)
              .then((response) => {
                console.log(response.data)
                this.results = response.data
                this.called = be_url
              })
           } //end of planets
         } //end of methods
      });
    </script>
  </body>
</html>
`

async function handleRequest(request) {
  const url = new URL(request.url)
  let apiUrl = url.searchParams.get("apiurl")

  if (apiUrl == null) {
    apiUrl = API_URL
  }

  // Rewrite request to point to API url. This also makes the request mutable
  // so we can add the correct Origin header to make the API server think
  // that this request isn't cross-site.
  request = new Request(apiUrl, request)
  request.headers.set("Origin", new URL(apiUrl).origin)
  let response = await fetch(request)

  // Recreate the response so we can modify the headers
  response = new Response(response.body, response)

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", url.origin)

  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append("Vary", "Origin")

  return response
}

function handleOptions(request) {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ){
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    let respHeaders = {
      ...corsHeaders,
    // Allow all future content Request headers to go back to browser
    // such as Authorization (Bearer) or X-Client-Name-Version
      "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
    }

    return new Response(null, {
      headers: respHeaders,
    })
  }
  else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    })
  }
}

addEventListener("fetch", event => {
  const request = event.request
  const url = new URL(request.url)
    // Serve demo page
    event.respondWith(rawHtmlResponse(DEMO_PAGE))
})
