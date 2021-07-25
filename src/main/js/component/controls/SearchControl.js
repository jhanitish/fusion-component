import { UIComponent, composite } from "MPageFusion";

/*
to use atomic and composite controls we have to declare it
*/
const {
    form: {
        FormSearch
    }
} = composite;

export default class SearchControl extends UIComponent {

    /**
     * @inheritDoc
     */
    createChildren() {
        return [{
            searchControl: new FormSearch({
                inputEventName: "searchInput",
                inputFocusEventName: "searchInputFocus",
                isRequired: true,
                isDisabled: false,
                formName: "uid",
                options: { },
                value: "",
                valueChangeEventName: "searchValueChange"
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
                class: "search-box-div"
            },
            mappedChildren.searchControl.render()
        );
    }

    /**
     * Life cycle method of UIComponent. Assigns a callback to the searchValueChange event.
     * Search within the table based on search list.
     * @returns {undefined} Returns nothing
     */

    afterCreate() {
        this.on("searchValueChange", (context, { value, isValid }) => {
            this.stopPropagation("searchValueChange");
            this.emit("sortRowsClick", this, context, { value, isValid });
        });
    }
}
