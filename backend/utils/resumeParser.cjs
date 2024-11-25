const fs = require('fs');
const pdfParse = require('pdf-parse');

console.log(pdfParse);

// Function to extract skills from the CV PDF text
const parseCVSkills = async (pdfBuffer) => {
    try {
        const data = await pdfParse(pdfBuffer); // Parse the PDF buffer
       

        const pdfText = data.text.toLowerCase(); // Convert text to lowercase for easier matching
// console.log('Extracted Text:', pdfText);
        // Split the text into individual words
        const words = pdfText.split(/\W+/); // Split on non-word characters (spaces, punctuation)

        // Filter out words that are not skills (you can further refine this list if needed)
        const cvSkills = words.filter((word) => word.length > 2); // You can adjust this based on your needs

        return cvSkills;
    } catch (error) {
        console.error('Error parsing CV:', error);
        return [];
    }
};

// export default parseCVSkills;

module.exports = {parseCVSkills}
