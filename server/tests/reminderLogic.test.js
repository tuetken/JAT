import * as NotificationService from "../services/NotificationService.js";

describe("Reminder Notifications", () => {
  it("should format a message with company and position", () => {
    const app = {
      company: "Spotify",
      position: "Software Engineer",
      reminderMessage: "Follow up with recruiter",
    };
    const message = NotificationService.triggerNotification(
      app,
      true
    ); // silent test
    expect(message).toContain("Spotify");
    expect(message).toContain("Follow up with recruiter");
  });
});
