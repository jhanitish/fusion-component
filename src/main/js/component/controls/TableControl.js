import { UIComponent, atomic } from "MPageFusion";

/*
to use atomic and composite controls we have to declare it
*/
const {
    table: {
        Table
    }
} = atomic;


export default class TableControl extends UIComponent {

    /**
     * @inheritdoc
     */
    createChildren() {
        return [{
            tableControl: new Table({
                classNames: "table-control",
                columns: [
                    {
                        display: "Name",
                        key: "nameColumn",
                        sortable: true,
                        defaultSortOrder: -1,
                        sortOrder: 0
                    },
                    {
                        display: "Title",
                        key: "titleColumn"
                    },
                    {
                        display: "Languages Known",
                        key: "languagesKnownColumn"
                    }
                ],
                columnProps: {
                    clickEventName: "sortingByName"
                },
                rowProps: {
                    rowSelectionChangeEventName: ""
                },
                rows: []
            })
        }];
    }

    /**
     * @inheritDoc
     */
    view(el, props, children, mappedChildren) {
        return el(
            "div",
            {
                class: "table-content-div"
            },
            mappedChildren.tableControl.render()
        );
    }

    /**
     * Life cycle method of UIComponent. Assigns a callback to the sort rows event.
     * Sorting the table based on the column.
     * @returns {undefined} Returns nothing
     */
    afterCreate() {
        this.on("sortingByName", (colHeaderCell, colKey, sortOrder) => {
            const tableControl = this.getChild("tableControl");
            const columns = tableControl.getProp("columns");
            const sortRows = Table.helpers.sort([
                Table.helpers.compareKeyedColumn(
                    colKey,
                    columns,
                    cell => cell.content[0].getProps().anchorControl.getProps().display,
                    sortOrder
                )
            ]);
            tableControl.setProp(
                "rows",
                sortRows({ rows: tableControl.getProp("rows") })
            );
            tableControl.update();
        });
    }
}
