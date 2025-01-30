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
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();
    var revdate = yyyy + '-' + mm + '-' + dd + '-' + hh + '-' + mm + '-' + ss

    incoming_json = JSON.stringify(await request.json());
    json_data = JSON.parse(incoming_json);
    console.log(`Details: ${incoming_json}`);
    console.log(`Type: ${json_data.type}`);
    console.log(`Date: ${revdate}`);

    // write to my kv 
    //webhook_demo.put(revdate, json_data.type);
    await webhook_demo.put(revdate, incoming_json);

    return incoming_json;
  } else {
    // Perhaps some other type of data was submitted in the form
    // like an image, or some other binary data.
    return 'a file';
  }
}

async function handleRequest(request) {
  const reqBody = await readRequestBody(request);
  const retBody = `The request body sent in was ${reqBody}`;
  return new Response(retBody);
}

async function handleGet() {

const DEMO_PAGE = page => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Orca WebHook Demo</title>
  </head>
  <body>
    <h1>Orca WebHook Demo</h1>
    <ul id="stuff"></ul>
  </body>
  <script>
    alert("foo");
  </script>
</html>
`

  var KV = await webhook_demo.list();
  stringify_object = JSON.stringify(KV.keys);
  return new Response(JSON.stringify(KV.keys), {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
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
