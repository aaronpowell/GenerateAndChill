using Azure;
using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Mvc;

namespace KubernetesDayDemo.Server;

public static class Routes
{
    static readonly string SystemPrompt = """
        If no style of the image has been provided, use one of the following styles:
        - Realistic
        - Sketch
        - Cartoon
        - Watercolour painting
        - Oil painting

        Use the following prompt to generate the image: 
        """;

    public static void MapRoutes(this WebApplication app)
    {
        app.MapPost("/api/generate/image", async ([FromServices] OpenAIClient client, [FromBody] ImageGenerationPayload body) =>
        {
            string prompt = SystemPrompt + body.Prompt;
            Response<ImageGenerations> response = await client.GetImageGenerationsAsync(new ImageGenerationOptions
            {
                ImageCount = 1,
                Prompt = prompt,
                Size = ImageSize.Size1024x1024,
                User = "user",
            });

            if (response.Value is null || response.Value.Data.Count != 1)
            {
                return Results.BadRequest("Something caused it to not generate an image");
            }

            return Results.Ok(new
            {
                ImageUri = response.Value.Data[0].Url,
                Prompt = prompt,
            });
        });
    }
}
