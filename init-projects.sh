# Add color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BOLD}🚀 Initializing backend projects...${NC}\n"

echo -e "${BLUE}📦 Initializing Python project${NC}"

mkdir python-backend
cd python-backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install fastapi uvicorn[standard] websockets asyncpg python-dotenv
pip freeze > requirements.txt

echo -e "${GREEN}✅ Created Python project${NC}\n"

cd ..

echo -e "${BLUE}📦 Initializing Java project${NC}"

mkdir java-backend
cd java-backend
# Using Spring Initializr via curl to create a new project
curl https://start.spring.io/starter.tgz -d dependencies=web,webflux,websocket,data-jpa,postgresql,lombok -d type=gradle-project -d bootVersion=3.2.3 -d baseDir=. -d groupId=com.asyncbench -d artifactId=java-backend -d name=java-backend -d description="Java Backend for AsyncBench" -d packageName=com.asyncbench -d javaVersion=17 | tar -xzvf -

echo -e "${GREEN}✅ Created Java project${NC}\n"

cd ..

echo -e "${BLUE}📦 Initializing Go project${NC}"

mkdir go-backend
cd go-backend
go mod init asyncbench
# Install necessary dependencies
go get github.com/gin-gonic/gin
go get github.com/gorilla/websocket
go get github.com/lib/pq
go get github.com/joho/godotenv

echo -e "${GREEN}✅ Created Go project${NC}\n"

cd ..

echo -e "${BLUE}📦 Initializing C# project${NC}"

mkdir csharp-backend
cd csharp-backend
dotnet new webapi --name AsyncBench
cd AsyncBench
dotnet add package Microsoft.AspNetCore.SignalR
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design

echo -e "${GREEN}✅ Created C# project${NC}\n"

cd ../..