
## 1. Build stage
FROM mcr.microsoft.com/dotnet/runtime:10.0 AS base
USER $APP_UID
WORKDIR /app


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copy project file first for Docker cache
COPY NotificationService.csproj ./

#Restore the nugget dependencies for the project
RUN dotnet restore	

#Copy the rest of the files/Sources to the build container
COPY . .

# Publish application
RUN dotnet publish \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

## 2. Runtime 
FROM mcr.microsoft.com/dotnet/runtime:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "NotificationService.dll"]