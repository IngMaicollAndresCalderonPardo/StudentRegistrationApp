namespace StudentRegistrationApp.Server.Models
{
    public class Subject
    {
        public int SubjectId { get; set; }
        public string Name { get; set; } = null!;
        public int Credits { get; set; } = 3;

        public int ProfessorId { get; set; }
        public Professor? Professor { get; set; }

        public ICollection<ProfessorSubject> ProfessorSubjects { get; set; } = new List<ProfessorSubject>();
        public ICollection<StudentSubject> StudentSubjects { get; set; } = new List<StudentSubject>();
    }
}
