
//AppMain.Views.hem_bmaView = Backbone.View.extend({
    
//    render: function (eventName) {       
//        $(this.el).html(_.template(tpl.get('hem_bma'), { model: this.model.toJSON(), collection: this.collection.toJSON() }));
//        $('#nav-panel').trigger("updatelayout");
//        return this;
//    }
//});
AppMain.Views.hem_bmaView = Backbone.View.extend({    
    initialize: function () {
        getuserdata(this, function () {
                return false;
    });
        this.bokpuffen();

    },
    bokpuffen: function () {
        widgetmain();

    },
    events: {
        'click #blocklinks a': 'externalbrowser',
        'click #bokpuff a': 'externalbokpuff'

    },
    externalbrowser: function (e) {
        $.mobile.loading('show', { text: "Laddar.. vänta!", textVisible: true });
        e.preventDefault();
        var extlink = "http://www.barnensbibliotek.se";
        extlink += $(e.currentTarget).attr("href");       
        var ref = window.open(extlink, '_system', 'location=yes');
        $.mobile.loading('hide');
       
    },
    externalbokpuff: function (e) {
        $.mobile.loading('show', { text: "Laddar.. vänta!", textVisible: true });
        e.preventDefault();
        var extlink = "http://www.bokpuffen.se";       
        var ref = window.open(extlink, '_system', 'location=yes');
        $.mobile.loading('hide');

    },
    render: function (eventName) {
        var userobj = storageHandler.get("_userdata");
        if (!userobj) {
            getuserdata(this, function () {
                return false;
            });
        }
        isvotestarted(this, userobj.userid, userobj.dev, function (that, value) {
            var lsmenu = storageHandler.get("menudata");
            var menumodel = new AppMain.Models.menu(lsmenu)
            menumodel.set({ votetime: value });
            storageHandler.set("menudata", menumodel);
        });
        $(this.el).html(_.template(tpl.get('hem_bma'), { model: this.model.toJSON()}));
        $('#nav-panel').trigger("updatelayout");
        return this;
    }
});


AppMain.Views.boktips_bmaView = Backbone.View.extend({
    initialize: function () {
        this.bokpuffen();

    },
    bokpuffen: function () {
        widgetmain();

    },
    render: function (eventName) {
        var test = this.collection.toJSON()
        $(this.el).html(_.template(tpl.get('boktips_bma'), {model: this.model.toJSON(), collection: this.collection.toJSON() }));        
        return this;
    }   
});

AppMain.Views.skrivboktips_bmaView = Backbone.View.extend({
    events: {
        'submit form': 'submit'
    },
    submit: function (e) {
        $.mobile.loading('show', { text: "Laddar.. v"+ unescape("%E4")+"nta!", textVisible: true });
        e.preventDefault();
        var useridt = "0";
        var usr = storageHandler.get("_userdata");        
        if (usr) {
            if (usr.userid) {
                useridt = usr.userid;
            }
            var verify = this.$('input[name=txtbooktitle]').val();
            if (verify !="") {
                var boktipsarr = "uid/" + useridt;

                boktipsarr += "/title/" + this.$('input[name=txtbooktitle]').val();
                boktipsarr += "/review/" + this.$('#txtbooktips').val();
                boktipsarr += "/age/" + this.$('input[id=sliderAgeWhoLikeThisBook]').val();
                boktipsarr += "/category/" + this.$('#select-choice-1').val()

                addboktipsdetaildata(this, boktipsarr, function (that, boktips) {
                    var test;
                    app = new AppRouter();
                    app.navigate('inskickatboktips', { trigger: true });
                })
            } else {
                alert("Du måste skriva något!");
                this.$('input[name=txtbooktitle]').focus()
            };
        } else {
            alert("Du måste vara inloggad för att skriva boktips");
           
        };
        $.mobile.loading('hide');
        
    },
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('skrivboktips_bma'), { model: this.model.toJSON() }));
        return this;
    }
});

AppMain.Views.inskickatboktips_bmaView = Backbone.View.extend({
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('inskickatboktips_bma')));
        return this;
    }
});

