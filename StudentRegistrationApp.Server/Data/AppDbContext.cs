using Microsoft.EntityFrameworkCore;
using StudentRegistrationApp.Server.Models;

namespace StudentRegistrationApp.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Student> Students => Set<Student>();
        public DbSet<Subject> Subjects => Set<Subject>();
        public DbSet<Professor> Professors => Set<Professor>();
        public DbSet<ProfessorSubject> ProfessorSubjects => Set<ProfessorSubject>();
        public DbSet<StudentSubject> StudentSubjects => Set<StudentSubject>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Claves compuestas
            modelBuilder.Entity<ProfessorSubject>()
                .HasKey(ps => new { ps.ProfessorId, ps.SubjectId });

            modelBuilder.Entity<StudentSubject>()
                .HasKey(ss => new { ss.StudentId, ss.SubjectId });

            modelBuilder.Entity<Student>()
                .HasIndex(s => s.DocumentNumber)
                .IsUnique();

            // Relaciones StudentSubject <-> Subject
            modelBuilder.Entity<StudentSubject>()
                .HasOne(ss => ss.Subject)
                .WithMany(s => s.StudentSubjects)
                .HasForeignKey(ss => ss.SubjectId);

            // Relación Subject <-> Professor
            modelBuilder.Entity<Subject>()
                .HasOne(s => s.Professor)
                .WithMany(p => p.Subjects)
                .HasForeignKey(s => s.ProfessorId);

            // Relaciones StudentSubject <-> Student
            modelBuilder.Entity<StudentSubject>()
                .HasOne(ss => ss.Student)
                .WithMany(s => s.StudentSubjects)
                .HasForeignKey(ss => ss.StudentId);

            // Relaciones ProfessorSubject <-> Profesor
            modelBuilder.Entity<ProfessorSubject>()
                .HasOne(ps => ps.Professor)
                .WithMany(p => p.ProfessorSubjects)
                .HasForeignKey(ps => ps.ProfessorId);

            // Relaciones ProfessorSubject <-> Subject
            modelBuilder.Entity<ProfessorSubject>()
                .HasOne(ps => ps.Subject)
                .WithMany(s => s.ProfessorSubjects)
                .HasForeignKey(ps => ps.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Professor>().HasData(
              new Professor { ProfessorId = 1, Name = "Ken Thompson" },
              new Professor { ProfessorId = 2, Name = "Dennis Ritchie" },
              new Professor { ProfessorId = 3, Name = "Chris Lattner" },
              new Professor { ProfessorId = 4, Name = "Joel Spolsky" },
              new Professor { ProfessorId = 5, Name = "Dave Cutler" }
            );

            modelBuilder.Entity<Subject>().HasData(
              new Subject { SubjectId = 1, Name = "Estructuras de Datos", Credits = 3, ProfessorId = 2 },
              new Subject { SubjectId = 2, Name = "Algoritmos", Credits = 3, ProfessorId = 2 },
              new Subject { SubjectId = 3, Name = "Bases de Datos", Credits = 3, ProfessorId = 4 },
              new Subject { SubjectId = 4, Name = "Sistemas Operativos", Credits = 3, ProfessorId = 1 },
              new Subject { SubjectId = 5, Name = "Redes de Computadores", Credits = 3, ProfessorId = 5 },
              new Subject { SubjectId = 6, Name = "Programación Orientada a Objetos", Credits = 3, ProfessorId = 3 },
              new Subject { SubjectId = 7, Name = "Ingeniería de Software", Credits = 3, ProfessorId = 4 },
              new Subject { SubjectId = 8, Name = "Arquitectura de Computadores", Credits = 3, ProfessorId = 1 },
              new Subject { SubjectId = 9, Name = "Inteligencia Artificial", Credits = 3, ProfessorId = 5 },
              new Subject { SubjectId = 10, Name = "Desarrollo Web", Credits = 3, ProfessorId = 3 }
            );


        }
    }
}
