using System;
using System.Collections.Generic;
using System.Text;

namespace NotificationService.Events
{

    public class WorkspaceUserAddedEvent
    {
        public Guid EventId { get; set; }

        public string WorkspaceId { get; set; } = string.Empty;

        public string WorkspaceName { get; set; } = string.Empty;

        public string AddedUserId { get; set; } = string.Empty;

        public string AddedUserName { get; set; } = string.Empty;

        public string AddedUserEmail { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public string AddedBy { get; set; } = string.Empty;

        public DateTime OccurredOn { get; set; }
    }
}
