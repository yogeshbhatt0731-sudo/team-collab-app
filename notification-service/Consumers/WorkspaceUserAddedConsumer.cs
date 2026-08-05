using NotificationService.Email;
using NotificationService.Events;

namespace NotificationService.Consumers
{
    public class WorkspaceUserAddedConsumer
    {
        private readonly IEmailService _emailService;

        public WorkspaceUserAddedConsumer(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task HandleAsync(WorkspaceUserAddedEvent message)
        {
            string subject = $"You've been added to \"{message.WorkspaceName}\"";

            string body = $"""
                    Hello {message.AddedUserName},

                    {message.AddedBy} has added you to the workspace "{message.WorkspaceName}" as a {message.Role}.

                    Log in to start collaborating with your team.

                    Thank you,
                    Team Collaboration
                    """;

            await _emailService.SendEmailAsync(
                message.AddedUserEmail,
                subject,
                body);
        }
    }
}
