const fs = require('fs');
const pdfParse = require('pdf-parse');



// Function to extract skills from the CV PDF text
const parseCVSkills = async (pdfBuffer) => {
    try {
        const data = await pdfParse(pdfBuffer); 
       

        const pdfText = data.text.toLowerCase(); 

        // Split the text into individual words
        const words = pdfText.split(/\W+/); // Split on non-word characters (spaces, punctuation)

        // Filter out words that are not skills (you can further refine this list if needed)
        const cvSkills = words.filter((word) => word.length > 2); // You can adjust this based on your needs
        // console.log(cvSkills)
        return cvSkills;
    } catch (error) {
        console.error('Error parsing CV:', error);
        return [];
    }
};



module.exports = {parseCVSkills}
