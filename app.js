const PostForm = document.querySelector('.PostForm');
const TitleInput = document.querySelector('#TitleInput');
const DescInput = document.querySelector('#DescInput');
let MainArray = [];
let lastPostId = 10;
let currentPage = 1; 
const postsPerPage = 8; 

async function getPost() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! | status: ${response.status}`);
        }

        const data = await response.json();
        MainArray = data.slice(0, 100);

        renderPosts(MainArray); 
    } catch (error) {
        console.error(error);
    }
}

PostForm.addEventListener('submit', async event => {
    event.preventDefault();

    const Title = TitleInput.value;
    const Desc = DescInput.value;

    if (Title && Desc) {
        try {
            const postResponse = await postData(Title, Desc);

            postResponse.id = ++lastPostId; 
            MainArray.push(postResponse); 

            renderPosts(MainArray); 

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

function ReadPost(value) {
    const { id: ID, title: Title, body: Body } = value;

    const postSection = document.querySelector(".read-section");
    const newDiv = document.createElement("div");
    const postTitle = document.createElement("h2");
    const postBody = document.createElement("p");
    const postID = document.createElement("p");
    const postImage = document.createElement("img");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    postImage.src = "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png";
    postTitle.textContent = Title;
    postBody.textContent = Body;
    postID.textContent = `Post ID: ${ID}`;
    deleteButton.textContent = "Delete";
    editButton.textContent = "Edit";

    deleteButton.addEventListener('click', () => deletePost(ID));
    editButton.addEventListener('click', () => editPost(ID));

    postImage.style.width = '100px';
    newDiv.className = 'post-item rounded rouned-3';
    postSection.style.padding = '30px';
    deleteButton.className = 'btn btn-primary ms-2 rounded-3';
    editButton.className = 'btn btn-primary ms-2 rounded-3';
    
    newDiv.style.padding = '30px';
    newDiv.style.boxShadow = '10px 10px 5px #6CBEC7';

    newDiv.appendChild(postID);
    newDiv.appendChild(postImage);
    newDiv.appendChild(postTitle);
    newDiv.appendChild(postBody);
    newDiv.appendChild(deleteButton);
    newDiv.appendChild(editButton);

    postSection.appendChild(newDiv);
}

function renderPosts(posts) {
    const postSection = document.querySelector(".read-section");
    postSection.innerHTML = ''; 

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = posts.slice(0, endIndex); 

    paginatedPosts.forEach(post => {
        ReadPost(post);
    });

    renderReadMoreButton(); 
}

// Function to delete a post by its ID
function deletePost(postId) {
    MainArray = MainArray.filter(post => post.id !== postId);
    renderPosts(MainArray);
}

// Function to edit a post by its ID
function editPost(postId) {
    const postToEdit = MainArray.find(post => post.id === postId);

    if (postToEdit) {
        const newTitle = prompt('Enter new title:', postToEdit.title);
        const newBody = prompt('Enter new body:', postToEdit.body);

        if (newTitle && newBody) {
            postToEdit.title = newTitle;
            postToEdit.body = newBody;
            renderPosts(MainArray);
        } else {
            alert('Both title and body are required to update the post.');
        }
    } else {
        alert('Post not found.');
    }
}

// Function to render "Read More" button
function renderReadMoreButton() {
    const readMoreContainer = document.querySelector('.read-more-container');
    readMoreContainer.innerHTML=''

    const totalPosts = MainArray.length;
    const postsDisplayed = currentPage * postsPerPage;

    if (postsDisplayed < totalPosts) {
        const readMoreButton = document.createElement('button');
        readMoreButton.textContent = 'Read More';
        readMoreButton.className = 'btn btn-primary mt-3';

        readMoreButton.addEventListener('click', () => {
            currentPage++;
            renderPosts(MainArray); 
        });

        readMoreContainer.appendChild(readMoreButton);
    }
}

// Function to display error messages
function displayError(message) {
    const errorContainer = document.querySelector('.error-container');
    errorContainer.textContent = message;
}

// Fetch initial posts
getPost();
