module.exports = {
    apps: [
      {
        name: "ligare-sistema-frontend",
        script: "serve",
        args: ["-s", "dist", "-p", "5000"],
      },
    ],
  };