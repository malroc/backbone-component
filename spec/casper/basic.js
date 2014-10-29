casper.test.begin(
    "Basic test: core component/helper functionality" ,
    8                                                 ,
    function suite( test ) {
        casper.start(
            "http://localhost:8000/spec/examples/basic.html" ,
            function( ) {
                test.assertTitle( "Backbone.Component: basic test" ,
                                  "HTML page title"                );
            }
        );

        casper.waitForSelector(
            ".component-component1 a" ,
            function( ) {
                test.assertExists( ".component-component1 a"  ,
                                   "component 1 is found"     );
                test.assertExists( "div.component-2#cmp-2"    ,
                                   "component 2 is found"     );
                test.assertExists( ".component-helper strong" ,
                                   "helper is found"          );
                test.assertSelectorHasText( ".component-component1 a"  ,
                                            "Example component 1"      );
                test.assertSelectorHasText( "div.component-2#cmp-2"    ,
                                            "Example component 2"      );
                test.assertSelectorHasText( ".component-helper strong" ,
                                            "Example helper"           );
                this.click( ".component-component1 a" );
            }
        );

        casper.waitForSelectorTextChange(
            ".component-component1 a" ,
            function( ) {
                test.assertSelectorHasText( ".component-component1 a" ,
                                            "Example component 1."    );
            }
        );

        casper.run(
            function( ) {
                test.done();
            }
        );
    }
);
