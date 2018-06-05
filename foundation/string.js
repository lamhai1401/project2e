function capitalize(str) { 
	if(!str) return ('String is empty');
		str = str.replace(/\s+/g,' ').trim();
		str = str.replace(/(^|\s)\S/g, l => l.toUpperCase())
		return(str);
}

function createcode(str){
	str = (capitalize(str)).toUpperCase();
	str = str.replace(/\s+/g, "_");
	return str;
}

function convertJSON(str) {
	str = JSON.parse(str.replace(/['']/g, "\""));
	return str;
};

// xử lý list data of process detail (collect.py)
async function formatRunningProcess1(str) {
	str = str.replace(/^{/, "");
	str = str.replace(/}$/, "");
	var arr = (str.split(/}, \W/));
	for (let index = 0; index < arr.length; index++) {
		if( index == arr.length -1 ) {
			arr[index] ="'" + arr[index]; 
			return arr;
		}
		if(index == 0) arr[index] = arr[index] + "}"
		else arr[index] ="'" + arr[index] + "}"
	}
};

async function formatRunningProcess2(str) {
	const arr = await formatRunningProcess1(str);
	var arrTemp = [];
	arr.forEach(element => {
		arrTemp.push({
			pid:  	(element.slice(0, element.indexOf(" ")-1).replace(/[']/g, "")).replace(/"$/, ""),
			detail: convertJSON(element.slice(element.indexOf(" "), element.length)),
		});
	});
	return arrTemp;
};
module.exports = {
	capitalize					: capitalize,
	createcode					:	createcode,
	convertJSON					:	convertJSON,
	formatDetail2String	: formatRunningProcess2
};

// const str = "{'name': 'DESKTOP-7UMAOKJ', 'system_os': 'Windows', 'number_of_cpus': '8', 'number_of_physical_cpus': '4', 'pcpu': '6.1', 'pmem': '51.0', 'total_proc': '218'}";

// console.log(convertJSON(str));