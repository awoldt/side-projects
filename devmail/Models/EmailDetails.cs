using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class EmailDetails
{
    [Key]
    public Guid Id { get; set; }

    // Define foreign key property to establish the relationship
    [ForeignKey("SentByUser")]
    public string SentByUserId { get; set; }
    
    // Navigation property to represent the relationship
    public AppUser SentByUser { get; set; }

    public string EmailBody { get; set; }
    public DateTime SentOn { get; set; }

    // Navigation property to represent the relationship
    public ICollection<Recipients> Recipients { get; set; }
}