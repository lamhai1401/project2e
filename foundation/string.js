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

async function formatDiskinfo(str) {
	const arr = await formatRunningProcess1(str);
	var arrTemp = [];
	arr.forEach(element => {
		arrTemp.push({
			name:  	(element.slice(0, element.indexOf(" ")-1).replace(/["']/g, "")).replace(/"$/, ""),
			detail: convertJSON(element.slice(element.indexOf(" "), element.length)),
		});
	});
	return arrTemp;
};

module.exports = {
	capitalize					: capitalize,
	createcode					:	createcode,
	convertJSON					:	convertJSON,
	formatDetail2String	: formatRunningProcess2,
	formatDiskinfo			: formatDiskinfo,
};

// const str = "{'name': 'DESKTOP-7UMAOKJ', 'system_os': 'Windows', 'number_of_cpus': '8', 'number_of_physical_cpus': '4', 'pcpu': '6.1', 'pmem': '51.0', 'total_proc': '218'}";

// console.log(convertJSON(str));

// const str = `
// [{"Id": 2, "User": "zabbix", "Host": "localhost", "db": "zabbix", "Command": "Sleep", "Time": 1, "State": "", "Info": "None", "Progress": 0.0}, 
// {"Id": 3, "User": "zabbix", "Host": "localhost", "db": "zabbix", "Command": "Sleep", "Time": 0, "State": "", "Info": "None", "Progress": 0.0}, 
// {"Id": 4, "User": "zabbix", "Host": "localhost", "db": "zabbix", "Command": "Sleep", "Time": 4, "State": "", "Info": "None", "Progress": 0.0}, 
// {"Id": 5, "User": "zabbix", "Host": "localhost", "db": "zabbix", "Command": "Sleep", "Time": 7, "State": "", "Info": "None", "Progress": 0.0}, 
// {"Id": 7, "User": "zabbix", "Host": "localhost", "db": "zabbix", "Command": "Sleep", "Time": 29, "State": "", "Info": "None", "Progress": 0.0}, 
// {"Id": 8, "User": "zabbix", "Host": "localhost", "db": "zabbix", "Command": "Sleep", "Time": 5, "State": "", "Info": "None", "Progress": 0.0}, 
// {"Id": 10, "User": "zabbix", "Host": "localhost", "db": "zabbix", "Command": "Sleep", "Time": 6, "State": "", "Info": "None", "Progress": 0.0}, 
// {"Id": 6655, "User": "root", "Host": "192.168.3.234:56231", "db": null, "Command": "Query", "Time": 0, "State": "init", "Info": "SHOW FULL PROCESSLIST", "Progress": 0.0}]
// `

// const net = `{"bytes_sent": "2436685", "bytes_recv": "14520690", "packets_sent": "13950", "packets_recv": "18315", "error_in": "0", "error_out": "0", "drop_in": "0", "drop_out": "0"}`;

// const mongo = `{"C": {"total": "912.74G", "used": "75.87G", "free": "836.87G", "percent_used": "8.3", "type": "NTFS", "mount": "C:"}, 
// "D": {"total": "17.26G", "used": "15.01G", "free": "2.24G", "percent_used": "87.0", "type": "NTFS", "mount": "D:"}}`

// formatDiskinfo(mongo)
// .then(data =>{
// 	data.forEach(ele =>{
// 		console.log(ele.name);
// 		console.log(ele.detail);
// 	})
// });