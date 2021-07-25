import TableControl from "../../../../main/js/component/controls/TableControl";
import { control } from "fusion-test-helpers";
import { UIComponent, atomic, composite } from "MPageFusion";
import { createRows } from "../../../../main/js/component/helpers/tableHelper";

/*
to use atomic and composite controls we have to declare it
*/
const {
    table: {
        Table
    },
    label: {
        Anchor
    },
    card: {
        Card
    }
} = atomic;
const {
    dialog: {
        Popup
    }
} = composite;

describe("Table control renders using", () => {
    let tableControl;
    let vDom;
    
    beforeEach(() => {
        tableControl = new TableControl();
    });

    describe("the createChildren function", () => {
        let tableControlChildren;
        beforeEach(() => {
            tableControlChildren = tableControl.createChildren()[0].tableControl;
        });

        describe("checking the columns properties", () => {
            let tableControlColumn;
            beforeEach(() => {
                tableControlColumn = tableControlChildren.getProps().columns;
            });

            it("table header", () => {
                expect(tableControlColumn[0].display).toEqual("Name");
                expect(tableControlColumn[0].key).toEqual("nameColumn");
                expect(tableControlColumn[0].sortable).toBe(true);
                expect(tableControlColumn[0].defaultSortOrder).toEqual(-1);
                expect(tableControlColumn[0].sortOrder).toEqual(0);
                expect(tableControlColumn[1].display).toEqual("Title");
                expect(tableControlColumn[1].key).toEqual("titleColumn");
                expect(tableControlColumn[2].display).toEqual("Languages Known");
                expect(tableControlColumn[2].key).toEqual("languagesKnownColumn");
            });
        });

        describe("columnprops properties", () => {
            let tableControlColumnProps;
            beforeEach(() => {
                tableControlColumnProps = tableControlChildren.getProps().columnProps;
            });

            it("checking the column events properties", () => {
                expect(tableControlColumnProps.clickEventName).toEqual("sortingByName");
            });
        });

        describe("rowprops properties", () => {
            let tableControlRowProps;
            beforeEach(() => {
                tableControlRowProps = tableControlChildren.getProps().rowProps;
            });

            it("checking the rows events properties", () => {
                expect(tableControlRowProps.rowSelectionChangeEventName).toEqual("");
            });
        });

        describe("rows properties", () => {
            let tableControlRows;
            beforeEach(() => {
                tableControlRows = tableControlChildren.getProps().rows;
            });

            it("creating table rows", () => {
                expect(tableControlRows).toEqual([]);
            });
        });

                
    });

    describe("The TableControl.view function", () => {
        let tableDom;
        let tableControlChild;

        beforeEach(() => {
            tableDom = control(new TableControl());
            tableControlChild = tableControl.getChild("tableControl");
            spyOn(tableControlChild, "render");
        });

        it("checking the table dom elements", () => {
            expect(tableDom.tag()).toBe("div");

            expect(tableDom.hasClass("table-content-div")).toBe(true);
        });

        it("checking the render children", () => {
            
            control(tableControl);
            expect(tableControlChild.render).toHaveBeenCalled();
        });
    });

    describe("The afterCreate function", () => {
        let sortedData;
        let docTable;
        let columns;
        
        beforeEach(() => {
            tableControl = new TableControl(); //eslint-disable-line
            columns = tableControl.getChild("tableControl").getProp("columns");
            docTable = tableControl.getChild("tableControl");
            tableControl.getChild("tableControl").setProp("rows", createRows(mockRowsArray));
            spyOn(tableControl, "on");
            tableControl.afterCreate();
            spyOn(docTable, "update");
            spyOn(docTable, "setProp").and.callThrough();
            vDom = control(tableControl);
        });

        it("calls setProp and update function", () => {
            tableControl.emit("sortingByName", docTable.getChildren()[0].getChildren()[0].getChildren()[0], "nameColumn", -1);
            expect(docTable.setProp).toHaveBeenCalled();
            expect(docTable.update).toHaveBeenCalled();
        });

        it("sorts the table data by Name column in descending order", () => {
            tableControl.emit("sortingByName", docTable.getChildren()[0].getChildren()[0].getChildren()[0], "nameColumn", -1); // eslint-disable-line no-undef
            sortedData = docTable.getProp("rows");
            expect(sortedData[0].data[0].content[0].getProps().anchorControl.getProps().display).toEqual("Terry Anderson");
            expect(sortedData[0].data[1].display).toEqual("MD");
            expect(sortedData[0].data[2].display).toEqual("English");
        });

        it("sorts the table data by Name column in ascending order", () => {
            tableControl.emit("sortingByName", columns, "nameColumn", 1); // eslint-disable-line no-undef
            sortedData = docTable.getProp("rows");
            expect(sortedData[0].data[0].content[0].getProps().anchorControl.getProps().display).toEqual("David Bloom");
            expect(sortedData[0].data[1].display).toEqual("MD");
            expect(sortedData[0].data[2].display).toEqual("English");
        });
    });    
});