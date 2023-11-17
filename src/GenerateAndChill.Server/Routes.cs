using Azure;
using Azure.AI.OpenAI;
using Azure.Data.Tables;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;

namespace GenerateAndChill.Server;

public static class Routes
{
    private const string ContainerName = "images";
    private const string ErrorContainer = "errors";
    static readonly string SystemPrompt = """
        You an AI tasked with generating prompts to create images for people.

        A starting prompt will be provided.
        If the prompt isn't in English, translate it to English first.
        If there is no style in the prompt, choose a random style from the following list:
        - Realistic
        - Sketch
        - Cartoon
        - Watercolour painting
        - Oil painting

        Return a new prompt to give to the image generator.
        """;

    public static void MapRoutes(this WebApplication app)
    {
        app.MapPost("/api/image/generate", HandleImageGeneration);
        app.MapGet("/api/image/{id}", HandleImageRetrieval);
    }

    private static async Task<IResult> HandleImageRetrieval([FromServices] TableServiceClient tableClient, [FromServices] BlobServiceClient blobClient, string id)
    {
        TableClient table = tableClient.GetTableClient(ContainerName);
        await table.CreateIfNotExistsAsync();
        Response<TableEntity> response = await table.GetEntityAsync<TableEntity>(id, id);
        TableEntity entity = response.Value;

        if (entity is null)
        {
            return Results.NotFound();
        }

        return Results.Ok(new
        {
            Id = id,
            ImageUri = $"{entity["ImageUri"]}",
            DetailedPrompt = entity["DetailedPrompt"].ToString(),
            OriginalPrompt = entity["OriginalPrompt"].ToString(),
        });
    }

    private static async Task<IResult> HandleImageGeneration(
            [FromServices] OpenAIClient client,
            [FromServices] BlobServiceClient blobClient,
            [FromServices] TableServiceClient tableClient,
            IConfiguration config,
            [FromBody] ImageGenerationPayload body)
    {
        string prompt = body.Prompt;
        Guid id = Guid.NewGuid();

        try
        {
            string generatedPrompt = await GeneratePrompt(client, config, prompt);

            ImageGenerations generations = await GenerateImage(client, generatedPrompt);

            if (generations is null || generations.Data.Count != 1)
            {
                return Results.BadRequest("Something caused it to not generate an image");
            }

            Uri imageUri = await UploadImage(blobClient, id, generations);
            await StorePrompt(tableClient, generatedPrompt, body.Prompt, id, imageUri);

            return Results.Ok(new
            {
                Id = id,
                ImageUri = $"{imageUri.AbsoluteUri}",
                DetailedPrompt = prompt,
                OriginalPrompt = body.Prompt,
            });
        }
        catch (RequestFailedException ex)
        {
            TableClient table = tableClient.GetTableClient(ErrorContainer);
            await table.CreateIfNotExistsAsync();
            await table.UpsertEntityAsync(new TableEntity(id.ToString(), id.ToString()) {
                { "Error", ex.ToString() },
                { "Prompt", body.Prompt },
                { "Type", "RequestFailedException" }
            });
            return Results.BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            TableClient table = tableClient.GetTableClient(ErrorContainer);
            await table.CreateIfNotExistsAsync();
            await table.UpsertEntityAsync(new TableEntity(id.ToString(), id.ToString()) {
                { "Error", ex.ToString() },
                { "Prompt", body.Prompt },
                { "Type", "Exception" }
            });
            return Results.Problem(ex.Message, statusCode: 500);
        }
    }

    private static async Task<string> GeneratePrompt(OpenAIClient client, IConfiguration config, string prompt)
    {
        ChatCompletionsOptions chatCompletionsOptions = new([new ChatMessage(ChatRole.System, SystemPrompt),
            new ChatMessage(ChatRole.User, prompt)])
        {
            MaxTokens = 64,
            Temperature = 0.1f
        };

        Response<ChatCompletions> response = await client.GetChatCompletionsAsync(config["Azure:OpenAIModelName"], chatCompletionsOptions);

        return response.Value.Choices[0].Message.Content;
    }

    private static async Task StorePrompt(TableServiceClient tableClient, string prompt, string originalPrompt, Guid id, Uri imageUri)
    {
        TableClient table = tableClient.GetTableClient(ContainerName);
        await table.CreateIfNotExistsAsync();
        await table.UpsertEntityAsync(new TableEntity(id.ToString(), id.ToString())
            {
                { "ImageUri", imageUri.ToString() },
                { "DetailedPrompt",  prompt },
                { "OriginalPrompt", originalPrompt }
            });
    }

    private static async Task<ImageGenerations> GenerateImage(OpenAIClient client, string prompt)
    {
        Response<ImageGenerations> response = await client.GetImageGenerationsAsync(new ImageGenerationOptions
        {
            ImageCount = 1,
            Prompt = prompt,
            Size = ImageSize.Size512x512,
            User = "user",
        });

        ImageGenerations generations = response.Value;
        return generations;
    }

    private static async Task<Uri> UploadImage(BlobServiceClient blobClient, Guid id, ImageGenerations generations)
    {
        BlobContainerClient container = blobClient.GetBlobContainerClient(ContainerName);
        await container.CreateIfNotExistsAsync(Azure.Storage.Blobs.Models.PublicAccessType.Blob);
        Uri imageUri = generations.Data[0].Url;
        using HttpClient httpClient = new();
        using Stream imageStream = await httpClient.GetStreamAsync(imageUri);
        BlobClient blob = container.GetBlobClient($"{id}.png");
        await blob.UploadAsync(imageStream, overwrite: true);

        return blob.Uri;
    }
}
