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

// Project Images endpoints
app.MapPost("/api/projects/{id}/images", async (int id, IFormFile file, TangledDbContext db) =>
{
    var project = await db.Projects.FindAsync(id);
    if (project is null) return Results.NotFound();

    // Create uploads directory if it doesn't exist
    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "projects", id.ToString());
    Directory.CreateDirectory(uploadsPath);

    // Generate unique filename
    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    var filePath = Path.Combine(uploadsPath, fileName);

    // Save file
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }

    // Create database record
    var projectImage = new ProjectImage
    {
        ProjectId = id,
        FileName = file.FileName,
        FilePath = $"/uploads/projects/{id}/{fileName}",
        UploadedAt = DateTime.UtcNow
    };

    db.ProjectImages.Add(projectImage);
    await db.SaveChangesAsync();

    return Results.Created($"/api/projects/{id}/images/{projectImage.Id}", projectImage);
}).DisableAntiforgery();

app.MapDelete("/api/projects/{projectId}/images/{imageId}", async (int projectId, int imageId, TangledDbContext db) =>
{
    var image = await db.ProjectImages
        .FirstOrDefaultAsync(pi => pi.Id == imageId && pi.ProjectId == projectId);
    
    if (image is null) return Results.NotFound();

    // Delete physical file
    var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", image.FilePath.TrimStart('/'));
    if (File.Exists(physicalPath))
    {
        File.Delete(physicalPath);
    }

    db.ProjectImages.Remove(image);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Materials endpoints
app.MapGet("/api/materials", async (TangledDbContext db) =>
    await db.Materials
        .Include(m => m.MaterialImages)
        .ToListAsync());

app.MapGet("/api/materials/{id}", async (int id, TangledDbContext db) =>
    await db.Materials
        .Include(m => m.MaterialImages)
        .FirstOrDefaultAsync(m => m.Id == id) is Material material
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

// Material Images endpoints
app.MapPost("/api/materials/{id}/images", async (int id, IFormFile file, TangledDbContext db) =>
{
    var material = await db.Materials.FindAsync(id);
    if (material is null) return Results.NotFound();

    // Create uploads directory if it doesn't exist
    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "materials", id.ToString());
    Directory.CreateDirectory(uploadsPath);

    // Generate unique filename
    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    var filePath = Path.Combine(uploadsPath, fileName);

    // Save file
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }

    // Create database record
    var materialImage = new MaterialImage
    {
        MaterialId = id,
        FileName = file.FileName,
        FilePath = $"/uploads/materials/{id}/{fileName}",
        UploadedAt = DateTime.UtcNow
    };

    db.MaterialImages.Add(materialImage);
    await db.SaveChangesAsync();

    return Results.Created($"/api/materials/{id}/images/{materialImage.Id}", materialImage);
}).DisableAntiforgery();

app.MapDelete("/api/materials/{materialId}/images/{imageId}", async (int materialId, int imageId, TangledDbContext db) =>
{
    var image = await db.MaterialImages
        .FirstOrDefaultAsync(mi => mi.Id == imageId && mi.MaterialId == materialId);
    
    if (image is null) return Results.NotFound();

    // Delete physical file
    var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", image.FilePath.TrimStart('/'));
    if (File.Exists(physicalPath))
    {
        File.Delete(physicalPath);
    }

    db.MaterialImages.Remove(image);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Project Ideas endpoints
app.MapGet("/api/projectideas", async (TangledDbContext db) =>
    await db.ProjectIdeas
        .Include(pi => pi.ProjectIdeaImages)
        .ToListAsync());

app.MapGet("/api/projectideas/{id}", async (int id, TangledDbContext db) =>
    await db.ProjectIdeas
        .Include(pi => pi.ProjectIdeaImages)
        .FirstOrDefaultAsync(pi => pi.Id == id) is ProjectIdea idea
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

// Project Idea Images endpoints
app.MapPost("/api/projectideas/{id}/images", async (int id, IFormFile file, TangledDbContext db) =>
{
    var projectIdea = await db.ProjectIdeas.FindAsync(id);
    if (projectIdea is null) return Results.NotFound();

    // Create uploads directory if it doesn't exist
    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "projectideas", id.ToString());
    Directory.CreateDirectory(uploadsPath);

    // Generate unique filename
    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    var filePath = Path.Combine(uploadsPath, fileName);

    // Save file
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }

    // Create database record
    var projectIdeaImage = new ProjectIdeaImage
    {
        ProjectIdeaId = id,
        FileName = file.FileName,
        FilePath = $"/uploads/projectideas/{id}/{fileName}",
        UploadedAt = DateTime.UtcNow
    };

    db.ProjectIdeaImages.Add(projectIdeaImage);
    await db.SaveChangesAsync();

    return Results.Created($"/api/projectideas/{id}/images/{projectIdeaImage.Id}", projectIdeaImage);
}).DisableAntiforgery();

app.MapDelete("/api/projectideas/{projectIdeaId}/images/{imageId}", async (int projectIdeaId, int imageId, TangledDbContext db) =>
{
    var image = await db.ProjectIdeaImages
        .FirstOrDefaultAsync(pii => pii.Id == imageId && pii.ProjectIdeaId == projectIdeaId);
    
    if (image is null) return Results.NotFound();

    // Delete physical file
    var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", image.FilePath.TrimStart('/'));
    if (File.Exists(physicalPath))
    {
        File.Delete(physicalPath);
    }

    db.ProjectIdeaImages.Remove(image);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
