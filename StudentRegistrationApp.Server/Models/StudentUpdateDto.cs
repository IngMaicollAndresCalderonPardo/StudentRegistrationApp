namespace StudentRegistrationApp.Server.Models
{
    public class StudentUpdateDto
    {
        public string Name { get; set; } = null!;
        public string Lastname { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string CellPhone { get; set; } = null!;
        public string Address { get; set; } = null!;
    }

}
