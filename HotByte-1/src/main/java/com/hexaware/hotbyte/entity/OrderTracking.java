package com.hexaware.hotbyte.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_tracking")
public class OrderTracking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tracking_id")
    private Integer trackingId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "status_update")
    private String statusUpdate;

    @Column(name = "description")
    private String description;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OrderTracking() {}

    public Integer getTrackingId() { return trackingId; }
    public void setTrackingId(Integer trackingId) { this.trackingId = trackingId; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getStatusUpdate() { return statusUpdate; }
    public void setStatusUpdate(String statusUpdate) { this.statusUpdate = statusUpdate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
