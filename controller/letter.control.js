import model from "../config/aiCofigaration.js";
import Letter from "../model/letter.model.js";

// Create Letter
export const createLetter = async (req, res) => {
  try {
    const { loverName, loverTune, letterType,language } = req.body;

    const prompt = `
            Hey Gemini Flash 2.0,  

            I want to send a love letter to my special one. Please generate a heartfelt ${letterType} love letter in a ${loverTune} tone for my lover, **${loverName}**.  

              ### Additional Instructions:  
                - The letter should be written in **${language}**, ensuring natural fluency an correctness.  
                - Detect the **gender** of the person based on their name and personalize the lette accordingly.  
                - Ensure the letter feels natural, deeply emotional, and engaging.  
                - Maintain the requested tone (**${loverTune}**)—whether it's romantic, poetic, or funny. 

            ### Response Format:  
            Return the response as a structured JSON object in the following format:  


            \`\`\`json
            {
            "title": "A beautiful title for the letter",
            "content": "The full love letter text"
            }
            \`\`\`

            Make sure the letter flows naturally and captures deep emotions, humor, or poetic beauty based on the chosen style and language.
         `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const response =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response) {
      console.error("A.I return empty response ", result);

      return res.status(400).json({
        success: false,
        message: "Failed to generated content ",
      });
    }

    let jsonData;

    try {
      const startIndex = response.indexOf("```json\n");
      const endIndex = response.lastIndexOf("\n```");

      if (startIndex === -1 || endIndex === -1) {
        console.error("Invalid format: Missing code fences.", response);
        return res.status(500).json({
          success: false,
          message:
            "Invalid format:  AI did not return data within ```json\\n and \\n```.",
        });
      }

      const jsonString = response.substring(startIndex + 7, endIndex); // Extract JSON
      jsonData = JSON.parse(jsonString);
    } catch (jsonErr) {
      console.error("Error parsing JSON:", response, jsonErr);
      return res.status(403).json({
        success: false,
        message: `Failed to parse JSON.  Ensure AI return that the content is valid JSON. Error: ${jsonErr.message}`,
      });
    };

    const postLetter = new Letter({
      userId: req.userId,
      loverName,
      loverType: loverTune,
      letterType,
      language,
      letter: jsonData,

    });

    const newLetter = await postLetter.save();

    return res.status(201).json({
      success: true,
      letter: newLetter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Letter--->
export const getLetter = async (req, res) => {
  try {
    const { letterId } = req.params;
    const letter = await Letter.findById(letterId);

    if (letter) {
      return res.status(200).json({
        success: true,
        letter,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Haven't any letter.!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Letters--->
export const getUserLetters = async (req, res) => {
  try {
    const { userId } = req.params;
    const letters = await Letter.find({ userId: userId });

    if (letters.length > 0) {
      return res.status(200).json({
        success: true,
        letter: letters.reverse(),
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Haven't any letter.!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLetter = async (req, res) => {
  try {
    const { letterId } = req.params;
    const letter = await Letter.findById(letterId);

    if (letter) {
      await Letter.findByIdAndDelete(letterId);

      return res.status(200).json({
        success: true,
        message: "Your letter Deleted Successfully .!",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Letter Deleted Failed.!letter Not found .",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// letter Likes--->
export const addALikeInLetter = async (req, res) => {
  try {
    const { letterId } = req.params; // Get letter ID from params
    const userId = req.userId; // Get user ID from authenticated request

    // Check if the letter exists
    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res
        .status(404)
        .json({ success: false, message: "letter not found" });
    }

    // Determine whether to like or unlike
    const isLiked = letter.like.includes(userId);
    const update = isLiked
      ? { $pull: { like: userId } } // Unlike: Remove userId from like array
      : { $addToSet: { like: userId } }; // Like: Add userId to like array

    // Update the letter atomically
    const updatedletter = await Letter.findByIdAndUpdate(letterId, update, {
      new: true,
    });

    // Send the response
    return res.status(200).json({
      success: true,
      message: isLiked ? "Removed like" : "Added like",
      likes: updatedletter.like, // Return the updated like count
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server error',
    });
  }
};

// // Delete user--->
// export const  =async(req,res)=>{
//     try {

//     } catch (error) {
//         return res.status(500).json({
//             success:false,
//             message:error.message
//         });
//     };
// };
