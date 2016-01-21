/// <reference path="typings/tsd.d.ts"/>
declare var exports;
if (window && !window.hasOwnProperty('exports')) window['exports'] = {};

/*
import Scriber from 'scriber'

let params = {
  githubToken: ''
}

scriber(d => {
  d.md(`
  # Markdown Header

  aksjksjkjwkjd
  sksjkjxkjkxjs
  wksjsk
  `)

  d.code(``)

  d.gist('')

  d.fiddle('')

  d.youtube('')
}, element, params);

System
  .import('app/doc.ts')
  .then(module => scriber(module.default, element, params))
 */

function trim(text:string):string {
	let lines:string[] = text.replace(/\r/g, '').split('\n');
	let reg:RegExp = /^(\s*)/;
	let f:number = -1;
	let fmax:number = lines.length;
	while (++f < fmax) {
		let line:string = lines[f];
		if (line.trim().length > 0) {
			lines = lines.slice(f);
			if (reg.test(line)) {
				return lines.map(line => line.replace(new RegExp(`^(${reg.exec(line)[0]})`), '')).join('\n');
			}
		}
	}
	return text;
}

export class Doc {
	private _element:Element;
	private selection:d3.Selection<any>;

	get element():Element {
		return this._element;
	}

	constructor(element:Element, private params?:any) {
		this._element = element;
		this.selection = d3.select(element);
	}

	append(tag:string, html:string) {
		this.selection
			.append(tag)
			.html(html)
	}

	h1(html:string) {
		this.append('h1', html);
	}

	h2(html:string) {
		this.append('h2', html);
	}

	h3(html:string) {
		this.append('h3', html);
	}

	h4(html:string) {
		this.append('h4', html);
	}

	h5(html:string) {
		this.append('h5', html);
	}

	p(html:string) {
		this.append('p', html);
	}

	div(html:string, css:string = 'scriber-html') {
		this.selection
			.append('div')
			.attr('class', css)
			.html(html)
	}

	md(markdown:string, css:string = 'scriber-markdown') {
		this.div(marked(trim(markdown)), css);
	}

	code(source:string, extension:string = '', css:string = 'scriber-code') {
		this.md('```' + extension + '\n' + trim(source) + '\n' + '```', css);
	}

	gist(source:string, css:string = 'scriber-gist') {
		// https://gist.github.com/iamssen/b45fe34577eaa6713432
		// <script src="https://gist.github.com/iamssen/b45fe34577eaa6713432.js"></script>

		let id:string;
		let reg:RegExp = /\/\/gist.github.com\/[a-zA-Z0-9]+\/([a-zA-Z0-9]+)/;

		if (reg.test(source)) {
			let arr:RegExpExecArray = reg.exec(source);
			id = arr[1];
		} else {
			id = source;
		}

		let div:d3.Selection<any> = this.selection
			.append('div')
			.attr('class', css);

		$.ajax({
			url: `https://gist.github.com/${id}.json`,
			dataType: 'jsonp',
			success: ((gist:{div:string, stylesheet:string}) => {
				d3.select('head')
					.append('link')
					.attr({
						rel: 'stylesheet',
						href: gist.stylesheet
					});
				div.html(gist.div);
			})
		});
	}

	jsfiddle(source:any, width:string = '100%', height:string = '340', css:string = 'scriber-jsfiddle') {
		// https://jsfiddle.net/iamssen/kghbw17a/
		// <script async src="//jsfiddle.net/iamssen/kghbw17a/embed/"></script>
		let author:string;
		let id:string;
		let reg:RegExp = /\/\/jsfiddle.net\/([a-zA-Z0-9\-_]+)\/([a-zA-Z0-9\-_]+)/;

		if (reg.test(source)) {
			let arr:RegExpExecArray = reg.exec(source);
			author = arr[1];
			id = arr[2];
		} else if (typeof source === 'string') {
			let arr:string[] = source.split('/');
			author = arr[0];
			id = arr[1];
		} else if (source.hasOwnProperty('author') && source.hasOwnProperty('id')) {
			author = source['author'];
			id = source['id'];
		}

		this.div(`<iframe width="${width}" height="${height}" src="//jsfiddle.net/${author}/${id}/embedded/" frameborder="0"></iframe>`, css);
	}

	youtube(source:string, width:string = '100%', height:string = '350', css:string = 'scriber-youtube') {
		// https://www.youtube.com/watch?v=wZiEtrdmHJg
		// https://youtu.be/wZiEtrdmHJg
		// <iframe width="560" height="315" src="https://www.youtube.com/embed/wZiEtrdmHJg" frameborder="0" allowfullscreen></iframe>
		if (source.indexOf('<iframe') === 0) {
			this.div(source, css);
		} else {
			let id:string;
			if (source.length === 11) {
				id = source;
			} else {
				let reg:RegExp = /([a-zA-Z0-9_\-]{11})/;
				if (reg.test(source)) {
					let arr:RegExpExecArray = reg.exec(source);
					id = arr[1];
				}
			}
			this.div(`<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`, css);
		}
	}
}

export default function scriber(generator:(doc:Doc) => void, element:Element, params?:any) {
	generator(new Doc(element, params));
}
