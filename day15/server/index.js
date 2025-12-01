import http from 'node:http';
import { parse } from 'node:path';
const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(req)

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const{ pathname, searchParams } = parsedUrl;

    console.log(parsedUrl)
    console.log(pathname)
    console.log(searchParams)

    if (pathname ==='/hi') {
        res.writeHead(200);
        res.end("hello");
    }
    else if (pathname === '/who') {
        res.writeHead(200);
        res.end("i am ohjaehyun");
    }
    else {
        res.writeHead(200);
        res.end("please req : / hi or /who");
    }

    res.writeHead(200);
    res.end("hi~ i'm ohjaehyun");
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
