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
    var mm = String(today.getMinutes()).padStart(2,'0');
    var ss = String(today.getSeconds()).padStart(2,'0');
    var revdate = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mm + ':' + ss

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

const renderPage = (data, KVdata, KVkeys_length) => {
return `
    <html>
      <head>
        <title>Orca DEMO webhook</title>
      </head>
      <body>
        <div>
          <h1>${KVdata}</h1>
          <div><p>${data.keys[0].name} </p></div>
          <div><p>${data.keys[1].name} </p></div>
          ${KVdata[0].val}
          <div><p>Length: ${KVkeys_length}</p></div>
        </div>
      </body>
    </html>
    `
};

  var KVkeys = await webhook_demo.list();
  var KVkeys_length = KVkeys.keys.length;
  var array = [];
  for (let count = 0; count < KVkeys_length; count++) {
    curr_key = KVkeys.keys[count].name;
    curr_val = await webhook_demo.get(KVkeys.keys[count].name)
    feed = {key: curr_key, val: curr_val}
    array.push(feed)
  } 
  console.log(array);
  console.log(`Array length: ${KVkeys_length}`);
  var KVdata = array;
  return new Response(renderPage(KVkeys, KVdata, KVkeys_length), {
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