AppMain.Views.login_bmaView = Backbone.View.extend({
    events: {
        'click #SubmitUserlogin': 'submit',
        'click #ResetUserlogin': 'avbryt',
        'click #registrera': 'registrera',
        'submit': 'submit'
    },
    submit: function (e) {
        $.mobile.loading('show', { text: "Loggar in.. v" + unescape("%E4") + "nta!", textVisible: true });
        e.preventDefault();
        
        if (checkConnection() == "0") {
        	$.mobile.loading('hide');   		
        	app = new AppRouter();
        	app.navigate('#login', { trigger: true });
    	}else{
	        var uservalues = {
	            user: this.$('#username').val(),
	            pass: this.$('#password').val()
	        }

	        verifyuser(this, uservalues, function (that, userjson) {
	            userjson['password'] = uservalues.pass;
	            _userdata = new AppMain.Models.user(userjson);
	            
	            var userid = _userdata.get("userid");
	            if (userid) {
	
	                isvotestarted(this, userid,_userdata.attributes.dev, function (that, value) {
	                    console.log(value);
	                })
	
	                //var menu = storageHandler.get('menudata');
                    //menu.avatar = _userdata.attributes.avatar;
                    //storageHandler.set("menudata", menu);

                    var menuinfo = {
	                    avatar: _userdata.attributes.avatar,
	                    votetime: storageHandler.get('isvoteStarted'),	                    
	                    votedfortotal : storageHandler.get('Uservotedfortotal'),
	                    votedebug  : storageHandler.get('isdebugvotestarted'),	                  
	                    Status: ""
	                }
	                

	                var savemenu = new AppMain.Models.menu(menuinfo)
	                storageHandler.set("menudata", savemenu);
	                
	                //var usrdata = JSON.stringify(_userdata);
	                //var tmp3 = JSON.stringify(userjson);
	                storageHandler.set("debug", "sattvärde");
	                storageHandler.set("_userdata", _userdata); //ladda user objektet med alla värden in i localstorage
	               // window.localStorage.setItem("LSaktuelltUserid", userid);
	                app = new AppRouter();
	                app.navigate('#hem', { trigger: true });
	            } else {
	                storageHandler.remove("_userdata");
	                
	                //window.localStorage.removeItem("LSaktuelltUserid");
	                //window.localStorage.removeItem("LSuserdataJson");     
	                //navigator.notification.alert("Det gick inte att logga in! Försök igen!");
	                that.$('#Errormess').html("Det gick inte att logga in! Försök igen!");
	                $.mobile.loading('hide');
	            };        
	        });
    	}; 
    },
    avbryt: function (event) {    	
    	navigator.notification.vibrate(1000);
    	navigator.app.exitApp();
    },
    registrera: function (e) {
        e.preventDefault();
        var ref = window.open('http://www.barnensbibliotek.se/Hem/tabid/193/ctl/Login/Default.aspx', '_system', 'location=yes');
    },
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('login_bma')));
        return this;
    }
});

var usrobj = storageHandler.get("_userdata");
if (usrobj) {
    if (usrobj.userid) {

        //isvotestarted(this,usrobj.userid,usrobj.dev, function (that, value) {
        //    console.log(value);
        //})

        var menuinfo = {
            avatar: usrobj.avatar,
            votetime: storageHandler.get('isvoteStarted'),
            votedfortotal: storageHandler.get('Uservotedfortotal'),
            Status: ""
        }
        var savemenu = new AppMain.Models.menu(menuinfo)
        storageHandler.set("menudata", savemenu);
    };
};

