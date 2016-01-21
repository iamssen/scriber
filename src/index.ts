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

	gist(source:string) {
		// https://gist.github.com/iamssen/b45fe34577eaa6713432
		// <script src="https://gist.github.com/iamssen/b45fe34577eaa6713432.js"></script>
		const css:string = 'scriber-gist';
		source = source.trim();
		if (source.indexOf('<script') === 0) {
			this.div(source, css);
		} else if (source.indexOf('https://gist.github.com') === 0) {
			this.div(`<script src="${source}.js"></script>`, css);
		}
	}

	jsfiddle(source:string) {
		// https://jsfiddle.net/iamssen/kghbw17a/
		// <script async src="//jsfiddle.net/iamssen/kghbw17a/embed/"></script>
		const css:string = 'scriber-jsfiddle';
		source = source.trim();
		if (source.indexOf('<script') === 0) {
			this.div(source, css);
		} else if (source.indexOf('https://jsfiddle.net') === 0) {
			this.div(`<script async src="${source}embed"></script>`, css);
		}
	}

	youtube(source:string, width:number = 560, height:number = 315) {
		// https://www.youtube.com/watch?v=wZiEtrdmHJg
		// https://youtu.be/wZiEtrdmHJg
		// <iframe width="560" height="315" src="https://www.youtube.com/embed/wZiEtrdmHJg" frameborder="0" allowfullscreen></iframe>
		const css:string = 'scriber-youtube';
		source = source.trim();
		if (source.indexOf('<iframe') === 0) {
			this.div(source, css);
		} else {
			let reg:RegExp = /([a-zA-Z0-9_-]{11})/;
			if (reg.test(source)) {
				let arr:RegExpExecArray = reg.exec(source);
				let id:string = arr[0];
				this.div(`<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`, css);
			}
		}
	}
}

export default function scriber(generator:(doc:Doc) => void, element:Element, params?:any) {
	generator(new Doc(element, params));
}
