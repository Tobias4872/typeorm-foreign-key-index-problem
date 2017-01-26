import "reflect-metadata";
import { Connection, createConnection } from "typeorm";

//
// DRIVER CONFIGURATION
//
const driver: any = {
    database: "foreign_key_index_problem",
    host: "0.0.0.0",
    password: "root",
    port: 3306,
    type: "mysql",
    username: "root",
};

//
// FIRST RUN TO CREATE THE ORIGINAL DATABASE
//
createConnection({
    driver: driver,
    entities: [
        "./models/original/*.js",
    ],
    logging: {
        logQueries: true,
    },
}).then(async (c: Connection) => {
    console.log(">>>> Initial setup ...");
    await c.syncSchema();
    await c.close();

    //
    // SECOND RUN TO MAKE "zone.playerSettings" A MANDATORY FIELD
    //
    createConnection({
        driver: driver,
        entities: [
            "./models/updated/*.js",
        ],
        logging: {
            logQueries: true,
        },
    }).then(async (c: Connection) => {
        console.log(">>>> Updating schema ...");
        await c.syncSchema();
        await c.syncSchema();
        await c.close();
    });
});
