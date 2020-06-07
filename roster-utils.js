/*
 *	Prints a table in the console of all the classes for the teacher.
 */
function findClasses(teacher) {

	const myClassesOnlyCheckbox = document.getElementById('my-classes');
	const numClasses = document.querySelectorAll('.pure-input-1-3 option').length;

	if (numClasses < 40) {
		myClassesOnlyCheckbox.click();
		setTimeout(() => {
			buildTable();
		}, 1000);
	} else {
		buildTable();
	}

	function buildTable() {
		const options = Array.from(document.querySelectorAll('.pure-input-1-3 option'));
	  console.table(
	  	options
	  	.filter(option => option.textContent.match(new RegExp(teacher, 'gi')))
	  	.map(option => ({ className: option.textContent, classNumber: option.value }))
	  );
	}

}


/*
 *	Switches the teach tool to the roster page for the given classNumber.
 * 	You can get the classNumber by using the findClasses helper-function.
 */
function selectClass(classNumber) {
	const options = Array.from(document.querySelectorAll('.pure-input-1-3 option'));
	const index = options.findIndex(option => option.value == classNumber);
	
	window.location = `${window.origin}/teach/#roster/class/${classNumber}`;
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


