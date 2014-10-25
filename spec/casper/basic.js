casper.test.begin(
    "Basic test: core component/helper functionality" ,
    6                                                 ,
    function suite( test ) {
        casper.start(
            "http://localhost:8000/spec/examples/basic.html" ,
            function( ) {
                test.assertTitle( "Backbone.Component: basic test" ,
                                  "HTML page title"                );
            }
        );

        casper.waitForSelector(
            ".component-component a" ,
            function( ) {
                test.assertExists( ".component-component a"   ,
                                   "component is found"       );
                test.assertExists( ".component-helper strong" ,
                                   "helper is found"          );
                test.assertSelectorHasText( ".component-component a"   ,
                                            "Example component"        );
                test.assertSelectorHasText( ".component-helper strong" ,
                                            "Example helper"           );
                this.click( ".component-component a" );
            }
        );

        casper.waitForSelectorTextChange(
            ".component-component a" ,
            function( ) {
                test.assertSelectorHasText( ".component-component a"   ,
                                            "Example component."       );
            }
        );

        casper.run(
            function( ) {
                test.done();
            }
        );
    }
);
