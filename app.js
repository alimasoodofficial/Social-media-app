const response = await fetch('https://jsonplaceholder.typicode.com/posts/');
async function getPost() {
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! | status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const gettingValues = data.slice(0, 5).map(value => {
             return  displayPost(value)
        });

    } catch (error) {
        console.error(error);
    }
}


 function displayPost(value) {
    const { id:ID,title:Title,body:Body} = value;

    const postSection = document.querySelector(".post-section")
    const postTitle = document.createElement("h2")
    const postBody = document.createElement("p")
    const postID = document.createElement("p")

    postTitle.textContent = Title
    postBody.textContent = Body
    postID.textContent = ID

    postSection.appendChild(postTitle)
    postSection.appendChild(postBody)
    postSection.appendChild(postID)



}





