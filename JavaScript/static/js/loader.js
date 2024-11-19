import {
    TableauViz,
    TableauEventType,
  } from 'https://prod-useast-a.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';

function initializeViz() {
    viz = document.getElementById("viz");
    viz.width = 200;
    viz.height = 200;
    viz.hideTabs = true;
    viz.hideToolbar = true;
    viz.src = 'https://prod-useast-a.online.tableau.com/t/murrayslanding/views/RedirectPage/Dashboard1';
    viz.token = CA_SSO_token;

    const onFirstInteractive = () => {
      workbook = viz.getWorkbook();
      activeSheet = workbook.getActiveSheet();
      loadNewDoc();
    };
  
    viz.addEventListener(TableauEventType.FirstInteractive, onFirstInteractive);
  }   


function loadNewDoc(){
       window.location="/dashboard";
       }


       
// var viz, sheet, workbook; //we need this to be semi-global so we can reference it via multiple functions

//     function initViz()
//     {
//         var containerDiv = document.getElementById("vizContainer"),
//             url = "http://localhost/trusted/" + ticket + "/views/RedirectPage/Sheet1",
//             options =
//             {
//                 height: "1px",
//                 width: "1px",
//                 hideTabs: true,
//                 hideToolbar: true,
//                 onFirstInteractive: function () //this function fires only once when the viz is first time rendered - think of it as init function
//                 {
//                     console.log("Finished loading, redirecting to dashboard.");
//                     loadNewDoc();
//                 }
//             }
//         viz = new tableau.Viz(containerDiv, url, options); // Create a viz object and embed it in the container div.
//     }