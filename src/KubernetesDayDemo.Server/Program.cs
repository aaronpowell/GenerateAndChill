using Azure;
using Azure.AI.OpenAI;
using Azure.Core;
using Azure.Identity;
using KubernetesDayDemo.Server;

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

WebApplication app = builder.Build();

app.MapRoutes();

app.Run();
