<script>
    let username = '';
    let password = '';
    let reenter = '';
    export let onRegister;
    export let onLogin;

    async function handleRegister() {
            if (password !== reenter) {
                alert('Passwords do not match');
                return;
            }

            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password})
            });

            if (response.ok) {
                alert('Registration successful');
            } else {
                alert('Registration failed, Username may be taken');
            }
            onRegister()
            onLogin();
        }
</script>

<div class="login-container">
    <input type="text" bind:value={username} placeholder="Username" />
    <input type="password" bind:value={password} placeholder="Password" />
    <input type="password" bind:value={reenter} placeholder="Re-enter Password" />
    <button on:click={handleRegister}>Register</button>
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