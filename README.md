# Scenarios for Comparison

Each backend will handle the following scenarios, and the React frontend will display performance metrics like response time, concurrency handling, and resource usage.

| **Scenario** | **Description** |
|-------------|---------------|
| **REST API: Concurrent Requests Handling** | **Endpoint:** `GET /process` <br> Simulate processing time (e.g., 500ms per request). <br> React frontend will send multiple requests in parallel. <br> Compare how each backend handles concurrent requests and responds. |
| **WebSockets: Real-time Message Broadcast** | WebSocket connection that listens for events. <br> Backend broadcasts messages to connected clients every second. <br> Compare latency and concurrency handling across languages. |
| **REST API: Long-running Task with Polling vs WebSockets** | **Polling approach:** `GET /long-task/{id}` <br> Client sends a request, and backend takes 5 seconds to process before returning a response. <br> Client continuously polls the endpoint to check for completion. <br> **WebSocket approach:** WebSocket notifies the frontend when processing is complete. <br> Compare efficiency of polling vs WebSockets in different languages. |
| **Database Query Simulation** | Simulate an I/O-heavy operation with PostgreSQL. <br> **Endpoint:** `GET /data` <br> Query a large dataset from PostgreSQL and returning paginated results. <br> Compare blocking vs non-blocking execution. |
| **Background Job Processing** | **Scenario:** A request triggers a job that runs in the background. <br> **Endpoint:** `POST /start-job` <br> Backend processes the job asynchronously and returns `jobId`. <br> **Endpoint:** `GET /job-status/{jobId}` <br> Returns job completion status. <br> Compare async task execution across languages. |

---

# Tech Stack for Each Backend

| **Language** | **REST Framework** | **WebSockets** | **Async Support** |
|-------------|-------------------|---------------|------------------|
| **Java** | Spring Boot (MVC/WebFlux) | Spring WebSockets | WebFlux, CompletableFuture |
| **C#** | ASP.NET Core | SignalR | `async/await`, Background Services |
| **Go** | Gin/Echo/Fiber | `gorilla/websocket` | Goroutines, Channels |
| **Python** | FastAPI | `websockets` | `asyncio`, Background Tasks |
