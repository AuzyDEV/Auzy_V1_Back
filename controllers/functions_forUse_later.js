
const getIDSfromCollectionThatDoesNotExistInTheSecond = async(req, res, next)=> {
    const originalCollectionRef =  fireStore.collection('posts');
  
    // Get all the documents from the original collection
    const originalCollectionSnapshot = await originalCollectionRef.get();
  
    // Array to store the IDs from the original collection
    let originalCollectionIds = [];
    
    // Loop through all the documents and get their IDs
    originalCollectionSnapshot.forEach(doc => {
      originalCollectionIds.push(doc.id);
    });
  
    // Attribute value you want to check against
    const attrValue = req.query.attrValue;
  
    // Reference to the specific collection
    const otherCollectionRef = fireStore.collection("savedPosts");
  
    // Result array to store the IDs that do not exist in the specific collection with the specific attribute value
    let result = [];
  
    // Loop through the IDs from the original collection
    for (const id of originalCollectionIds) {
      // Query to get the document from the specific collection with the specific attribute value
      const query = otherCollectionRef.where('postId', '==', id);
    
      // Get the query results
      const querySnapshot = await query.get();
  
      // Check if the query returned any results
      if (querySnapshot.empty) {
        //console.log(querySnapshot)
        // If not, it means that the ID does not exist in the specific collection with the specific attribute value
        result.push({id});
      }
    }
  
    // Return the result array in the JSON response
    res.json({ result });
  }