FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Projeleri kopyala
COPY ./FinFlow.API ./FinFlow.API
COPY ./FinFlow.Application ./FinFlow.Application
COPY ./FinFlow.Domain ./FinFlow.Domain
COPY ./FinFlow.Infrastructure ./FinFlow.Infrastructure

# Restore ve publish
RUN dotnet restore ./FinFlow.API/FinFlow.API.csproj
RUN dotnet publish ./FinFlow.API/FinFlow.API.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Render port
ENV ASPNETCORE_URLS=http://0.0.0.0:$PORT

ENTRYPOINT ["dotnet", "FinFlow.API.dll"]
