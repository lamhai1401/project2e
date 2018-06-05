module.exports = (object) => {
	const template = `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Warning</title>
	</head>
	<body>
		<b>Warning Warning Warning!!!</b><br><br>
		<ul>
			<li> Your current RAM usage percentage is: <b>${object.pmem}</b></li>
			<li> Your current CPU usage percentage is: <b>${object.pcpu}</b></li>
			<li> Your Total Running Applications are:  <b>${object.total_proc}</b></li>
		</ul>
		<br>Error: <b> ${object.name} </b>
		<br>The current value: <b> ${object.currValue} </b> ${object.state} 5% than last value: <b> ${object.lastValue} </b><br><br>
		Please check this!!<br><br>
		System administrator.
	</body>
	</html>
	`
	return template;
}