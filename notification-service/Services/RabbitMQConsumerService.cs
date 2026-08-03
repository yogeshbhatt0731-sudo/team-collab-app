using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using NotificationService.Consumers;
using NotificationService.Events;
using NotificationService.Configuration;

namespace NotificationService.Services;

public class RabbitMQConsumerService : BackgroundService
{
    private readonly RabbitMQSettings _settings;
    private readonly WorkspaceCreatedConsumer _workspaceCreatedConsumer;
    private readonly WorkspaceUserAddedConsumer _workspaceUserAddedConsumer;

    public RabbitMQConsumerService(
        IOptions<RabbitMQSettings> options,
        WorkspaceCreatedConsumer workspaceCreatedConsumer,
        WorkspaceUserAddedConsumer workspaceUserAddedConsumer)
    {
        _settings = options.Value;

        _workspaceCreatedConsumer = workspaceCreatedConsumer;

        _workspaceUserAddedConsumer = workspaceUserAddedConsumer;
    }

    private static readonly JsonSerializerOptions JsonOptions =
    new()
    {
        PropertyNameCaseInsensitive = true
    };

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {

        //Configure the Settings to get Connection
        var factory = new ConnectionFactory
        {
            HostName = _settings.Host,
            Port = _settings.Port,
            UserName = _settings.Username,
            Password = _settings.Password
        };

        //Create Connection
        var connection = factory.CreateConnection();

        //Create channel
        IModel channel = connection.CreateModel();

        //Create Channel If not exists else Ignore
        channel.QueueDeclare(
            queue: _settings.Queue,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null);


        //Listening for the messages
        EventingBasicConsumer consumer = new EventingBasicConsumer(channel);


        //Add event when msg arrives it executes
        consumer.Received += async (sender, e) =>
        {
            try
            {
                //convert Byte to json
                var json = Encoding.UTF8.GetString(e.Body.ToArray());

                Console.WriteLine();

                Console.WriteLine("Received JSON");

                Console.WriteLine(json);

                //Convert JSON to C# obj
                 switch (e.RoutingKey)
                {
                    case "workspace.created":
                        {
                            var message =
                                JsonSerializer.Deserialize<WorkspaceCreatedEvent>(
                                    json,
                                    JsonOptions);

                            if (message == null)
                                throw new Exception(
                                    "Unable to deserialize WorkspaceCreatedEvent");

                            await _workspaceCreatedConsumer
                                .HandleAsync(message);

                            break;
                        }

                    case "workspace.user.added":
                        {
                            var message =
                                JsonSerializer.Deserialize<WorkspaceUserAddedEvent>(
                                    json,
                                    JsonOptions);

                            if (message == null)
                                throw new Exception(
                                    "Unable to deserialize WorkspaceUserAddedEvent");

                            await _workspaceUserAddedConsumer
                                .HandleAsync(message);

                            break;
                        }

                    default:
                        Console.WriteLine(
                            $"Unknown routing key: {e.RoutingKey}");

                        break;
                }

                //If successful return an acknowledgemnt
                channel.BasicAck(e.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                //If not successful return an negative acknowledgemnt
                channel.BasicNack(e.DeliveryTag, false, true);
            }
        };

        channel.BasicConsume(
            queue: _settings.Queue,
            autoAck: false,
            consumer: consumer);

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(1000, stoppingToken);
        }

    }
}
