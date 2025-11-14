namespace Tangled.Core.Entities;

public class ProjectIdeaImage
{
    public int Id { get; set; }
    public int ProjectIdeaId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }

    // Navigation properties
    public ProjectIdea ProjectIdea { get; set; } = null!;
}
