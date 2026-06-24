# Imagens fixas (evita camada corrompida do cache local do tag :8.0 flutuante)
FROM mcr.microsoft.com/dotnet/sdk:8.0.404-bookworm-slim AS build
WORKDIR /src

COPY backend/WebApi/webApi.csproj WebApi/
COPY backend/Application/Application.csproj Application/
COPY backend/Infra/Infra.csproj Infra/
COPY backend/Domain/Domain.csproj Domain/
COPY backend/Entities/Entities.csproj Entities/

RUN dotnet --version && dotnet restore WebApi/webApi.csproj

COPY backend/ ./

RUN dotnet publish WebApi/webApi.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0.16-bookworm-slim AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "webApi.dll"]
