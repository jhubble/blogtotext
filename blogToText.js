const fs = require('fs');
const convert = require('xml-js');

const xml = fs.readFileSync('feed.atom', {encoding: 'UTF-8'});
const json = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 2}));

const entries = json.feed.entry;

console.log(entries.length);

entries.forEach((entry) => {
	let output = "TITLE:"+entry.title._text;
	let body = (entry.content && entry.content._text) ? entry.content._text.replace(/<br \/>/g,'\n') : '';
	let dates = "CREATED:   "+entry['blogger:created']['_text']+"\n";
	dates += "PUBLISHED: "+entry.published['_text']+"\n";
	dates += "UPDATED:   "+entry.updated['_text']+"\n";
	output += "\n" + body + "\n" + dates;

	if (entry.category) {
		output += "\n";
		let cats = entry.category;
		if (cats._attributes) {
			cats = [cats];
		}
		cats.forEach((cat) => {
			output += "TAG:"+cat['_attributes'].term+"\n";
		});
	}

	let filename = 'foo.txt';
	if (!entry['blogger:filename']) {
		filename = entry['blogger:created']['_text'];
		filename = filename.replace(/[\-T]/g,'_');
		filename = filename.replace(/[^0-9_]/g,'');
		filename += '.txt';
	} 
	else {
		filename = entry['blogger:filename']['_text'];
		filename = filename.replace(/^\//,'');
		filename = filename.replace(/\//g,'_');
		filename = filename.replace(/html$/,'txt');
	}

	console.log(filename);
	fs.writeFileSync(filename,output);

});
