// ==UserScript==
// @name         Live Tab++
// @namespace    http://razboy.dev/
// @version      0.2
// @description  Appends some functions to the Live Tab of the CWHQ Teach tool that help search.
// @author       You
// @match        https://*.codewizardshq.com/teach/
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.findStudents = (name) => {
        if (unsafeWindow.learn.model._students) unsafeWindow.learn.model.students = unsafeWindow.learn.model._students;
        const studentList = []
        const sortedStudentKeys = Object.keys(unsafeWindow.learn.model.students).filter(e => e.match(new RegExp(name, "gi")))
        sortedStudentKeys.forEach(key => {
            const student = unsafeWindow.learn.model.students[key];
            const list = [student.username, student.class];
            studentList.push(list);
        })
        console.table(studentList);
        return studentList;
    }

    unsafeWindow.createTableFromStudents = (studentList) => {
        let students = studentList.split(/\s/g);
        students = students.map(student => unsafeWindow.findStudents(student)[0]);
        students = students.map(student => {
            const studentClass = unsafeWindow.learn.model.classes.find(c => c[0] == student[1]);
            if (studentClass) {
                return `${student[0]}: ${studentClass[2]} (${student[1]})`;
            } else {
                return `${student[0]}: ${student[1]}`;
            }
        });
        return students.join("\n");
    }

})();
