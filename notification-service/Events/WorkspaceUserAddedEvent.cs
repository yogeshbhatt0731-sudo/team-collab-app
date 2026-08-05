using System;
using System.Collections.Generic;
using System.Text;

namespace NotificationService.Events
{

    public class WorkspaceUserAddedEvent
    {
        public Guid EventId { get; set; }

        public long WorkspaceId { get; set; }

        public string WorkspaceName { get; set; } = string.Empty;

        public long AddedUserId { get; set; }

        public string AddedUserName { get; set; } = string.Empty;

        public string AddedUserEmail { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public string AddedBy { get; set; } = string.Empty;

        public DateTime OccurredOn { get; set; }
    }
}
