# Navamid

### Docs and courtesy: https://github.com/lukeed/navaid

### Example

```js
let mid = (req, res, next) => {
	console.log(req);
	req.date = new Date();
	console.log("mid");
	// res.redirect("/books/1");
	// next("no auth");
	next();
};
let router = Navamid();
// Attach routes
router
	.use(mid)
	.on("/", (req, res, next) => {
		console.log("~> /", req.date);
	})
	.on("/users/:username", ({ params }) => {
		console.log("~> /users/:username", params);
	})
	.on("/books/*", ({ params }) => {
		console.log("~> /books/*", params);
	});
router.listen("", (err, req, res) => {
	console.log(err);
});
```
