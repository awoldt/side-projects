# Use the official .NET SDK image as a build environment
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /App

# Copy everything
COPY . ./

# Restore as distinct layers
RUN dotnet restore

# Build and publish a release
RUN dotnet publish -c Release -o out

# Use the official .NET runtime image as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App

# Install dependencies for headless Chrome
RUN apt-get update && apt-get install -y \
    wget \
    --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy the published application from the build environment
COPY --from=build-env /App/out .

# Expose the port
EXPOSE 8080

# Run the application
ENTRYPOINT ["dotnet", "server.dll"]
