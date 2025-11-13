namespace Tangled.Core.Entities;

public class ProjectMaterial
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public int MaterialId { get; set; }
    public int? YardsUsed { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Project Project { get; set; } = null!;
    public Material Material { get; set; } = null!;
}
