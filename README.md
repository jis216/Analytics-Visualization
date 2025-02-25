# Final
## URL & Accounts
- web app url: [https://js-cse135-pa4.web.app/](https://js-cse135-pa4.web.app/)
- grading account:
	- Admin Level:
		- email: cse135grader@gmail.com
		- password: 1234567
	- Analyst Level:
		- email: user@gmail.com
		-password: 1234567

## Authentication  Implementation
- Code
- Libraries: use Firebase SDK for Javascript, specifically firebase.app and firebase.auth 
- Client Side:
	- `/login` will sign in the user through email and password and get the idToken from Firebase. Then it will send this idToken to the endpoint `/sessionLogin` in exchange for sessionCookie
	- `/signup` will sign up the user through email and password and redirect user to `/login` page.
	- user will be redirected to `/dashboard` page after sign in. Whenever accessing this page, the page will automatically send a request to endpoint `/user-access` to see if the user can access dashboard.
	- whenever accessing `/admin` page, the page will automatically send a request to endpoint `/admin-access` to see if the user have the access to administrator resources.
- Server Side Endpoints:
	- `/sessionLogin`: verify idToken in the request and send a session cookie
	- `/user-access`:


## App Routing Diagram
![PoC diagram](/demo_imgs/poc-diagram.jpg)

## Chart & Grid
- Chart Library Discussion
	- Library Used: Highcharts
	- Charts to use:
	- a column range chart to showcase the time each loading task takes (e.g. loadEvent, DOM, request, response). [demo for column range chart](https://www.highcharts.com/demo/columnrange/dark-unica)
	- a data series plot that showcase how the average loading time changes over days. [demo for data series plot](https://www.highcharts.com/demo/line-labels/dark-unica)
	- a pie chart to showcase the percentage of time each loading task spent in the total amount of time. [demo for pie chart](https://www.highcharts.com/demo/pie-legend/dark-unica)
- Grid Library Discussion
	- Library Used: ZingGrid
	- To display the date, time, URI and related static browser info in grids. Each of the attributes mentioned is a grid column.

## Code Location
- Authentication:
	- `functions/index.js` - endpoints
	- `hosting/`
		- `login.html`
		- `signUp.html`
	- `scripts/`
		- `auth.js`
		- `firebase-init.js`
- Routing:
	- `firebase.json`
	- `hosting/`
		- `dashboard.html`
		- `admin.html` (currently just a place holder)
	- `scripts/`
		- `access-init.js`
- Grid: 
	- `hosting/reports/`
		- `browsers.js`
		- `browsers.html`
		- `grid.css`
- Chart:
	- `hosting/reports/`
		- `speed.js`
		- `speed.html`
	
## Diagram and Wireframe
- Diagram:
![Diagram](/demo_imgs/diagram.png)
- Wireframe:
![Wireframe](/demo_imgs/wireframe.png)