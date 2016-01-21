/// <reference path="../src/typings/tsd.d.ts" />
export declare class Doc {
    private params;
    private _element;
    private selection;
    element: Element;
    constructor(element: Element, params?: any);
    append(tag: string, html: string): void;
    h1(html: string): void;
    h2(html: string): void;
    h3(html: string): void;
    h4(html: string): void;
    h5(html: string): void;
    p(html: string): void;
    div(html: string, css?: string): void;
    md(markdown: string, css?: string): void;
    code(source: string, extension?: string, css?: string): void;
    gist(source: string, css?: string): void;
    jsfiddle(source: any, width?: string, height?: string, css?: string): void;
    youtube(source: string, width?: string, height?: string, css?: string): void;
}
export default function scriber(generator: (doc: Doc) => void, element: Element, params?: any): void;
