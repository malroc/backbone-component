// Backbone.Component v0.1.0
// (c) 2014 Oleg Kalistratov, for SourceTalk project (http://sourcetalk.net)
// Distributed Under MIT License

(
    function ( factory ) {
        if ( ( typeof define === "function" ) && ( define.amd ) ) {
            // AMD. Register as an anonymous module.
            define( [ "underscore", "backbone" ] ,
                    factory                      );
        } else {
            // Browser globals
            factory( _, Backbone );
        }
    }(
        function( _, Backbone ) {
            "use strict";

            var namespace          = Backbone.Components;
            var baseViewClass      = Backbone.View;
            var transformHTML      = null;
            var observedComponents = { };

            var observe = function( component ) {
                if ( component.selector                        &&
                     !observedComponents[ component.selector ] ) {
                    observedComponents[ component.selector ] = component;
                }
            };

            var unobserve = function( selector ) {
                delete observedComponents[ selector ];
            };

            var register = function( componentName ) {
                var proto      = baseViewClass.prototype;
                var components = observedComponents;
                var cls        = null;

                if ( _.isArray( namespace ) ) {
                    _.each(
                        namespace ,
                        function( ns ) {
                            cls || ( cls = ns[ componentName ] );
                        }
                    );
                } else {
                    cls = namespace[ componentName ];
                }

                proto[ "insert" + componentName ] = function( ) {
                    var res       = "";
                    var component = new cls;
                    var wrapper   =
                        ( _.last( arguments ) || { } )[ "wrapper" ] || { };
                    var className =
                        "component-" +
                        componentName.
                        replace( /([A-Z])/g, "-$1" ).
                        replace( /^\-+/, "" ).
                        toLowerCase( );

                    wrapper[ "htmlId"    ] || ( wrapper[ "htmlId"    ] =
                                                _.uniqueId( className )      );
                    wrapper[ "htmlClass" ] || ( wrapper[ "htmlClass" ] = ""  );
                    wrapper[ "htmlClass" ] += " " + className;

                    component.selector      = "#" + wrapper[ "htmlId" ];
                    component.componentName = componentName;

                    if ( component instanceof Backbone.Component ) {
                        observe( component );
                    }

                    res = component.generate.apply( component, arguments );
                    res = template(
                        {
                            "html"          : res                ,
                            "componentName" : componentName      ,
                            "selector"      : component.selector ,
                            "wrapper"       : wrapper
                        }
                    );

                    if ( _.isFunction( transformHTML ) ) {
                        res = transformHTML.call( this, res );
                    }

                    return res;
                };

                proto[ "observe" + componentName ] = function( selector ) {
                    if ( selector ) {
                        component          = new cls;
                        component.selector = selector;

                        observe( component );
                    }
                };
            };

            var componentObserver = new MutationObserver(
                function( ) {
                    _.each(
                        observedComponents ,
                        function( component, selector ) {
                            component.check( );
                            if ( component.unobserveFlag ) {
                                unobserve( selector );
                            }
                        }
                    );
                }
            );

            var template = _.template(
                "\
                    <span class=\"<%= wrapper[ \"htmlClass\" ] %>\"\
                          id=\"<%= wrapper[ \"htmlId\" ] %>\"\
                          data-component-selector=\"<%= selector %>\"\
                          data-component-name=\"<%= componentName %>\">\
                        <%= html %>\
                    </span>\
                "
            );

            Backbone.Helper = function( ) {
                this.cid = _.uniqueId( "helper" );
                this.initialize.apply( this, arguments );
            };

            _.extend(
                Backbone.Helper.prototype ,
                Backbone.Events           ,
                {
                    initialize: function( ) {
                    } ,

                    generate:   function( ) {
                        return "";
                    }
                }
            );

            Backbone.Helper.extend = Backbone.Model.extend;

            Backbone.Component = Backbone.Helper.extend(
                {
                    activate:   function( ) {
                    } ,

                    deactivate: function( ) {
                    } ,

                    check:      function( ) {
                        var el = document.querySelector( this.selector );

                        if ( el && !this.present ) {
                            if ( !el.attributes[ "data-component-name" ] ) {
                                el.setAttribute( "data-component-name" ,
                                                 this.componentName    );
                            }
                            if ( !el.attributes[ "data-component-selector" ] ) {
                                el.setAttribute( "data-component-selector" ,
                                                 this.componentName        );
                            }
                            this.setElement( el );
                            this.activate( );
                        } else if ( !el && this.present ) {
                            this.undelegateEvents( );
                            this.deactivate( );
                            this.unobserveFlag = true;
                        }

                        this.present = !!el;
                    }
                }
            );

            _.extend(
                Backbone.Component.prototype ,
                _.pick(
                    Backbone.View.prototype ,
                    "$"                     ,
                    "setElement"            ,
                    "delegateEvents"        ,
                    "undelegateEvents"
                )
            );

            Backbone.Component.VERSION  = "0.1.0";

            Backbone.Component.initialize = function( options ) {
                var initNS = function( ns ) {
                    _.each(
                        ns ,
                        function( v, k ) {
                            if ( ( typeof( v ) === "function"             ) &&
                                 ( v.prototype instanceof Backbone.Helper ) ) {
                                register( k );
                            };
                        }
                    );
                };

                options || ( options = { } );

                namespace     = options[ "namespace"     ] || namespace;
                baseViewClass = options[ "baseViewClass" ] || baseViewClass;
                transformHTML = options[ "transformHTML" ] || transformHTML;

                if ( _.isArray( namespace ) ) {
                    _.each( namespace, initNS );
                } else {
                    initNS( namespace );
                }

                baseViewClass.prototype.unobserve = function( selector ) {
                    unobserve( selector );
                };

                baseViewClass.prototype.reobserveAll = function( ) {
                    var elements =
                        this.el.querySelectorAll( "[data-component-selector]" );
                    var view     = this;

                    _.each(
                        elements ,
                        function( el ) {
                            var componentName =
                                el.getAttribute( "data-component-name"     );
                            var selector      =
                                el.getAttribute( "data-component-selector" );

                            if ( selector                          &&
                                 componentName                     &&
                                 view[ "observe" + componentName ] ) {
                                view[ "observe" + componentName ]( selector );
                            }
                        }
                    );
                };

                componentObserver.observe(
                    document.body ,
                    {
                        "childList" : true ,
                        "subtree"   : true
                    }
                );
            };
        }
    )
);
