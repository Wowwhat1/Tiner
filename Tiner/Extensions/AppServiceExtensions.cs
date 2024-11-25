using Microsoft.EntityFrameworkCore;
using Tiner.Data;
using Tiner.Data.Repositories;
using Tiner.Interfaces;
using Tiner.Services;

namespace Tiner.Extensions;

public static class AppServiceExtensions {
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) {
        services.AddControllers();
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(config.GetConnectionString("DefaultConnection")));

        services.AddCors();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        return services;
    }
}