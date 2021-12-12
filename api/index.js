/**
 * Example someHost is set up to take in a JSON request
 * Replace url with the host you wish to send requests to
 * @param {string} someHost the host to send the request to
 * @param {string} url the URL to send the request to
 */
const base = "https://swapi.dev/api/"
const url  = "https://swapi.dev/api/"
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
}



/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (response.status == 200) {
    if (contentType.includes("application/json")) {
      return JSON.stringify(await response.json())
    }
    else if (contentType.includes("application/text")) {
      return response.text()
    }
    else if (contentType.includes("text/html")) {
      return response.text()
    }
    else {
      return response.text()
    }
  }
  else {
    return response.status
  }
}

async function handleRequest(data) {
  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "access-control-allow-origin": "*",
    },
  }
  var path = data.url.replace(/^https:\/\/.*?\//gi, "/");
  console.log(data.url)
  console.log(path)
  const swapi = "https://swapi.dev/api"
  const url = swapi + path
  const response = await fetch(url, init)
  const results = await gatherResponse(response)
  return new Response(results, init)
}

addEventListener("fetch", event => {
  const data = event.request
  return event.respondWith(handleRequest(data))
})
