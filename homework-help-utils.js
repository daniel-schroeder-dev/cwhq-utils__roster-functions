/*
*   studentlist is a string of space or newline seperated names
*   Contributed by: Elie
*/
unsafeWindow.createTableFromStudents = (studentList) => {
    let students = studentList.split(/\s/g);
    students = students.map(student => unsafeWindow.findStudents(student)[0]);
    students = students.map(student => {
        const studentClass = unsafeWindow.learn.model.classes.find(c => c[0] == student[1]);
        if (studentClass) {
            return student[0] + ": " + studentClass[1] + "(" + student[1] + ")";
        } else {
            return student[0] + ": " + student[1];
        }
    });
    return students.join("\n");
}