AppMain.Views.katalog_bmaView = Backbone.View.extend({  
    events: {
        'keyup #searchbox': 'submit',
        'click .typesearchbox': 'typsearch',
    },
    submit: function (e) {
       
        e.preventDefault();
        var searchval = $('#searchbox').attr("value");
        if (searchval.length > 2) {
            $.mobile.loading('show', { text: "S" + unescape("%F6") + "ker.. v" + unescape("%E4") + "nta!", textVisible: true });
            var useridt = 0
            var usr = storageHandler.get("_userdata");
            //if (window['_userdata'] != undefined) {
            if(usr){
                if (usr.userid) {
                    useridt = usr.userid;
                }
            }
            getBokSearchdata(this, searchval, useridt, function (that, bokSearchJson) {
                var bokSearchList = new AppMain.Collections.boklist(bokSearchJson);
                var bookid;
                if (AppMain.globals.currentView.length > 1) {
                    AppMain.globals.currentView[0].close();
                    AppMain.globals.currentView.shift();
                };
                $('#UlSearchResult').html(_.template(tpl.get('katalogensearch_bma'), { collection: bokSearchList.toJSON() }));
                $('#UlSearchResult').listview("refresh");
                                
                $('.vote').on('click', function () {
                    bookid = $(this).attr("rel");
                    if (useridt > 0) {
                        votehandler('add', bookid, useridt)
                    } else {
                        alert("du måste vara inloggad!");
                    };
                })
                $('.voted').on('click', function () {
                    bookid = $(this).attr("rel");
                    if (useridt > 0) {
                        votehandler('del', bookid, useridt);
                    } else {
                        alert("du måste vara inloggad!");
                    };
                })                   
            })            
            $.mobile.loading('hide');
        }
          console.log(searchval)
    },
    typsearch: function (e) {
        e.preventDefault();
        var searchtyp = $(e.currentTarget).attr("rev");
        var searchval = $(e.currentTarget).attr("rel");
        
        $.mobile.loading('show', { text: "S" + unescape("%F6") + "ker.. v" + unescape("%E4") + "nta!", textVisible: true });
            var useridt = 0
            var usr = storageHandler.get("_userdata");
            //if (window['_userdata'] != undefined) {
            if (usr) {
                if (usr.userid) {
                    useridt = usr.userid;
                }
            }
            getBokcatamnSearchdata(this,searchtyp, searchval, useridt, function (that, bokSearchJson) {
                var bokSearchList = new AppMain.Collections.boklist(bokSearchJson);
                var bookid;
                if (AppMain.globals.currentView.length > 1) {
                    AppMain.globals.currentView[0].close();
                    AppMain.globals.currentView.shift();
                };
                $('#UlSearchResult').html(_.template(tpl.get('katalogensearch_bma'), { collection: bokSearchList.toJSON() }));
                $('#UlSearchResult').listview("refresh");

                $('.vote').on('click', function () {
                    bookid = $(this).attr("rel");
                    if (useridt > 0) {
                        votehandler('add', bookid, useridt)
                    } else {
                        alert("du måste vara inloggad!");
                    };
                })
                $('.voted').on('click', function () {
                    bookid = $(this).attr("rel");
                    if (useridt > 0) {
                        votehandler('del', bookid, useridt);
                    } else {
                        alert("du måste vara inloggad!");
                    };
                })
                $.mobile.loading('hide');
            })
           
        
        console.log(searchval)
    },
    render: function (eventName) {      
        $(this.el).html(_.template(tpl.get('katalog_bma'),{ model: this.model.toJSON()}));
       
        return this;
    }
});
//////////////////////////////////////
AppMain.Views.boktipssearchmain_bmaView = Backbone.View.extend({
    initialize: function () {      
        $.mobile.loading('show', { text: "S" + unescape("%F6") + "ker.. v" + unescape("%E4") + "nta!", textVisible: true });

            getBoktipsgetlatestdata(this, function (that, boktipSearchJson) {
                var boktipSearchList = new AppMain.Collections.boktipsen(boktipSearchJson);
                var bookid;
                if (AppMain.globals.currentView.length > 1) {
                    AppMain.globals.currentView[0].close();
                    AppMain.globals.currentView.shift();
                };
                $('#UlSearchResult').html(_.template(tpl.get('boktipssearch_bma'), { collection: boktipSearchList.toJSON() }));
                $('#UlSearchResult').listview("refresh");

            })
            $.mobile.loading('hide');
       
    },
    events: {
        'keyup #searchbox': 'submit',        
    },
    submit: function (e) {

        e.preventDefault();
        var searchval = $('#searchbox').attr("value");
        if (searchval.length > 2) {
            $.mobile.loading('show', { text: "S" + unescape("%F6") + "ker.. v" + unescape("%E4") + "nta!", textVisible: true });
            
            getBoktipsSearchdata(this, searchval, function (that, boktipSearchJson) {
                var boktipSearchList = new AppMain.Collections.boktipsen(boktipSearchJson);
                var bookid;
                $('#UlSearchResult').html(_.template(tpl.get('boktipssearch_bma'), { collection: boktipSearchList.toJSON() }));
                $('#UlSearchResult').listview("refresh");
               
            })
            $.mobile.loading('hide');
        }
        console.log(searchval)
    },    
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('boktipssearchmain_bma'), { model: this.model.toJSON() }));

        return this;
    }
});


