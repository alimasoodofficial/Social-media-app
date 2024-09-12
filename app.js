const PostForm = document.querySelector('.PostForm');
const TitleInput = document.querySelector('#TitleInput');
const DescInput = document.querySelector('#DescInput');
let firstTenPosts = []; // To store the first 10 posts
let lastPostId = 10; // Start from 10 since we display the first 10 posts

// Fetch and display the first 10 posts
async function getPost() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/');
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! | status: ${response.status}`);
        }

        const data = await response.json();
        // Slice the first 10 posts and store them in the array
        firstTenPosts = data.slice(0, 10);

        // Display each post and update lastPostId dynamically
        firstTenPosts.forEach(post => {
            ReadPost(post); // Display post
            lastPostId = post.id; // Set lastPostId to the highest ID
        });

    } catch (error) {
        console.error(error);
    }
}

// Handle form submission to create a new post
PostForm.addEventListener('submit', async event => {
    event.preventDefault();

    const Title = TitleInput.value;
    const Desc = DescInput.value;

    if (Title && Desc) {
        try {
            // Create a new post
            const postResponse = await postData(Title, Desc);

            // Increment the lastPostId for the new post
            postResponse.id = ++lastPostId; // Increment lastPostId and assign to the new post

            // Push the new post into the firstTenPosts array
            firstTenPosts.push(postResponse);

            // Re-render the posts
            renderPosts(firstTenPosts);

            // Clear input fields
            TitleInput.value = '';
            DescInput.value = '';
        } catch (error) {
            console.error(error);
            displayError(error.message);
        }
    } else {
        displayError('Please fill out both the title and description');
    }
});

// Function to create a new post via the API
async function postData(Title, Desc) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                title: Title,
                body: Desc,
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to display a post on the page
function ReadPost(value) {
    const { id: ID, title: Title, body: Body } = value;

    const postSection = document.querySelector(".read-section");
    const newDiv = document.createElement("div");
    const postTitle = document.createElement("h2");
    const postBody = document.createElement("p");
    const postID = document.createElement("p");
    const postImage = document.createElement("img");
    const deleteButton = document.createElement("button"); // Create delete button

    postImage.src = "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png";
    postTitle.textContent = Title;
    postBody.textContent = Body;
    postID.textContent = `Post ID: ${ID}`;
    deleteButton.textContent = "Delete"; // Set delete button text

    deleteButton.addEventListener('click', () => deletePost(ID)); // Add event listener for delete

    postImage.style.width = '100px';
    newDiv.className = 'post-item';
    postSection.style.padding = '30px';

    newDiv.appendChild(postID);
    newDiv.appendChild(postImage);
    newDiv.appendChild(postTitle);
    newDiv.appendChild(postBody);
    newDiv.appendChild(deleteButton); // Append delete button to the post

    postSection.appendChild(newDiv);
}

// Function to render all posts (called after push or delete)
function renderPosts(posts) {
    const postSection = document.querySelector(".read-section");

    // Clear the current posts
    postSection.innerHTML = '';

    // Render all posts again
    posts.forEach(post => {
        ReadPost(post);
    });
}

// Function to delete a post by its ID
function deletePost(postId) {
    // Remove the post from the array
    firstTenPosts = firstTenPosts.filter(post => post.id !== postId);

    // Re-render the posts
    renderPosts(firstTenPosts);
}

// Function to display error messages
function displayError(message) {
    const errorContainer = document.querySelector('.error-container');
    errorContainer.textContent = message;
}

// Initialize the page by loading the first 10 posts
getPost();
