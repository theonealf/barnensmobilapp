tpl = {

    // Hash of preloaded templates for the app
    templates: {},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates: function (names, callback) {

        var that = this;

        var loadTemplate = function (index) {
            var name = names[index];

            var tplsrc = "";

            switch (name) {               
                case 'hem_bma':
                    tplsrc = 'templates/barnensmobilapp/' + name + '.htm';
                    break;
                case 'menu_bma':
                    tplsrc = 'templates/barnensmobilapp/generic/' + name + '.htm';
                    break;
                case 'boktips_bma':
                    tplsrc = 'templates/barnensmobilapp/boktips/' + name + '.htm';
                    break;
                case 'boktipssearchmain_bma':
                    tplsrc = 'templates/barnensmobilapp/boktips/' + name + '.htm';
                    break;
                case 'boktipssearch_bma':
                    tplsrc = 'templates/barnensmobilapp/boktips/' + name + '.htm';
                    break;                    
                case 'skrivboktips_bma':
                    tplsrc = 'templates/barnensmobilapp/boktips/' + name + '.htm';
                    break;                 
                case 'inskickatboktips_bma':
                    tplsrc = 'templates/barnensmobilapp/boktips/' + name + '.htm';
                    break;
                case 'boktipsdetail_bma':
                    tplsrc = 'templates/barnensmobilapp/boktips/' + name + '.htm';
                    break;
                case 'bokdetail_bma':
                    tplsrc = 'templates/barnensmobilapp/generic/' + name + '.htm';
                    break;
                case 'bokdetailextra_bma':
                    tplsrc = 'templates/barnensmobilapp/generic/' + name + '.htm';
                    break;
                case 'booksuggestapi_bma':
                    tplsrc = 'templates/barnensmobilapp/generic/' + name + '.htm';
                    break;
                case 'forfattarealsowrite_bma':
                    tplsrc = 'templates/barnensmobilapp/generic/' + name + '.htm';
                    break;
                case 'latestbooks_bma':
                    tplsrc = 'templates/barnensmobilapp/generic/' + name + '.htm';
                    break;                    
                case 'bokomdomenlist_bma':
                    tplsrc = 'templates/barnensmobilapp/generic/' + name + '.htm';
                    break;   
                case 'noconnection_bma':
                    tplsrc = 'templates/barnensmobilapp/generic/' + name + '.htm';
                    break;    
                case 'login_bma':
                    tplsrc = 'templates/barnensmobilapp/generic/' + name + '.htm';
                    break;
                case 'information_bma':
                    tplsrc = 'templates/barnensmobilapp/generic/' + name + '.htm';
                    break;
                case 'katalog_bma':
                    tplsrc = 'templates/barnensmobilapp/katalogen/' + name + '.htm';
                    break;
                case 'katalogensearch_bma':
                    tplsrc = 'templates/barnensmobilapp/katalogen/' + name + '.htm';
                    break;
                case 'votepage_bma':
                    tplsrc = 'templates/barnensmobilapp/katalogen/' + name + '.htm';
                    break;
                case 'votepagevotedtotal_bma':
                    tplsrc = 'templates/barnensmobilapp/katalogen/' + name + '.htm';
                    break;                    
                case 'votelist_bma':
                    tplsrc = 'templates/barnensmobilapp/katalogen/' + name + '.htm';
                    break;
                case 'votelistvotedtotal_bma':
                    tplsrc = 'templates/barnensmobilapp/katalogen/' + name + '.htm';
                    break;
                case 'krypin_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;
                case 'krypinedit_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;
                case 'krypinavatar_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;
                case 'krypinpresentation_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;                    
                case 'quizer_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;
                case 'sagomaskinenmain_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;
                case 'sagomaskinen_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;
                case 'sagomaskinenvisa_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;
                case 'sagomaskinen2_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;
                case 'sagomaskinenvisa2_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;
                case 'mybooks_bma':
                    tplsrc = 'templates/barnensmobilapp/krypin/' + name + '.htm';
                    break;
                                  
                    
                    //DEFAULT--------------------------------------
                    // ADD
                default:
                    tplsrc = 'index.html';
                    break;
            };
           
            //console.log('Loading template: ' + name);
            $.get(tplsrc, function (data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get: function (name) {
        return this.templates[name];
    },
    getgen: function (name) {

        var tplgenerated;

        switch (name) {
            //SOK---------------------------------------
            case 'sokmain':
                
                tplgenerated = tplgen.gen(name);
                break;
            case 'soktips':
                tplgenerated = 'templates/sok/' + name + '.htm';
                break;
            case 'sokdeltagare':
                tplgenerated = 'templates/sok/' + name + '.htm';
                break;
                //GAME---------------------------------------
            case 'gamewalkquiz':
                tplgenerated = 'templates/game/' + name + '.htm';
                break;
                //root--------------------------------------
            case 'mainhub':
                tplgenerated = 'templates/' + name + '.htm';
                break;
            case 'mainhubstart':
                tplgenerated = 'templates/mainhub/' + name + '.htm';
                break;
            case 'mainhublist':
                tplgenerated = 'templates/mainhub/' + name + '.htm';
                break;
            case 'mainhublistitem':
                tplgenerated = 'templates/mainhub/' + name + '.htm';
                break;
            case 'mainhubend':
                tplgenerated = 'templates/mainhub/' + name + '.htm';
                break;
            case 'start':
                tplgenerated = 'templates/' + name + '.htm';
                break;
            case 'mainpage':
                tplgenerated = 'templates/' + name + '.htm';
                break;
            case 'hem_bma':
                tplgenerated = 'templates/barnensmobilapp/' + name + '.htm';
                break;
                

                //DEFAULT--------------------------------------
                // ADD
            default:
                tplgenerated = 'index.html';
                break;

        };


        return tplgenerated;
    }

};

//tpl.loadTemplates(['filename-of-your-external-html-file'], function () {
//    app = new AppRouter();
//    Backbone.history.start();
//});


(function ($) {

    /**
    * @function
    * @property {object} jQuery plugin which runs handler function once specified element is inserted into the DOM
    * @param {function} handler A function to execute at the time when the element is inserted
    * @param {bool} shouldRunHandlerOnce Optional: if true, handler is unbound after its first invocation
    * @example $(selector).waitUntilExists(function);
    */

    $.fn.waitUntilExists = function (handler, shouldRunHandlerOnce, isChild) {
        var found = 'found';
        var $this = $(this.selector);
        var $elements = $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);

        if (!isChild) {
            (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
                window.setInterval(function () { $this.waitUntilExists(handler, shouldRunHandlerOnce, true); }, 500)
            ;
        }
        else if (shouldRunHandlerOnce && $elements.length) {
            window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
        }

        return $this;
    }

}(jQuery));