////////////////////////////////
AppMain.Views.krypin_bmaView = Backbone.View.extend({    
    initialize: function () {
        getuserdata(this, function () {
            return false;
        });
    },
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('krypin_bma'), { model: this.model}));
        return this;
    }
});
AppMain.Views.krypinedit_bmaView = Backbone.View.extend({
    events: {
        'click #Submitedit': 'submitedit'        
    },
    submitedit: function (e) {
        $.mobile.loading('show', { text: "Sparar.. v" + unescape("%E4") + "nta!", textVisible: true });
        e.preventDefault();
        
        var getuserdata = function (that, callback) {
            var userjson = storageHandler.get("_userdata");
            _userdata = new AppMain.Models.user(userjson);
           var uservalues = {
                userid: _userdata.get("userid"),
                user: _userdata.get("username"),
                pass: _userdata.get("password"),
                displayname: convertSvenskatecken(that.$('#visningsnamn').val()),
                fornamn: convertSvenskatecken(that.$('#fornamn').val()),
                efternamn: convertSvenskatecken(that.$('#efternamn').val()),
                adress: convertSvenskatecken(that.$('#adress').val()),
                postnr: that.$('#postnr').val(),
                ort: convertSvenskatecken(that.$('#ort').val()),
                skola: convertSvenskatecken(that.$('#skola').val()),
                alder: that.$('#alder').val(),
                epost: that.$('#epost').val()
            };
           console.log(uservalues.fornamn + ' 1:' + that.$('#ort').val() + ' 2:' + $('#skola').val());
            callback(that,uservalues);
           
        }
        
        getuserdata(this, function (that, usrinfo) {
            edituserdata(this, usrinfo, function (that, userjson) {

                _userdata.set({                    
                    displayname: userjson.displayname,
                    fornamn: userjson.fornamn,
                    efternamn: userjson.efternamn,
                    adress: userjson.adress,
                    postnr: userjson.postnr,
                    ort: userjson.ort,
                    skola:userjson.skola,
                    alder: userjson.alder,
                    epost: userjson.epost,
                    avatar: userjson.avatar,
                    systemmess: userjson.systemmess,
                    laserjustnu: userjson.laserjustnu
                    
                });
                storageHandler.set("_userdata", _userdata);
                $.mobile.loading('hide');
                $('#Message').html("Dina uppgifter är sparade!");
            });
        });
    },
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('krypinedit_bma'), { model: this.model }));
        return this;
    }
});
AppMain.Views.krypinavatar_bmaView = Backbone.View.extend({
    events: {
        'click .bytavatar': 'valdavatar',
    },
    valdavatar: function (e) {
        $.mobile.loading('show', { text: "Sparar.. v" + unescape("%E4") + "nta!", textVisible: true });
        e.preventDefault();
        var uservalues = {};
        var laddauserdata = function (that) {
            uservalues = {
                user: _userdata.get("username"),
                pass: _userdata.get("password"),
                avatar: $(e.currentTarget).attr("rel")
            };
        }
        var getuserdata = function (that1, callback) {
            var userjson = storageHandler.get("_userdata");
            _userdata = new AppMain.Models.user(userjson);
               callback(that1);
        }            
        getuserdata(this, function (that) { 
            laddauserdata(that);
        });              
        editavatar(this, uservalues, function (that, userjson) {
            var upduserdata = new AppMain.Models.user(userjson);
            if (upduserdata.get('avatar') == uservalues.avatar) {
                _userdata.set({ "avatar": uservalues.avatar });
                storageHandler.set("_userdata", _userdata);
                var lsmenu = storageHandler.get("menudata");
                var menumodel = new AppMain.Models.menu(lsmenu)
                menumodel.set({ avatar: uservalues.avatar });
                storageHandler.set("menudata", menumodel);
            };
            var changesrc = "<img id='imgValdAvatar' rel='" + _userdata.get("avatar") + "' src='images/bbimages/avatar/" + _userdata.get("avatar") + "' />"
            $('#valdAvatar').html(changesrc);
            $.mobile.loading('hide');
        });
    },

    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('krypinavatar_bma'), { model: this.model }));
        return this;
    }
});

