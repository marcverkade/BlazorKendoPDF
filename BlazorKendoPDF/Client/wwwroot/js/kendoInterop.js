// Check if Kendo and jQuery are loaded correctly
function ensureKendoAndJquery() {
	if (!window.$ || !window.kendo) {
		alert("Something went wrong with loading the Kendo library, review the script references and browser console");
		// implement your own preferred error handling and/or CDN fallback
		return false;
	}
	return true;
}

function createWidget(functionName, container, id, dotNetComponent, initialColor) {
	if (!ensureKendoAndJquery()) { return; }

	// create the jQuery widgets here
	window[functionName]($(container).find("#" + id), dotNetComponent, initialColor);
}

function destroyWidgets(container) {
	if (!ensureKendoAndJquery()) { return; }

	// dispose the Kendo widgets in the container to avoid memory leaks when Blazor removes their DOM elements
	// if you have your own jQuery events attached, detach them here as well
	kendo.destroy(container);

	// if you have issues with Blazor not clearing all the DOM generated through jQuery, you may need to do it yourself
	// for example, widgets generating popup elements outside of the current container may remain in the DOM and
	// you may need to remove them yourself (e.g., before destroying the Kendo widgets, so you can use the references they offer)
	// $(container).find("#" + ganttId).empty();
}

// Create the PdfViewer element from a Blazor component through the CreateWidget function - Using a PDF as data
function createPdfViewer($elem) {
	console.log("PDF Viewer create with data");
	$.when(
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.js"),
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.js")
	).done(function () {
		window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.js';
	}).then(function () {
		$elem.kendoPDFViewer({
			pdfjsProcessing: {
				file: { data: $elem[0].dataset.pdfdata }
			},
			toolbar: {
				items: [
					"pager", "spacer", "zoomInOut",
					"zoom", "toggleSelection", "spacer", "search", "open", "download", "print"
				]
			},
			width: $elem[0].dataset.width,
			height: $elem[0].dataset.height,
			scale: $elem[0].dataset.scale
		}).data("kendoPDFViewer");
	});

	// Wait for the viewer to load the PDF page
	waitForPdfViewer().then(function (pdfViewerWidget) {
		if (pdfViewerWidget) {
			// Rest of your code that depends on the pdfViewerWidget
			console.log("Rest of the code can now use pdfViewerWidget");

			// Add a custom class
			addClass('vsi-pdfreader');
		};
	});
}

// Wait for the viewer to load the PDF page
function waitForPdfViewer() {
	return new Promise((resolve) => {
		const checkInterval = 1000; // Check every 1 second
		const maxAttempts = 10; // Maximum number of attempts

		let attempts = 0;

		const checkPdfViewer = () => {
			const pdfViewerWidget = $("#pdfViewer").data("kendoPDFViewer");
			if (pdfViewerWidget) {
				console.log("PDF Viewer Widget found");
				resolve(pdfViewerWidget);
			} else {
				attempts++;
				if (attempts < maxAttempts) {
					console.log("Waiting for PDF Viewer Widget...");
					setTimeout(checkPdfViewer, checkInterval);
				} else {
					console.log("PDF Viewer Widget not found after max attempts.");
					resolve(null); // Resolve with null if not found after max attempts
				}
			}
		};
		checkPdfViewer(); // Start the initial check
	});
}

// Download the PDF
function onDownloadClick() {
	var pdfViewer = $("#pdfViewer").data("kendoPDFViewer");

	if (pdfViewer) {
		console.log("onDownloadClick: PDF Viewer found");
		pdfViewer.execute({ command: "DownloadCommand" });
	} else {
		console.log("onDownloadClick: PDF Viewer not found");
	}
}

