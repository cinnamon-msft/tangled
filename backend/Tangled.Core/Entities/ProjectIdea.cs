namespace Tangled.Core.Entities;

public class ProjectIdea
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? InspirationLinks { get; set; } // JSON array of URLs
    public string? EstimatedDifficulty { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<ProjectIdeaImage> ProjectIdeaImages { get; set; } = new List<ProjectIdeaImage>();
}
