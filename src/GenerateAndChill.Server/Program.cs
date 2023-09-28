using Azure;
using Azure.AI.OpenAI;
using Azure.Identity;
using GenerateAndChill.Server;
using Microsoft.Extensions.Azure;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddScoped(provider =>
{
    IConfigurationSection config = builder.Configuration.GetSection("Azure");

    Uri url = new(config["OpenAIEndpoint"]!);

    OpenAIClient openAIClient = config["OpenAIKey"] switch
    {
        null => new(url, new DefaultAzureCredential()),
        string key => new(url, new AzureKeyCredential(key))
    };

    return openAIClient;
});

builder.Services.AddAzureClients(clientBuilder =>
{
    clientBuilder.AddBlobServiceClient(builder.Configuration["Azure:BlobStorageConnectionString"]);
    clientBuilder.AddTableServiceClient(builder.Configuration["Azure:TableStorageConnectionString"]);
});



WebApplication app = builder.Build();

app.MapRoutes();

app.Run();
