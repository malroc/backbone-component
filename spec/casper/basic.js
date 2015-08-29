casper.test.begin(
    "Basic test: core component/helper functionality" ,
    18                                                ,
    function suite( test ) {
        casper.start(
            "http://localhost:8000/spec/examples/basic.html" ,
            function( ) {
                test.assertTitle( "Backbone.Component: basic test" ,
                                  "HTML page title"                );
                this.click( "#render-view-1" );
            }
        );

        casper.waitForSelectorTextChange(
            "#initialize-output" ,
            function( ) {
                this.click( "#render-view-2" );
            }
        );

        casper.waitForSelector(
            "#view-2 .component-component1 a" ,
            function( ) {
                for ( i = 1; i < 3; i++ ) {
                    test.assertExists( "#view-"                             +
                                       i                                    +
                                       " .component-component1"             +
                                       "[id^=\"component-component1-\"] a"  ,
                                       "component 1 is found"               );
                    test.assertExists( "#view-"                             +
                                       i                                    +
                                       " div.component-2[id^=\"cmp-2-\"]"   ,
                                       "component 2 is found"               );
                    test.assertExists( "#view-"                             +
                                       i                                    +
                                       " .helper-helper strong"             ,
                                       "helper is found"                    );
                    test.assertSelectorHasText( "#view-"                    +
                                                i                           +
                                                " .component-component1 a"  ,
                                                "Example component 1"       );
                    test.assertSelectorHasText( "#view-"                    +
                                                i                           +
                                                " div.component-2"          ,
                                                "Example component 2"       );
                    test.assertSelectorHasText( "#view-"                    +
                                                i                           +
                                                " .helper-helper strong"    ,
                                                "Example helper"            );
                    test.assertSelectorHasText( "#initialize-output"        ,
                                                "+*+*"                      );
                    this.click( "#view-" + i + " .component-component1 a"   );
                };
            }
        );

        casper.waitForSelectorTextChange(
            ".component-component1 a" ,
            function( ) {
                for ( i = 1; i < 3; i++ ) {
                    test.assertSelectorHasText( "#view-"                    +
                                                i                           +
                                                " .component-component1 a"  ,
                                                "Example component 1."      );
                    this.click( "#remove-view-" + i );
                }
            }
        );

        casper.waitForSelectorTextChange(
            "#remove-output" ,
            function( ) {
                test.assertSelectorHasText( "#remove-output" ,
                                            "-/-/"           );
            }
        );

        casper.run(
            function( ) {
                test.done();
            }
        );
    }
);
