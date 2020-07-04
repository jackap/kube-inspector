// @ts-ignore
var http = require('http');
var requests=0;
// @ts-ignore
var podname= process.env.HOSTNAME;
var startTime: number | Date;
var host: any;
var handleRequest = function(request: any, response: { setHeader: (arg0: string, arg1: string) => void; writeHead: (arg0: number) => void; write: (arg0: string) => void; end: (arg0: string) => void; }) {
  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(200);
  response.write("Hello Kubernetes bootcamp! | Running on: ");
  response.write(host);
  response.end(" | v=1\n");
  // @ts-ignore
    console.log("Running On:" ,host, "| Total Requests:", ++requests,"| App Uptime:", (new Date() - startTime)/1000 , "seconds", "| Log Time:",new Date());
}
var www = http.createServer(handleRequest);
www.listen(8081,function () {
    startTime = new Date();
    // @ts-ignore
    host = process.env.HOSTNAME;
    console.log ("Kubernetes Bootcamp App Started At:",startTime, "| Running On: " ,host, "\n" );
});
