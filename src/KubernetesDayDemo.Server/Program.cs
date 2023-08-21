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

    OpenAIClient openAIClient = config["OpenAIKey"] switch
    {
        null => new(new Uri(config["OpenAIEndpoint"]!), new DefaultAzureCredential()),
        string key => new(new Uri(config["OpenAIEndpoint"]!), new AzureKeyCredential(key))
    };

    return openAIClient;
});

WebApplication app = builder.Build();

app.MapRoutes();

app.Run();
