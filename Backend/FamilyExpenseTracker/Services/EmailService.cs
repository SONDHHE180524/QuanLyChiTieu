using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace FamilyExpenseTracker.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var smtpHost = _config["EmailSettings:Host"];
        var smtpPort = int.Parse(_config["EmailSettings:Port"] ?? "587");
        var smtpUser = _config["EmailSettings:Email"];
        var smtpPass = _config["EmailSettings:Password"];
        var displayName = _config["EmailSettings:DisplayName"];

        using var client = new SmtpClient(smtpHost, smtpPort)
        {
            Credentials = new NetworkCredential(smtpUser, smtpPass),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(smtpUser!, displayName),
            Subject = subject,
            Body = message,
            IsBodyHtml = true
        };
        mailMessage.To.Add(toEmail);

        await client.SendMailAsync(mailMessage);
    }
}
