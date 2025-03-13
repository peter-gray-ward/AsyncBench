using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:5173") // Allow requests from React frontend
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()); // Required if frontend sends cookies/auth
});

builder.Services.AddOpenApi();

var app = builder.Build();
string NAME = "C#/.NET";

app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/all-posts", async () =>
{
    var posts = new List<Post>();

    // Load environment variables (assuming you use `env.json` in .NET's configuration)
    var config = app.Configuration;
    string connectionString = config.GetConnectionString("DefaultConnection");

    await using var connection = new NpgsqlConnection(connectionString);
    await connection.OpenAsync();

    string sql = "SELECT post_number, datetime, username, text, raw_sentiment_score, positive_sentiment FROM posts";
    await using var command = new NpgsqlCommand(sql, connection);
    await using var reader = await command.ExecuteReaderAsync();

    while (await reader.ReadAsync())
    {
        posts.Add(new Post(
            reader.GetInt32(0),
            reader.GetDateTime(1),
            reader.IsDBNull(2) ? null : reader.GetString(2),
            reader.IsDBNull(3) ? null : reader.GetString(3),
            reader.IsDBNull(4) ? null : reader.GetDouble(4),
            reader.IsDBNull(5) ? null : reader.GetBoolean(5)
        ));
    }

    return Results.Ok(new {
        name = NAME,
        posts = posts
    });
})
.WithName("GetAllPosts");

app.Run();

record Post(
    int PostNumber,
    DateTime DateTime,
    string? UserName,
    string? Text,
    double? RawSentimentScore,
    bool? PositiveSentiment
);
