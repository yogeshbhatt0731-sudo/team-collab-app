using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NotificationService.Configuration;
using NotificationService.Consumers;
using NotificationService.Email;
using NotificationService.Services;

var builder = Host.CreateApplicationBuilder(args);


builder.Services.Configure<RabbitMQSettings>(
    builder.Configuration.GetSection("RabbitMQ"));

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("Email"));

builder.Services.AddSingleton<WorkspaceCreatedConsumer>();

builder.Services.AddSingleton<WorkspaceUserAddedConsumer>();

builder.Services.AddHostedService<RabbitMQConsumerService>();

builder.Services.AddSingleton<IEmailService, SmtpEmailService>();



var app = builder.Build();

app.Run();