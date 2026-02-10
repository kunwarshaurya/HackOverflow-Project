# Design Document: Missing Core Features

## Overview

This design addresses three critical missing features in the event management system: complete notification management, functional chat messaging, and admin analytics dashboard integration. The system currently has partial implementations that need to be completed with full CRUD operations, proper error handling, and comprehensive testing.

The implementation will extend existing components rather than replacing them, ensuring seamless integration with the current Node.js/Express backend and EJS frontend architecture.

## Architecture

### System Components

The implementation follows the existing MVC pattern with these key components:

1. **Backend API Layer**: Express.js controllers and routes
2. **Frontend Client Layer**: EJS templates with client-side JavaScript
3. **Data Layer**: MongoDB with Mongoose models
4. **Real-time Communication**: Polling-based updates (extensible to WebSockets)

### Integration Points

- **Notification System**: Extends existing `/notifications` routes and `notificationManager` client-side class
- **Chat System**: Completes existing `/chat` routes and chat view templates
- **Analytics System**: Integrates existing `analyticsController` with admin dashboard

## Components and Interfaces

### Notification Management Component

**Backend Extensions**:
```javascript
// Additional routes in /client/src/routes/notifications.js
DELETE /notifications/:id          // Delete single notification
POST   /notifications/mark-all-read // Mark all as read
DELETE /notifications/bulk         // Bulk delete notifications
```

**Frontend Extensions**:
```javascript
// Extensions to NotificationManager class
class NotificationManager {
  async deleteNotification(notificationId)
  async markAllAsRead()
  async bulkDelete(notificationIds)
  async bulkMarkAsRead(notificationIds)
}
```

### Chat Messaging Component

**Backend API Endpoints**:
```javascript
// New routes in /client/src/routes/chat.js
POST   /chat/send                  // Send message (fix existing)
GET    /chat/club/:clubId/messages // Get club messages with pagination
GET    /chat/event/:eventId/messages // Get event messages with pagination
```

**Real-time Updates**:
- Polling mechanism every 3 seconds (existing pattern)
- Message ordering by timestamp
- Automatic scroll to bottom for new messages

### Admin Analytics Component

**Backend Integration**:
```javascript
// Use existing analyticsController.getDashboardStats()
// Extend with additional metrics:
- User statistics (total, active, growth)
- Club engagement metrics
- Message activity statistics
```

**Frontend Dashboard Cards**:
- Total Users / Active Users
- Total Messages / Recent Activity
- Club Participation Rates
- Event Success Metrics

## Data Models

### Existing Models (No Changes Required)

**Notification Model** (already exists):
```javascript
{
  _id: ObjectId,
  message: String,
  type: String, // 'success', 'error', 'info', 'warning'
  isRead: Boolean,
  createdAt: Date,
  relatedEvent: ObjectId // optional
}
```

**Message Model** (already exists):
```javascript
{
  _id: ObjectId,
  content: String,
  sender: ObjectId, // User reference
  clubId: ObjectId, // optional
  eventId: ObjectId, // optional
  createdAt: Date
}
```

### Data Access Patterns

**Notification Operations**:
- Read: Paginated queries with read/unread filtering
- Update: Batch updates for mark-as-read operations
- Delete: Soft delete with cascade handling

**Message Operations**:
- Read: Chronological ordering with pagination
- Create: Real-time insertion with validation
- Query: Context-based filtering (club/event)
## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis and property reflection, the following properties ensure system correctness:

### Property 1: Notification State Management
*For any* notification and any user action (click, mark as read, delete), the notification's display state should immediately reflect the action and persist the change to the database
**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Bulk Notification Operations
*For any* set of notifications and any bulk operation (mark all read, bulk delete), all selected notifications should be updated consistently and the UI should reflect all changes
**Validates: Requirements 1.5**

### Property 3: Message Chronological Ordering
*For any* chat context (club or event) and any set of messages, messages should always be displayed in chronological order based on their creation timestamp
**Validates: Requirements 2.1, 2.2**

### Property 4: Message Creation and Persistence
*For any* valid message content and chat context, submitting the message should save it to the database and display it immediately in the correct chronological position
**Validates: Requirements 2.3, 2.4**

### Property 5: Empty Message Validation
*For any* string composed entirely of whitespace or empty content, the chat system should reject the message and maintain the current chat state unchanged
**Validates: Requirements 2.5**

### Property 6: Analytics Metric Accuracy
*For any* system state with known data (users, events, clubs, messages), the analytics dashboard should display metrics that accurately reflect the actual counts and calculations
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

### Property 7: Error Handling with Recovery
*For any* operation that fails (network, database, validation), the system should display specific error messages, maintain data consistency, and provide appropriate recovery options
**Validates: Requirements 1.6, 2.6, 3.6, 3.7, 4.2, 4.3, 4.4**

### Property 8: User Feedback Consistency
*For any* operation (success or in-progress), the system should provide immediate visual feedback through success indicators, loading states, or error messages as appropriate
**Validates: Requirements 4.1, 4.5, 4.6**

### Property 9: Data Persistence Integrity
*For any* data modification operation (notification updates, message creation, analytics computation), changes should be immediately persisted to the database and remain consistent across concurrent operations
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 10: Chat History Loading
*For any* chat context with existing messages, joining the chat should load recent messages in chronological order and enable scrolling for message history
**Validates: Requirements 2.7**

## Error Handling

### Error Categories

1. **Network Errors**: Connection timeouts, server unavailability
2. **Validation Errors**: Invalid input data, empty messages, malformed requests
3. **Database Errors**: Connection failures, constraint violations, transaction rollbacks
4. **Authentication Errors**: Invalid tokens, expired sessions, insufficient permissions

### Error Response Strategy

- **Immediate Feedback**: All errors display user-friendly messages within 200ms
- **Graceful Degradation**: Partial functionality maintained during non-critical failures
- **Retry Mechanisms**: Automatic retry for transient network errors (max 3 attempts)
- **Data Consistency**: All failed operations maintain database integrity

### Fallback Behaviors

- **Notification Loading**: Show cached notifications if API unavailable
- **Chat Messages**: Display "Unable to load messages" with retry button
- **Analytics**: Show "Data temporarily unavailable" with refresh option

## Testing Strategy

### Dual Testing Approach

The implementation requires both unit testing and property-based testing for comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Notification CRUD operations with specific test data
- Chat message validation with known inputs
- Analytics calculations with predetermined datasets
- Error handling with simulated failure conditions

**Property Tests**: Verify universal properties across all inputs
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: missing-core-features, Property {number}: {property_text}**
- Comprehensive input coverage through randomization

### Property-Based Testing Configuration

Using **fast-check** library for JavaScript property-based testing:
- Generate random notifications, messages, and user data
- Test properties across wide input ranges
- Verify invariants hold under all conditions
- Catch edge cases that unit tests might miss

### Testing Balance

- **Unit tests**: 40% of test coverage (specific scenarios, integration points)
- **Property tests**: 60% of test coverage (universal behavior verification)
- Both approaches are complementary and necessary for system reliability