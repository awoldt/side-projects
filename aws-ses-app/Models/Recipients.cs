using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Recipients
{
    [Key]
    public Guid Id { get; set; }

    // Define foreign key property to establish the relationship
    [ForeignKey("EmailDetails")]
    public Guid EmailId { get; set; }
    
    // Navigation property to represent the relationship
    public EmailDetails EmailDetails { get; set; }

    public string EmailAddress { get; set; }
}