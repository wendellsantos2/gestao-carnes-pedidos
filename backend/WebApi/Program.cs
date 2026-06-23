using Application.Services;
using Domain.Interfaces;
using Infra.Data;
using Infra.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICarneRepository, CarneRepository>();
builder.Services.AddScoped<ICompradorRepository, CompradorRepository>();
builder.Services.AddScoped<IPedidoRepository, PedidoRepository>();

builder.Services.AddScoped<ICarneService, CarneService>();
builder.Services.AddScoped<ICompradorService, CompradorService>();
builder.Services.AddScoped<IPedidoService, PedidoService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
