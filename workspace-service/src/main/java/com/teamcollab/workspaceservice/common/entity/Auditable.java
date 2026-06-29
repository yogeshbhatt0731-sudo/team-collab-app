package com.teamcollab.workspaceservice.common.entity;

import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

// timestamps ONLY — no @Id. Anything can extend this, composite-key or not.
@MappedSuperclass
@Getter
public abstract class Auditable {
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
