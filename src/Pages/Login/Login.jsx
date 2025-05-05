export const Login = () => {
    return (
        <div>
            <h1>Login</h1>
            <p>Please enter your credentials to log in.</p>
            <label htmlFor="email">Email:</label><br />
            <input type="email" id="email" placeholder="Your Email" /><br />
            <label htmlFor="password">Password:</label><br />
            <input type="password" id="password" placeholder="Your password" /><br />
            <button type="submit">Login</button><br />
            <p>Don't have an account? <a href="/signup">Register here</a></p>
        </div>
    )
}