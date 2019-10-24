/**
 * Class Core
 * @description A simple frontend base for a veterinary website project
 * @author Oskar 'Swiezu' Golebiewski <osa1022@gmail.com>
 */
class Core {
    constructor(isAdmin = false) {
        this.baseUrl = window.location.protocol + "//" + window.location.host + "/";
        this.initEvents();
        this.action = null;
    }

    initEvents() {
        $('a').on('click', (e) => {
            $(document).trigger('core.route.start', e);
            console.debug($(e.target));
            if ($(e.target).attr('action') !== undefined) {
                e.preventDefault();
                core.changeUrl($(e.target).attr('href'), $(e.target).attr('action'));
            } else if ($(e.target).closest("a").attr('action') !== undefined) {
                e.preventDefault();
                core.changeUrl($(e.target).closest("a").attr('href'), $(e.target).closest("a").attr('action'));
            }
        });
        window.onpopstate = function (event) {
            core.newRoute();
        };
    }

    newRoute(withRemove = false) {
        if (this.action !== null) {
            this.removeJs(this.action);
            if (typeof actionRun === 'function') {
                actionRun = null;
            }
        }

        this.action = this.getActionUrl();
        this.addJs(this.getActionUrl());
        if (typeof actionRun === 'function') {
            actionRun(); //git
            $(document).find('div.loading').fadeOut(900);
        } else {
            $(document).find('div.loading').fadeOut(900);
            if (window.location.pathname.includes('/admin')) {
                $('section.content-header').html("<h1>Nie odnaleziono podanej strony</h1>");
                return core.compileLayout('/action/admin/404.html', $(document).find('section[id="content"]'));
            } else {
                return core.compileLayout('/action/404.html', $(document).find('section[id="content"]'));
            }
    }
    }

    /* 
     * PL: Sprawdzanie czy w URL znajduje się subdomena
     * 
     * EN: Check if in URL exists subdomain
     */
    subdomainExist() {
        var exist = false;
        var subdomains = ['pultusk', 'inna']; // Nazwy subdomen, które mają być obsłużone
        var host = window.location.host.split('.');

        host.forEach(function (index) {
            if (subdomains.indexOf(index) !== -1) {
                exist = true;
            }
        });

        return exist;
    }

    /*
     * PL: uruchomienie modala w przypadku, gdy w w adresie URL nie ma podanej subdomeny
     * 
     * EN: run modal if the subdomain is not in the URL address
     */
    officeModal() {
        var modal = document.getElementById("myModal");
        var exist = this.subdomainExist();

        if (!exist) {
            modal.style.display = "block";

            $(".button").on("click", function () {
                var newUrl = window.location.protocol + '//' + $(this).attr('officeName') + '.' + window.location.host.replace("www.", "") + window.location.pathname;

                window.location = newUrl;
            });
        }
    }

    changeUrl(url, title = 'untitled') {
        history.pushState({url: url}, title, url);
        this.newRoute();
    }

    // Headers and params are optional
    makeXhr(opts) {
        return new Promise(function (resolve, reject) {
            $(document).trigger("core.xhr.start", [resolve, reject]);
            opts.url = window.location.protocol + "//" + window.location.host + "/" + opts.url;
            var xhr = new XMLHttpRequest();
            xhr.open(opts.method, opts.url);

            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {

                    resolve(xhr);
                    $(document).trigger("core.xhr.success", [xhr]);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                    $(document).trigger("core.xhr.error", [this.status, xhr.statusText]);

                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
                $(document).trigger("core.xhr.error", [this.status, xhr.statusText]);
            };

            if (opts.headers) {
                Object.keys(opts.headers).forEach(function (key) {
                    xhr.setRequestHeader(key, opts.headers[key]);
                });
            }
            var paramsString = "";
            var params = opts.params;
            if (params && typeof params === 'object') {
                paramsString += Object.keys(params).map(function (key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                }).join('&');
            }
            if (opts.settings !== undefined && opts.settings.extendParams !== undefined && opts.settings.extendParams === true) {
                if (paramsString !== "") {
                    paramsString += "&";
                }
                paramsString += window.location.search.substr(1);
            }
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(paramsString);
        });
    }

    getFormData($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    addCss(href) {
        if ($('head').find("link[rel='stylesheet'][href='" + href + "'][type='text/css']").length === 0) {
            $('head').append('<link rel="stylesheet" href="' + href + '" type="text/css" />');
        }
    }

    removeCss(href) {
        $('head').find('link[rel=stylesheet][href=' + href + ']').remove();
    }

    addJs(href) {
        if ($('head').find("script[src='" + href + "']").length === 0) {
            $('head').append('<script src="' + href + '"/>');
        }
    }

    removeJs(href) {
        $('head').find("script[src='" + href + "']").remove();
    }

    getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }

    getUrlParams() {
        let vars = [], hash;
        if (window.location.href.indexOf('?') !== -1) {
            let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (let i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
        }
        return vars;
    }

    getActionUrlParams(url) {
        let vars = [], hash;
        if (url.indexOf('?') !== -1) {
            let hashes = url.slice(url.indexOf('?') + 1).split('&');
            for (let i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
        }
        return vars;
    }

    hideLoader() {
        $(document).ready(function () {
            // Images loaded is zero because we're going to process a new set of images.
            var imagesLoaded = 0;
            // Total images is still the total number of <img> elements on the page.
            var totalImages = $('img').length;

            // Step through each image in the DOM, clone it, attach an onload event
            // listener, then set its source to the source of the original image. When
            // that new image has loaded, fire the imageLoaded() callback.
            $('img').each(function (idx, img) {
                $('<img>').on('load', imageLoaded).attr('src', $(img).attr('src'));
            });

            // Do exactly as we had before -- increment the loaded count and if all are
            // loaded, call the allImagesLoaded() function.
            function imageLoaded() {
                imagesLoaded++;
                if (imagesLoaded == totalImages) {
                    allImagesLoaded();
                }
            }

            function allImagesLoaded() {
                $(document).find('div.loading').fadeOut(900);
            }
        });

    }

    getActionUrl(withBaseUrl = false) {
        let actionUrl;
        let pathname = "";

        if (window.location.pathname === "/" || window.location.pathname === "") {
            pathname += "/index/";
        } else if (window.location.pathname === "/admin" || window.location.pathname === "/admin/") {
            pathname += "/admin/index/";
        } else {
            pathname += window.location.pathname;
        }

        if (withBaseUrl) {
            actionUrl = this.baseUrl + "/js/action" + pathname;
        } else {
            actionUrl = "/js/action" + pathname;
        }

        if (actionUrl.substring(actionUrl.length - 1) === "/")
        {
            actionUrl = actionUrl.substring(0, actionUrl.length - 1);
        }
        return actionUrl += ".js";
    }

    executeFunctionByName(functionName, context /*, args */) {
        var args = Array.prototype.slice.call(arguments, 2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    }

    compileLayout(pathToFile, target, data) {
        return core.makeXhr({
            method: 'GET',
            url: '/js' + pathToFile
        }).then((result) => {
            var pagefn = doT.template(result.response, undefined, {});
            let content = pagefn(data);
            target ? target.html(content) : null;
            return Promise.resolve(content);
        }).then((result2) => {
            window.scroll(0, 0);
            return Promise.resolve(result2);
        });
    }
}
