import { UIComponent, composite } from "MPageFusion";

/*
to use atomic and composite controls we have to declare it
*/
const {
    button: {
        ButtonGroup
    }
} = composite;

export default class ToggleControl extends UIComponent {

    /**
     * @inheritdoc
     */
    createChildren() {
        return [{
            toggleControl: new ButtonGroup(
                {
                    canDeselect: false,
                    multiSelect: false,
                    classNames: "toggle-button",
                    selectionChangeEventName: "toggleButtonSelect",
                    items: [
                        {
                            display: "Location",
                            id: "location",
                            isSelected: true,
                            type: "secondary",
                            classNames: "location-toggle"
                        },
                        {
                            display: "UID",
                            id: "uid",
                            type: "secondary",
                            isSelected: false,
                            classNames: "location-toggle"
                        }
                    ]
                },
                []
            )
        }];
    }
    /**
     * @inheritDoc
     */
    view(el, props, children, mappedChildren) {
        return el(
            "div",
            {
                class: "toggle-button-div"
            },

            mappedChildren.toggleControl.render()
        );
    }

    /**
     * Life cycle method of UIComponent. Assigns a callback to the toggleButtonSelect event.
     * Toggle between the two buttons for searching based on selected field.
     * @returns {undefined} Returns nothing
     */
    afterCreate() {
        this.on("toggleButtonSelect", (source, payload) => {
            this.emit("toggleButtonClick", this, payload);
        });
    }
}
