// application/CheckCompleteService.js
export class CheckCompleteService {
  constructor(progressRepo, eventPublisher) {
    this.progressRepo = progressRepo;
    this.eventPublisher = eventPublisher;
  }

  async checkComplete(guid) {
    const progress = await this.progressRepo.getProgress(guid);

    if (progress.a_done === "1" && progress.b_done === "1") {
      await this.eventPublisher.publish("ifc_ready", guid);
      return true;
    }

    return false;
  }
}