// Remove some buttons from the toolbar
function removeButtonsFromToolbar() {

	// Check if the element is found
	var pdfViewerElement = $("#pdfViewer")
	if (pdfViewerElement) {
		console.log("removeButtonsFromToolbar: PDF Element found");
	} else {
		console.log("removeButtonsFromToolbar: PDF Element not found");
	}

	// Check if pdfviewer is found and log to console
	// Not working, see kendoui.for.jquery.2023.3.1114.pdf page 2050
	// var pdfViewer = $("#pdfViewer").getKendoPDFViewer();
	var pdfViewerWidget = $("#pdfViewer").data("kendoPDFViewer");
	if (pdfViewerWidget) {
		console.log("removeButtonsFromToolbar: PDF Viewer Widget found");
	} else {
		console.log("removeButtonsFromToolbar: PDF Viewer Widget not found");
	}

	// Check if printToolElement is found and log to console
	var printToolElement = $(".k-toolbar").find('button[title="Print"]');
	if (printToolElement.length > 0) {
		console.log("Print tool element found");
		pdfViewerWidget.toolbar.remove(printToolElement);
	} else {
		console.log("Print tool element not found"); // Not found
	}
}

// Adjust settings in the PDF viewer
function adjustSettings() {
	console.log("Adjusting viewport settings");
	var pdfViewer = $("#pdfViewer").data("kendoPDFViewer");
	pdfViewer.setOptions
	({
		width: "80%",
		height: 450,
	})
}

// Set a PDF file in the PDF viewewr
function setFile() {
	console.log("Setting a PDF file");
	var pdfViewer = $("#pdfViewer").data("kendoPDFViewer");
	if (pdfViewer) {
		console.log("SetFile: PDF Viewer found");
		pdfViewer.fromFile("https://localhost:7237/samplereport.pdf")
	} else {
		console.log("SetFile: PDF Viewer not found");
	}
}

// Set data in the PDF viewewr
function setData() {
	console.log("Setting a PDF through data");
	var pdfViewer = $("#pdfViewer").data("kendoPDFViewer");
	if (pdfViewer) {
		console.log("SetData: PDF Viewer found");
		pdfViewer.fromFile({ data: "JVBERi0xLjEKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDEvTWVkaWFCb3ggWy00MCAtNjQgMjYwIDgwXSA+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjE8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9BcmlhbD4+ID4+ID4+L0NvbnRlbnRzIDQgMCBSPj5lbmRvYmoKNCAwIG9iajw8L0xlbmd0aCA1OT4+CnN0cmVhbQpCVAovRjEgMTggVGYKMCAwIFRkCihUZWxlcmlrIFBkZlZpZXdlciBmb3IgQmxhem9yKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDIxIDAwMDAwIG4KMDAwMDAwMDA4NiAwMDAwMCBuCjAwMDAwMDAxOTUgMDAwMDAgbgowMDAwMDAwNDkwIDAwMDAwIG4KdHJhaWxlciA8PCAgL1Jvb3QgMSAwIFIgL1NpemUgNSA+PgpzdGFydHhyZWYKNjA5CiUlRU9G" })
	} else {
		console.log("SetData: PDF Viewer not found");
	}
}

function setDataPreserve()
{
	// Remember the current zoomoption and zoomvalue
	// Set the scale by zoomValue if zoomOption == -1 (custom zoom) -> ZoomSet = true
	// Hide the PDF viewer
	// Load the new page
	// Set the zoomOption if ZoomSet == false
	// Unhide the PDF viewer

	var ZoomSet = false;
	var ZoomOption = getZoomOption();
	var ZoomValue = getZoomValue();
	var ZoomValueOption = getZoomValueOption(ZoomValue); 

	// Parse the ZoomValue
	var numericZoomValue = parseFloat(ZoomValue);
	if (numericZoomValue === 0) {
		numericZoomValue = 100;
	}

	// Set the Scale when it is custom and not an option
	if (ZoomOption == -1)
	{
		if (ZoomValueOption == -1) {
			// It is really a custom item
			ZoomSett = true;
			setScale(numericZoomValue / 100);
		}
	}

	// Hide the viewer
	addClass('vsi-hidden');

	// Set the data
	setData();

	// Set the combo if no zoom is set
	if (!ZoomSet)
	{
		setZoomOption(ZoomOption);
	}

	// Show the viewer
	removeClass('vsi-hidden');
}

