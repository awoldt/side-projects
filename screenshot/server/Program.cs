using System.Diagnostics;
using Google.Cloud.Storage.V1;
using PuppeteerSharp;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "MyAllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "https://screenshot-omega-seven.vercel.app")
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("MyAllowSpecificOrigins");
app.UseHttpsRedirection();

var browserFetcher = new BrowserFetcher();
await browserFetcher.DownloadAsync();
var browser = await Puppeteer.LaunchAsync(new LaunchOptions
{
    Headless = true,
    Args = ["--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--mute-audio"
        ]
});

app.MapGet("/", () =>
{
    return Results.Json(new ApiResponse<string>(true, "Hello", "Hello"));
});

app.MapPost("/", async (HttpRequest req) =>
{
    try
    {
        string? site = req.Query["site"];
        string? apiKey = req.Query["api_key"];

        if (site == null || apiKey == null)
        {
            return Results.Json(new ApiResponse<string>(false, "Missing url queries", null));
        }

        // first, get the user sending in the request
        // need to find them by api_key submitted in the url
        var user = await SupabaseService.GetUser(apiKey);
        if (user == null)
        {
            return Results.Json(new ApiResponse<string>(false, "Could not get user supabase record", null));
        }

        if (user.Models.FirstOrDefault().ScreenshotsRemaining == 0)
        {
            return Results.Json(new ApiResponse<string>(false, "You have no more remaining screenshots", null));
        }

        // take screenshot
        var page = await browser.NewPageAsync();
        await page.SetRequestInterceptionAsync(true);
        page.Request += (sender, e) =>
        {
            var request = e.Request;
            // Define the resource types you want to ignore
            var ignoredResourceTypes = new List<string> { "font", "media", };
            var ignoredFileExtensions = new List<string> { ".gltf", ".glb", ".obj", ".fbx", ".dae", ".3ds", ".stl", ".ply" };

            var url = request.Url.ToLower();
            if (ignoredResourceTypes.Contains(request.ResourceType.ToString()) || ignoredFileExtensions.Any(ex => url.EndsWith(ex)))
            {
                request.AbortAsync();
            }
            else
            {
                request.ContinueAsync();
            }
        };

        await page.GoToAsync(site);
        string randomFilename = Utils.GenerateRandomFilename();
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "imgs");
        string savedImgPath = $"{filePath}/{randomFilename}";

        // see if imgs directory on server exists, if not create
        if (!Directory.Exists(filePath))
        {
            Directory.CreateDirectory(filePath);
        }

        Stopwatch stopwatch = new Stopwatch();
        stopwatch.Start();
        await page.ScreenshotAsync(savedImgPath);
        stopwatch.Stop();
        var exactScreenshotTime = DateTime.UtcNow.ToString();
        await page.CloseAsync();

        // save to google cloud
        await Utils.UploadToGoogleCloud(savedImgPath, randomFilename);

        // get the file size 
        FileInfo fi = new(savedImgPath);

        // save screenshot details in screenshot table
        await SupabaseService.InsertScreenshotRecord(user.Models.FirstOrDefault().Id, $"https://storage.googleapis.com/screenshot_uploads/{randomFilename}", site, exactScreenshotTime, stopwatch.ElapsedMilliseconds, fi.Length);

        // subtract remaining screenshot by 1 and save user record
        await SupabaseService.UpdateRemainingScreenshots(user.Models.FirstOrDefault().Id, user.Models.FirstOrDefault().ScreenshotsRemaining);

        // delete screenshot saved on server
        File.Delete(savedImgPath);

        return Results.Json(new ApiResponse<object>(true, "Screenshot taken successfully", new { url = $"https://storage.googleapis.com/screenshot_uploads/{randomFilename}", remainingScreenshots = user.Models.FirstOrDefault().ScreenshotsRemaining - 1 }));
    }
    catch (System.Exception err)
    {
        Console.WriteLine(err);
        return Results.Json(new ApiResponse<string>(false, err.ToString(), null));
    }
});

app.Run();

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }

    public ApiResponse(bool success, string message, T? data)
    {
        Success = success;
        Message = message;
        Data = data;
    }
}
