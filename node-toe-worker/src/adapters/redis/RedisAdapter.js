// infrastructure/RedisEventPublisher.js
import Redis from "ioredis";
import { EventPublisherPort } from "../Port/EventPublisherPort.js";

class RedisEventPublisher extends EventPublisherPort {
  constructor() {
    super();
    this.redis = new Redis({ host: "redis", port: 6379 });
  }

  async publish(channel, message) {
    await this.redis.publish(channel, message);
  }
}
module.exports = RedisEventPublisher;