AppMain.Views.krypinpresentation_bmaView = Backbone.View.extend({
    events: {
        'click #Submiteditpress': 'editpresentation'
    },
    editpresentation: function (e) {
        $.mobile.loading('show', { text: "Sparar.. v" + unescape("%E4") + "nta!", textVisible: true });
        e.preventDefault();
        var uservalues = {};
        var laddauserdata = function (that) {
            uservalues = {
                user: _userdata.get("username"),
                pass: _userdata.get("password"),
                presentation: convertSvenskatecken(that.$('#presentation').val())
            };
        }
        var getuserdata = function (that1, callback) {
            var userjson = storageHandler.get("_userdata");
            _userdata = new AppMain.Models.user(userjson);
            callback(that1);
        }
        getuserdata(this, function (that) {
            laddauserdata(that);
        });
        editpresentation(this, uservalues, function (that, userjson) {
            var upduserdata = new AppMain.Models.user(userjson);
            //if (upduserdata.get('presentation') != uservalues.presentation) {
                _userdata.set({ "presentation": uservalues.presentation });
                storageHandler.set("_userdata", _userdata);
            //};
            $.mobile.loading('hide');
            that.$('#Message').html("Presentationen är uppdaterad");
        });
    },

    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('krypinpresentation_bma'), { model: this.model }));
        return this;
    }
});

AppMain.Views.quizer_bmaView = Backbone.View.extend({
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('quizer_bma')));
        return this;
    }
});

AppMain.Views.rosta_bmaView = Backbone.View.extend({
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('rosta_bma')));
        return this;
    }
});
AppMain.Views.sagomaskinenmain_bmaView = Backbone.View.extend({
    render: function (eventName) {        
        $(this.el).html(_.template(tpl.get('sagomaskinenmain_bma'), { model: this.model.toJSON() }));
        return this;        
    }
});
AppMain.Views.sagomaskinen_bmaView = Backbone.View.extend({
    events: {
        'click #skapaSaga': 'submitsaga',
    },
    onClose: function () {
        var lsmenu = storageHandler.get("menudata");
        var menumodel = new AppMain.Models.menu(lsmenu)
        var menu = new AppMain.Views.menu_bmaView({ model: menumodel });
    },
    submitsaga: function (e) {
        $.mobile.loading('show', { text: "Skapar saga.. v" + unescape("%E4") + "nta!", textVisible: true });
        e.preventDefault();
        var maskinsaga = {
            substantiv1: this.$('#txtord1').val(),
            substantiv2: this.$('#txtord2').val(),
            substantiv3: this.$('#txtord4').val(),
            verb: this.$('#txtord3').val(),
            adjektiv: this.$('#txtord5').val()
        };
        $.mobile.loading('hide');
        storageHandler.set("maskinsaga", maskinsaga);
        app = new AppRouter();
        app.navigate('#sagomaskinenvisa', { trigger: true });
    },
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('sagomaskinen_bma'), { model: this.model.toJSON() }));
        return this;
    }
});
AppMain.Views.sagomaskinenvisa_bmaView = Backbone.View.extend({
	 events: {
	        'click #delasaga': 'delasaga',
	    },
	    delasaga: function (e) {
	        e.preventDefault();	        
	        var gensagan = this.$('#txtsagan').text();	       
	        navigator.share(gensagan, "Maskinsaga -Barnens mobilapp", "text/plain");
	        
	    },
	render: function (eventName) {
        $(this.el).html(_.template(tpl.get('sagomaskinenvisa_bma'), this.model.toJSON()));
        return this;
    }
});

