import { createRows, locationSearch, uidSearch } from "../../../../main/js/component/helpers/tableHelper";

describe("tableHelpers", () => {
    describe("createRows function", () => {
        let processedRows;
        let tableRowsData;
        let tableControlRowsProps;

        it("returns processed rows with display, popup, card", () => {
            processedRows = createRows(mockRowsArray);
            tableRowsData = processedRows[0].data;
            tableControlRowsProps = tableRowsData[0].content[0].getProps();

            expect(processedRows[0].key).toEqual("row0");
            expect(processedRows[0].isSelected).toBe(false);
            expect(tableRowsData[0].display).toEqual("");
            expect(tableRowsData[1].display).toEqual("MD");
            expect(tableRowsData[2].display).toEqual("English");
            expect(tableControlRowsProps.title).toEqual("Doctor Details");
            expect(tableControlRowsProps.alwaysShowHeader).toBe(true);
            expect(tableControlRowsProps.anchorControl.getProps().display).toEqual("Jason Snitzer");
            expect(tableControlRowsProps.anchorControl.getProps().key).toEqual("anchor0");
            expect(tableControlRowsProps.content[0].getProps().items[0].value).toEqual("Bio");
            expect(tableControlRowsProps.content[0].getProps().items[1].value).toEqual("Dr. Jason Snitzer, MD, specialist in pediatrics, currently sees patients in Santa clara, California.\n\nDr. Snitzer is licensed to treat patients in California.\n\nDr. Snitzer has passed an automated background check which looked at elements including medical license status and malpractice screening (no history found).");
            expect(tableControlRowsProps.content[1].getProps().items[0].value).toEqual("Educational Details");
            expect(tableControlRowsProps.content[1].getProps().items[1].value).toEqual("MD");
            expect(tableControlRowsProps.content[2].getProps().items[0].value).toEqual("Specialization");
            expect(tableControlRowsProps.content[2].getProps().items[1].value).toEqual("Pediatrician");
            expect(tableControlRowsProps.content[3].getProps().items[0].value).toEqual("Practice Locations");
            expect(tableControlRowsProps.content[3].getProps().items[1].value).toEqual("ca-santa-clara");
        });
    });

    describe("Location Search", () => {
        let processedLocationSearch;
        let processedSearch;

        it("returns processed location list", () => {
            processedLocationSearch = locationSearch(mockRowsArray);
            processedSearch = processedLocationSearch.results;
            
            expect(processedLocationSearch.placeholder).toEqual("Search By Location");
            expect(processedLocationSearch.throttle).toEqual(300);
            expect(processedSearch[0].key).toBe("row0");
            expect(processedSearch[0].data[0].display).toEqual("ca-santa-clara");
        });    
    });

    describe("UID Search", () => {
        let processedUIDSearch;
        let processedSearch;

        it("returns processed uid list", () => {
            processedUIDSearch = uidSearch(mockRowsArray);
            processedSearch = processedUIDSearch.results;
            
            expect(processedUIDSearch.placeholder).toEqual("Search By UID");
            expect(processedUIDSearch.throttle).toEqual(300);
            expect(processedSearch[5].key).toBe("row5");
            expect(processedSearch[5].data[0].display).toEqual("333d4bb6fcf640e18e93b11b00fe09eb");
        });    
    });
});