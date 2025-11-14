using Microsoft.EntityFrameworkCore;
using Tangled.Core.Entities;

namespace Tangled.Data;

public class TangledDbContext : DbContext
{
    public TangledDbContext(DbContextOptions<TangledDbContext> options)
        : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Material> Materials => Set<Material>();
    public DbSet<ProjectMaterial> ProjectMaterials => Set<ProjectMaterial>();
    public DbSet<ProjectIdea> ProjectIdeas => Set<ProjectIdea>();
    public DbSet<ProjectImage> ProjectImages => Set<ProjectImage>();
    public DbSet<MaterialImage> MaterialImages => Set<MaterialImage>();
    public DbSet<ProjectIdeaImage> ProjectIdeaImages => Set<ProjectIdeaImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Project configuration
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CraftType).IsRequired();
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
        });

        // Material configuration
        modelBuilder.Entity<Material>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
            entity.Property(e => e.PurchasePrice).HasPrecision(10, 2);
        });

        // ProjectMaterial configuration (many-to-many)
        modelBuilder.Entity<ProjectMaterial>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Project)
                .WithMany(p => p.ProjectMaterials)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Material)
                .WithMany(m => m.ProjectMaterials)
                .HasForeignKey(e => e.MaterialId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ProjectIdea configuration
        modelBuilder.Entity<ProjectIdea>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
        });

        // ProjectImage configuration
        modelBuilder.Entity<ProjectImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
            entity.HasOne(e => e.Project)
                .WithMany(p => p.ProjectImages)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MaterialImage configuration
        modelBuilder.Entity<MaterialImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
            entity.HasOne(e => e.Material)
                .WithMany(m => m.MaterialImages)
                .HasForeignKey(e => e.MaterialId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ProjectIdeaImage configuration
        modelBuilder.Entity<ProjectIdeaImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
            entity.HasOne(e => e.ProjectIdea)
                .WithMany(pi => pi.ProjectIdeaImages)
                .HasForeignKey(e => e.ProjectIdeaId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        var now = new DateTime(2025, 11, 1, 0, 0, 0, DateTimeKind.Utc);

        // Seed Materials
        modelBuilder.Entity<Material>().HasData(
            new Material
            {
                Id = 1,
                Name = "Wool-Ease Yarn",
                Brand = "Lion Brand",
                Color = "Navy",
                Weight = Core.Enums.YarnWeight.Worsted,
                FiberContent = "80% Acrylic, 20% Wool",
                Yardage = 197,
                RemainingYardage = 197,
                SkeinQuantity = 3,
                CreatedAt = now,
                UpdatedAt = now
            },
            new Material
            {
                Id = 2,
                Name = "Cotton Yarn",
                Brand = "Lily Sugar'n Cream",
                Color = "Hot Pink",
                Weight = Core.Enums.YarnWeight.Worsted,
                FiberContent = "100% Cotton",
                Yardage = 120,
                RemainingYardage = 60,
                SkeinQuantity = 2,
                CreatedAt = now,
                UpdatedAt = now
            },
            new Material
            {
                Id = 3,
                Name = "Baby Alpaca Fingering",
                Brand = "Cascade Yarns",
                Color = "Sage Green",
                Weight = Core.Enums.YarnWeight.Fingering,
                FiberContent = "100% Baby Alpaca",
                Yardage = 437,
                RemainingYardage = 437,
                SkeinQuantity = 2,
                CreatedAt = now,
                UpdatedAt = now
            }
        );

        // Seed Projects
        modelBuilder.Entity<Project>().HasData(
            new Project
            {
                Id = 1,
                Name = "Cozy Winter Scarf",
                CraftType = Core.Enums.CraftType.Knitting,
                Status = Core.Enums.ProjectStatus.Completed,
                PatternName = "Simple Garter Stitch Scarf",
                HookOrNeedleSize = "US 8",
                Notes = "Made as a gift for mom. She loved it!",
                StartDate = now.AddDays(-30),
                CompletionDate = now.AddDays(-15),
                IsFavorite = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new Project
            {
                Id = 2,
                Name = "Granny Square Blanket",
                CraftType = Core.Enums.CraftType.Crochet,
                Status = Core.Enums.ProjectStatus.InProgress,
                PatternName = "Classic Granny Square",
                HookOrNeedleSize = "5.5mm",
                Notes = "Working on this during my commute. 45 squares done, need 64 total.",
                StartDate = now.AddDays(-60),
                IsFavorite = false,
                CreatedAt = now,
                UpdatedAt = now
            },
            new Project
            {
                Id = 3,
                Name = "Floral Embroidery Hoop",
                CraftType = Core.Enums.CraftType.Embroidery,
                Status = Core.Enums.ProjectStatus.Completed,
                PatternName = "Wildflower Bouquet",
                Notes = "Used DMC floss in various colors. Framed in 8-inch hoop.",
                StartDate = now.AddDays(-20),
                CompletionDate = now.AddDays(-5),
                IsFavorite = true,
                CreatedAt = now,
                UpdatedAt = now
            }
        );

        // Seed ProjectMaterials (relationships)
        modelBuilder.Entity<ProjectMaterial>().HasData(
            new ProjectMaterial
            {
                Id = 1,
                ProjectId = 1,
                MaterialId = 1,
                YardsUsed = 250,
                CreatedAt = now
            },
            new ProjectMaterial
            {
                Id = 2,
                ProjectId = 2,
                MaterialId = 2,
                YardsUsed = 60,
                CreatedAt = now
            }
        );

        // Seed ProjectIdeas
        modelBuilder.Entity<ProjectIdea>().HasData(
            new ProjectIdea
            {
                Id = 1,
                Name = "Lace Shawl",
                Description = "Delicate triangular shawl with intricate lace pattern",
                EstimatedDifficulty = "Advanced",
                Notes = "Want to use the sage green alpaca yarn for this",
                CreatedAt = now,
                UpdatedAt = now
            },
            new ProjectIdea
            {
                Id = 2,
                Name = "Amigurumi Octopus",
                Description = "Cute stuffed octopus toy",
                EstimatedDifficulty = "Intermediate",
                CreatedAt = now,
                UpdatedAt = now
            }
        );
    }
}
