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
	- user will be redirected to `/dashboard` page after sign in. Whenever accessing this page, the page will automatically send a request to endpoint `/user-access` to see if the user can access dashboard ().
- Server Side:
	- 


## PoC Diagram
-	Minification File Sizes Comparison:
	-	original file: 10,310 bytes
	-	refactored file: 10,189 bytes (repetition -> iteration)
	-	minified file: 8109 bytes (use minifier.org to shrink file size)
- Optimization Process:
	- First refactor some repetitive code to iteration:
		- 
![PoC diagram](https://github.com/jis216/jis216.github.io/blob/master/demo_imgs/database-structure.png)

## Endpoints List
- Endpoints origin: https://us-central1-js-cse135-pa3.cloudfunctions.net/
- /session
	- GET: 
		- request: no query required
		- response: get a set-cookie header if request doesn't have a cookie.
- /collect
	- /collect/document
		- POST: 
			- request: JSON {
				operation: "setData" or "getData",
				docName: [document where that ],
				[the data object you want to set the document to]
				}
			- response:
				- setData: 
				return "store document" if success, error messages if otherwise
				- getData: 
				return the JSON that represents the document in database
	- /collect/collection:
		- GET: 
				- request: no query required, need to send cookie
				- response: the JSON that represents the collection specified by cookie
		- POST:
			- request body: plain text of the collection name
			- response: the JSON that represents the collection specified by request body
	- /collect/all:
		- GET: 
				- request: no query required
				- response: send all the collection names back
	- /showdb: redirect you to the database visualization page at https://js-cse135-pa3.web.app/showdb
	
## Data Storage Overview
<table>
<thead>
<tr>
<th>DOCUMENT</th>
<th>FIELD</th>
<th>TYPE</th>
</tr>
</thead>
<tbody>
<tr>
<td>static</td>
<td>my-user-agent</td>
<td>String</td>
</tr>
<tr>
<td></td>
<td>user-language</td>
<td>String</td>
</tr>
<tr>
<td></td>
<td>cookie-on</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>images-on</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>javascript-on</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>css-on</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>screen-height</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>screen-width</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>window-height</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>window-width</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>effective-connection-type</td>
<td>String</td>
</tr>
<tr>
<td>loading</td>
<td>navig-start</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>load-end</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>time-taken</td>
<td>Number</td>
</tr>
<tr>
<td>events</td>
<td>mouse-buttons</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>mouse-meta</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>mouse-ctrl</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>mouse-shift</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>mouse-alt</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>client-x</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>client-y</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>screen-x</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>keyboard-key</td>
<td>String</td>
</tr>
<tr>
<td></td>
<td>keyboard-code</td>
<td>String</td>
</tr>
<tr>
<td></td>
<td>keyboard-ctrlKey</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>keyboard-shiftKey</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>keyboard-altKey</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>keyboard-metaKey</td>
<td>Boolean</td>
</tr>
<tr>
<td></td>
<td>scroll-x</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>scroll-y</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>unloading-start</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>unloading-end</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>unloading-diff</td>
<td>Number</td>
</tr>
<tr>
<td></td>
<td>idle-time</td>
<td>String/Number</td>
</tr>
</tbody>
</table>

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEwNDcxNTEyMjcsLTY0NzQ4OTQ1MSwtMT
gyMTExOTM4M119
-->