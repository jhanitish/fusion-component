import { control } from "fusion-test-helpers";
import FindMyDoctor from "../../../main/js/component/FindMyDoctor";
import ToggleControl from "../../../main/js/component/controls/ToggleControl";
import SearchControl from "../../../main/js/component/controls/SearchControl";
import TableControl from "../../../main/js/component/controls/TableControl";
import { createRows, locationSearch, uidSearch } from "../../../main/js/component/helpers/tableHelper";

describe("Find my doctor", () =>{
    let findMyDoctor;

    beforeEach(() => {
        findMyDoctor = new FindMyDoctor();
    });

    describe("Constructor ", () => {
        beforeEach(() => {
            spyOn(findMyDoctor, 'getDoctorData');
        });
        it("calls get doctor data request", () => {
            findMyDoctor.constructor();
            expect(findMyDoctor.getDoctorData).toHaveBeenCalled();
        });
    });

    describe("Get Doctor Data", () => {
        let xmlRequest;
        let resolveSpy;
        let rejectSpy;
        let findDocPromise;
        beforeEach(() => {
            findMyDoctor = new FindMyDoctor();
            xmlRequest = {
                open: jasmine.createSpy('open'),
                send: jasmine.createSpy('send'),
                status: jasmine.createSpy('status').and.returnValue(200),
                response: jasmine.createSpy('response'),
                onload: jasmine.createSpy('onload')
            };
            XMLHttpRequest = jasmine.createSpy('XMLHttpRequest');
            XMLHttpRequest.and.callFake(() => {
                return xmlRequest;
            });
            resolveSpy = jasmine.createSpy("Promise.resolve");
            rejectSpy = jasmine.createSpy("Promise.reject");
            findMyDoctor.getDoctorData();
            findDocPromise = new Promise((resolve, reject)  => {
            });
        });

        describe("Checking promise function here", () => {
            it("returns a promise object of  your function", () => {
                expect(findMyDoctor.getDoctorData()).toEqual(jasmine.any(Promise));
            });
            it("should call proper location json file", () => {
                findMyDoctor.getChild("searchControl").setProp("formName", "location");
                let formName = findMyDoctor.getChild("searchControl").getProp("formName")
                findMyDoctor.getDoctorData();
                expect(formName).toEqual("location");
                expect(xmlRequest.open).toHaveBeenCalledWith(
                    "GET", "http://localhost:9005/src/main/js/component/data/location.json", true);
            });
            it("checking the send method for getDoctorData", () => {
                findMyDoctor.getDoctorData();
                expect(xmlRequest.send).toHaveBeenCalled();
            });
        });    
    });

    describe("jsonDataRetrive function", () => {
        let tableControl;
        let searchControl;

        beforeEach(() => {
            findMyDoctor.jsonDataRetrive(mockRowsArray);
            tableControl = findMyDoctor.getChild("tableControl");
            searchControl = findMyDoctor.getChild("searchControl");
            spyOn(tableControl.getChild("tableControl"), "update");
        });
        it("setting the value for table rows", () => {
            const tableRows =  tableControl.getChild("tableControl").getProp("rows");

            expect(tableControl).toEqual(jasmine.any(TableControl));
            expect(tableRows[0].data[0].content[0].getProps().anchorControl.getProps().display).toEqual("Jason Snitzer");
            expect(tableRows[0].data[1].display).toEqual("MD");
            expect(tableRows[0].data[2].display).toEqual("English");
        });

        it("search data based on location toggle", () => {
            searchControl.getChild("searchControl").setProp("formName", "location");
            const searchFormName = searchControl.getChild("searchControl").getProp("formName");
            searchControl.getChild("searchControl").setProp("options", locationSearch(mockRowsArray));
            const searchList = searchControl.getChild("searchControl").getProp("options");
            expect(searchFormName).toEqual("location");
            expect(searchList.results[0].data[0].display).toEqual("ca-santa-clara");
            expect(searchList.results[0].key).toEqual("row0");
        });

        it("search data based on uid toggle", () => {
            searchControl.getChild("searchControl").setProp("formName", "uid");
            const searchFormName = searchControl.getChild("searchControl").getProp("formName");
            searchControl.getChild("searchControl").setProp("options", uidSearch(mockRowsArray));
            const searchList = searchControl.getChild("searchControl").getProp("options");
            expect(searchFormName).toEqual("uid");
            expect(searchList.results[0].data[0].display).toEqual("001f60172493d3546f7869f4b8bad742");
            expect(searchList.results[0].key).toEqual("row0");
        });
    });



    describe("the createChildren function", () => {

        it("renders the toggle, search and table controls", () => {
            let children = findMyDoctor.createChildren();
            expect(children[0].toggleControl).toEqual(jasmine.any(ToggleControl));
            expect(children[0].toggleControl.getProps().clickEventName).toEqual("toggleButtonClick");
            expect(children[1].searchControl).toEqual(jasmine.any(SearchControl)); 
            expect(children[1].searchControl.getProps().clickEventName).toEqual("sortRowsClick");
            expect(children[1].searchControl.getProps().formName).toEqual("location");
            expect(children[2].tableControl).toEqual(jasmine.any(TableControl));
        });
    });

    describe("FindMyDoctor.view function", () => {
        let findMyDoctorDom;
        let toggleControl; 
        let tableControl;
        let searchControl;
        
        beforeEach(() => {
            findMyDoctorDom = control(new FindMyDoctor());
            toggleControl = findMyDoctor.getChildren()[0];
            tableControl = findMyDoctor.getChildren()[1];
            searchControl = findMyDoctor.getChildren()[2];
            spyOn(toggleControl, "render");
            spyOn(tableControl, "render");
            spyOn(searchControl, "render");
        });
        it("checking the find my doctor dom elements", () => {
            expect(findMyDoctorDom.tag()).toBe("div");

            expect(findMyDoctorDom.hasClass("find-my-doctor-container")).toBe(true);
        });
        it("checking the render children", () => {
            control(findMyDoctor);
            expect(toggleControl.render).toHaveBeenCalled();
            expect(tableControl.render).toHaveBeenCalled();
            expect(searchControl.render).toHaveBeenCalled();
        });
    });

    describe("After.Create function", () => {
        beforeEach(() => {
            spyOn(findMyDoctor, "on");
            spyOn(findMyDoctor, "stopPropagation");
            findMyDoctor.afterCreate();
        });    

        describe("SearchControl", () => {
            let value;
            let isValid;
            beforeEach(() => {
                value= "row1";
                isValid = true;

            });
            it("sortRowsClick emit event", () => {
                findMyDoctor.getChild("tableControl").setProp("rows", createRows(mockRowsArray));
                findMyDoctor.emit("sortRowsClick", findMyDoctor.getChild("SearchControl"), {}, {value, isValid});
                let sortedData = findMyDoctor.getChild("tableControl").getChild("tableControl").getProp("rows");
                expect(findMyDoctor.stopPropagation).toHaveBeenCalledWith("sortRowsClick");
                expect(sortedData[0].key).toEqual(value);
                expect(sortedData[0].data[0].content[0].getProps().anchorControl.getProps().display).toEqual("Martin Jimenez");
                expect(sortedData[0].data[1].display).toEqual("MD");
                expect(sortedData[0].data[2].display).toEqual("English");
            });
        });
        describe("ToggleControl", () => {
            let payload;
            beforeEach(() => {
                spyOn(findMyDoctor, "getDoctorData");
                payload = {
                    changed: {
                        deselections: {
                            0: "uid"
                        },
                        selections: {
                            0: "location"
                        }
                    },
                    selected: {
                        ids: {
                            0: "location"
                        }
                    }
                }
            });

            it("toggleButtonClick emit event", () => {
                findMyDoctor.emit("toggleButtonClick", findMyDoctor.getChild("SearchControl"), payload);
                const toggleButtonSelected = payload.selected.ids[0];
                findMyDoctor.getChild("searchControl").setProp("formName", toggleButtonSelected);
                expect(findMyDoctor.stopPropagation).toHaveBeenCalledWith("toggleButtonClick");
                expect(toggleButtonSelected).toEqual("location");
                expect(findMyDoctor.getChild("searchControl").getProp("formName")).toEqual("location");
                expect(findMyDoctor.getDoctorData).toHaveBeenCalled();
            });
        });
    });
});