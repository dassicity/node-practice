const fs = require('fs');

const requestHandler = (request, response) => {
    const url = request.url;
    const method = request.method;

    if (url === '/') {
        response.write('<html>');
        response.write('<head><title>My first Form</title></head>');
        response.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        response.write('</html>');
        return response.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = [];

        request.on('data', (chunk) => {
            body.push(chunk);
            // console.log(chunk);
        });

        request.on('end', () => {
            const parsedText = Buffer.concat(body).toString();
            const message = parsedText.split('=')[1];
            // console.log(message);
            fs.writeFile('message.txt', message, () => {
                // response.statusCode = 302;
                // response.setHeader('Location', '/');
                // return response.end();
                console.log('Finished');
            });
        });

    }

    response.setHeader('Content-type', 'text/html');
    response.write('<html>');
    response.write('<head><title>My first application</title></head>');
    response.write('<body><h1>Hello from Node !!!!</h1></body>');
    response.write('</html>');
    response.end();
}

module.exports = requestHandler;