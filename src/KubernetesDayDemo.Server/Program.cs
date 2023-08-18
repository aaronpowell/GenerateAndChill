using Azure;
using Azure.AI.OpenAI;
using KubernetesDayDemo.Server;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped(provider =>
{
    IConfigurationSection config = builder.Configuration.GetSection("Azure");

    OpenAIClient openAIClient = new(
        new Uri(config["OpenAIEndpoint"]!),
        new AzureKeyCredential(config["OpenAIKey"]!)
    );

    return openAIClient;
});

WebApplication app = builder.Build();

app.MapRoutes();

app.Run();
