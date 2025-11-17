namespace Tangled.Core.Entities;

public class MaterialImage
{
    public int Id { get; set; }
    public int MaterialId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }

    // Navigation properties
    public Material Material { get; set; } = null!;
}
