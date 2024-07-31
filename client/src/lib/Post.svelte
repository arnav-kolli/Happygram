<script>
    import Comments from '$lib/Comment.svelte';
    export let post;
    export let onAuthorClick; // Function to handle author name click
    export let onDelete;
    export let onUpdate;

    let edit = false;
    let updatedCaption = post.caption;

    function handleAuthorClick() {
        if (onAuthorClick) {
            onAuthorClick(post.authorid); // Call the passed function with the author's ID
        }
    }

    async function deletePost() {
        const response = await fetch(`http://localhost:3001/posts/${post._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
            onDelete(post._id); 
        }
    }

    async function updateCaption(){
        const response = await fetch(`http://localhost:3001/posts/${post._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ caption: updatedCaption })
        });

        if (response.ok) {
            edit = false; 
            onUpdate(post._id, updatedCaption);
        }
    }

</script>

<div class="post">
    <div class="edit-delete-btns">
        {#if post.authorUser === localStorage.getItem('user')}
            <button on:click={deletePost}>Delete</button>
            <button on:click={()=>edit = !edit}>{edit ? 'Cancel' : 'Edit'}</button>
        {/if}
    </div>
    <div class="post-img-container">
        {#if post.imageUrl}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img class="post-img" src={post.imageUrl} alt="picture">
        {/if}
    </div>
    <button class="post-author" on:click={()=>handleAuthorClick()}>{post.authorUser}</button>


    {#if edit}
        <input bind:value={updatedCaption} />
        <button on:click={updateCaption}>Save</button>
    {:else}
        <p class="post-content">{post.caption}</p>
    {/if}
    <Comments postId={post._id} postAuthor={post.authorUser}/>
</div>


<style>
.post {
    max-width: 600px;
    margin: 20px auto; 
    border: 1px solid #ccc; 
    border-radius: 10px;
    overflow: hidden; 
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative; 
}

.post-img-container {
    margin: 10px; 
}

.post-img {
    display: block;
    max-width: calc(100% - 20px); 
    height: auto; 
    margin: 0 auto; 
}

.post-author {
    display: block; 
    margin: 0; 
    padding: 15px; 
    font-size: 1em; 
    background: none; 
    border: none;
    text-align: left; 

}

.post-author:hover {
    text-decoration: underline; 
}

.post-content {
    padding: 0 15px 15px; 
    color: #444444;
}


.edit-delete-btns {
    position: absolute; 
    top: 10px; 
    right: 10px; 
    display: flex;
}

button {
    background: #f0f0f0; 
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px 10px; 
    margin-left: 5px; 
    cursor: pointer;
}

button:hover {
    background: #e8e8e8; 
}


</style>

