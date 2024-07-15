import { initiator } from "~vendor";

const start = async () => {
  await initiator.start();
};

const stop = (code: 0 | 1) => {
  initiator
    .stop()
    .then(() => {
      process.removeAllListeners();
      process.exit(code);
    })
    .catch((e) => {
      console.error(e);
      process.removeAllListeners();
      process.exit(1);
    });
};

process.on("SIGTERM", () => stop(0));
process.on("SIGINT", () => stop(0));
process.on("SIGHUP", () => stop(0));
process.on("unhandledRejection", (reason, p) => {
  p.catch((e) => {
    stop(1);
  });
});

start()
  .then()
  .catch((e) => stop(1));
