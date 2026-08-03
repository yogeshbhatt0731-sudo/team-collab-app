using Microsoft.Extensions.Options;
using NotificationService.Configuration;
using System.Net;
using System.Net.Mail;

namespace NotificationService.Email;

public class SmtpEmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public SmtpEmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        //Create a mail template
        using MailMessage message = new MailMessage();
        message.From = new MailAddress(_settings.Username);
        message.To.Add(to);
        message.Subject = subject;
        message.Body = body;

        //Open a Connection
        using SmtpClient client = new SmtpClient(
            _settings.Host,
            _settings.Port
        );

        //Enable TLS Encryption
        client.EnableSsl = true;

        //Authenticate creds
        //if fail, 535 Authentication Failed
        client.Credentials =
        new NetworkCredential(
        _settings.Username,
        _settings.Password);

        //Send message 
        await client.SendMailAsync(message);
    }
}