Kendo UI for jQuery PDF Viewer

ASP.Net Core 7 Blazor WASM - Visual Studio 2022

This Kendo UI for jQuery PDF Viewer sample for Blazor is created to replace the native Blazor PDF viewer (version upto november 2023) which contains a bug and shows PDF's in inferior quality. 

* Use a Blazor component to call the Kendo UI widget creation to create the PDF viewer
* Updated pdf.js to 3.11.174 in stead of 2.2.x
* Loading PDF from file or Data in the PDF viewer
* Wait for the PDF viewer component to load the PDF (max 10 seconds) so it can be used in javascript

Custom buttons for complete PDF manipulation...

<input type="button" value="Download" onclick="onDownloadClick()"/>
<input type="button" value="Remove buttons from Toolbar" onclick="removeButtonsFromToolbar()" />
<input type="button" value="Adjust settings" onclick="adjustSettings()" />
<input type="button" value="Set PDF from file" onclick="setFile()" />
<input type="button" value="Set PDF from data" onclick="setData()" />
<input type="button" value="Set PDF from data and preserve the current zoom-level" onclick="setDataPreserve()" />
<input type="button" value="Set Scale" onclick="setScale(2.67)" />
<input type="button" value="Set Fullwidth" onclick="setZoomOption(2)" />
<input type="button" value="Get the current zoom-option" onclick="getZoomOption()" />
<input type="button" value="Get the current zoom-value" onclick="getZoomValue()" />
<input type="button" value="Set zoom-value" onclick="setZoomValue(123)" />
<input type="button" value="Hide the PDF viewer" onclick="addClass('vsi-hidden')" />
<input type="button" value="Show the PDF viewer" onclick="removeClass('vsi-hidden')" />

VSI Curacao - www.vsi.cw - Marc Verkade - November 2023