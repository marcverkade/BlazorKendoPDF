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

// Create the PffViewer element from the Blazor component through the CreateWidget function - Using a PDF as filename
function createPdfViewer($elem) {
	console.log("PDF Viewer create with file");
	$.when(
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.js"),
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.js")
	).done(function () {
		window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.js';
	}).then(function () {
		$elem.kendoPDFViewer({
			pdfjsProcessing: {
				file: $elem[0].dataset.filename
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
}

// Create the PffViewer element from the Blazor component through the CreateWidget function - Using a PDF as data
function createPdfViewerData($elem) {
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
}

function onDownloadClick() {
	var pdfViewer = $("#pdfViewer").data("kendoPDFViewer");

	if (pdfViewer) {
		console.log("PDF Viewer found");
		pdfViewer.execute({ command: "DownloadCommand" });
	} else {
		console.log("PDF Viewer not found");
	}
}
function removePrintFromToolbar() {

	// Check if the element is found
	var pdfViewerElement = $("#pdfViewer")
	if (pdfViewerElement) {
		console.log("PDF Element found");
	} else {
		console.log("PDF Element not found");
	}

	// Check if pdfviewer is found and log to console
	// Not working, see kendoui.for.jquery.2023.3.1114.pdf page 2050
	// var pdfViewer = $("#pdfViewer").getKendoPDFViewer();
	var pdfViewerWidget = $("#pdfViewer").data("kendoPDFViewer");
	if (pdfViewerWidget) {
		console.log("PDF Viewer Widget found");
	} else {
		console.log("PDF Viewer Widget not found");
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

function adjustSettings() {
	console.log("Adjusting Settings");
	var pdfViewer = $("#pdfViewer").data("kendoPDFViewer");
	pdfViewer.setOptions
		({
			width: "50%",
			height: 450,
			scale: 2
		})
}

function setFile() {
	console.log("Setting file");
	var pdfViewer = $("#pdfViewer").data("kendoPDFViewer");
	pdfViewer.fromFile("https://localhost:7237/samplereport.pdf")
}

function setData() {
	console.log("Setting data");
	var pdfViewer = $("#pdfViewer").data("kendoPDFViewer");
	pdfViewer.fromFile({ data: "JVBERi0xLjEKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDEvTWVkaWFCb3ggWy00MCAtNjQgMjYwIDgwXSA+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjE8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9BcmlhbD4+ID4+ID4+L0NvbnRlbnRzIDQgMCBSPj5lbmRvYmoKNCAwIG9iajw8L0xlbmd0aCA1OT4+CnN0cmVhbQpCVAovRjEgMTggVGYKMCAwIFRkCihUZWxlcmlrIFBkZlZpZXdlciBmb3IgQmxhem9yKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDIxIDAwMDAwIG4KMDAwMDAwMDA4NiAwMDAwMCBuCjAwMDAwMDAxOTUgMDAwMDAgbgowMDAwMDAwNDkwIDAwMDAwIG4KdHJhaWxlciA8PCAgL1Jvb3QgMSAwIFIgL1NpemUgNSA+PgpzdGFydHhyZWYKNjA5CiUlRU9G"})
}

// This is a manual version used for testing, not used anymore
function setPDFViewer() {

	$.when(
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.js"),
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.js")
	)
		.done(function () {
			window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.js';
		}).then(function () {
			var pdfViewer = $("#pdfViewer").kendoPDFViewer
				({
					pdfjsProcessing: {
						file: { data: "JVBERi0xLjEKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDEvTWVkaWFCb3ggWy00MCAtNjQgMjYwIDgwXSA+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjE8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9BcmlhbD4+ID4+ID4+L0NvbnRlbnRzIDQgMCBSPj5lbmRvYmoKNCAwIG9iajw8L0xlbmd0aCA1OT4+CnN0cmVhbQpCVAovRjEgMTggVGYKMCAwIFRkCihUZWxlcmlrIFBkZlZpZXdlciBmb3IgQmxhem9yKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDIxIDAwMDAwIG4KMDAwMDAwMDA4NiAwMDAwMCBuCjAwMDAwMDAxOTUgMDAwMDAgbgowMDAwMDAwNDkwIDAwMDAwIG4KdHJhaWxlciA8PCAgL1Jvb3QgMSAwIFIgL1NpemUgNSA+PgpzdGFydHhyZWYKNjA5CiUlRU9G" }
					},
					width: "100%",
					height: 700,
					scale: 1.5
				})
		})
}
