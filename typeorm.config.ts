module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "RenKuy",
  synchronize: true,
  logging: true,
  entities: ["src/entity/*.ts"], // Add all entities
  migrations: ["src/migration/**/*.ts"], // Add all migration files
  subscribers: [],
  cli: {
    migrationsDir: "src/migration", // Folder for migrations
  },
};
