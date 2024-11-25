using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Tiner.Data;
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

        return services;
    }
}