AppMain.Views.sagomaskinen2_bmaView = Backbone.View.extend({
    events: {
        'click #skapaSaga': 'submitsaga',
    },
    onClose: function () {
        var lsmenu = storageHandler.get("menudata");
        var menumodel = new AppMain.Models.menu(lsmenu)
        var menu = new AppMain.Views.menu_bmaView({ model: menumodel });
    },
    submitsaga: function (e) {
        e.preventDefault();
        var maskinsaga = {
            ord1: this.$('#txtord1').val(),
            ord2: this.$('#txtord2').val(),
            ord3: this.$('#txtord3').val(),
            ord4: this.$('#txtord4').val(),
            ord5: this.$('#txtord5').val(),
            ord6: this.$('#txtord6').val(),
            ord7: this.$('#txtord7').val(),
            ord8: this.$('#txtord8').val(),
            ord9: this.$('#txtord9').val()
        };

        storageHandler.set("maskinsaga2", maskinsaga);
        app = new AppRouter();
        app.navigate('#sagomaskinenvisa2', { trigger: true });
    },
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('sagomaskinen2_bma'), { model: this.model.toJSON() }));
        return this;
    }
});
AppMain.Views.sagomaskinenvisa2_bmaView = Backbone.View.extend({
    events: {
        'click #delasaga': 'delasaga',
    },
    delasaga: function (e) {
        e.preventDefault();
        var gensagan = this.$('#txtsagan').text();
        navigator.share(gensagan, "Maskinsaga -Barnens mobilapp", "text/plain");

    },
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('sagomaskinenvisa2_bma'), this.model.toJSON()));
        return this;
    }
});
AppMain.Views.mybooks_bmaView = Backbone.View.extend({
    render: function (eventName) {
        var test = this.collection.toJSON()
        $(this.el).html(_.template(tpl.get('mybooks_bma'), { model: this.model.toJSON(), collection: this.collection.toJSON() }));
        return this;
    }
});
AppMain.Views.bokdetail_bmaView = Backbone.View.extend({
    events: {
        'change #chkmybook': 'mybookcheckbox',
        'change #chkvote': 'votecheckbox',
    },
    mybookcheckbox: function (e) {
        $.mobile.loading('show', { text: "Sparar.. v" + unescape("%E4") + "nta!", textVisible: true });
        var useridt = "";
        var usr = storageHandler.get("_userdata");
        if (usr.userid) {
                useridt = usr.userid;
                if ($(e.currentTarget).prop('checked')) {
                    console.log("vote checked: " + $(e.currentTarget).val());                    
                } else {
                    console.log("vote Inte checked: " + $(e.currentTarget).val());                    
                };
                updateMybookAjax(this, useridt, $(e.currentTarget).val(), function (that, isinmybook) {

                    if (isinmybook) {
                        $('#chkmybook').prop('checked', true).checkboxradio('refresh');
                    } else {
                        $('#chkmybook').prop('checked', false).checkboxradio('refresh');
                    }
                });               
                $.mobile.loading('hide');
        };
    },
    votecheckbox: function (e) {
        $.mobile.loading('show', { text: "Sparar.. v" + unescape("%E4") + "nta!", textVisible: true });
        var useridt="";
        var usr = storageHandler.get("_userdata");        
        
            if (usr.userid) {
                useridt = usr.userid;
                if ($(e.currentTarget).prop('checked')) {
                    console.log("vote checked: " + $(e.currentTarget).val());
                    votehandler('add', $(e.currentTarget).val(), useridt, function (maxvotes) {
                        if (maxvotes) {
                            $('#chkvote').prop('checked', false).checkboxradio('refresh');
                        }
                        
                    });
                } else {
                    console.log("vote Inte checked: " + $(e.currentTarget).val());
                    votehandler('del', $(e.currentTarget).val(), useridt);
                };
                $.mobile.loading('hide');
            };
        
    },
    voted: function (id) {
        var isbookvoted = "";
        var usrobj = storageHandler.get("_userdata");
               
            if (usrobj.userid) {
                isBookvotedfor(this, usrobj.userid, id, function (that, bookvoted) {
                    var statuscode = bookvoted.substring(0, 2);
                    if (statuscode == '11') {
                        $('#chkvote').prop('checked', true).checkboxradio('refresh');
                    }
                    isbookvoted = bookvoted;
                    console.log('isbookvoted: ' + isbookvoted);
                });
            };
        
    },
    inmybook: function (id) {
        var isbookvoted = "";
        var usrobj = storageHandler.get("_userdata");

        
            if (usrobj.userid) {
                chkisbookinMybookAjax(this, usrobj.userid, id, function (that, bookinmybooks) {                    
                    if (bookinmybooks) {
                        $('#chkmybook').prop('checked', true).checkboxradio('refresh');
                    }                   
                    console.log('bookinmybooks: ' + bookinmybooks);
                });
            };
        
    },
    render: function (eventName) {
        console.log('votetime: ' + this.model.votedfortotal); //hämtar idt från den medskickade arrayen
        var jsons = this.collection.toJSON();
        // this.inmybook(jsons[0].Boklist[0].bookid);
        //this.voted(jsons[0].Boklist[0].bookid);
        console.log('votetime: ' + this.model.votetime);
        $(this.el).html(_.template(tpl.get('bokdetail_bma'), { model: this.model.toJSON(), collection: this.collection.toJSON() }));
       
        return this;
    }
});
AppMain.Views.bokdetailextra_bmaView = Backbone.View.extend({
    render: function (eventName) {
        
        //console.log("bokdetailextra_bma id= " + bookid); //hämtar idt från den medskickade arrayen
        $(this.el).html(_.template(tpl.get('bokdetailextra_bma'), { model: this.model.toJSON(), collection: this.collection.toJSON() }));

        return this;
    }
});
AppMain.Views.booksuggestapi_bmaView = Backbone.View.extend({ // add list to bokdetailextraView
    el: '#alsoreadbox',
    initialize: function () {
        this.render();
    },
    render: function (eventName) {
        var test = this.collection.toJSON()
        $(this.el).html(_.template(tpl.get('booksuggestapi_bma'), { collection: this.collection.toJSON() }));
        return this;
    }

});

