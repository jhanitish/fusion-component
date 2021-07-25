import { atomic, composite } from "MPageFusion";
/*
to use atomic and composite controls we have to declare it
*/
const {
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

/**
 * Returns an array of rows to be used by the TableControl.
 * @param {Object} rows Array of dynamic data for the column
 * @returns {Object} An array of objects for row
 */
export const createRows = rows => rows.map((row, index) => {
    const processedRows = {
        key: `row${index}`,
        isSelected: false,
        data: [
            {
                display: "",
                content: [
                    new Popup({
                        title: "Doctor Details",
                        alwaysShowHeader: true,
                        anchorControl: new Anchor({
                            display: `${row.profile.first_name} ${row.profile.last_name}`,
                            key: `anchor${index}`
                        }),
                        content: [
                            new Card({
                                items: [
                                    {
                                        value: "Bio"
                                    },
                                    {
                                        value: `${row.profile.bio}`
                                    }
                                ]
                            }),
                            new Card({
                                items: [
                                    {
                                        value: "Educational Details"
                                    },
                                    {
                                        value: `${row.profile.title}`
                                    }
                                ]
                            }),
                            new Card({
                                items: [
                                    {
                                        value: "Specialization"
                                    },
                                    {
                                        value: `${row.specialties[0].actor}`
                                    }
                                ]
                            }),
                            new Card({
                                items: [
                                    {
                                        value: "Practice Locations"
                                    },
                                    {
                                        value: `${row.practices[0].location_slug}`
                                    }
                                ]
                            })
                        ]
                    })
                ]
            },
            {
                display: `${row.profile.title}`
            },
            {
                display: `${row.profile.languages[0].name}`
            }
        ]
    };
    return processedRows;
});

/**
 * Returns an array of search location list to be used by the SearchControl.
 * @param {Object} rows Array of dynamic data for the location search list
 * @returns {Object} An array of objects for location search list
 */
export const locationSearch = (rows) => {
    const processedLocationSearch = {
        placeholder: "Search By Location",
        throttle: 300,
        results: rows.map((row, index) => {
            const processedSearch = {
                key: `row${index}`,
                data: [
                    {
                        display: `${row.practices[0].location_slug}`
                    }
                ]
            };
            return processedSearch;
        })
    };
    return processedLocationSearch;
};

/**
 * Returns an array of search uid list to be used by the SearchControl.
 * @param {Object} rows Array of dynamic data for the uid search list
 * @returns {Object} An array of objects for uid search list
 */
export const uidSearch = (rows) => {
    const processedUIDSearch = {
        placeholder: "Search By UID",
        throttle: 300,
        results: rows.map((row, index) => {
            const processedSearch = {
                key: `row${index}`,
                data: [
                    {
                        display: `${row.uid}`
                    }
                ]
            };
            return processedSearch;
        })
    };
    return processedUIDSearch;
};
