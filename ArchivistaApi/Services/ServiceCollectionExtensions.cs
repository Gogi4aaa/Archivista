using Microsoft.Extensions.DependencyInjection;
using ArchivistaApi.Services.Interfaces;

namespace ArchivistaApi.Services
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Register all application services here with Scoped lifetime
            // This means one instance per request
            
            // Example of how to register a service:
            services.AddScoped<IArtifactService, ArtifactService>();
            
            return services;
        }
    }
} 