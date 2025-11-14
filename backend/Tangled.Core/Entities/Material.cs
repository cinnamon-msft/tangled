using Tangled.Core.Enums;

namespace Tangled.Core.Entities;

public class Material
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string? Color { get; set; }
    public YarnWeight? Weight { get; set; }
    public string? FiberContent { get; set; }
    public int? Yardage { get; set; }
    public int? RemainingYardage { get; set; }
    public int? SkeinQuantity { get; set; }
    public string? DyeLot { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public string? PurchasedAt { get; set; }
    public decimal? PurchasePrice { get; set; }
    public string? ImageUrl { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<ProjectMaterial> ProjectMaterials { get; set; } = new List<ProjectMaterial>();
    public ICollection<MaterialImage> MaterialImages { get; set; } = new List<MaterialImage>();
}
