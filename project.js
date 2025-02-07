// Function to handle drag-and-drop and file upload
function setupFileUpload() {
    const dropArea = document.getElementById('main-view-content');
    const fileInput = dropArea.querySelector('input[type="file"]');

    // Prevent default behaviors for drag-and-drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area on drag
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
    });

    // Handle drop event
    dropArea.addEventListener('drop', handleDrop, false);

    // Handle file input selection
    fileInput.addEventListener('change', handleFileSelect, false);

    // Prevent default behavior for drag events
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Handle file selection
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    }

    // Handle file drop
    function handleDrop(e) {
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }

    // Process the uploaded file
    function processFile(file) {
        const reader = new FileReader();

        // Ensure it's a JSON file
        if (file.type === 'application/json') {
            reader.onload = function () {
                try {
                    const data = JSON.parse(reader.result);
                    execute(data); // Call execute with the parsed JSON object
                } catch (error) {
                    
                    console.error('Error parsing JSON file:', error);
                    alert('Invalid JSON file.');
                }
            };

            reader.readAsText(file);
        } else {
            alert('Please upload a valid JSON file.');
        }
    }
}
function addMetadataRow(tablenode, name, value) {
    let n=tablenode.appendtpl("metadata_row");
    n.find(".metadata_name").text(name);
    n.find(".metadata_value").text(value);
}
// Function to execute with the JSON data
function execute(data) {
    console.log('Executing with data:', data);

    var metanode= $("#content").tpl("metadata_content");
    var metatable = metanode.find(".metadata-table");
    var tablenode= $("#content").appendtpl("discovery_table");
    var tbl = tablenode.find(".discovery-table");

    
    addMetadataRow(metatable, "Name", data.response.output.engine.name);
    addMetadataRow(metatable, "UDI", data.response.output.engine.udi);
    addMetadataRow(metatable, "Urgency", data.response.output.response.engine_result.urgency);




    $.each(data.response.output.response.engine_result.discovery, function (i, item) {
        var row = tbl.appendtpl("discovery_row");
        row.find(".discovery_number").text(i);
        row.find(".discovery_name").text(item.taxonomy[2].expression[0].label.name);

        let datatext = "";
        if (item.taxonomy[0].expression[0].attributes[0].name = "Volume") {
            datatext =datatext + item.taxonomy[0].expression[0].attributes[1].name+"<br />";
            datatext =datatext + "Volume: " 
            + parseFloat(item.taxonomy[1].quantity.value).toFixed(2) 
            + " "
            + ((item.taxonomy[0].quantity.units.name=="Cubic Millimeter")?"mm³":item.taxonomy[0].quantity.units.name)
            + "<br />";
        }
        if (item.taxonomy[1].expression[0].attributes[0].name = "Diameter(Total)") {
            datatext =datatext + "Diameter(Total): " 
            + parseFloat(item.taxonomy[1].quantity.value).toFixed(2)
            + " "
            + ((item.taxonomy[1].quantity.units.name=="Millimeter")?"mm":item.taxonomy[1].quantity.units.name)
            + "<br />";
        }
        row.find(".discovery_data").html(datatext);
    });




}

// Initialize the file upload functionality on page load
document.addEventListener('DOMContentLoaded', setupFileUpload);
