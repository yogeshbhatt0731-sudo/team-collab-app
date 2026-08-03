using System;
using System.Collections.Generic;
using System.Text;
using NotificationService.Email;
using NotificationService.Events;

namespace NotificationService.Consumers
{
    public class WorkspaceCreatedConsumer
    {
        private readonly IEmailService _emailService;

        public WorkspaceCreatedConsumer(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task HandleAsync(WorkspaceCreatedEvent message)
        {
            
            string subject = "Workspace Created Successfully";

            string body = $"""
                    Hello {message.CreatedBy},

                    Your workspace "{message.WorkspaceName}" has been created successfully.
                    Thank you,
                    Team Collaboration
                    """;

            await _emailService.SendEmailAsync(
                message.CreatedByEmail,
                subject,
                body);
            
        }
    }
}
