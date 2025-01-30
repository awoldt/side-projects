HttpClient client = new HttpClient();
var AI = new AI(client, " - - - - - ");

await AI.GenerateResponse(AI.Time);

