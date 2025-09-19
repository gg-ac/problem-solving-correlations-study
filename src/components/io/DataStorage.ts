export function saveToDownloadsFolder(json:string, filename:string){
    // Create a Blob from the JSON string
    const blob = new Blob([json], { type: 'application/json' });

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Free up memory
}