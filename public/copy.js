
document.getElementById('copyButton').addEventListener('click', function() {
    copyToClipboard('updatedLink');
});

function copyToClipboard(elementId) {
    // Get the content of the div
    var contentToCopy = document.getElementById(elementId).innerText;

    // Create a temporary textarea element
    var tempTextarea = document.createElement('textarea');
    tempTextarea.value = contentToCopy;

    // Append the textarea to the document
    document.body.appendChild(tempTextarea);

    // Select and copy the content
    tempTextarea.select();
    document.execCommand('copy');

    // Remove the temporary textarea
    document.body.removeChild(tempTextarea);

    // Optionally, provide user feedback
    alert('Content copied to clipboard!');
}

