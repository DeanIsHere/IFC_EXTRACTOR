// domain/EventPublisher.js
class EventPublisherPort {
  async publish(channel, message) {
    throw new Error("Not implemented");
  }
}

module.exports = EventPublisherPort;