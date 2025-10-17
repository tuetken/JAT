// Mock Notification Service

export function triggerNotification(app) {
  if (!app) return "Invalid application data.";

  const baseMessage = `Reminder for ${app.company}: ${app.position}`;
  const message =
    app.reminderMessage &&
    app.reminderMessage.trim().length > 0
      ? `${baseMessage} — ${app.reminderMessage}`
      : baseMessage;

  console.log("[NotificationService] Triggered:", message);
  return message;
}

export function checkReminders(applications = []) {
  const today = new Date().toISOString().split("T")[0];
  return applications.filter((app) => {
    if (!app.reminder) return false;
    const reminderDate = new Date(app.reminder)
      .toISOString()
      .split("T")[0];
    return reminderDate === today;
  });
}
