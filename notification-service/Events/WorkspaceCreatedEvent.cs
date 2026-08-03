using System;
using System.Collections.Generic;
using System.Text;

namespace NotificationService.Events
{

public class WorkspaceCreatedEvent
    {
        public Guid EventId { get; set; }

        public string EventName { get; set; }

        public string WorkspaceId { get; set; }

        public string WorkspaceName { get; set; }

        public string CreatedBy { get; set; }

        public string CreatedByEmail { get; set; }

        public DateTime OccurredOn { get; set; }
    }
}
