using Microsoft.EntityFrameworkCore;
using ArchivistaApi.Data;
using ArchivistaApi.Services;
using ArchivistaApi.Config;
using ArchivistaApi.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Configure secrets
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

// Configure strongly typed settings
var appSecrets = builder.Configuration.Get<AppSecrets>();
if (appSecrets == null)
{
    throw new InvalidOperationException("Application secrets configuration is missing or invalid.");
}

// Register AppSecrets as a service
builder.Services.AddSingleton(appSecrets);

// Add services to the container.
builder.Services.AddDbContext<ArchivistaContext>(options =>
    options.UseNpgsql(appSecrets.Database.GetConnectionString()));

// Register DatabaseSeeder
builder.Services.AddScoped<DatabaseSeeder>();

// Register application services
builder.Services.AddApplicationServices(builder.Configuration);

// Register UserService
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var seeder = services.GetRequiredService<DatabaseSeeder>();
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
        throw; // Re-throw the exception if you want to prevent the app from starting with an unseeded database
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // In development, don't redirect to HTTPS
    app.UseHttpsRedirection();
}

// Use CORS
app.UseCors("AllowAll");

// Add authentication & authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
