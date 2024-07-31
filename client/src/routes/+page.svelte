<script>
    import { onMount } from 'svelte';
    import Login from '$lib/Login.svelte';
    import Register from '$lib/Register.svelte';
    import Post from '$lib/Post.svelte';
    import SearchBar from '$lib/Search.svelte';
    import { isAuthenticated, posts } from '$lib/stores.js';

    let showLogin = false;
    let showRegister = false;
    let showCreatePostForm = false;
    let newCaption = '';
    let selectedImage; // State for the selected image
    let atHome = true;

    let users = []

    onMount(async () => {
        // Fetch and display posts 
        const token = localStorage.getItem('token');
        if(token){
            isAuthenticated.set(true);
        }
        const response = await fetch('http://localhost:3001/posts');
        if (response.ok) {
            let data = await response.json()
            posts.set(data);
        }
    });

    function toggleLogin() {
        showLogin = !showLogin;
        showRegister = false;
    }

    function toggleRegister() {
        showRegister = !showRegister;
        showLogin = false;
    }

    function handlePostDelete(deletedPostId) {
        posts.update(allPosts => allPosts.filter(post => post._id !== deletedPostId));
    }

    function signOut(){
        isAuthenticated.set(false);
        localStorage.clear();
    }

    async function handleAuthorClick(authorId) {
        console.log(authorId)
        const response = await fetch(`http://localhost:3001/posts/user/${authorId}`);
        if (response.ok) {
            let data = await response.json()
            posts.set(data);
        }
        users = []
        atHome = false;
    }
    async function createPost() {
        const formData = new FormData();
        formData.append('caption', newCaption);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }
        formData.append('authorUser',localStorage.getItem('user'))

        const response = await fetch('http://localhost:3001/posts', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type' is not set because the browser will set it when using FormData
            },
            body: formData
        });

        if (response.ok) {
            // Handle successful post creation
            let newPost = await response.json()
            resetForm();
            posts.update(allPosts=>[newPost,...allPosts])
        } 
    }

    function resetForm() {
        newCaption = '';
        selectedImage = null;
        showCreatePostForm = false;
    }

    function handleImageChange(event) {
        selectedImage = event.target.files[0];
    }

    async function goHome(){
        const response = await fetch('http://localhost:3001/posts');
        if (response.ok) {
            let data = await response.json()
            posts.set(data);
        }
        users  = []
        atHome = true;
    }

    async function onSearch(query){
        const response = await fetch(`http://localhost:3003/search?q=${query}`);
        if (response.ok) {
            let data = await response.json()
            posts.set(data.posts);
            users = data.users;
        }
        atHome = false;
    }

    async function handleUpdate(postId,newCaption){
        posts.update(allPosts => {
        return allPosts.map(post => {
            if (post._id === postId) {
                return { ...post, caption: newCaption };
            }
            return post;
        });
    });
    }
</script>

