import { UIComponent } from "MPageFusion";
import TableControl from "./controls/TableControl";
import ToggleControl from "./controls/ToggleControl";
import SearchControl from "./controls/SearchControl";
import { createRows, locationSearch, uidSearch } from "./helpers/tableHelper";

/**
 * Definition of the FindMyDoctor class.
 * @class FindMyDoctor
 */
export default class FindMyDoctor extends UIComponent {

    constructor() {
        super("find-my-doctor");
        this.getDoctorData();
    }
    /**
     * Getting json data based on the toggle button property using promise.
     * Setting rows after dynamically getting data from JSON file.
     * @returns {Object} Returns object
     */
    getDoctorData() {
        const request = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            request.onload = () => {
                if (request.status === 200) {
                    resolve(request);
                } else {
                    reject({
                        status: "400",
                        statusText: "request failed"
                    });
                }
            };
            if (this.getChild("searchControl").getProp("formName") === "uid") {
                request.open("GET", "http://localhost:9005/src/main/js/component/data/uid.json", true);
            } else if (this.getChild("searchControl").getProp("formName") === "location") {
                request.open("GET", "http://localhost:9005/src/main/js/component/data/location.json", true);
            }
            request.send();
        }).then((data) => {
            const jsonData = JSON.parse(data.responseText);
            this.jsonDataRetrive(jsonData.data);
        });
    }

    /**
     * After getting the json data dynamically creating rows.
     * Setting rows after dynamically getting data from JSON file.
     * @returns {Object} Returns object
     */
    jsonDataRetrive(jsonData) {
        const searchControl = this.getChild("searchControl");
        const tableControl = this.getChild("tableControl");
        tableControl.setProp("rows", createRows(jsonData));
        tableControl.getChild("tableControl").setProp("rows", createRows(jsonData)).update();
        if (this.getChild("searchControl").getProp("formName") === "location") {
            searchControl.getChild("searchControl").setProp("options", locationSearch(jsonData)).update();
        } else if (this.getChild("searchControl").getProp("formName") === "uid") {
            searchControl.getChild("searchControl").setProp("options", uidSearch(jsonData)).update();
        }
    }
    /**
     * @inheritDoc
     */
    createChildren() {
        return [
            {
                toggleControl: new ToggleControl({
                    clickEventName: "toggleButtonClick"
                })
            },
            {
                searchControl: new SearchControl({
                    clickEventName: "sortRowsClick",
                    formName: "location"
                })
            },
            {
                tableControl: new TableControl()
            }
        ];
    }
    /**
     * @inheritDoc
     */
    view(el, props, children, mappedChildren) {
        return el(
            "div",
            {
                class: "find-my-doctor-container"
            },
            mappedChildren.toggleControl.render(),
            mappedChildren.searchControl.render(),
            mappedChildren.tableControl.render()
        );
    }

    /**
     * @inheritdoc
     */
    afterCreate() {
        /**
         * Assigns a callback to the sortRowsClick event.
         * Search within the table based on search list.
         * @returns {undefined} Returns nothing
         */
        this.on("sortRowsClick", (source, context, { value, isValid }) => {
            this.stopPropagation("sortRowsClick");
            const searchRowsData = this.getChild("tableControl").getProp("rows").filter(rowData => rowData.key === value);
            this.getChild("tableControl").getChild("tableControl").setProp("rows", searchRowsData).update();
        });

        /**
         * Assigns a callback to the toggleButtonClick event.
         * Toggles the search box based on the toggle button click.
         * @returns {undefined} Returns nothing
         */
        this.on("toggleButtonClick", (source, payload) => {
            this.stopPropagation("toggleButtonClick");
            const toggleButtonSelected = payload.selected.ids[0];
            this.getChild("searchControl").setProp("formName", toggleButtonSelected);
            this.getDoctorData();
        });
    }
}
