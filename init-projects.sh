# Add color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BOLD} Setting-up PostgreSQL\n"

brew install postgresql
pg_ctl -D /usr/local/var/postgres start

echo -e "${BOLD}🚀 Initializing backend projects...${NC}\n"

echo -e "${BLUE}📦 Initializing Python project${NC}"

mkdir python-backend
cd python-backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install fastapi uvicorn[standard] websockets asyncpg python-dotenv uvicorn
pip freeze > requirements.txt

echo -e "${GREEN}✅ Created Python project${NC}\n"

cd ..

echo -e "${BLUE}📦 Initializing Java MVC project${NC}"

# Using Spring Initializr via curl to create a new project
curl -L -G https://start.spring.io/starter.tgz \ 
     --data-urlencode dependencies=web,websocket,data-jpa,postgresql,lombok \
     --data-urlencode type=gradle-project \
     --data-urlencode bootVersion=3.3.0 \       
     --data-urlencode baseDir=java-mvc-backend \
     --data-urlencode groupId=com.asyncbench \     
     --data-urlencode artifactId=java-mvc-backend \
     --data-urlencode name=java-mvc-backend \                        
     --data-urlencode description="Java MVC Backend for AsyncBench" \
     --data-urlencode packageName=com.asyncbench.mvc \
     --data-urlencode javaVersion=17 \
     -o java-mvc-backend.tgz

echo -e "${GREEN}✅ Created Java MVC project${NC}\n"

cd ..

echo -e "${BLUE}📦 Initializing Java WebFlux project${NC}"

# Using Spring Initializr via curl to create a new project
curl -L -G https://start.spring.io/starter.tgz \
     --data-urlencode dependencies=webflux,data-r2dbc,postgresql,lombok \
     --data-urlencode type=gradle-project \
     --data-urlencode bootVersion=3.3.0 \
     --data-urlencode baseDir=java-webflux-backend \
     --data-urlencode groupId=com.asyncbench \
     --data-urlencode artifactId=java-webflux-backend \
     --data-urlencode name=java-webflux-backend \
     --data-urlencode description="Java WebFlux Backend for AsyncBench" \
     --data-urlencode packageName=com.asyncbench.webflux \
     --data-urlencode javaVersion=17 \
     -o java-webflux-backend.tgz

# Extract the downloaded project
tar -xzvf java-webflux-backend.tgz

Warning: Binary output can mess up your terminal. Use "--output -" to tell 
Warning: curl to output it to your terminal anyway, or consider "--output 
Warning: <FILE>" to save to a file.
curl: (3) Could not parse the URL, failed to set query
zsh: command not found: --data-urlencode
zsh: command not found: #
tar: Error opening archive: Failed to open 'java-webflux-backend.tgz'
echo -e "${GREEN}✅ Created Java WebFlux project${NC}\n"

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
go get github.com/gin-contrib/cors

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