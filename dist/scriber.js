if (window && !window.hasOwnProperty('exports'))
    window['exports'] = {};
function trim(text) {
    var lines = text.replace(/\r/g, '').split('\n');
    var reg = /^(\s*)/;
    var f = -1;
    var fmax = lines.length;
    while (++f < fmax) {
        var line = lines[f];
        if (line.trim().length > 0) {
            lines = lines.slice(f);
            if (reg.test(line)) {
                return lines.map(function (line) { return line.replace(new RegExp("^(" + reg.exec(line)[0] + ")"), ''); }).join('\n');
            }
        }
    }
    return text;
}
var Doc = (function () {
    function Doc(element, params) {
        this.params = params;
        this._element = element;
        this.selection = d3.select(element);
    }
    Object.defineProperty(Doc.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Doc.prototype.append = function (tag, html) {
        this.selection
            .append(tag)
            .html(html);
    };
    Doc.prototype.h1 = function (html) {
        this.append('h1', html);
    };
    Doc.prototype.h2 = function (html) {
        this.append('h2', html);
    };
    Doc.prototype.h3 = function (html) {
        this.append('h3', html);
    };
    Doc.prototype.h4 = function (html) {
        this.append('h4', html);
    };
    Doc.prototype.h5 = function (html) {
        this.append('h5', html);
    };
    Doc.prototype.p = function (html) {
        this.append('p', html);
    };
    Doc.prototype.div = function (html, css) {
        if (css === void 0) { css = 'scriber-html'; }
        this.selection
            .append('div')
            .attr('class', css)
            .html(html);
    };
    Doc.prototype.md = function (markdown, css) {
        if (css === void 0) { css = 'scriber-markdown'; }
        this.div(marked(trim(markdown)), css);
    };
    Doc.prototype.code = function (source, extension, css) {
        if (extension === void 0) { extension = ''; }
        if (css === void 0) { css = 'scriber-code'; }
        this.md('```' + extension + '\n' + trim(source) + '\n' + '```', css);
    };
    Doc.prototype.gist = function (source, css) {
        if (css === void 0) { css = 'scriber-gist'; }
        var id;
        var reg = /\/\/gist.github.com\/[a-zA-Z0-9]+\/([a-zA-Z0-9]+)/;
        if (reg.test(source)) {
            var arr = reg.exec(source);
            id = arr[1];
        }
        else {
            id = source;
        }
        var div = this.selection
            .append('div')
            .attr('class', css);
        $.ajax({
            url: "https://gist.github.com/" + id + ".json",
            dataType: 'jsonp',
            success: (function (gist) {
                d3.select('head')
                    .append('link')
                    .attr({
                    rel: 'stylesheet',
                    href: gist.stylesheet
                });
                div.html(gist.div);
            })
        });
    };
    Doc.prototype.jsfiddle = function (source, width, height, css) {
        if (width === void 0) { width = '100%'; }
        if (height === void 0) { height = '340'; }
        if (css === void 0) { css = 'scriber-jsfiddle'; }
        var author;
        var id;
        var reg = /\/\/jsfiddle.net\/([a-zA-Z0-9\-_]+)\/([a-zA-Z0-9\-_]+)/;
        if (reg.test(source)) {
            var arr = reg.exec(source);
            author = arr[1];
            id = arr[2];
        }
        else if (typeof source === 'string') {
            var arr = source.split('/');
            author = arr[0];
            id = arr[1];
        }
        else if (source.hasOwnProperty('author') && source.hasOwnProperty('id')) {
            author = source['author'];
            id = source['id'];
        }
        this.div("<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"//jsfiddle.net/" + author + "/" + id + "/embedded/\" frameborder=\"0\"></iframe>", css);
    };
    Doc.prototype.youtube = function (source, width, height, css) {
        if (width === void 0) { width = '100%'; }
        if (height === void 0) { height = '350'; }
        if (css === void 0) { css = 'scriber-youtube'; }
        if (source.indexOf('<iframe') === 0) {
            this.div(source, css);
        }
        else {
            var id;
            if (source.length === 11) {
                id = source;
            }
            else {
                var reg = /([a-zA-Z0-9_\-]{11})/;
                if (reg.test(source)) {
                    var arr = reg.exec(source);
                    id = arr[1];
                }
            }
            this.div("<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"https://www.youtube.com/embed/" + id + "\" frameborder=\"0\" allowfullscreen></iframe>", css);
        }
    };
    return Doc;
})();
exports.Doc = Doc;
function scriber(generator, element, params) {
    generator(new Doc(element, params));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = scriber;
//# sourceMappingURL=scriber.js.map