using System.CodeDom.Compiler;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

public enum TimePeriod
{
    Today,
    Yesterday,
    Week,
    Month,
    YearToDate
}

public class OpenAIRequest
{
    public class Message
    {
        [JsonPropertyName("role")]
        public string Role { get; set; }
        [JsonPropertyName("content")]
        public string Content { get; set; }
    }

    [JsonPropertyName("model")]
    public string Model { get; set; }
    [JsonPropertyName("messages")]
    public Message[] Messages { get; set; }
}

public class AI
{
    private readonly string OpenAIChatUrl = "https://api.openai.com/v1/chat/completions";
    public TimePeriod Time;
    private string ApiKey;
    private readonly HttpClient Client;

    public AI(HttpClient client, string OpenAIApiKey = "")
    {
        if (OpenAIApiKey == "")
        {
            Console.WriteLine("You must supply an OpenAI Api key to generate responses.");
            Environment.Exit(0);
        }
        Client = client;
        ApiKey = OpenAIApiKey;
        Time = SetTimePeriod(); // makes user select the time period
    }

    public TimePeriod SetTimePeriod()
    {
        int CursorPosition = 0;
        var Times = Enum.GetValues<TimePeriod>();

        while (true)
        {
            Console.Clear();
            for (int i = 0; i < Times.Length; i++)
            {
                Console.WriteLine(i == CursorPosition ? $"> {Times[i]}" : Times[i]);
            }
            var k = Console.ReadKey();
            switch (k.Key)
            {
                case ConsoleKey.UpArrow:
                    {
                        if (CursorPosition != 0) CursorPosition--;
                        break;
                    }

                case ConsoleKey.DownArrow:
                    {
                        if (CursorPosition != Times.Length - 1) CursorPosition++;
                        break;
                    }

                case ConsoleKey.Enter:
                    {
                        return Times[CursorPosition];
                    }
            }
        }
    }

    public async Task<string?> GenerateResponse(TimePeriod T)
    {
        string? Prompt = SetPrompt(T);
        if (Prompt == null) return null;

        OpenAIRequest Req = new OpenAIRequest
        {
            Model = "gpt-4o",
            Messages =
            [
                new OpenAIRequest.Message
                {
                    Role = "developer",
                    Content = "You are to return json data in this exact format: {\"dow\": NUMBER, \"s&p\": NUMBER, \"nasdaq\": NUMBER}. The numbers represent percentage values."
                },
                new OpenAIRequest.Message {
                    Role = "user",
                    Content = Prompt
                }
            ]
        };

        try
        {
            HttpContent body = new StringContent(JsonSerializer.Serialize(Req), Encoding.UTF8, "application/json");
            Client.DefaultRequestHeaders.Add("Authorization", $"Bearer {ApiKey}");

            HttpResponseMessage res = await Client.PostAsync(OpenAIChatUrl, body);


            Console.WriteLine(await res.Content.ReadAsStringAsync());

            return "nice";
        }
        catch (System.Exception)
        {
            return null;
        }
    }

    public string? SetPrompt(TimePeriod T)
    {
        TimeZoneInfo TZ = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time"); // we using east coast time bitches
        DateTime Now = DateTime.UtcNow;
        DateTime Est = TimeZoneInfo.ConvertTimeFromUtc(Now, TZ);

        int MarketClose = 16; // 4pm est

        switch (T)
        {
            case TimePeriod.Today: return $"How {(Est.Hour >= MarketClose ? "did" : "has")} the stock market performed today";
            case TimePeriod.Yesterday: return $"How did the stock market perform yesterday";
            case TimePeriod.Week: return $"How has the stock market in the past 5 trading days";
            case TimePeriod.Month: return $"How has the stock market performed in the 30 trading days";
            case TimePeriod.YearToDate: return $"How has the stock market performed year to date";
        }
        return null;
    }
}