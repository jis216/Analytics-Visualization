!!!Attention!!!
you CAN GO TO https://github.com/jis216/jis216.github.io to view the RENDERED version of this README.


## Collection and Sessionization Architecture
- The test website is at: jis216.github.io
- The tracker file and database visualization files are hosted at: https://js-cse135-pa3.web.app
- The could functions/endpoints are at https://us-central1-js-cse135-pa3.cloudfunctions.net/
- Sessionization: takes approach 2 and has an endpoint '/sessionize' for you to get the cookie
- Collection Structure:
	- each session has its own collection named by its session id
	- each collection is separated into 3 documents: static, loading, events
	- each document has its corresponding fields specified in the table below.
![database-structure](https://github.com/jis216/jis216.github.io/blob/master/demo_imgs/database-structure.png)

## Tracker Minifiy
-	Minification File Sizes Comparison:
	-	original file: 10,310 bytes
	-	refactored file: 10,189 bytes (repetition -> iteration)
	-	minified file: 8109 bytes (use minifier.org to shrink file size)
- Optimization Process:
	- First refactor some repetitive code to iteration:
		- Original Code:
		-	```
			function  mouseAnalytics(mouseEvent){
				localSetItem("events", "mouse-buttons", mouseEvent.buttons);
		
				localSetItem("events", "mouse-meta", mouseEvent.metaKey);
				
				localSetItem("events", "mouse-ctrl", mouseEvent.ctrlKey);
				
				localSetItem("events", "mouse-shift", mouseEvent.shiftKey);
				
				localSetItem("events", "mouse-alt", mouseEvent.altKey);
				
				localSetItem("events", "client-x", mouseEvent.screenX);
				
				localSetItem("events", "client-y", mouseEvent.screenY);
				
				localSetItem("events", "screen-x", mouseEvent.clientX);
				
				localSetItem("events", "screen-y", mouseEvent.clientY);
				
				localSetItem("events", "movement-x", mouseEvent.movementX);
				
				localSetItem("events", "movement-y", mouseEvent.movementY);
			};
			```

		-	Refactored Code:
		-	```
			function  mouseAnalytics(mouseEvent){
				const  mouseSet ={
				
					"mouse-buttons": mouseEvent.buttons,
				
					"mouse-meta": mouseEvent.metaKey,
					
					"mouse-ctrl": mouseEvent.ctrlKey,
					
					"mouse-shift": mouseEvent.shiftKey,
					
					"mouse-alt": mouseEvent.altKey,
					
					"client-x": mouseEvent.screenX,
					
					"client-y": mouseEvent.screenY,
					
					"screen-x": mouseEvent.clientX,
					
					"screen-y": mouseEvent.clientY,
					
					"movement-x": mouseEvent.movementX,
					
					"movement-y": mouseEvent.movementY
				};
				localSetBatch("events", mouseSet);
			};
			```
	- Then use tools at [minifier.org](https://www.minifier.org/) to minify the refactored file

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
eyJoaXN0b3J5IjpbLTE4MjExMTkzODNdfQ==
-->