// After setting the scale like this and you load a new page, this setting will be uses in stead of the initial scale setting
function setScale(scaleFactor) {
	alert('Load a PDF or data to see this new scale setting');
	console.log("Adjusting scale");
	var pdfViewer = $("#pdfViewer").data("kendoPDFViewer");

	if (pdfViewer) {
		console.log("SetScale: PDF Viewer found");
		pdfViewer.setOptions
			({
				scale: scaleFactor
			})
	} else {
		console.log("SetScale: PDF Viewer not found");
	}
}

// Add a class name to a component
function addClass(addClassName) {
	console.log("Setting class:" + addClassName);
	var pdfViewer = $("#pdfViewer");

	if (pdfViewer) {
		console.log("AddClass: PDF Viewer found");
		pdfViewer.addClass(addClassName);
	} else {
		console.log("AddClass: PDF Viewer not found");
	}
}

// Remove a class name to a component
function removeClass(removeClassName) {
	console.log("Removing class:" + removeClassName);
	var pdfViewer = $("#pdfViewer");

	if (pdfViewer) {
		console.log("RemoveClass: PDF Viewer found");
		pdfViewer.removeClass(removeClassName);
	} else {
		console.log("RemoveClass: PDF Viewer not found");
	}
}

// Set the zoom option through the menu since it is not possible to set by code
// 2 = Full-width
function setZoomOption(zoomOption) {
	var combo = $(".k-combobox-clearable").find("input").last().getKendoComboBox();

	if (combo) {
		console.log("SetZoomOption: Zoomcombo found");

		combo.select(zoomOption);
		combo.trigger("change");
	}
	else {
		console.log("SetZoomOption: Zoomcombo not found");
	}
}

function getZoomOption() {
	var combo = $(".k-combobox-clearable").find("input").last().getKendoComboBox();

	if (combo) {
		var selectedIndex = combo.select(); // This gets the index of the selected item.
		console.log("getZoomOption: Selected Index - ", selectedIndex);
		alert("getZoomOption: Current Selected - " + selectedIndex);
		return selectedIndex; // This returns the current value of the ComboBox.
	}
	else {
		console.log("getZoomOption: Zoomcombo not found");
		return null; // Return null or an appropriate value if the ComboBox is not found.
	}
}

function getZoomValue() {
	var combo = $(".k-combobox-clearable").find("input").last().getKendoComboBox();

	if (combo) {
		var currentValue = combo.value();
		console.log("getZoomValue: Current Value - ", currentValue);
		alert("getZoomOption: Current Value - " + currentValue);
		return currentValue; // This returns the current value of the ComboBox.
	}
	else {
		console.log("getZoomValue: Zoomcombo not found");
		return null; // Return null or an appropriate value if the ComboBox is not found.
	}
}

// Set the zoom option through the menu since it is not possible to set by code
// 2 = Full-width
function setZoomValue(zoomValue) {
	var combo = $(".k-combobox-clearable").find("input").last().getKendoComboBox();

	if (combo) {
		console.log("setZoomValue: Zoomcombo found");

		// combo.value(zoomValue);
		combo.value(zoomValue+'%');
		combo.trigger("change");
	}
	else {
		console.log("setZoomValue: Zoomcombo not found");
	}
}

// Get the option in the zoom combobox of the zoomValue
// When ZoomOption == -1 AND ZoomValueOption != -1 --> It is the initial option
function getZoomValueOption(value) {
	// Access the ComboBox
	var combo = $(".k-combobox-clearable").find("input").last().getKendoComboBox();

	if (combo) {
		// Get all items from the combobox's dataSource
		var items = combo.dataSource.data();

		// Convert items to a standard array if necessary
		var standardItemsArray = Array.from(items);

		// Find the index of the provided value in the combobox items
		var index = standardItemsArray.findIndex(function (item) {
			return item.text == value; // Adjust this comparison based on the actual data structure of your items
		});

		return index; // Returns the index if found, otherwise -1
	} else {
		console.log("ComboBox not found");
		return -1; // Return -1 if the ComboBox is not found
	}
}

function isNumeric(str) {
	return !isNaN(str) && !isNaN(parseFloat(str));
}