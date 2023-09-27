#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0-preview AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0-preview AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GenerateAndChill.Server/GenerateAndChill.Server.csproj", "GenerateAndChill.Server/"]
RUN dotnet restore "GenerateAndChill.Server/GenerateAndChill.Server.csproj"
COPY . .
WORKDIR "/src/GenerateAndChill.Server"
RUN dotnet build "GenerateAndChill.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "GenerateAndChill.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GenerateAndChill.Server.dll"]