using Azure;
using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Mvc;

namespace KubernetesDayDemo.Server;

public static class Routes
{
    static readonly string SystemPrompt = """
        You are an image generating AI that is an expert on Azure, Microsoft technologies, Kubernetes, containers, and the cloud.
        People will use you to generate images of how they are going to use their free time now that they don't have to manage infrastructure.
        Do not include text in the image.
        If no style of the image has been provided, use one of the following styles:
        - Watercolour painting
        - Oil painting
        - Sketch
        - Cartoon

        Use the following prompt to generate the image:
        """;

    public static void MapRoutes(this WebApplication app)
    {
        app.MapPost("/generate/image", async ([FromServices] OpenAIClient client, [FromBody] ImageGenerationPayload body) =>
        {
            Response<ImageGenerations> response = await client.GetImageGenerationsAsync(new ImageGenerationOptions
            {
                ImageCount = 1,
                Prompt = SystemPrompt + "\n" + body.Prompt,
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
            });
        });
    }
}
