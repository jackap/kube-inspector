import {createInspectorServer} from "./server";


const inspector = createInspectorServer();
inspector.listen(8081,()  => console.info('Inspector is listening on port 8081!'));
