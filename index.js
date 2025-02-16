import app from "./app.js";
import { CONNECT_DB } from "./connection/DB_CONNECT.js";

const port = process.env.PORT || 3443;
const DB_URI = process.env.MDB_URI;


app.listen(port,async()=>{
   await CONNECT_DB(DB_URI);
    console.log(`Server is running. Server link ---> http://localhost:${port}`);
});