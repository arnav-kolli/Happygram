<script>
    let searchQuery = '';
    export let onSearch;

    function handleSearch() {
        onSearch(searchQuery);
    }
</script>

<div class="search-container">
    <input bind:value={searchQuery} placeholder="Search posts or profiles" />
    <button on:click={handleSearch}>Search</button>
</div>


<style>
    .search-container {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    .search-container input {
        width: 300px;
        padding: 10px;
        margin-right: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    button {
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        background-color: blue;
        color: white;
        cursor: pointer;
    }

</style>

