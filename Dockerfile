FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Klasörleri FinFlow içinden kopyala
COPY ./FinFlow.API ./FinFlow.API
COPY ./FinFlow.Application ./FinFlow.Application
COPY ./FinFlow.Domain ./FinFlow.Domain
COPY ./FinFlow.Persistence ./FinFlow.Persistence

# Restore ve publish işlemleri
RUN dotnet restore ./FinFlow.API/FinFlow.API.csproj
RUN dotnet publish ./FinFlow.API/FinFlow.API.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

ENTRYPOINT ["dotnet", "FinFlow.API.dll"]

EXPOSE 80