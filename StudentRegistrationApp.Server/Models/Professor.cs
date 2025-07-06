namespace StudentRegistrationApp.Server.Models
{
    public class Professor
    {
        public int ProfessorId { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<Subject> Subjects { get; set; } = new List<Subject>();

        public ICollection<ProfessorSubject> ProfessorSubjects { get; set; } = new List<ProfessorSubject>();
    }
}
