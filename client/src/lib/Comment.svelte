<script>
    import { onMount} from 'svelte';
    import { writable } from 'svelte/store';

    export let postId;
    export let postAuthor;
    let newComment = '';
    const comments = writable([]);

    $: if (postId) {
        fetchComments();
    }

    onMount(async () => {
        await fetchComments();
    });

    async function fetchComments() {
        const response = await fetch(`http://localhost:3002/comments/${postId}`);
        let data = [];
        if (response.ok) {
            data = await response.json()
        }
        data = data
        comments.set(data)
    }

    async function addComment() {
        const response = await fetch(`http://localhost:3002/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({postid:postId,"text":newComment,"authorUser":localStorage.getItem('user')})
        });
        newComment = "";
        fetchComments();
    }

    async function deleteComment(commentId) {
        const response = await fetch(`http://localhost:3002/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        fetchComments();
    }

    function userAuth(comment){
        let cur = localStorage.getItem('user')
        if(comment.authorUser == cur || cur == postAuthor){
            return true
        }
        return false
    }
</script>

<div class="comments-section">
    {#each $comments as comment}
        <div class="comment">
            <span class="comment-author">{comment.authorUser}</span>
            <p class="comment-text">{comment.text}</p>
            {#if userAuth(comment)}
            <button class="comment-delete-btn" on:click={() => deleteComment(comment._id)}>Delete</button>
            {/if}
        </div>
    {/each}

    <textarea class = "new-comment" bind:value={newComment}></textarea>
    <button class = "submit-comment-btn" on:click={addComment}>Add Comment</button>
</div>

<style>
 .comments-section {
    margin-top: 20px;
    padding: 10px;
    border-top: 1px solid #ccc;
}

.comment {
    background-color: #fffbe6; /* Light yellow background */
    border: 1px solid #ffd700; /* Yellow border */
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.comment-author {
    font-weight: bold;
    color: #333;
    margin-right: 10px;
}

.comment-text {
    color: #555;
    flex-grow: 1;
    margin: 0 10px; /* Add margin for spacing */
    word-break: break-word; /* Break long words to prevent overflow */
}

.comment-delete-btn {
    background: none;
    border: none;
    color: #ff4500; /* Orange color for delete button */
    cursor: pointer;
    padding: 5px;
}

.new-comment {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ffd700; /* Yellow border */
    border-radius: 4px;
    box-sizing: border-box;
}

.submit-comment-btn {
    background-color: #ffd700; /* Yellow background */
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.submit-comment-btn:hover {
    background-color: #ffcc00; /* Darker yellow on hover */
}

</style>

