module.exports = {
    development: {
      database: {
        host: "localhost",
        port: 3306,
        name: "banco",
        dialect: "mysql",
        user: "root",
        password: "1234567"
      },
      secret: '1C3C7E1694F1E9DAD939399E87E5FFB5DF06B2327CA31B409CB3'
    },
    production: {
      database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
      }
    }
  };