/// <reference path="../src/typings/tsd.d.ts" />
export declare class Doc {
    private params;
    private _element;
    private selection;
    element: Element;
    constructor(element: Element, params?: any);
    div(html: string, css?: string): void;
    md(markdown: string, css?: string): void;
    code(source: string, extension?: string, css?: string): void;
    gist(source: string): void;
    jsfiddle(source: string): void;
    youtube(source: string, width?: number, height?: number): void;
}
export default function scriber(generator: (doc: Doc) => void, element: Element, params?: any): void;
