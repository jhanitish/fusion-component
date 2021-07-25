import SearchControl from "../../../../main/js/component/controls/SearchControl";
import { control } from "fusion-test-helpers";
import { UIComponent, composite } from "MPageFusion";

/*
to use atomic and composite controls we have to declare it
*/
const {
    form: {
        FormSearch
    }
} = composite;

describe("Search control renders using", () =>{
    let searchControl;

    beforeEach(() => {
        searchControl = new SearchControl();
    });

    describe("the createChildren function", () => {
        let children;
        let childSearchControl;
        beforeEach(() => {
            children = searchControl.createChildren()[0];
            childSearchControl = children.searchControl.getProps();
        });

        it("and it creates an search box object", () => {
            expect(childSearchControl.inputEventName).toEqual("searchInput");
            expect(childSearchControl.inputFocusEventName).toEqual("searchInputFocus");
            expect(childSearchControl.isRequired).toEqual(true);
            expect(childSearchControl.isDisabled).toEqual(false);
            expect(childSearchControl.options).toEqual({});
            expect(childSearchControl.value).toEqual("");
            expect(childSearchControl.valueChangeEventName).toEqual("searchValueChange");
        });
    });

    describe("SearchControl.view function", () => {
        let searchDom;
        let searchControlChild;

        beforeEach(() => {
            searchDom = control(new SearchControl());
            searchControlChild = searchControl.getChild("searchControl");
            spyOn(searchControlChild, "render");
        });

        it("checking the search dom elements", () => {
            expect(searchDom.tag()).toBe("div");

            expect(searchDom.hasClass("search-box-div")).toBe(true);
        });

        it("checking the render", () => {
            
            control(searchControl);
            expect(searchControlChild.render).toHaveBeenCalled();
        });
    });

    describe("After.Create function", () => {
        let actionHandler;
        let events;
        let value;
        let isValid;
        beforeEach(() => {
            events = {};
            value = "row1",
            isValid = true
            searchControl = new SearchControl();
            spyOn(searchControl, "on").and.callFake((name, handler, value, isValid) => {
                events[name] = handler;
            });
            searchControl.afterCreate();
        });

        it("emits the event ", () => {
            expect(searchControl.on).toHaveBeenCalledWith("searchValueChange", jasmine.any(Function)); // eslint-disable-line no-undef
        });

        describe("The toggleButtonSelect event handler function", () => {
            beforeEach(() => {
                spyOn(searchControl, "emit");
                spyOn(searchControl, "stopPropagation");
                actionHandler = events["searchValueChange"];
            });
            it("stops event bubbling", () => {
                actionHandler({}, "something");
                expect(searchControl.stopPropagation).toHaveBeenCalledWith("searchValueChange");
            });

            it("emits the event with the payload value", () => {
                actionHandler({}, "",{ isValid, value });
                expect(searchControl.emit).toHaveBeenCalledWith("sortRowsClick", searchControl, {}, { isValid: undefined, value: undefined });
            });
        });    
    });
});