AppMain.Views.forfattarealsowrite_bmaView = Backbone.View.extend({ // add list to bokdetailextraView
    el: '#forfalsowrite',
    initialize: function () {
        this.render();
    },
    render: function (eventName) {
        var test = this.collection.toJSON()
        $(this.el).html(_.template(tpl.get('forfattarealsowrite_bma'), { collection: this.collection.toJSON() }));
        return this;

    }

});

AppMain.Views.latestbooks_bmaView = Backbone.View.extend({ // add list to bokdetailextraView
    el: '#latestbooks',
    initialize: function () {
        this.render();
    },
    render: function (eventName) {
        var test = this.collection.toJSON()
        $(this.el).html(_.template(tpl.get('latestbooks_bma'), { collection: this.collection.toJSON() }));
        return this;
    }

});

AppMain.Views.boktipsdetail_bmaView = Backbone.View.extend({
    render: function (eventName) {
        console.log("boktipsdetail_bma id= " + this.id); //hämtar idt från den medskickade arrayen
        $(this.el).html(_.template(tpl.get('boktipsdetail_bma'), { model: this.model.toJSON(), collection: this.collection.toJSON() }));
        return this;
    }
});
AppMain.Views.nyheter_bmaView = Backbone.View.extend({ // add list to bokdetailextraView
    el: '#nyheter',
    initialize: function () {
        this.render();
    },
    render: function (eventName) {       
        getnyheter(this, function (that, nyheterhtml) {                    
            $(that.el).html(nyheterhtml);
            $('#nyheter').trigger("create");
            $('#nav-panel').trigger("updatelayout");
            return that;
        })       
    }
});
AppMain.Views.manadensforfattare_bmaView = Backbone.View.extend({ // add list to bokdetailextraView
    el: '#forfattare',
    initialize: function () {
        this.render();
    },
    render: function (eventName) {
        getforfattare(this, function (that, forfattarehtml) {
            $(that.el).html(forfattarehtml);
            $('#forfattare').trigger("create");
            $('#nav-panel').trigger("updatelayout");
            return that;
        })
    }
});

