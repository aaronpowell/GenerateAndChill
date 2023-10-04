# Image Generator Sample

This sample application uses [Azure OpenAI Service](https://learn.microsoft.com/azure/ai-services/openai/) to generate images from text.

## How it works

There are two parts to the AI component of this application, initial text processing of the user prompt and image generation.

### Text Processing

To aim for consistent generation of images the text prompt provided needs to be in English and needs to have a provided style for the image to be generated. To ensure this, an initial [Chat Completion](https://learn.microsoft.com/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line&pivots=programming-language-csharp) is performed using a [System Prompt](https://learn.microsoft.com/azure/ai-services/openai/concepts/system-message) to guide the LLM into how it should generate the prompt.

The System Prompt can be found [here](./blob/main/src/GenerateAndChill.Server/Routes.cs#L13).

### Image Generation

Once the prompt has been returned from the Chat Completion it is provided to the [image model](https://learn.microsoft.com/azure/ai-services/openai/dall-e-quickstart?tabs=command-line&pivots=programming-language-csharp) to generate an image. The returned image is then stored in Azure Storage before being returned to the user.

## Running the sample

### Local development

[![Open in Codespaces](https://img.shields.io/static/v1?style=for-the-badge&label=Open+In+Codespaces&message=Open&color=brightgreen&logo=github)](https://codespaces.new/aaronpowell/GenerateAndChill)

This sample uses a [devcontainer](https://containers.dev) to prepare a development environment, meaning it can be opened in GitHub Codespaces or locally using the [VSCode Remote Containers extension](https://code.visualstudio.com/docs/remote/containers).

#### Manual setup

If you don't want to use the devcontainer you need to ensure you have the following:

- [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- [Node.js 20.x](https://nodejs.org/en/download/)
- [Azurite](https://github.com/azure/azurite)
  - Alternatively, you can use a deployed Azure Storage account
- [Azure OpenAI Service](https://learn.microsoft.com/azure/ai-services/openai/)
  - You'll need to create a new resource and note the API key and endpoint
- [Azure Developer CLI](https://aka.ms/azd)

### Provisioning Azure resources

To provision the Azure resources you can use the [Azure Developer CLI](https://aka.ms/azd) and run the following commands:

```bash
azd auth login
azd env new -n MyDemoEnv
azd provision
```

Once the deployment is complete, navgiate to the resource group in Azure and copy the OpenAI + Storage connection string into the `appsettings.Development.json` file like so:

```json
{
  "Azure": {
    "OpenAIEndpoint": "<endpoint here>",
    "OpenAIKey": "<key here>",
    "BlobStorageConnectionString": "<storage connection string here>",
    "TableStorageConnectionString": "<storage connection string here>"
  }
}
```

### Running the application

From VS Code launch the application with the `Full Stack` launch profile, which will start the .NET server, the React frontend and the [Azure Static Web Apps CLI](https://learn.microsoft.com/azure/static-web-apps/static-web-apps-cli).

Navigate to http://localhost:4280 to see the application running.

### Deploying to Azure

To deploy the application to Azure you can use the [Azure Developer CLI](https://aka.ms/azd) and run the following commands:

```bash
azd up
```

Once the deployment is complete the URL for the frontend application will be displayed in the terminal.

## License

[MIT](./LICENSE)
