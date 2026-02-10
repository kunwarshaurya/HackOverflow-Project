// Toast notification system
function showToast(type, title, message, duration = 5000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconMap[type] || iconMap.info}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove toast after duration
    setTimeout(() => {
        if (toast.parentNode) {
            removeToast(toast);
        }
    }, duration);
    
    // Add click to close functionality
    toast.addEventListener('click', function(e) {
        if (e.target.closest('.toast-close')) {
            removeToast(toast);
        }
    });
}

function closeToast(button) {
    const toast = button.closest('.toast');
    removeToast(toast);
}

function removeToast(toast) {
    toast.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Add slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Notification item enhancements */
    .notification-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border-bottom: 1px solid #e9ecef;
        transition: background-color 0.2s ease;
    }
    
    .notification-item:hover {
        background-color: #f8f9fa;
    }
    
    .notification-checkbox {
        flex-shrink: 0;
    }
    
    .notification-checkbox input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
    }
    
    .notification-actions {
        display: flex;
        gap: 0.5rem;
        margin-left: auto;
        flex-shrink: 0;
    }
    
    .notification-mark-read,
    .notification-delete {
        background: none;
        border: none;
        padding: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        color: #6c757d;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
    }
    
    .notification-mark-read:hover {
        background-color: #28a745;
        color: white;
    }
    
    .notification-delete:hover {
        background-color: #dc3545;
        color: white;
    }
    
    .notification-action {
        padding: 0.5rem;
        border-radius: 4px;
        color: #6c757d;
        text-decoration: none;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
    }
    
    .notification-action:hover {
        background-color: #007bff;
        color: white;
        text-decoration: none;
    }
    
    /* Bulk controls styling */
    .notification-bulk-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .bulk-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .selection-info {
        font-size: 0.875rem;
        color: #6c757d;
        font-weight: 500;
    }
    
    .notification-global-actions {
        display: flex;
        justify-content: center;
    }
    
    .global-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    /* Button styling */
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid transparent;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .btn-sm {
        padding: 0.375rem 0.75rem;
        font-size: 0.8125rem;
    }
    
    .btn-primary {
        background-color: #007bff;
        border-color: #007bff;
        color: white;
    }
    
    .btn-primary:hover {
        background-color: #0056b3;
        border-color: #0056b3;
    }
    
    .btn-outline-primary {
        color: #007bff;
        border-color: #007bff;
        background-color: transparent;
    }
    
    .btn-outline-primary:hover {
        background-color: #007bff;
        color: white;
    }
    
    .btn-outline-danger {
        color: #dc3545;
        border-color: #dc3545;
        background-color: transparent;
    }
    
    .btn-outline-danger:hover {
        background-color: #dc3545;
        color: white;
    }
    
    .btn-outline-secondary {
        color: #6c757d;
        border-color: #6c757d;
        background-color: transparent;
    }
    
    .btn-outline-secondary:hover {
        background-color: #6c757d;
        color: white;
    }