<header class="page-header">
    <h1 class="header-title">😁😁HappyGram😁😁</h1>
    <div class="header-buttons">
    {#if !$isAuthenticated}
        <button on:click={toggleLogin}>Login</button>
        <button on:click={toggleRegister}>Register</button>
    {/if}

    {#if $isAuthenticated}
        {#if $isAuthenticated}
        <button on:click={signOut}>Logout</button>
        {/if}

        {#if !atHome}
            <button on:click={goHome}>Home</button>
        {/if}

        {#if atHome}
            <button on:click={()=>handleAuthorClick(localStorage.getItem('userid'))}>Your Profile</button>
        {/if}
        <button on:click={() => showCreatePostForm = !showCreatePostForm}>Create Post</button>

    {/if}
    </div>
</header>
{#if $isAuthenticated}
<div class="search-bar-container">
    <SearchBar onSearch={onSearch}/>
</div>
{/if}

{#if showLogin}
    <Login onLogin={toggleLogin}/>
{:else if showRegister}
    <Register onRegister={toggleRegister} onLogin={toggleLogin}/>
{/if}

{#if $isAuthenticated}
    {#if showCreatePostForm}
    <div class="create-post-container">
        <textarea class="new-caption" bind:value={newCaption} placeholder="caption"></textarea>
            <input type="file" accept="image/*" on:change={handleImageChange} />
        <button class="post-button" on:click={createPost}>Post</button>
    </div>
    {/if}
    {#each users as user}
        <button class="post-author" on:click={()=>handleAuthorClick(user._id)}>{user.username}</button><br>
    {/each}
    {#if !posts}
        <p>No Posts yet!!</p>
    {/if}
    {#each $posts as post}
        <Post {post} onAuthorClick={handleAuthorClick} onDelete={handlePostDelete} onUpdate={handleUpdate}/>
    {/each}
    
{:else}
    <p>Please log in to use Happygram.</p>
{/if}

<style>
    p{
       text-align: center;
    }

    .post-author {
        display: block; /* Make it a block element to occupy its own space */
        background-color: #fff; /* White background */
        border: 1px solid #ccc; /* Light border similar to post cards */
        padding: 10px 15px; /* Padding inside the card */
        margin-bottom: 10px; /* Margin to separate each user card */
        border-radius: 5px; /* Rounded corners */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
        color: #333; /* Text color */
        text-decoration: none; /* No underline */
        cursor: pointer; /* Indicates it is clickable */
        max-width: 600px; /* Match the width of post containers */
        margin: 10px auto; /* Center the card and add vertical spacing */
        transition: box-shadow 0.3s ease, transform 0.1s ease; /* Smooth transition for hover effects */
    }

    .post-author:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
        transform: translateY(-2px); /* Slight raise effect on hover */
    }
    .page-header {
    background-color: #ffd700; /* Yellow background */
    padding: 10px 20px; /* Padding for spacing inside the header */
    display: flex; /* Use flexbox for layout */
    justify-content: space-between; /* Space out the title and the buttons */
    align-items: center; /* Vertically center items */
}

.header-title {
    margin: 0;
    color: #fff; /* White text color */
    font-family: 'Arial', sans-serif; /* Example font, adjust as needed */
}

.header-buttons {
    display: flex;
    gap: 10px; /* Spacing between buttons */
}

/* Button and other header styles remain the same as before */

.search-bar-container {
    padding: 10px 30px; /* Padding to match the header */

}

.page-header button {
    background: none;
    border: 2px solid #fff; /* White border for buttons */
    padding: 8px 16px; /* Padding inside the buttons */
    margin: 0 10px; /* Margin between buttons */
    border-radius: 5px; /* Rounded corners for buttons */
    cursor: pointer;
    font-weight: bold; /* Make the text bold */
    color: #fff; /* White text color */
    transition: background-color 0.3s ease; /* Transition for button hover effect */
}

.page-header button:hover {
    background-color: #ffcc00; /* Darker yellow on hover */
    color: #333; /* Dark text color on hover */
}

.create-post-container {
    background-color: #fff; /* White background */
    padding: 20px;
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    max-width: 600px; /* Restrict the width of the container */
    margin: 20px auto; /* Center it and add vertical spacing */
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    gap: 10px; /* Add space between elements */
}

.new-caption {
    width: 100%; /* Make textarea full width of its container */
    border: 1px solid #ccc; /* Light border */
    border-radius: 5px; /* Rounded corners */
    padding: 10px; /* Padding inside the textarea */
    resize: vertical; /* Allow vertical resizing only */
}

.file-upload-container {
    background-color: #f8f8f8; /* Light gray background for the upload area */
    border: 1px dashed #ccc; /* Dashed border */
    border-radius: 5px; /* Rounded corners */
    padding: 10px;
    text-align: center;
    cursor: pointer;
}

.file-upload-container:hover {
    background-color: #e8e8e8; /* Slightly darker on hover */
}

.file-upload-container input[type="file"] {
    display: none; /* Hide the default file input */
}

.post-button {
    background-color: #ffd700; /* Yellow background */
    color: #fff; /* White text */
    border: none;
    padding: 10px 15px;
    border-radius: 5px; /* Rounded corners */
    cursor: pointer;
    font-weight: bold; /* Bold font for the button text */
    transition: background-color 0.3s ease; /* Smooth transition for hover effect */
}

.post-button:hover {
    background-color: #ffcc00; /* Darker yellow on hover */
}

</style>
