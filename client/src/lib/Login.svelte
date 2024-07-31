<script>
    import { isAuthenticated } from '$lib/stores.js';
    let username = '';
    let password = '';
    export let onLogin;

    async function handleLogin() {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        console.log(res)
        if (res.ok) {
            const data = await res.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('userid',data.id);
            localStorage.setItem('user',username);
            isAuthenticated.set(true);
        } else {
            alert('Login failed');
        }
        onLogin()
    }
</script>

<div class="login-container">
    <input type="text" bind:value={username} placeholder="Username" />
    <input type="password" bind:value={password} placeholder="Password" />
    <button on:click={handleLogin}>Login</button>
</div>


<style>
    .login-container {
        display: flex;
        flex-direction: column;
        width: 300px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    input {
        margin-bottom: 10px;
        padding: 10px;
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

    button:hover {
        background-color: darkblue;
    }
</style>