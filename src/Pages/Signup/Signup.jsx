export const Signup = () => {
    return (
        <div>
            <h1>Signup</h1>
            <p>Please enter your credentials to signup.</p>
            <label htmlFor="username">Username:</label><br />
            <input type="text" id="username" placeholder="Your Username" /><br />
            <label htmlFor="email">Email:</label><br />
            <input type="email" id="email" placeholder="Your Email" /><br />
            <label htmlFor="password">Password:</label><br />
            <input type="password" id="password" placeholder="Your password" /><br />
            <button type="submit">Sign Up</button><br />
            <p>Already have an account? <a href="/login">login here</a></p>
        </div>
    )
}