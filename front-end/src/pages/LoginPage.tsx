import React, { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setToken } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login/', { email, password })
      setToken(res.data.access)
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Login failed')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-body">
      <form className="bg-bg-card p-6 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4 text-primary">Login</h2>
        <input type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded border-border" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full mb-3 p-2 border rounded border-border" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="btn-primary w-full py-2 rounded">Login</button>
      </form>
    </div>
  )
}

export default LoginPage
