# Scenarios for Comparison

Each backend will handle the following scenarios, and the React frontend will display performance metrics like response time, concurrency handling, and resource usage.

| **Scenario**                        | **What It Tests**                  | **Expected Results**                                     |
|--------------------------------------|------------------------------------|---------------------------------------------------------|
| **Large Dataset Fetch**             | Serialization & JSON encoding     | Go & C# likely faster due to better serializers        |
| **Concurrent Requests (50 Users)**  | Threading & async handling        | Go (goroutines) & .NET (async) expected to perform best |
| **WebSockets Latency**              | Event-driven response time        | Go, .NET, and WebFlux expected to handle concurrency well |
| **Long Task (Polling vs WebSockets)** | Efficient async handling         | Polling should be slowest, WebSockets fastest          |
| **Database Query Handling**         | Blocking vs non-blocking DB calls | WebFlux (R2DBC) should win over traditional JDBC       |


# Tech Stack for Each Backend

| **Language** | **REST Framework** | **WebSockets** | **Async Support** |
|-------------|-------------------|---------------|------------------|
| **Java** | Spring Boot (MVC/WebFlux) | Spring WebSockets | WebFlux, CompletableFuture |
| **C#** | ASP.NET Core | SignalR | `async/await`, Background Services |
| **Go** | Gin/Echo/Fiber | `gorilla/websocket` | Goroutines, Channels |
| **Python** | FastAPI | `websockets` | `asyncio`, Background Tasks |
