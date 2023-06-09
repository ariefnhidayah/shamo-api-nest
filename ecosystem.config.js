module.exports = {
    apps: [
        {
            name: "shamo-api",
            exec_mode: "cluster",
            instances: "1",
            script: "dist/main.js", // your script
            args: "start",
            env: {
                APP_ENV: "production",
                PORT: "3000",
                DB_USER: "",
                DB_PORT: "",
                DB_PASS: "",
                DB_NAME: "",
                DB_HOST: "",
                JWT_SECRET: "",
                JWT_SECRET_ADMIN: "",
                JWT_ACCESS_TOKEN_EXPIRED: ""
            },
        },
    ],
};