using NotificationService.Events;

namespace NotificationService.Consumers
{
 

    public class WorkspaceUserAddedConsumer
    {
        public Task HandleAsync(
            WorkspaceUserAddedEvent message)
        {

            return Task.CompletedTask;
        }
    }
}
