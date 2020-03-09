-   Brief overview of your authentication code and how you implemented it (including any code or libraries you needed) (3pts)
-   Diagram that shows how your PoC examples work together including their routes (3pts)
-   Discussion of the grid library you used (3pts)
-   Discussion of the chart library you used (3pts)

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


## PoC Diagram
-	
![PoC diagram](https://github.com/jis216/jis216.github.io/blob/master/demo_imgs/poc-diagram.jpg)

## PoC
- Chart Library Discussion
	- Library Used: Highcharts
	- 
- Grid Library Discussion
	- Library Used: ZingGrid

## Code Location
- Grid:
- Chart:
	
## Diagram and Wireframe
- Diagram:
![Diagram](https://github.com/jis216/jis216.github.io/blob/master/demo_imgs/diagram.png)
- Wireframe:
![Wireframe](https://github.com/jis216/jis216.github.io/blob/master/demo_imgs/wireframe.png)
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTc5NDQ2NTcwOSwtNjQ3NDg5NDUxLC0xOD
IxMTE5MzgzXX0=
-->