AppMain.Views.bokomdomen_bmaView = Backbone.View.extend({ // add list to bokdetailextraView
    el: '#vadtyckerandra',
    initialize: function () {
        this.render();
    },
    render: function (eventName) {       
        $(this.el).html(_.template(tpl.get('bokomdomenlist_bma'), { collection: this.collection.toJSON() }));
        return this;
    }

});
AppMain.Views.menu_bmaView = Backbone.View.extend({
    el: '#nav-panel',
    initialize: function () {
            this.render();
        },
    render: function (eventName) {
        console.log("menu_bma id= "); //hämtar idt från den medskickade arrayen
        $(this.el).html(_.template(tpl.get('menu_bma'), this.model.toJSON()));        
        return this;
    }
});
AppMain.Views.votepage_bmaView = Backbone.View.extend({
    
    events: {
        'click #votbtn': 'votetotal',
        'click #sendvotes': 'Skickavotes',
        'click #update': 'updatelist',
        'click #notsure': 'notsure',
        'click #JustVotedmessage': 'JustVotedmessage'
    },
    Skickavotes:function(e){
        var usr = storageHandler.get("_userdata");
        $('#messageboxen').show();
        if (usr.adress && usr.epost && usr.postnr) {
           
            $('#iamSureSendVotes').show();
        } else {
            $('#adressMissing').show();
        };
        return false;
    },
    notsure: function (e) {
        $('#messageboxen').hide();
        return false;
    },
    JustVotedmessage: function (e) {
        $('#messageboxen').hide();
        return false;
    },
    votetotal: function (e) {
        e.preventDefault();
        
            var usr = storageHandler.get("_userdata");
            votefortotal(this, usr.userid, function (that, ok) {                
                $('#JustVotedmessage').show();
                $('#iamSureSendVotes').hide();
                $('#update').hide();              
                $('#sendvotes').hide();                
                $('#ul_votelistList .voted').addClass("justvoted");
                $('#votedtxt').html("Du har nu röstat i bokjuryn!");
            });
         
            return false;
       
    },
    updatelist: function (e) {       
            var counter = $('#ul_votelistList li').size();                              
            if(counter >0){                            
                $('#votbtn').show();
                $('#update').hide();
                $('#noresult').hide();
            };                               
            return false;       

    },
    render: function (eventName) {
        var votepage_bmatest = this.model.toJSON();
        $(this.el).html(_.template(tpl.get('votepage_bma'), { model: this.model.toJSON() }));
        return this;
    }
});
AppMain.Views.votepagevotedtotal_bmaView = Backbone.View.extend({
    
    render: function (eventName) {
        var test = this.model.toJSON();
        $(this.el).html(_.template(tpl.get('votepagevotedtotal_bma'), { model: this.model.toJSON() }));
        return this;
    }
});
AppMain.Views.votelist_bmaView = Backbone.View.extend({
    el: '#ul_votelistList',
    events: {
        'click .voted': 'delvote'
    },
    delvote: function (e) {
        var usr = storageHandler.get("_userdata");

       
            if (usr.userid) {
                var useridt = usr.userid;
                var valtbookid = $(e.currentTarget).attr("rel");
                console.log(valtbookid);
                if (valtbookid > 0) {                   
                    votehandler('del', valtbookid, useridt);
                } else {
                    alert("Du måste vara inloggad!");
                };
            }
        

        getuservotelist(this, userid, function (that, votelistlist) {
            var votelistcol = new AppMain.Collections.votedbooklistor(votelistlist);
            var nyvotelist = new AppMain.Views.votelist_bmaView({ collection: votelistcol });

        });
    },
    initialize: function () {
        this.render();
        
    },
    render: function (eventName) {
        
            var test = this.collection.toJSON()
            $(this.el).html(_.template(tpl.get('votelist_bma'), { collection: this.collection.toJSON() })).listview("refresh");
            return this;
       
    }
});

AppMain.Views.votelistvotedtotal_bmaView = Backbone.View.extend({
    el: '#ul_votelistList',    
    initialize: function () {
        this.render();
    },
    render: function (eventName) {
        var test = this.collection.toJSON()
        $(this.el).html(_.template(tpl.get('votelistvotedtotal_bma'), { collection: this.collection.toJSON() })).listview("refresh");
        return this;
    }
});

//Informationssida -------------------------------------------------------------------
AppMain.Views.information_bmaView = Backbone.View.extend({
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('information_bma')));
        return this;
    }
});
//End Informationssida

//Informationssida -------------------------------------------------------------------
AppMain.Views.noconnection_bmaView = Backbone.View.extend({
    render: function (eventName) {
        $(this.el).html(_.template(tpl.get('noconnection_bma')));
        return this;
    }
});
//End Informationssida
//var element = document.getElementById('deviceProperties');
//element.innerHTML = 'Device Name: '     + device.name     + '<br />' +
//                    'Device Model: '    + device.model    + '<br />' +
//                    'Device Cordova: '  + device.cordova  + '<br />' +
//                    'Device Platform: ' + device.platform + '<br />' +
//                    'Device UUID: '     + device.uuid     + '<br />' +
//                    'Device Version: '  + device.version  + '<br />';


