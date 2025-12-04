module.exports = {
    apps: [
      {
        name: "book-exchange",
        script: "build/index.js",
        env: {
          PORT: 3400,
          HOST: "localhost",
        },
      }
    ]
  };