`;
document.head.appendChild(style);

// Notification management functions
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
    }
    
    async loadNotifications() {
        try {
            const response = await fetch('/notifications/api');
            if (response.ok) {
                const data = await response.json();
                this.notifications = data.notifications || [];
                this.updateUnreadCount();
                this.renderNotifications();
            }
        } catch (error) {
            console.error('Failed to load notifications:', error);
            showToast('error', 'Error', 'Failed to load notifications');
        }
    }
    
    async markAsRead(notificationId) {
        try {
            const response = await fetch(`/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Update local notification
                const notification = this.notifications.find(n => n._id === notificationId);
                if (notification) {
                    notification.isRead = true;
                    this.updateUnreadCount();
                    this.renderNotifications();
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            showToast('error', 'Error', 'Failed to mark notification as read');
            throw error; // Re-throw for caller handling
        }
    }
    
    async deleteNotification(notificationId) {
        try {
            const response = await fetch(`/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Remove notification from local array
                this.notifications = this.notifications.filter(n => n._id !== notificationId);
                this.updateUnreadCount();
                this.renderNotifications();
                showToast('success', 'Success', 'Notification deleted successfully');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
            showToast('error', 'Error', 'Failed to delete notification');
            throw error; // Re-throw for caller handling
        }
    }
    
    async markAllAsRead() {
        try {
            const unreadNotifications = this.notifications.filter(n => !n.isRead);
            if (unreadNotifications.length === 0) {
                showToast('info', 'Info', 'No unread notifications to mark');
                return;
            }
            
            const response = await fetch('/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Update all notifications to read status
                this.notifications.forEach(notification => {
                    notification.isRead = true;
                });
                this.updateUnreadCount();
                this.renderNotifications();
                showToast('success', 'Success', `Marked ${unreadNotifications.length} notifications as read`);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            showToast('error', 'Error', 'Failed to mark all notifications as read');
            throw error; // Re-throw for caller handling
        }
    }
    
    async bulkDelete(notificationIds) {
        try {
            if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
                showToast('warning', 'Warning', 'No notifications selected for deletion');
                return;
            }
            
            const response = await fetch('/notifications/bulk', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationIds })
            });
            
            if (response.ok) {
                // Remove deleted notifications from local array
                this.notifications = this.notifications.filter(n => !notificationIds.includes(n._id));
                this.updateUnreadCount();
                this.renderNotifications();
                showToast('success', 'Success', `Deleted ${notificationIds.length} notifications`);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to delete notifications:', error);
            showToast('error', 'Error', 'Failed to delete selected notifications');
            throw error; // Re-throw for caller handling
        }
    }
    
    async bulkMarkAsRead(notificationIds) {
        try {
            if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
                showToast('warning', 'Warning', 'No notifications selected to mark as read');
                return;
            }
            
            // Filter to only unread notifications
            const unreadIds = notificationIds.filter(id => {
                const notification = this.notifications.find(n => n._id === id);
                return notification && !notification.isRead;
            });
            
            if (unreadIds.length === 0) {
                showToast('info', 'Info', 'Selected notifications are already read');
                return;
            }
            
            // For bulk mark as read, we'll make individual API calls since the backend
            // doesn't have a bulk mark-as-read endpoint for specific IDs
            const promises = unreadIds.map(id => 
                fetch(`/notifications/${id}/read`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            );
            
            const responses = await Promise.allSettled(promises);
            const successCount = responses.filter(result => 
                result.status === 'fulfilled' && result.value.ok
            ).length;
            
            if (successCount > 0) {
                // Update local notifications that were successfully marked as read
                unreadIds.forEach(id => {
                    const notification = this.notifications.find(n => n._id === id);
                    if (notification) {
                        notification.isRead = true;
                    }
                });
                this.updateUnreadCount();
                this.renderNotifications();
                
                if (successCount === unreadIds.length) {
                    showToast('success', 'Success', `Marked ${successCount} notifications as read`);
                } else {
                    showToast('warning', 'Partial Success', `Marked ${successCount} of ${unreadIds.length} notifications as read`);
                }
            } else {
                throw new Error('Failed to mark any notifications as read');
            }
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
            showToast('error', 'Error', 'Failed to mark selected notifications as read');
            throw error; // Re-throw for caller handling
        }
    }
    
    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
        
        // Update badge in navbar
        const badge = document.getElementById('notification-count');
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'block' : 'none';
        }
    }
    
    renderNotifications() {
        const container = document.getElementById('notifications-list');
        if (!container) return;
        
        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <h3>No notifications</h3>
                    <p>You're all caught up!</p>
                </div>
            `;
            return;
        }
        
        // Add bulk action controls if there are notifications
        const bulkControls = `
            <div class="notification-bulk-controls" style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; display: none;" id="bulk-controls">
                <div class="bulk-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="notificationManager.markSelectedAsRead()">
                        <i class="fas fa-check"></i> Mark Selected as Read
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="notificationManager.deleteSelected()">
                        <i class="fas fa-trash"></i> Delete Selected
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="notificationManager.clearSelection()">
                        <i class="fas fa-times"></i> Clear Selection
                    </button>
                </div>
                <div class="selection-info">
                    <span id="selection-count">0 selected</span>
                </div>
            </div>
        `;
        
        const notificationsList = this.notifications.map(notification => `
            <div class="notification-item ${notification.isRead ? 'read' : 'unread'}" 
                 data-id="${notification._id}">
                <div class="notification-checkbox">
                    <input type="checkbox" class="notification-select" value="${notification._id}" 
                           onchange="notificationManager.updateSelection()">
                </div>
                <div class="notification-icon ${notification.type}">
                    <i class="${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-message">${notification.message}</p>
                    <span class="notification-time">${this.formatTime(notification.createdAt)}</span>
                </div>
                <div class="notification-actions">
                    ${!notification.isRead ? `
                        <button class="notification-mark-read" 
                                onclick="notificationManager.markAsRead('${notification._id}')"
                                title="Mark as read">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    <button class="notification-delete" 
                            onclick="notificationManager.deleteNotification('${notification._id}')"
                            title="Delete notification">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${notification.relatedEvent ? `
                        <a href="/events/${notification.relatedEvent}" class="notification-action" title="View event">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = bulkControls + notificationsList;
        
        // Add global action buttons
        this.renderGlobalActions();
    }
    
    renderGlobalActions() {
        const container = document.getElementById('notifications-list');
        if (!container) return;
        
        const unreadCount = this.notifications.filter(n => !n.isRead).length;
        
        if (this.notifications.length > 0) {
            const globalActions = document.createElement('div');
            globalActions.className = 'notification-global-actions';
            globalActions.style.cssText = 'margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;';
            globalActions.innerHTML = `
                <div class="global-actions">
                    ${unreadCount > 0 ? `
                        <button class="btn btn-sm btn-primary" onclick="notificationManager.markAllAsRead()">
                            <i class="fas fa-check-double"></i> Mark All as Read (${unreadCount})
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-outline-secondary" onclick="notificationManager.toggleSelectAll()">
                        <i class="fas fa-check-square"></i> Select All
                    </button>
                </div>
            `;
            
            container.insertBefore(globalActions, container.firstChild);
        }
    }
    
    updateSelection() {
        const checkboxes = document.querySelectorAll('.notification-select');
        const selectedIds = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        const bulkControls = document.getElementById('bulk-controls');
        const selectionCount = document.getElementById('selection-count');
        
        if (bulkControls && selectionCount) {
            if (selectedIds.length > 0) {
                bulkControls.style.display = 'block';
                selectionCount.textContent = `${selectedIds.length} selected`;
            } else {
                bulkControls.style.display = 'none';
            }
        }
    }
    
    toggleSelectAll() {
        const checkboxes = document.querySelectorAll('.notification-select');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(cb => {
            cb.checked = !allChecked;
        });
        
        this.updateSelection();
    }
    
    clearSelection() {
        const checkboxes = document.querySelectorAll('.notification-select');
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
        this.updateSelection();
    }
    
    getSelectedIds() {
        const checkboxes = document.querySelectorAll('.notification-select:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    async markSelectedAsRead() {
        const selectedIds = this.getSelectedIds();
        if (selectedIds.length === 0) {
            showToast('warning', 'Warning', 'No notifications selected');
            return;
        }
        
        try {
            await this.bulkMarkAsRead(selectedIds);
            this.clearSelection();
        } catch (error) {
            // Error already handled in bulkMarkAsRead
        }
    }
    
    async deleteSelected() {
        const selectedIds = this.getSelectedIds();
        if (selectedIds.length === 0) {
            showToast('warning', 'Warning', 'No notifications selected');
            return;
        }
        
        // Confirm deletion
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} notification(s)? This action cannot be undone.`)) {
            return;
        }
        
        try {
            await this.bulkDelete(selectedIds);
            this.clearSelection();
        } catch (error) {
            // Error already handled in bulkDelete
        }
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return date.toLocaleDateString();
    }
}

// Initialize notification manager
const notificationManager = new NotificationManager();

// Auto-load notifications when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('notifications-list')) {
        notificationManager.loadNotifications();
    }
});

// Real-time notification updates (if WebSocket is available)
function initializeRealTimeNotifications() {
    // This would connect to a WebSocket server for real-time updates
    // For now, we'll use polling
    setInterval(() => {
        if (document.getElementById('notifications-list')) {
            notificationManager.loadNotifications();
        }
    }, 30000); // Poll every 30 seconds
}

// Initialize real-time notifications
document.addEventListener('DOMContentLoaded', initializeRealTimeNotifications);

// Export for global use
window.showToast = showToast;
window.notificationManager = notificationManager;