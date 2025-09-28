
"use client"

import axios from "axios";
import { useState } from "react";
import Router from "next/router";
import { useRouter } from "next/navigation";

function AuthPage({ isSignin }: { isSignin: boolean }) {

  const [user, setuser] = useState({ username: "", password: "", name: "" });

  const router = useRouter();

  const handleSubmit = async () => {

    try {
      if (!user.username || !user.password || (!isSignin && !user.name)) {
      alert("Please fill all fields");
      return;
    }
    
    if (!isSignin) {
      await axios.post("http://localhost:3001/signup", {
        username: user.username,
        password: user.password,
        name: user.name,
      })
    } else {
      await axios.post("http://localhost:3001/signin", {
        username: user.username,
        password: user.password,
      })
    }

    if (!isSignin) {
      router.push("/signin");
    }

    router.push("/");
      
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-2 m-2 bg-white rounded">
        <input type="text" placeholder="Username" value={user.username} onChange={(e) => setuser({ ...user, username: e.target.value })} />
        <input type="password" placeholder="Password" value={user.password} onChange={(e) => setuser({ ...user, password: e.target.value })} />
        {!isSignin && <input type="text" placeholder="Name" value={user.name} onChange={(e) => setuser({ ...user, name: e.target.value })} />}
        <button onClick={handleSubmit}>{isSignin ? "Sign in" : "Sign up"}</button>
      </div>
    </div>
  );
}

export default AuthPage;
