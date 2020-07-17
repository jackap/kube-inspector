import {setupTests} from "./setup";
import {inspect} from "./inspector";


async function main(){ // TODO: wait for all containers to be up and running
    const {inspectorUrl} = await setupTests();
   const inspectorResponse = await inspect(inspectorUrl);

}
main().then(r => console.log(r));
