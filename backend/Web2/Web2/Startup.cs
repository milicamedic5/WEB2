using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web2.Data;
using Web2.Models;
using Web2.Repository;

namespace Web2
{
	public class Startup
	{
		public IConfiguration Configuration { get; }
		readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddDbContext<DataContext>(x =>
								x.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
			services.AddControllers().AddNewtonsoftJson(options =>
								options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
			services.AddScoped<IAuthRepository, AuthRepository>();
			services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
			services.AddScoped<IUnitOfWork, UnitOfWork>();
			services.AddDefaultIdentity<User>()
				  .AddRoles<IdentityRole>()
				  .AddEntityFrameworkStores<DataContext>();
			services.Configure<IdentityOptions>(options =>
			{
				options.Password.RequireDigit = false;
				options.Password.RequireNonAlphanumeric = false;
				options.Password.RequireLowercase = false;
				options.Password.RequireUppercase = false;
				options.Password.RequiredLength = 6;
			}
			);

			services.AddCors(options =>
			{
				options.AddPolicy(name: MyAllowSpecificOrigins,
								  builder =>
								  {
									  //builder.WithOrigins("http://localhost:3000");
									  builder.AllowAnyMethod();
									  builder.AllowAnyOrigin();
									  builder.AllowAnyHeader();
								  });
			});

			var key = Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:Token").Value);

			services.AddAuthentication(x =>
			{
				x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

			}).AddJwtBearer(x =>
			{
				x.RequireHttpsMetadata = false;
				x.SaveToken = false;
				x.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(key),
					ValidateIssuer = false,
					ValidateAudience = false,
					ClockSkew = TimeSpan.Zero
				};
			}).AddGoogle("Google", options =>
			{
				options.ClientId = "20750505971-rm4o3m5qtk5ra0g325v64pch5hug1qsl.apps.googleusercontent.com";
				options.ClientSecret = "W5XEbY6C8ffReoGMiidVnFi0";
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			//app.Use((context, next) =>
			//{
			//	context.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
			//	return next.Invoke();
			//});

			app.UseCors(MyAllowSpecificOrigins);

			app.UseHttpsRedirection();

			app.UseRouting();

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}
