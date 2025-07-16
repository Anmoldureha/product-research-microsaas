import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "@/env.mjs";

const connection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
});

export const researchQueue = new Queue("research", {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

export { connection as redis };