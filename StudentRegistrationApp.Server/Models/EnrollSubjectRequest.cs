namespace StudentRegistrationApp.Server.Models
{
    public class EnrollSubjectRequest
    {
        public required string DocumentNumber { get; set; }
        public required List<int> Subjects { get; set; }
    }
}
