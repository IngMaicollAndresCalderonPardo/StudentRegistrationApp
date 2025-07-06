namespace StudentRegistrationApp.Server.Models
{
    public class ProfessorSubject
    {
        public int ProfessorId { get; set; }
        public Professor Professor { get; set; } = null!;
        public int SubjectId { get; set; }
        public Subject Subject { get; set; } = null!;
    }
}
