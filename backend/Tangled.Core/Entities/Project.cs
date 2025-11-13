using Tangled.Core.Enums;

namespace Tangled.Core.Entities;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public CraftType CraftType { get; set; }
    public ProjectStatus Status { get; set; }
    public string? PatternName { get; set; }
    public string? PatternLink { get; set; }
    public string? HookOrNeedleSize { get; set; }
    public string? Notes { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? CompletionDate { get; set; }
    public bool IsFavorite { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<ProjectMaterial> ProjectMaterials { get; set; } = new List<ProjectMaterial>();
    public ICollection<ProjectImage> ProjectImages { get; set; } = new List<ProjectImage>();
}
