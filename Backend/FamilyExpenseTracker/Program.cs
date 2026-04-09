using Microsoft.EntityFrameworkCore;
using FamilyExpenseTracker.Models;
using FamilyExpenseTracker.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace FamilyExpenseTracker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // === Đăng ký DbContext ===
            builder.Services.AddDbContext<QuanLyChiTieuDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // === Đăng ký Services ===
            builder.Services.AddScoped<IGiaoDichService, GiaoDichService>();
            builder.Services.AddScoped<IDanhMucService, DanhMucService>();
            builder.Services.AddScoped<INguoiDungService, NguoiDungService>();
            builder.Services.AddScoped<IEmailService, EmailService>();

            // === Cấu hình CORS (Mở thoáng để test nhanh) ===
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            // Thiết lập Port cho Railway/Docker
            var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
            builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

            // === Cấu hình JWT ===
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],
                    ValidateLifetime = true
                };
            });

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // THỨ TỰ MIDDLEWARE QUAN TRỌNG:
            // 1. Dùng Swagger cho cả môi trường Production để dễ debug
            app.UseSwagger();
            app.UseSwaggerUI();

            // 2. Kích hoạt CORS ngay sau Build
            app.UseCors("AllowAll");

            app.UseStaticFiles();

            // 3. Auth luôn nằm sau CORS
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}