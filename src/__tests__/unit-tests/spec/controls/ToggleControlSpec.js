import ToggleControl from "../../../../main/js/component/controls/ToggleControl";
import { control } from "fusion-test-helpers";
import { UIComponent, composite } from "MPageFusion";
import TableControl from "../../../../main/js/component/controls/TableControl";

/*
to use atomic and composite controls we have to declare it
*/
const {
    button: {
        ButtonGroup
    }
} = composite;

describe("Toggle control renders using", () =>{
    let toggleControl;

    beforeEach(() => {
        toggleControl = new ToggleControl();
    });

    describe("the createChildren function", () => {
        let children;
        let childToggleControl;
        beforeEach(() => {
            children = toggleControl.createChildren()[0];
            childToggleControl = children.toggleControl.getProps();
        });

        it("and it creates an toggle button object", () => {
            expect(childToggleControl.canDeselect).toBe(false);
            expect(childToggleControl.multiSelect).toBe(false);
            expect(childToggleControl.classNames).toBe("toggle-button");
            expect(childToggleControl.selectionChangeEventName).toEqual("toggleButtonSelect");
        });
        it("and it checks the properties of the toggle button", () => {
            const childToggleItems = childToggleControl.items;
            expect(childToggleItems[0].id).toEqual("location");
            expect(childToggleItems[0].display).toEqual("Location");
            expect(childToggleItems[0].isSelected).toBe(true);
            expect(childToggleItems[0].type).toEqual("secondary");
            expect(childToggleItems[0].classNames).toBe("location-toggle");
            expect(childToggleItems[1].id).toEqual("uid");
            expect(childToggleItems[1].display).toEqual("UID");
            expect(childToggleItems[1].isSelected).toBe(false);
            expect(childToggleItems[1].type).toEqual("secondary");
            expect(childToggleItems[1].classNames).toBe("location-toggle");
        });
    });

    describe("ToggleControl.view function", () => {
        let toggleDom;
        let toggleControl;
        beforeEach(() => {
            toggleDom = control(new ToggleControl());
            toggleControl = new ToggleControl().getChild("toggleControl");
            spyOn(toggleControl, "render");
        });

        it("checking the toggle dom elements", () => {
            expect(toggleDom.tag()).toBe("div");

            expect(toggleDom.hasClass("toggle-button-div")).toBe(true);
        });
        
        it("checking the render", () => {
            control(toggleControl);
            expect(toggleControl.render).toHaveBeenCalled();
        });
    });

    describe("After.Create function", () => {
        let toggleEventHandler;
        let events;
        beforeEach(() => {
            events = {};
            toggleControl = new ToggleControl();
            spyOn(toggleControl, "on").and.callFake((name, handler) => {
                events[name] = handler;
            });
            toggleControl.afterCreate();
        });

        it("emits the event ", () => {
            expect(toggleControl.on).toHaveBeenCalledWith("toggleButtonSelect", jasmine.any(Function)); // eslint-disable-line no-undef
        });


        describe("The toggleButtonSelect event handler function", () => {
            let payload;
            beforeEach(() => {
                spyOn(toggleControl, "emit");
                toggleEventHandler = events["toggleButtonSelect"];
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
            it("emits the event with the payload value", () => {
                toggleEventHandler({}, payload);
                expect(toggleControl.emit).toHaveBeenCalledWith("toggleButtonClick", toggleControl, payload);
            });
        });    
    });
});