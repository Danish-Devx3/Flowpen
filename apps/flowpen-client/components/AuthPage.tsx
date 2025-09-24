
"use client"

function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-2 m-2 bg-white rounded">
        <input type="text" />
        <input type="text" />

        <button onClick={() => {}}>{isSignin ? "Sign in" : "Sign up"}</button>
      </div>
    </div>
  );
}

export default AuthPage;
