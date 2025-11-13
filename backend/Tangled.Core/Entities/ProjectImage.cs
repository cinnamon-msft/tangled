namespace Tangled.Core.Entities;

public class ProjectImage
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }

    // Navigation properties
    public Project Project { get; set; } = null!;
}
