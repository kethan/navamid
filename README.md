# Navamid

### Docs and courtesy: https://github.com/lukeed/navaid

### Example

```js
let mid = (req, res, next) => {
	req.date = new Date();		// Attach date on req object
	console.log("mid", req);
	// res.redirect("/books/1"); // Redirct to a route
	// next("no auth"); 		//Throw Error
	next(); 					// Call the next middleware
};

let auth = (req, res, next) => {
	console.log("auth required");
	next();
};

let router = Navamid("/" (uri, req, res) => console.log('404'), (err, req, res) => console.log(err));
// Attach routes
router
	.use(mid)
	.on("/", (req, res, next) => {
		console.log("~> /", req.date);
	})
	.on("/users/:username", auth, ({ params }) => {
		console.log("~> /users/:username", params);
	})
	.on("/books/*", auth, (req, res) => {
		console.log("~> /books/*", req);
	});
router.listen()
```
### Difference from navaid

#### 1. constructor navamid(base, on404, onError) 

	- Optional on404 and onError when there is any middleware errors.
	- on404(uri, req, res)
	- onError(err, req, res)

#### 2. use(middleware(s)) 

	- An array of global middlewares similar to express.js
	- (req, res, next) - Middlware signature 

#### 3. on(path, middleware(s))

	- An array of middlewares to be executed for the path

#### 3. listen(uri?, callback?)

	- An optional callback to be called after starting the listener.

#### Req Object
```js
{
	params: {},
	url: ""
}
```

#### Res Object
```js
{
	 redirect: (uri: string, replace?: boolean);
}
```

#### Next
```
next(err?)
```