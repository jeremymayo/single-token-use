//***Part 1 - Instantiate the Viz
var viz, sheet, workbook; //we need this to be semi-global so we can reference it via multiple functions

    function initViz()
    {
        var containerDiv = document.getElementById("vizContainer"),
            url = "http://localhost/views/tc_viz/Original",
            options =
            {
                height: "675px",
                width: "1100px",
                hideTabs: true,
                hideToolbar: true,
                onFirstInteractive: function () //this function fires only once when the viz is first time rendered - think of it as init function
                {
                    console.log("Run this code when the viz has finished loading.");

                    workbook = viz.getWorkbook();
                    console.log(workbook);

                    sheet = viz.getWorkbook().getActiveSheet();
                    console.log(sheet.getName());

                    sheets = sheet.getWorksheets();
                    console.log(sheets);

                  for(var i =0; i < sheets.length; i++) {
                    sheetName = sheets[i].getName();
                    console.log(sheetName);
                  }

                    // *** Part 5a - Listen to Events
                    listenToMarksSelection();
                    $('#dataTablesDiv').hide();
                }
            }
        viz = new tableau.Viz(containerDiv, url, options); // Create a viz object and embed it in the container div.
    }

//***Part 2 - Export buttons
	function exportToPDF()
	{
            viz.showExportPDFDialog();
     }

    function exportToCSV()
    {
            viz.showExportDataDialog();
     }

    // ALEX -- Download a Crosstab
	function downloadCrosstab()
	{
		viz.showExportCrossTabDialog();
	}

//***Part 3 - Filter and Revert to Original State

    // ALEX -- Filter Region
    function filterRegion(filterName, value) {
        for(var i =0; i < sheets.length; i++) {
          sheets[i].applyFilterAsync(filterName, value, tableau.FilterUpdateType.REPLACE);
        }
    }

    function clearFilters(filterName) {
        for(var i =0; i < sheets.length; i++) {
          sheets[i].clearFilterAsync(filterName);
        }
    }

    function revertAll() {
        viz.revertAllAsync();
    }

//*** Part 4 - Marks Selections
    // We'll take in the values passed from dashboard.html and select only those marks.
   function selectStates(category, value) {
       sheet = viz.getWorkbook().getActiveSheet();
       if(sheet.getSheetType() === 'worksheet') {
            sheet.selectMarksAsync(category, value, tableau.SelectionUpdateType.REPLACE);
       } else {
           worksheetArray = sheet.getWorksheets();
           for(var i = 0; i < worksheetArray.length; i++) {
               worksheetArray[i].selectMarksAsync(category, value, tableau.SelectionUpdateType.REPLACE);
           }
       }
   }
    // We'll add to our selected marks.
   function addToStates(category, value) {
       sheet = viz.getWorkbook().getActiveSheet();
       if(sheet.getSheetType() === 'worksheet') {
            sheet.selectMarksAsync(category, value, tableau.SelectionUpdateType.ADD);
       } else {
           worksheetArray = sheet.getWorksheets();
           for(var i = 0; i < worksheetArray.length; i++) {
               worksheetArray[i].selectMarksAsync(category, value, tableau.SelectionUpdateType.ADD);
           }
       }
   }
    // Time to clear the marks.
    function clearSelection() {
         worksheetArray = sheet.getWorksheets();
         for(var i = 0; i < worksheetArray.length; i++) {
           worksheetArray[i].clearSelectedMarksAsync();
          }
        }

//*** Part 5b - Listen & Respond to Events
      function listenToMarksSelection() {
          viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
      }

      //Mark selection Handler

      //this is the function we specified in the event listener to run whenever a mark selection event occurs
      function onMarksSelection(marksEvent) {

        //filter sheets of selected marks because we dont need to hear events on all of our sheets
        if (marksEvent.getWorksheet().getName() == "Sales Map"){

          //get,marksAsync() is a method in the API that will retun a set of the marks selected
          return marksEvent.getMarksAsync().then(reportSelectedMarks);
        }
      }

      //This function is called after we get an array of marks from our mark selection event
      function reportSelectedMarks(marks) {

        //loop through all the selected marks
        for (var markIndex = 0; markIndex < marks.length; markIndex++) {

          //getPairs gets tuples of data for the mark. one mark has multiple tuples
          pairs = marks[markIndex].getPairs();

          //loop through the tuples
          for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {

            //we want to insert certain fields into an external table, this logic will set variables in our javascript layer for those
            if (pairs[pairIndex].fieldName == "Country") {
              country = pairs[pairIndex].formattedValue;
            } else if (pairs[pairIndex].fieldName == "State") {
              stateName = pairs[pairIndex].formattedValue;
            } else if (pairs[pairIndex].fieldName == "SUM(Quantity)") {
              sumQuantity = pairs[pairIndex].formattedValue;
            }
          }
          console.log(pairs);
          $('#auditDetailTable tr:last').after('<tr><td>' + country + '</td><td>' + stateName + '</td><td>' + sumQuantity + '</td>');
        }
      }

      //Here we load the table with our "Generate Tables" button and unhide the "dataTablesDiv"
      function loadTable() {
          $('#dataTablesDiv').show();
       }

      function emptyTable(){
          $('#auditDetailTable').empty();
          $('#auditDetailTable').html("<tr><th>Country</th><th>State</th><th>Quantity</th></tr>");
          $('#dataTablesDiv').hide();
          clearSelection();
      }