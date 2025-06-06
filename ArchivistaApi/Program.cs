using Microsoft.EntityFrameworkCore;
using ArchivistaApi.Data;
using ArchivistaApi.Services;
using ArchivistaApi.Config;

var builder = WebApplication.CreateBuilder(args);

// Configure secrets
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

// Configure strongly typed settings
var appSecrets = new AppSecrets();
builder.Configuration.GetSection("Database").Bind(appSecrets.Database);
builder.Configuration.GetSection("Jwt").Bind(appSecrets.Jwt);

// Add services to the container.
builder.Services.AddDbContext<ArchivistaContext>(options =>
    options.UseNpgsql(appSecrets.Database.GetConnectionString()));

// Register application services
builder.Services.AddApplicationServices(builder.Configuration);

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
