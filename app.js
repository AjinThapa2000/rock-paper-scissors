//require fs for readstrean 
const fs = require('fs');
// require http module
const http = require('http');

// create server
const  server = http.createServer((req, res) => {
  const url = new URL(req.url, `http:${req.headers.host}`)
  switch(url.pathname){
    case '/':
      if(req.method === 'GET'){
        const name = url.searchParams.get('name');
        console.log(name);

        res.writeHead(202, {'Content-Type': 'text/html'});
        fs.createReadStream('./index.html').pipe(res);
        break;

      } else if (req.method === 'POST'){
        handlePostResponse(req, res);
        break;
      }
      break;
      default:
        res.writeHead(404, {'Content-Type': 'text/html'});
        fs.createWriteStream('./404.html').pipe(res);
  }
})
//server listening on port 
server.listen(4001, () =>{
  console.log('Server is listening at '+ server.address().port)
})
//function handle post respone
function handlePostResponse( req, res){
  req.setEncoding('utf8');

  //Receive chunks on 'data'  event and concatenate to body variable
  let body ='';

  req.on('data', (chunk) =>{
    body += chunk;
    console.log(body);
  });
  // When done receiving data, select a random choice for server 
  //compare server choice with player's choice and send an appropriate message.
  req.on('end', () =>{
    const choices =['rock', 'paper', 'scissors'];
    const randomChoice = choices[Math.floor(Math.random() * 3)]
    const choice = body;
    let message;

    const tied = `Aww, we tied! I also chose ${randomChoice}.`;
    const victory = `Dang it, you won! I chose ${randomChoice}.`;
    const defeat = `Ha! You lost. I chose ${randomChoice}.`;

    if( choice === randomChoice){
      message = tied;
    } else if(
      (choice === 'rock' && randomChoice === 'paper') ||
      (choice === 'paper' && randomChoice === 'scissors') ||
      (choice === 'scissors' && randomChoice === 'rock')

    ){
      message = defeat;
    } else {
      message = victory;
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`You Selected ${choice}. ${message}`);


  });


  
}
