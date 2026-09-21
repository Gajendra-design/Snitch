import {app} from './app/app.js'
import { connectDb } from './config/db.js';
import { config } from './config/env.js';

try {
    await connectDb()
    const port = config.PORT;
    app.listen(port,()=>{
        console.log('server connected successfully',port);
    })
} catch (error) {
    console.log("error in connecting to mongo-DB",error);
    
}
