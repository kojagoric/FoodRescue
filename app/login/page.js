import LoginForm from "./login-form";

export default function LoginPage() {
  return <main className="container" style={{maxWidth:480}}>
    <section className="card">
      <h1>FoodRescue login</h1>
      <p className="muted">Sign in with an account created in the USERS table.</p>
      <LoginForm />
    </section>
  </main>;
}
