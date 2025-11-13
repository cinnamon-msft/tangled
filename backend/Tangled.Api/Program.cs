using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Tangled.Core.Entities;
using Tangled.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();

// Configure JSON options to handle reference cycles
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Add DbContext with SQLite
builder.Services.AddDbContext<TangledDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=tangled.db"));

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseStaticFiles();

// Projects endpoints
app.MapGet("/api/projects", async (TangledDbContext db) =>
    await db.Projects
        .Include(p => p.ProjectMaterials)
            .ThenInclude(pm => pm.Material)
        .Include(p => p.ProjectImages)
        .ToListAsync());

app.MapGet("/api/projects/{id}", async (int id, TangledDbContext db) =>
    await db.Projects
        .Include(p => p.ProjectMaterials)
            .ThenInclude(pm => pm.Material)
        .Include(p => p.ProjectImages)
        .FirstOrDefaultAsync(p => p.Id == id)
        is Project project
            ? Results.Ok(project)
            : Results.NotFound());

app.MapPost("/api/projects", async (Project project, TangledDbContext db) =>
{
    db.Projects.Add(project);
    await db.SaveChangesAsync();
    return Results.Created($"/api/projects/{project.Id}", project);
});

app.MapPut("/api/projects/{id}", async (int id, Project project, TangledDbContext db) =>
{
    if (id != project.Id) return Results.BadRequest();
    
    db.Entry(project).State = EntityState.Modified;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/projects/{id}", async (int id, TangledDbContext db) =>
{
    var project = await db.Projects.FindAsync(id);
    if (project is null) return Results.NotFound();
    
    db.Projects.Remove(project);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Materials endpoints
app.MapGet("/api/materials", async (TangledDbContext db) =>
    await db.Materials.ToListAsync());

app.MapGet("/api/materials/{id}", async (int id, TangledDbContext db) =>
    await db.Materials.FindAsync(id) is Material material
        ? Results.Ok(material)
        : Results.NotFound());

app.MapPost("/api/materials", async (Material material, TangledDbContext db) =>
{
    db.Materials.Add(material);
    await db.SaveChangesAsync();
    return Results.Created($"/api/materials/{material.Id}", material);
});

app.MapPut("/api/materials/{id}", async (int id, Material material, TangledDbContext db) =>
{
    if (id != material.Id) return Results.BadRequest();
    
    db.Entry(material).State = EntityState.Modified;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/materials/{id}", async (int id, TangledDbContext db) =>
{
    var material = await db.Materials.FindAsync(id);
    if (material is null) return Results.NotFound();
    
    db.Materials.Remove(material);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Project Ideas endpoints
app.MapGet("/api/projectideas", async (TangledDbContext db) =>
    await db.ProjectIdeas.ToListAsync());

app.MapGet("/api/projectideas/{id}", async (int id, TangledDbContext db) =>
    await db.ProjectIdeas.FindAsync(id) is ProjectIdea idea
        ? Results.Ok(idea)
        : Results.NotFound());

app.MapPost("/api/projectideas", async (ProjectIdea idea, TangledDbContext db) =>
{
    db.ProjectIdeas.Add(idea);
    await db.SaveChangesAsync();
    return Results.Created($"/api/projectideas/{idea.Id}", idea);
});

app.MapPut("/api/projectideas/{id}", async (int id, ProjectIdea idea, TangledDbContext db) =>
{
    if (id != idea.Id) return Results.BadRequest();
    
    db.Entry(idea).State = EntityState.Modified;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/projectideas/{id}", async (int id, TangledDbContext db) =>
{
    var idea = await db.ProjectIdeas.FindAsync(id);
    if (idea is null) return Results.NotFound();
    
    db.ProjectIdeas.Remove(idea);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
