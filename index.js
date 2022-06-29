/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hh = String(today.getHours()).padStart(2,'0');
    var mmm = String(today.getMinutes()).padStart(2,'0');
    var ss = String(today.getSeconds()).padStart(2,'0');
    var revdate = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mmm + ':' + ss

    incoming_json = JSON.stringify(await request.json());
    json_data = JSON.parse(incoming_json);
    console.log(`Details: ${incoming_json}`);
    console.log(`Type: ${json_data.type}`);
    console.log(`Date: ${revdate}`);

    // write to my kv 
    //webhook_demo.put(revdate, json_data.type);
    await webhook_demo.put(revdate, incoming_json);
    
    goober = await fetch('http://httpbin.org')
    console.log(goober)
    return incoming_json
  } 
}

async function handleRequest(request) {
  const reqBody = await readRequestBody(request);
  const retBody = `The request body sent in was ${reqBody}`;
  return new Response(retBody);
}

async function handleGet() {
  return new Response({
        headers: { "Content-Type": "text/html" },
        status: 200,
        statusText: "OK"
    });
}

addEventListener('fetch', event => {
  const { request } = event;
  const { url } = request;

  if (request.method === 'POST') {
    return event.respondWith(handleRequest(request));
  } else if (request.method === 'GET') {
    return event.respondWith(handleGet());
  }
});
