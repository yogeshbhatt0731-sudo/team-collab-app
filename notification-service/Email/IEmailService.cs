using System;
using System.Collections.Generic;
using System.Text;

namespace NotificationService.Email
{
    public interface IEmailService
    {
            public Task SendEmailAsync(
                string to,
                string subject,
                string body);

    }
}
