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
      "cache-control": "max-age=0",
    },
  }
  var path = data.url.replace(/^https:\/\/.*?\//gi, "/");
  console.log(data.url)
  console.log(path)
  const swapi = "https://svk-swapi-api.sales-public.f5demos.com"
  const url = swapi + path
  console.log(url)
  const response = await fetch(url, init)
  const results = await gatherResponse(response)
  return new Response(results, init)
}

addEventListener("fetch", event => {
  const data = event.request
  return event.respondWith(handleRequest(data))
})
