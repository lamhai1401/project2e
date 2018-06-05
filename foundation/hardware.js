const receivers         = require('../config/config').email_receiver;
const hardware_variation= require('../config/config').hardware_variation;
const warningEmail      = require('./nodemailer').WarningEmail;
const templates         = require('./mail_templates/Warning');
const Memory            = require('../models').Hardware_memory;
const Process           = require('../models').Hardware_process;

// title for annoumance
const PCPU      = 'Process % CPU usage has problem';
const PMEM      = 'Process memory % usage has problem';

async function CreateHarewareInfo(data) {
	try {

		// get value 
		const currProc  = data;
		var lastProc    = await Process.find().then(data => data.pop(0));

		// try catch if this is the first time we calculate
		if (!lastProc) lastProc = currProc;

		// create object for template
		const object = {
				pmem: currProc.pmem,
				pcpu: currProc.pcpu,
				total_proc: currProc.total_proc,
				name: '',
				currValue: '',
				lastValue: '',
				state: ''
		};

		// calculate this is which chance of hardware
		const isBigChangePCPU = Math.abs((currProc.pcpu - lastProc.pcpu)) > hardware_variation ? true: false;
		const isBigChangePMEM = Math.abs((currProc.pmem - lastProc.pmem)) > hardware_variation ? true: false;

		if(isBigChangePCPU) {
				object.name = PCPU;
				object.currValue = currProc.pcpu;
				object.lastValue = lastProc.pcpu;
				if (currProc.pcpu > lastProc.pcpu) object.state = 'EXCEED'
				else object.state = 'BELOW';
				await warningEmail(receivers, templates(object));
		} else if(isBigChangePMEM) {
				object.name = PMEM;
				object.currValue = currProc.pmem;
				object.lastValue = lastProc.pmem;
				if (currProc.pcpu > lastProc.pcpu) object.state = 'EXCEED'
				else object.state = 'BELOW';
				await warningEmail(receivers, templates(object));
		};
		
		// recording new process info document
		const process = await Process.create(currProc);
		return process;
	} catch (err) {
			return err.message;
	}
};

module.exports = CreateHarewareInfo;