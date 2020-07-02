
const scrollClassList = () => new Promise((resolve, reject) => {
	const selectClassIcon = document.querySelector('.v-input__slot');

	selectClassIcon.click();
	selectClassIcon.click();

	setTimeout(() => {
		const start = Date.now();
		const scrollDiv = document.querySelector('.v-menu__content.menuable__content__active.v-autocomplete__content');
		const scroll = () => scrollDiv.scrollTop += 200;
		const scrollInterval = setInterval(() => {
			if (Date.now() - start > 2000) {
				console.log('clearing scrollInterval');
				clearInterval(scrollInterval);
				return resolve();
			}
			scroll();
		}, 10);
	}, 500);
});

/*
 *	Prints a table in the console of all the classes for the given searchTerm.
 */
function findClasses(searchTerm) {

	const myClassesOnlyCheckbox = document.querySelector('input[type="checkbox"]');

	myClassesOnlyCheckbox.click();

	scrollClassList().then(() => {
		buildTable();
	});

	function buildTable() {
		const regExp = /\(([^)]+)\)/;
		const courses = Array.from(document.querySelectorAll('.v-list-item__title'));
	  console.table(
	  	courses
	  	.filter(course => course.textContent.match(new RegExp(searchTerm, 'gi')))
	  	.map(course => ({ className: course.textContent, classNumber: regExp.exec(course.textContent)[1] }))
	  );
	}

}


/*
 *	Switches the teach tool to the roster page for the given classNumber.
 * 	You can get the classNumber by using the findClasses helper-function.
 *	The type corresponds to the fields in the navbar, I usually use this
 *	for roster or files types.
 */
function selectClass(classNumber, type) {
	if (!type) {
		type = window.location.hash.split('/')[0];
		type = type
	} else {
		type = '#' + type;
	}
	
	window.location = `${window.origin}/teach/${type}/class/${classNumber}`;
	window.location.reload();
}


/*
 *	Writes all class credentials to the DOM in this form:
 *	
 *	Student name
 *	Codewizards login link
 * 	CWHQ username CWHQ password
 * 	
 * 	If the withScratch flag is passed as true, will add:
 * 	
 *	Scratch website link
 * 	Scratch username Scratch password (double-check these with Google Doc!)
 *
 *	Assumes that the passwords are hidden when you run the function.
 */
function getClassCredentials(withScratch = false) {

	const passwordLink = document.querySelector('th .pointer');
	passwordLink.click();

	setTimeout(() => {
		let tableRows = Array.from(document.querySelector('table').querySelectorAll('tr'));

		tableRows.splice(0, 1);

		let users = tableRows.map(row => {
		    let data = Array.from(row.querySelectorAll('td'));
		    let user = {
		        firstName: data[1].textContent,
		        lastName: data[2].textContent,
		        username: data[3].textContent,
		        password: data[7].textContent,
		    };
		    return user;
		});

		const studentInfo = document.createElement('div');

		studentInfo.style.cssText = `
			font-size: 18px;
	    padding: 24px;
	    position: absolute;
	    top: 0px;
	    left: 40%;
	    background: white;
    `;

		users.forEach(user => {
			const userDetails = document.createElement('div');

			userDetails.style.cssText = `
				margin: 24px 0;
			`;

			const name = document.createElement('p');
			const cwhqLink = document.createElement('p');
			const userCredentials = document.createElement('p');
			
			name.textContent = `${user.firstName} ${user.lastName}`;
			cwhqLink.textContent = 'https://username.codewizardshq.com/edit/';
			userCredentials.textContent = `${user.username} ${user.password}`;

			userDetails.appendChild(name);
			userDetails.appendChild(cwhqLink);
			userDetails.appendChild(userCredentials)
			
			if (withScratch) {
				const scratchLink = document.createElement('p');
				scratchLink.textContent = 'https://scratch.mit.edu/';
				const scratchLogin = document.createElement('p');
				scratchLogin.textContent = `cwhq_${user.username} cwhq1414`;
				userDetails.appendChild(scratchLink);
				userDetails.appendChild(scratchLogin);
			}
			
			studentInfo.appendChild(userDetails);


		});

		
		document.body.appendChild(studentInfo)

	}, 1000);

}



/*
 *	Returns an array of students that have studentName in their usernames. Use
 *	in combination with selectStudent if you want to easily browse all students
 *	in the 'Live' tab.
 */
function findStudent(studentName) {
	return Array.from(document.querySelectorAll('li i'))
		.map(el => el.nextSibling.textContent)
		.filter(student => student.includes(studentName));
}

/*
 *	Utility function used by selectStudent, you shouldn't need it.
 */
function findStudentElement(studentName) {
	return Array.from(document.querySelectorAll('li i'))
		.find(studentEl => studentEl.nextSibling.textContent.includes(studentName));
}

/*
 *	Has the same effect as clicking on the student's name in the 'Live' tab.
 *	Will select the student and populate their 'Show Files' area.
 */
function selectStudent(studentName) {
	const student = findStudentElement(studentName.trim());
	student.click();
	setTimeout(() => {
		Array.from(document.querySelectorAll('.pure-button.pure-button-primary')).filter(button => button.textContent == 'Show Files')[0].click();
	}, 1000);
}


/*
 *	Give the 'Code' section on the 'Live' tab a little more breathing room.
 */
function adjustLiveTabStyles() {
	document.querySelector('.main-container').setAttribute('style', 'max-width: 100% !important');
	document.querySelectorAll('.col-2').forEach(el => el.setAttribute('style', 'flex: 0 0 14.666667%'));
	document.querySelector('.col-5').setAttribute('style', 'max-width: 52.6666666667%; flex: 0 0 52.6666666667%;');
	document.querySelector('.body-2.live-col.ps').setAttribute('style', 'height: 75vh;');
}
