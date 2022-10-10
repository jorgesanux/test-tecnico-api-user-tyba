import { Sequelize } from "sequelize";
import pg from "pg";

pg.types.setTypeParser(1114, stringValue => {
    return new Date(stringValue + '+0000');
});

let dialectOptions = {
    useUTC: true
};
if (process.env.PG_SSL === "true") {
    dialectOptions.ssl = {
        rejectUnauthorized: false,
    }
}

const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        dialect: "postgres",
        logging: process.env.NODE_ENV === 'production' ? false : console.log,
        dialectOptions,
        timezone: 'UTC'
    }
);

export default sequelize;