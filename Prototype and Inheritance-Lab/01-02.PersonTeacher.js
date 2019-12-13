function PersonTeacher(){
    class Person{
        constructor(n,e){
            this.name=n;
            this.email=e;
        }
        toString(){
            return "Person "+`(name: ${this.name}, email: ${this.email})`
        }
    }
    class Teacher extends Person{
        constructor(n,e,subj){
            super(Person)
            this.name= n; 
            this.email =e;
            this.subject=subj;
        }
        toString(){
            return "Teacher "+`(name: ${this.name}, email: ${this.email}`+`, subject: ${this.subject})`
            
        }
    }
    class Student extends Person{
        constructor(n,e,c){
            super(Person)
            this.name=n;
            this.email=e;
            this.course = c;
        }
        toString(){
            return "Student "+`(name: ${this.name}, email: ${this.email}`+`, course: ${this.course})`
        }
    }
    return {
        Person,
        Teacher,
        Student
    }
}
let classes = new PersonTeacher();
let Person = classes.Person;
let Teacher = classes.Teacher;
let Student = classes.Student;
let p = new Person("Ivan","abv.bg");
let t = new Teacher("Dragiev","DragievForStudents@abv.bg","math")
let s = new Student("Pesho","Peshoab.v@bg","math");

console.log(p.toString());
console.log(t.toString());
console.log(s.toString());
