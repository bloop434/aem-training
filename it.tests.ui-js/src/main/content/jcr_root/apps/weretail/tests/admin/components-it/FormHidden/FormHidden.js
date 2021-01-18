/*
 *  Copyright 2016 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

;(function(h, $){

    //shortcut
    var c = window.CQ.WeRetailIT.commons;
    var formHidden = window.CQ.WeRetailIT.FormHidden;

    //element name
    var elemName = "hiddenComponent_name";
    //element value
    var elemValue = "hiddenComponent_value";
    //element id
    var elemId = "hiddenComponent_id";

    /**
     * Before Test Case
     */
    formHidden.tcExecuteBeforeTest = function () {
        return new TestCase("Setup Before Test")
        //common set up
            .execTestCase(c.tcExecuteBeforeTest)
            //create the test page, store page path in 'testPagePath'
            .execFct(function (opts,done) {
                c.createPage(c.template, c.rootPage ,'page_' + Date.now(),"testPagePath",done)
            })
            //add the component, store component path in 'hiddenPath'
            .execFct(function (opts, done){
                c.addComponent(c.rtFormHidden, h.param("testPagePath")(opts)+c.relParentCompPath,"hiddenPath",done)
            })
            //open the new page in the editor
            .navigateTo("/editor.html%testPagePath%.html");
    };

    /**
     * After Test Case
     */
    formHidden.tcExecuteAfterTest = function() {
        return new TestCase("Clean up after Test")
        //common clean up
            .execTestCase(c.tcExecuteAfterTest)
            //delete the test page we created
            .execFct(function (opts, done) {
                c.deletePage(h.param("testPagePath")(opts), done);
            });
    };

    /**
     * Helper test case: set the mandatory fields
     */
    formHidden.setMandatoryFields = new h.TestCase("Set Mandatory Fields")
    //and the mandatory element name
        .fillInput("[name='./name']",elemName);

    /**
     * Test: Check if Label is mandatory
     */
    formHidden.checkMandatoryFields = function(tcExecuteBeforeTest, tcExecuteAfterTest) {
        return new h.TestCase("Check Mandatory fields",{
            execBefore: tcExecuteBeforeTest,
            execAfter: tcExecuteAfterTest})

        // Open the edit dialog
            .execTestCase(c.tcOpenConfigureDialog("hiddenPath"))
            // try to close the edit dialog, NOTE: cant use tc.SaveConfigDialog as in fullscreen mode it would fail
            // since its expects a reload after clicking save
            .click(c.selSaveConfDialogButton,{expectNav:false})
            // check if the dialog is still open
            .asserts.visible(c.selConfigDialog)
            // check if element name is marked as invalid
            .asserts.isTrue(function() {
                return h.find("input[name='./name'].is-invalid").size() == 1
            });
    };

    /**
     * Test: Set element name
     */
    formHidden.setElementName = function(tcExecuteBeforeTest, tcExecuteAfterTest) {
        return new h.TestCase("Set Element Name",{
            execBefore: tcExecuteBeforeTest,
            execAfter: tcExecuteAfterTest})

        //Open the edit dialog
            .execTestCase(c.tcOpenConfigureDialog("hiddenPath"))
            //set the mandatory element name
            .execTestCase(formHidden.setMandatoryFields)
            // close the edit dialog
            .execTestCase(c.tcSaveConfigureDialog)

            //Check if the name is set correctly
            .asserts.isTrue(function() {
                return h.find("input[type='hidden'][name='" + elemName + "']","#ContentFrame").size() == 1;
            });
    };

    /**
     * Test: Set element value
     */
    formHidden.setElementValue = function(tcExecuteBeforeTest, tcExecuteAfterTest) {
        return new h.TestCase("Set Element Value",{
            execBefore: tcExecuteBeforeTest,
            execAfter: tcExecuteAfterTest})

        //Open the edit dialog
            .execTestCase(c.tcOpenConfigureDialog("hiddenPath"))
            //set the mandatory element name
            .execTestCase(formHidden.setMandatoryFields)
            //set the element value
            .fillInput("[name='./value']",elemValue)
            // close the edit dialog
            .execTestCase(c.tcSaveConfigureDialog)

            //Check if the value is set correctly
            .asserts.isTrue(function() {
                return h.find("input[type='hidden'][value='" + elemValue + "']","#ContentFrame").size() == 1;
            });
    };

    /**
     * Test: Set element identifier
     */
    formHidden.setElementId = function(tcExecuteBeforeTest, tcExecuteAfterTest) {
        return new h.TestCase("Set Element Identifier",{
            execBefore: tcExecuteBeforeTest,
            execAfter: tcExecuteAfterTest})

        //Open the edit dialog
            .execTestCase(c.tcOpenConfigureDialog("hiddenPath"))
            //set the mandatory element name
            .execTestCase(formHidden.setMandatoryFields)
            //set the element id
            .fillInput("[name='./id']",elemId)
            //close the edit dialog
            .execTestCase(c.tcSaveConfigureDialog)

            //Check if the id is set correctly
            .asserts.isTrue(function() {
                return h.find("input[type='hidden'][id='" + elemId + "']","#ContentFrame").size() == 1;
            });
    };

    var tcExecuteBeforeTest = formHidden.tcExecuteBeforeTest();
    var tcExecuteAfterTest = formHidden.tcExecuteAfterTest();

    /**
     * The main test suite.
     */
    new h.TestSuite('We.Retail Tests - Form Hidden', {path: '/apps/weretail/tests/admin/components-it/FormHidden.js',
        execBefore:c.tcExecuteBeforeTestSuite,
        execInNewWindow : false})

        .addTestCase(formHidden.checkMandatoryFields(tcExecuteBeforeTest, tcExecuteAfterTest))
        .addTestCase(formHidden.setElementName(tcExecuteBeforeTest, tcExecuteAfterTest))
        .addTestCase(formHidden.setElementValue(tcExecuteBeforeTest, tcExecuteAfterTest))
        .addTestCase(formHidden.setElementId(tcExecuteBeforeTest, tcExecuteAfterTest))
    ;

}(hobs, jQuery));

